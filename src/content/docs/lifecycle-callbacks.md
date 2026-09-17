---
title: Lifecycle callbacks
description: IdempotencyLifecycleListener and its contract - synchronous, swallowed exceptions, exactly one terminal per lease.
sourceOf: README "Lifecycle callbacks"
---

Register an `IdempotencyLifecycleListener` bean to observe the idempotent boundary. The
starter picks up every listener bean and honours `@Order`; no other configuration is needed.

```java
@Bean
public IdempotencyLifecycleListener auditListener(AuditService audit) {
    return new IdempotencyLifecycleListener() {
        @Override
        public void onAcquired(IdempotencyContext ctx, String leaseId) {
            audit.begin(ctx.key());   // runs on the calling thread, before the action
        }

        @Override
        public void onCompleted(IdempotencyContext ctx, String leaseId, Payload payload) {
            audit.end(ctx.key());
        }

        @Override
        public void onFailed(IdempotencyContext ctx, String leaseId, Throwable cause, FailurePhase phase) {
            audit.abandon(ctx.key(), phase);
        }
    };
}
```

## The contract

**Callbacks run synchronously on the calling thread,** in registration order. That is
deliberate: it lets a listener bind thread-local state that the guarded action then sees. A
listener that blocks blocks the call.

**Exceptions thrown by a listener are logged at WARN and swallowed.** They never change the
stored payload, the return value, or the exception the engine is propagating. Observation
must not be able to break the thing being observed.

**Every acquired lease gets exactly one terminal callback:** `onCompleted` **or** `onFailed`,
always preceded by `onAcquired` with the same lease. Use the pair to unbind whatever
`onAcquired` bound.

**`onDuplicate` and `onInFlight` stand alone.** Neither acquires a lease, so no terminal
callback follows. A listener that unbinds state in its terminal callback will never see one
for these, which is the usual source of a leak in a listener written against the happy path
alone.

**`onCompleted` fires only once the store has confirmed the completion.** An unconfirmed
durability guarantee counts as `onFailed` with `FailurePhase.COMPLETION`, which means the
action's side effects happened but a retry will most likely run them again. That distinction
is the whole reason the phase is on the callback.

**A fingerprint mismatch acquires no lease and fires nothing.** Heartbeat activity is not
surfaced either.

**Under `join-transaction` the terminal callback moves with the record:** `onCompleted` fires
after the commit, and a rollback fires `onFailed` with `FailurePhase.ROLLBACK`. See
[joining your transaction](/docs/joining-your-transaction/).

## Outside Spring

Pass the listeners to the engine directly:

```java
IdempotencyEngine engine = new IdempotencyEngine(store, scheduler, List.of(auditListener));
```

## What to use them for

Metrics and audit trails, which need the boundary rather than the business method. Binding
and unbinding a correlation id that the guarded action reads. Counting replays, which is the
number that tells you whether the keys your clients generate are the ones you expected.

Do not use them to perform side effects that must happen exactly once. A swallowed exception
means the listener can fail silently, and a listener is not covered by the record it observes.
