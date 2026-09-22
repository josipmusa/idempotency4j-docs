---
title: Outcomes
description: Outcome.Executed, Replayed and InFlight as a sealed type you switch on.
sourceOf: README "The engine"
---

`IdempotencyEngine.execute` returns a sealed `Outcome<T>` you switch on. Three cases, and the
compiler holds you to all three.

In this example `engine` is an `IdempotencyEngine` and `context` an `IdempotencyContext`, both
built as on [the engine](/docs/the-engine/) page. `handler.handle(event)` is the work being
guarded, and `consumer.nack` stands for however your broker client asks for a redelivery.

```java
switch (engine.execute(context, () -> handler.handle(event))) {
    case Outcome.Executed<Void> ignored -> { /* ran for the first time */ }
    case Outcome.Replayed<Void> ignored -> { /* already handled under this key */ }
    case Outcome.InFlight<Void> inFlight ->
            consumer.nack(inFlight.retryAfter());   // someone else has it; redeliver later
}
```

## The three cases

**`Executed<T>`** - no record existed, this call acquired the lease, ran the action and stored
the result. The value is what the action returned.

**`Replayed<T>`** - a `COMPLETE` record already existed. The action did not run. The value is
the decoded result of the original execution, which is why the same `switch` handles a first
run and a duplicate without the caller knowing which it got.

**`InFlight<T>`** - another caller holds the lease and still held it after the
[wait timeout](/docs/concepts/leases-and-waiting/) elapsed.
The action did not run and there is no value. `retryAfter()` carries how long to wait before
trying again, derived from the remaining lease.

## Why sealed

A sealed type makes the third case unavoidable. `InFlight` is the case people forget when
they write this by hand, because it only happens under concurrency and never in a unit test
written from the happy path.

:::note[`if (alreadyProcessed) return;` cannot express `InFlight` at all]
It silently treats a concurrent duplicate as a completed one, which means dropping work that
was never done. That is the bug a sealed type exists to make impossible.
:::

`Executed` and `Replayed` both carry a value; `InFlight` carries a delay. Switching on the
type is what makes that difference legible.

## Through the adapters

The adapters map the same three cases onto their transport, so you rarely switch by hand
unless you are calling the engine directly:

| Outcome | Annotated method | HTTP endpoint |
|---|---|---|
| `Executed` | The method's return value | The handler's response |
| `Replayed` | The stored return value | The stored response, plus `Idempotent-Replayed: true` |
| `InFlight` | `IdempotencyInFlightException`, carrying `retryAfter` | `409`, carrying `Retry-After` |

Register an `OutcomeMapper` bean to answer differently on an annotated method.
