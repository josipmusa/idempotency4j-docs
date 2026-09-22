---
title: Scope and key
description: A record is identified by a scope and a key together, never by the key alone - and why that matters.
sourceOf: README "How it works"
---

A record is identified by a **scope** and a **key** together, never by the key alone.

The key identifies the attempt. The scope names the unit of work it belongs to.

## Why the pair

A key on its own is ambiguous across an application. The same message id is delivered to
every consumer subscribed to a topic. The same `Idempotency-Key` can be sent to two different
endpoints by a client that generates one key per user action. If the key alone identified the
record, the first consumer to finish would mark the work done and the second would skip
work it had never performed.

Scoping removes the ambiguity. Both adapters default the scope to
`<simple class name>.<method name>`, so the same message id delivered to two consumers, or
the same `Idempotency-Key` sent to two endpoints, is two independent records rather than one
silently skipping the other's work.

## The default, and when to override it

```java
@Component
class OrderListener {

    @Idempotent(key = "#event.id()")   // scope defaults to OrderListener.on
    void on(OrderPlaced event) { ... }
}
```

The default is right whenever a method is the unit of work, which is the common case. Set
`scope` explicitly when two methods genuinely perform the same unit of work and should share
a record - a handler that was renamed and must keep deduplicating against records written
under the old name, for example. Renaming `on` above to `onOrderPlaced` would change the
default scope, so the renamed method names the old one:

```java
@Idempotent(scope = "OrderListener.on", key = "#event.id()")
void onOrderPlaced(OrderPlaced event) { ... }
```

A scope that is too long is rejected when the context starts, not on the first message.

## Keys are yours to shape

Records are scoped per method, but within a scope there is no built-in per-tenant or per-user
isolation.

:::caution[Two callers using the same key in the same scope share idempotency state]
On a public API this matters: a client generating keys from a sequence rather than a UUID
will collide with another tenant's keys, and the second tenant gets the first tenant's
stored response replayed to them.

Prefix the key at the application level, for example `userId:clientKey`. It is a
[documented limitation](/docs/operating/limitations/) rather than an oversight, and the fix
is yours to apply.
:::

Idempotency keys are client-controlled and may carry identifying data, so the library never
writes one to a log or an exception message. Both render a record as its scope followed by a
short digest of the key - `PaymentController.create/#3f9a2c71` for a key sent to a `create`
method on `PaymentController` - see
[security](/docs/operating/security/).
