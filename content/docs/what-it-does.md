---
title: What it does
description: The mental model behind idempotency4j, before any code - scope and key, run once, replay the stored result.
sourceOf: README intro, "What this is not"
---

Callers retry. A payment endpoint gets the same request twice because a mobile client lost
its connection and tried again. A Kafka consumer sees the same message twice because the
broker rebalanced. A provisioning job runs twice because an operator was not sure the first
run took. In each case a duplicate causes a real problem: money charged twice, two orders
shipped, two VMs started.

## The model

Give a unit of work a key. The engine acquires a lease on that key, runs your action under a
heartbeat, stores the result, and hands the stored result back to whoever shows up with that
key next.

A record is identified by a **scope** and a **key** together, never by the key alone. The key
identifies the attempt; the scope names the unit of work it belongs to. That pairing is what
stops the same message id delivered to two different consumers from being treated as one
piece of work - see [scope and key](/docs/concepts/scope-and-key/).

A record is absent, `IN_PROGRESS`, or `COMPLETE`. There is no failed state. Releasing deletes
the row, so a failed attempt leaves no trace and the next caller sees a key that was never
used. That is the whole state machine, and it is covered in
[the record lifecycle](/docs/concepts/record-lifecycle/).

## What you write

For most applications, one dependency and one annotation:

```java
@Idempotent(key = "#event.id()", waitTimeout = "PT0S")
@KafkaListener(topics = "orders")
void on(OrderPlaced event) {
    // Runs once per event id, however many times the broker redelivers.
}
```

Over HTTP the client generates the key and sends it as a header, so the annotation needs
nothing from you. Without Spring, the engine is a plain Java object you call directly.

:::caution[This is not an exactly-once guarantee for downstream side effects]
Lease fencing protects the idempotency record, not the third-party charge your action made
just before the process died. If you need that guarantee you still need a shared
transaction, a transactional outbox, or an idempotency key passed to the downstream service.

This library makes *your* work safe to retry; it cannot make *someone else's* endpoint safe
to retry for you.
:::

## What it is not

It is not a distributed lock you can borrow for general use, and the HTTP adapter is
Servlet-only.

The rest of what it does not do is on the [limitations](/docs/operating/limitations/) page,
which is worth reading before you adopt rather than after.
