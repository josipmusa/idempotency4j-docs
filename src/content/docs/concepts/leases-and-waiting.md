---
title: Leases and waiting
description: lease and wait as independent durations, the heartbeat at lease/2, and why blocking lives in the store.
sourceOf: README "How it works"
---

Two durations govern an acquisition, and they are set independently.

- **`lease`** is how long an acquisition is protected.
- **`wait`** is how long a second caller blocks for someone else's.

They answer different questions and conflating them is the usual source of confusion. `lease`
is about the holder: how long may this caller hold the key before the library assumes it
died. `wait` is about everyone else: how long should a duplicate stand around hoping to get
the real answer.

## The heartbeat

The heartbeat fires at `lease / 2`, so an action that legitimately runs longer than its lease
keeps it rather than having it stolen mid-flight.

This is what lets `lease` be short. A short lease is good - it bounds how long a key stays
stuck after a process dies - and without a heartbeat it would also mean a slow action losing
its key to a duplicate halfway through. The heartbeat separates the two: `lease` becomes how
long the library waits after the process stops responding, not a budget the action has to
finish inside.

An action that dies without releasing leaves an expired lease, which the next `tryAcquire`
steals atomically.

## Where the blocking happens

The blocking happens inside the store, not in the engine. A concurrent duplicate waits inside
`tryAcquire` for the holder to finish, and only gives up once `wait` elapses - which is why a
duplicate arriving mid-flight usually gets the real result rather than an error.

Putting it in the store rather than the engine is a boundary decision. Each backend can wait
the way its technology actually waits, and the engine stays free of polling loops it would
have to tune for every store.

## The caller that must not block

A caller that must not block sets `wait` to zero and is told the record is in flight straight
away.

```java
@Idempotent(key = "#event.id()", waitTimeout = "PT0S")
```

`waitTimeout = "PT0S"` is what you almost always want on a consumer thread. Declining a
redelivery is cheap; parking a consumer thread is not, and a pool of threads parked on each
other is how a consumer group stops making progress. The call throws
`IdempotencyInFlightException`, which carries `retryAfter` so the broker can redeliver later.

Over HTTP the same situation produces a `409` with a `Retry-After` header rather than an
exception.

## Defaults

| Setting | Default |
|---|---|
| `idempotency.default-lease` | `PT30S` |
| `idempotency.default-wait` | `PT10S` |
| `idempotency.default-ttl` | `PT24H` |

Each is overridable per method on the annotation. The full list is in
[configuration](/docs/reference/configuration/).
