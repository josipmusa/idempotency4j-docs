---
title: The engine
description: IdempotencyEngine.execute without Spring - building a context, the two overloads, and CompletionFailurePolicy.
sourceOf: README "The engine"
---

`IdempotencyEngine.execute` is the entire API. It acquires the lease, runs the action with a
heartbeat, encodes and records the result, releases on any failure, and fires the
[lifecycle callbacks](/docs/lifecycle-callbacks/) around all of it. What comes back is a
sealed [`Outcome`](/docs/concepts/outcomes/) you switch on.

The engine has no framework or transport types in it, so you can drive it directly. Everything
else in the library is an adapter over this.

## Building a context

```java
IdempotencyEngine engine = new IdempotencyEngine(store, scheduler);

IdempotencyContext context = IdempotencyContext.builder("ShipmentListener.onOrderShipped", event.id())
        .ttl(Duration.ofHours(24))
        .leaseDuration(Duration.ofSeconds(30))
        .waitTimeout(Duration.ZERO)   // decline instead of parking the consumer thread
        .build();
```

The builder takes the [scope and key](/docs/concepts/scope-and-key/) pair. Outside Spring
there is no method name to derive a scope from, so you name it - and naming it after the
handler keeps it stable when the method moves.

Add `.fingerprint(sha256Hex)` when the payload is worth guarding against key reuse. See
[fingerprints](/docs/concepts/fingerprints/).

## The runnable overload

A caller with nothing for a duplicate to replay uses the runnable overload:

```java
switch (engine.execute(context, () -> handler.handle(event))) {
    case Outcome.Executed<Void> ignored -> { /* ran for the first time */ }
    case Outcome.Replayed<Void> ignored -> { /* already handled under this key */ }
    case Outcome.InFlight<Void> inFlight ->
            consumer.nack(inFlight.retryAfter());   // someone else has it; redeliver later
}
```

## The codec overload

When a duplicate should get a real result back, pass a `PayloadCodec<T>` for whatever the
action returns:

```java
Outcome<Handled> outcome = engine.execute(context, () -> handler.handle(event), codec);
```

`Outcome.Replayed` carries the decoded value from the original execution, so the same
`switch` handles a first run and a duplicate without the caller knowing which it got. Writing
the codec is covered in [payloads and codecs](/docs/concepts/payloads-and-codecs/).

## When the store refuses the completion

The action ran and its side effects are durable, so `CompletionFailurePolicy` decides what
happens next.

- **`PROPAGATE`** - the engine's own default. Rethrows the storage failure.
- **`LOG_AND_RETURN`** - logs it and returns `Executed` with the value anyway, which is what
  an HTTP adapter wants: the response the handler produced should still reach the client.

The lease is not released either way; the record stays in progress until its lease expires,
and a retry after that re-executes.

```java
IdempotencyEngine engine = new IdempotencyEngine(
        store,
        scheduler,
        List.of(),
        IdempotencyConfig.builder()
                .completionFailurePolicy(CompletionFailurePolicy.LOG_AND_RETURN)
                .build());
```

:::note[The starter does not use the engine's default]
It wires its engine with `LOG_AND_RETURN`. Set
`idempotency.completion-failure-policy=propagate` to change it. The difference between the
two defaults is the one configuration surprise worth knowing about, and it is called out
again in [configuration](/docs/reference/configuration/).
:::

## Listeners outside Spring

```java
IdempotencyEngine engine = new IdempotencyEngine(store, scheduler, List.of(auditListener));
```
