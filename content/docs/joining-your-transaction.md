---
title: Joining your transaction
description: completion = "join-transaction", the window it closes, its three preconditions, and the advisor ordering trap.
sourceOf: README "Completing inside your transaction"
---

By default the record is written on its own, the moment the action returns. That leaves a
window: if the process dies between your transaction committing and the record being written,
the record stays in progress and a redelivery runs the action again.

`completion = "join-transaction"` closes it. The engine writes the record inside the
transaction the method is already running in, so the record and your business writes commit
together - a crash before the commit leaves neither, a crash after it leaves both.

```java
@Transactional
@Idempotent(key = "#event.id()", completion = "join-transaction", waitTimeout = "PT0S")
void on(OrderPlaced event) {
    orders.save(new Order(event));   // orders: your repository
}
```

## Three preconditions

Three things have to be true for this to work, and the library tells you at startup or on
entry if they are not. Each failure names itself precisely - the messages are on
[troubleshooting](/docs/operating/troubleshooting/).

**The store must support it.** JDBC does; the in-memory and Redis stores do not. Asking for
joined completion against a store that cannot give it fails the context at startup, whether
the request came from `idempotency.completion-mode=join-transaction` or from a single
`@Idempotent(completion = "join-transaction")`.

**A transaction must already be active when the method is entered.** The transaction advisor
has to run *outside* the idempotency advisor. Both default to `Ordered.LOWEST_PRECEDENCE`, which is a tie
rather than an order, so break it:

```java
@EnableTransactionManagement(order = Ordered.HIGHEST_PRECEDENCE)
```

A `@Transactional` method that asks for joined completion while the transaction advisor is
not ordered ahead fails the context at startup, and the message names both advisors' actual
order values so you can see the tie rather than infer it. A joined
context entered without an active transaction at runtime is an `IllegalStateException`, not a
silent downgrade.

:::caution[Two advisors at the same precedence is a tie, not an order]
A tie is resolved by something that is not your intent. The startup failure exists because
the alternative - discovering it in production when the ordering happened to come out the
other way - is not recoverable.
:::

**The store needs the caller's connection.** The starter wires a
`TransactionAwareConnectionResolver` into the JDBC store for you, which runs `COMPLETE` on the
transaction-bound connection and everything else on a connection of its own.

## What the store guarantees

The behaviour a transactional store must provide is pinned by `TransactionalStoreContract`,
which every store claiming support has to pass. Four guarantees come out of it, and they are
worth knowing because they decide what a crash leaves behind:

- **A completion inside a transaction is not visible from another connection before the
  commit.** A concurrent duplicate on a different connection still sees the record in
  progress, not complete.
- **After the commit, a duplicate sees it.** The record and your writes become visible
  together.
- **After a rollback, the record is still in progress** - not complete, and not absent. The
  lease still fences it.
- **A rollback followed by a release leaves the record absent,** which is what makes the key
  retriable again.

:::caution[A rollback does not delete the record by itself]
It stays in progress until the lease is released or expires, and only then is the key free.
A retry arriving in between is told the work is in flight rather than being allowed to run.
:::

## What moves with the record

Under joined completion the terminal lifecycle callback moves with the record: `onCompleted`
fires after the commit, and a rollback releases the lease and fires `onFailed` with
`FailurePhase.ROLLBACK`. Exactly one terminal still fires per lease, only later. See
[lifecycle callbacks](/docs/lifecycle-callbacks/).

## Application-wide

Set `idempotency.completion-mode=join-transaction` to make it the default and leave
`completion` off the individual annotations. Doing so requires a store that supports it, or
the context fails at startup - which is the intended way to find out.
