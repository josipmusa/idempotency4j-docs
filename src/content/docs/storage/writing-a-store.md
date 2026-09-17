---
title: Writing a store
description: The three-method SPI, the store contract, and why behaviour changes belong in the contract first.
sourceOf: README "Adding a backend"
---

The store SPI is three methods. Everything difficult about idempotency that is not the
engine's job lives behind them: all blocking, waiting, and stale-lease stealing happens
inside `tryAcquire`.

That concentration is deliberate. A store can wait the way its technology actually waits - a
Postgres advisory lock, a Redis blocking primitive, a condition variable - instead of the
engine polling on a schedule it would have to tune for every backend.

## The contract is the specification

`IdempotencyStoreContract` in `idempotency-test` is the single source of truth for store
behaviour. Implement the SPI, extend the contract, implement `store()`, and pass all of it.

```java
class MyStoreTest extends IdempotencyStoreContract {
    @Override
    protected IdempotencyStore store() {
        return new MyIdempotencyStore(...);
    }
}
```

A store that supports transactional completion also extends `TransactionalStoreContract`.

## Behaviour changes belong in the contract first

**Behaviour changes belong in the contract first, so every backend is held to them.**

This is the rule that keeps three backends from becoming three subtly different libraries. A
store whose lease stealing is almost right is worse than one that does not support the
feature, because the difference only appears under concurrency in production. Writing the
expectation into the contract first means every existing backend either satisfies it or fails
its build, which is how the divergence gets found on the machine of the person introducing
it.

If your store cannot honour a behaviour - joined completion is the usual one - say so rather
than approximating it. Declining is a supported answer; the engine fails the context at
startup when something asks for what the store does not provide.

## Before you write one

The three shipped stores cover a relational database, Redis, and a single JVM. A new backend
is worth writing when you run a durable store that is none of those and would rather not add
one. It is not worth writing to get a slightly different schema out of the JDBC store -
constructing that store by hand against a second `DataSource` is the cheaper answer.
