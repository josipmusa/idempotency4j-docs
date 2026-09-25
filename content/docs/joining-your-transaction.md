---
title: Joining your transaction
description: How the default waits for your commit, what completion = "join-transaction" adds, and its three preconditions.
sourceOf: README "Completing inside your transaction"
---

By default the record is written on its own. When the method runs inside a transaction - its
own `@Transactional`, or one a caller opened - the engine waits for that transaction: the
record is written after the commit, and a rollback frees the key so a retry runs the action
again. With no transaction, the record is written the moment the method returns.

Either way that leaves a window: if the process dies between your transaction committing and
the record being written, the record stays in progress and a redelivery runs the action again.

:::caution[The same key twice in one transaction does not replay]
The record is only complete after the commit, so a second call with the same key inside the
same transaction - a duplicate within a batch processed in one transaction - waits out its
`waitTimeout` and reports in flight. If the method is itself `@Transactional`, that exception
marks the shared transaction rollback-only on its way out, and the batch's commit fails even
when the caller catches it. Declare
`@Transactional(noRollbackFor = IdempotencyInFlightException.class)` to keep the rest of the
batch.
:::

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

**A transaction must be active when the method runs.** `@Transactional` on the method or its
class is enough: the idempotency advice runs inside it, with no ordering to configure. A
joined method with no transaction of its own relies on its caller's. A joined context entered
without an active transaction is an `IllegalStateException`, not a silent downgrade.

**The store needs the caller's connection.** The starter wires a
`TransactionAwareConnectionResolver` into the JDBC store for you, which runs the joined
completion on the transaction-bound connection and everything else, an autonomous completion
included, on a connection of its own.

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
At the store level the record returns to in progress. The engine releases it in its
after-rollback hook, which is what frees the key; until that release lands, a retry is told
the work is in flight rather than being allowed to run.
:::

## What moves with the record

Whenever the completion waits on a transaction - always under joined completion, and under
the default whenever the method runs inside one - the terminal lifecycle callback waits with
it: `onCompleted` fires after the commit, and a rollback releases the lease and fires `onFailed` with
`FailurePhase.ROLLBACK`. Exactly one terminal still fires per lease, only later. See
[lifecycle callbacks](/docs/lifecycle-callbacks/).

## Application-wide

Set `idempotency.completion-mode=join-transaction` to make it the default and leave
`completion` off the individual annotations. Doing so requires a store that supports it, or
the context fails at startup - which is the intended way to find out.

The property applies to `@Idempotent` methods only: the HTTP filter runs outside any
transaction a handler opens, so it always completes on its own.
