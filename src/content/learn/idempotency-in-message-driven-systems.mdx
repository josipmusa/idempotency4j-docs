---
title: Idempotency in message-driven systems
description: The outbox pattern, at-least-once delivery, and why a duplicate message is evidence that the first attempt may have died halfway, not only noise to filter out.
question: How does idempotency fit with the outbox pattern and at-least-once messaging?
order: 4
---

A duplicate message is usually treated as something to discard. It is also evidence: the first
attempt got far enough to leave a record, and it may have died before it finished. Those are two
different instructions, and most deduplication code follows only the first one.

The model that takes the second one seriously is Udi Dahan's, from
[Reliable Messaging Without Distributed Transactions](https://vimeo.com/111998645). It is the
design behind the NServiceBus outbox and behind most outbox implementations written since. What
follows explains it, then says where a Java application actually gets the pieces.

## The problem two resources create

A handler receives a message, writes to the database, and publishes messages of its own. Three
participants are involved: the broker it read from, the database it wrote to, and the broker it
published to. Nothing spans them.

So either half can succeed alone.

The database commits and the publish fails. The order row exists, `OrderPlaced` was never
published, and fulfilment never hears about an order the customer can see in their account.

The publish succeeds and the transaction rolls back. `OrderPlaced` is on the topic, announcing
a row that does not exist, and every consumer of it is now working from a fact that was
retracted before it was ever true.

Both failures are silent at the point they happen. The handler returns normally in the first
case and throws something unrelated in the second, and the inconsistency is discovered later by
whoever notices the gap.

## Why not two-phase commit

XA is the textbook answer, and the reasons to pass on it are practical ones.

It needs a coordinator with its own durable log and its own recovery path, which is a component
you now operate. Broker support is patchy: Kafka has no XA resource manager at all, and the
brokers that do offer one are not where most of their users are. And a distributed transaction
couples the availability of every resource in it, because a branch left in doubt holds its locks
until the coordinator returns.

The interesting part is that the problem can be solved without it, using one transaction against
one resource.

## The answer, in three steps

### 1. One transaction contains everything

A single local database transaction holds three things:

- the **dedup record** saying "I have processed message X",
- the **business writes**,
- the **outgoing messages**, written as rows into an outbox table rather than published.

One commit. One resource. No coordinator, because there is nothing to coordinate: either all
three are durable or none of them are.

### 2. Dispatch after the commit, then mark

After the transaction commits, a dispatcher sends the outbox rows to the broker and marks them
dispatched. A crash anywhere in that sequence is recovered by a process that picks up rows which
are not marked and sends them again.

That recovery is where at-least-once delivery comes from, and it comes from your own code, not
from the broker. A relay that publishes a row and dies before marking it has no way to learn
whether the publish landed, so it publishes again. Your outbox is one of the things producing
duplicates for the consumers downstream of it.

### 3. A duplicate means: check whether the first attempt finished

This is the step that gets left out.

When a duplicate inbound message arrives, you find the dedup record and skip the business logic.
You also **re-dispatch that record's outbox messages if they were never marked dispatched**.

The reason is step 2's gap. The first attempt may have committed all three writes and then died
before the dispatcher ran. The business change is durable, the dedup record is durable, and the
messages announcing them are sitting in a table that nobody is looking at. A redelivery arrives,
the usual deduplication logic recognises it, returns, and leaves the outbox rows exactly where
they were.

The usual mental model of deduplication is subtractive: recognise the duplicate, do nothing,
return. This model is additive. Recognise the duplicate, then ask whether the first attempt
actually finished, and finish it if it did not.

It changes what a redelivery is for. Instead of noise to be filtered, every redelivery is an
opportunity to repair a half-completed unit of work, driven by the broker's own retry schedule
instead of by a sweeper process guessing how stale is stale enough to act on.

## Everything has to be in one database

Step 1 is only one commit if the dedup record, the business writes and the outbox rows all live
in the same database. Put the dedup record in Redis and you are back to two resources and back
to the failure the whole design exists to avoid, with the added indignity that it now looks
solved.

That constraint arrives from a detail several levels down, which is why it tends to be
discovered late.
[Building the full thing](/learn/idempotency-in-spring-boot/) reaches the same place from the
other direction: the commit ordering question forces the record into the caller's transaction,
which forces the store to be the caller's database.

## Inbox and outbox are not alternatives

These get presented as competing patterns and they solve opposite halves.

The **outbox** is a producer-side guarantee: a message you decided to send is eventually
published, even if the process dies immediately after the commit.

The **inbox**, or idempotent receiver, is a consumer-side guarantee: a message that arrives
twice is processed once.

An outbox does not reduce the need for idempotent consumers. As step 2 shows, it is one of the
things that generates duplicates, because its recovery path cannot tell a publish that landed
from one that did not. A system with an outbox usually needs an inbox, and a system with an
inbox usually turns out to need an outbox the first time it publishes anything from a handler.

Neither gets you exactly-once delivery, which does not exist;
[what idempotency actually means](/learn/what-is-idempotency/) covers why, and why
effectively-once is the achievable thing.

Kafka's exactly-once semantics are a narrower guarantee than the name suggests: they cover
consume-transform-produce within Kafka, and they do not extend to your database writes or to any
outbound call you make. Turning them on does not remove the need for an idempotent consumer.

## What serves as the key

The first practical question on the receiving side is what to deduplicate on, and the answer is
broker-specific.

**Kafka** gives you a record key and a topic, partition and offset coordinate. The record key
identifies an entity rather than a delivery, so two distinct messages routinely share one; the
coordinate identifies the delivery and is stable across a redelivery, because a rebalance
replays the same offsets. If the producer puts an application-level id in a header, prefer it,
because it survives a topic migration and a coordinate does not.

**SQS** gives every message an id, and FIFO queues additionally take a deduplication id from
the producer, which suppresses duplicates for five minutes at the queue so they never reach your
handler at all. That window is a producer-side convenience and not a substitute for a record on
your side.

**AMQP** gives you a `message-id` property, which is optional and set by the application, plus a
`redelivered` flag. The flag tells you a redelivery is possible, not that one happened, so it is
a hint rather than an answer.

Whatever you pick has to be paired with something naming the consumer, or two services reading
the same stream will suppress each other's work.
[How idempotency keys work](/learn/how-idempotency-keys-work/) covers why identity is the pair
rather than the key.

One choice belongs to consumers specifically. When a duplicate arrives while the original is still
running, refuse it immediately rather than waiting for the original to finish. Listener pools
are small, and a thread parked waiting for another consumer is a thread not draining the
partition. Waiting is the right answer for an HTTP caller that needs a response, and the wrong
one here.

## Where a Spring application gets the pieces

The producer side has two concrete implementations in this ecosystem, and neither is a
do-it-yourself table.

**Spring Modulith's event publication registry** is the outbox for application events. When a
module publishes an event and there are transactional listeners for it, Modulith writes one row
per event-and-listener pair into its event publication log, in the same transaction as the
business writes. The row is marked completed when the listener succeeds. Incomplete rows survive
a restart and can be re-invoked, and since 2.0 a publication carries an explicit status:
`PUBLISHED`, `PROCESSING`, `COMPLETED`, `FAILED` or `RESUBMITTED`. Resubmission is exposed on
`IncompleteEventPublications`, whose `resubmitIncompletePublications` takes
`ResubmissionOptions` as of 2.0 alongside the older predicate- and duration-based overloads;
`FailedEventPublications` has a `resubmit` for the failed subset, and the options carry a batch
size, a minimum age and a filter.

`@ApplicationModuleListener` is the annotation that puts a listener in that registry, and the
same mechanism carries **event externalization**: an event annotated `@Externalized` is
published to Kafka, AMQP, JMS or a Spring Messaging channel by a transactional listener, so an
externalized event gets the registry's guarantees rather than a bare publish inside a
transaction.

**Namastack Outbox** is a production outbox for Spring Boot that Spring Modulith 2.1 can
delegate externalization to, through `spring-modulith-starter-namastack`. Where the registry is
a general mechanism for application events, this is the outbox as a first-class component, with
ordering and dispatch behaviour of its own.

## Where idempotency4j sits, and what it does not do

The receiving side, and only part of it.

Its records are step 1's dedup table. `@Idempotent` is transport-neutral, so it goes on a
`@KafkaListener` or an `@EventListener` as readily as on an MVC handler, with the key given as a
SpEL expression over the method's parameters. Its default scope is the class and method name,
which keeps two consumers of the same message independent. With the JDBC store and
`join-transaction` completion, the record is written on the caller's own transaction-bound
connection, so the record and the business writes commit or roll back together. That is step 1's
one-commit property, for the inbound half.

The expression is the whole integration, and it cuts both ways: you supply the key, and the
library never looks at the transport. It cannot tell a Kafka record from an SQS message, which
is why it works on either and why choosing what to pull out of them stays your decision, on the
terms the previous section describes.

What it does not do today is the rest of the picture. There is no messaging module: no
broker-specific key extraction, nothing that writes an outbox, nothing that dispatches one, and
nothing that knows what a Spring Modulith event publication is. The one-commit property belongs
to the JDBC store; the Redis store reports that it cannot support transactional completion and
always will, because there is no transaction a JDBC caller's writes could join. The HTTP side is
a servlet filter, with no reactive equivalent.

Step 3 has a seam, at least. `IdempotencyLifecycleListener.onDuplicate` fires exactly when a
completed record is found and the action is skipped, which is the moment step 3 describes: the
point at which you could ask whether the first attempt left anything unfinished, and finish it.
The callback is there and the decision is yours to write. Making that generic is a design
problem rather than a packaging one, because the library would have to know what was committed
alongside its record, and today it knows only that the record completed.

---

What the library does, and the exact shape of its records, leases and outcomes, is in
[the documentation](/docs/).
