---
title: What idempotency actually means
description: Why "the same request twice has the same effect once" is harder than it sounds, where duplicates actually come from, and why HTTP's definition of an idempotent method is not the property you need.
question: What does idempotency mean, and why is it hard?
order: 1
---

"The same request twice has the same effect once" is a sentence everyone agrees with and
almost nobody can implement, because the effect it refers to usually lives in a system that
has no idea a retry happened.

The word comes from mathematics, where it describes a function that can be applied to its own
result without changing it. `abs(abs(x))` is `abs(x)`. `max(5, max(5, x))` is `max(5, x)`.
Applying the function a second time is not an error and not a no-op exactly; it is
indistinguishable from having applied it once.

That definition survives the trip into distributed systems mostly intact, but it acquires a
question it did not have in mathematics: **the same effect on what?** A function has one
output. An HTTP request touches a database, a message broker, a payment provider, a cache,
and an email queue, and the answer can be different for each of them.

## The failure is not the duplicate. It is the uncertainty

Start with the situation that produces duplicates, because it explains why they cannot be
prevented at the source.

A client sends a request. The server receives it, does the work, and sends a response. The
response is lost: a connection reset, a load balancer timing out, a pod terminating between
the commit and the write to the socket, a phone leaving a tunnel.

The client is now in a state that has no good move. It knows it sent the request. It does not
know whether the server received it, whether the work ran, or whether the work ran and the
response was lost on the way back. Those three outcomes are **indistinguishable from where it
is standing**, and no amount of waiting will separate them.

So it retries, because the alternative is to silently drop work that may never have happened.
This is the correct behaviour. A client that gives up on a timeout is a client that loses
data, and every HTTP library, message broker, job runner and service mesh in common use has
settled on retrying for exactly this reason.

The duplicate is not a bug in the caller. It is the caller behaving correctly in a situation
where correct behaviour is indistinguishable from the bug.

Being precise about this determines where the fix can live. The caller
cannot fix it: no protocol gives it the information it would need. The network cannot fix it:
a lost response is the thing networks do. **Only the receiver can fix it**, because only the
receiver knows whether the work already ran.

## Where duplicates actually come from

The lost-response case is the clearest, but it is not the most common. Ranked roughly by how
often they cause an incident:

**At-least-once delivery.** Every mainstream message broker delivers at least once, by
design. Kafka redelivers on consumer group rebalance, on a failed commit of a consumer
offset, and whenever a consumer is considered dead by a coordinator that has not heard from
it. SQS redelivers after a visibility timeout. RabbitMQ redelivers any message still
unacknowledged when a consumer's channel or connection closes. None of this is a malfunction. It is the guarantee you agreed to when you chose the
broker.

**Client retries.** HTTP clients, service meshes, and API gateways retry. Some retry on
`5xx`, some on connection errors, some on any timeout, and the defaults are rarely the ones
you would have chosen. A retry three layers below your application code produces a duplicate
that nothing in your logs attributes to a retry.

**Human retries.** A user taps a button twice. A support engineer re-runs a failed job
because the dashboard showed an error that was actually a UI timeout. An operator replays a
dead letter queue after the underlying bug is fixed, not realising that half the messages in
it succeeded before failing on a later step.

**Restarts and redeployments.** A batch job killed halfway through and restarted from the
beginning. A migration re-run after a partial failure. A scheduler firing twice because two
instances both believed they held the lock.

What these have in common is that the duplicate arrives **at a different time, on a different
thread, possibly on a different machine**, from the original. Any defence that relies on
in-process memory, request-scoped state, or a single instance is defending against the case
that almost never happens.

## HTTP's definition is a different property

Anyone searching for this will find the HTTP specification's definition first, and it is a
genuine source of confusion.

RFC 9110 says that `PUT` and `DELETE` are idempotent, along with the safe methods `GET`,
`HEAD`, `OPTIONS` and `TRACE`, while `POST` is not, and neither is `PATCH`, which RFC 5789 defines separately. Read carefully, that sentence
is a statement about what those methods are **defined to mean**, not a promise about what any
particular server does when you call one twice.

The specification is telling intermediaries what they may safely do. A proxy is allowed to
retry a `PUT` on a connection failure without asking, because the method's semantics say a
repeated `PUT` expresses the same intent as a single one. It is not allowed to make that
assumption about `POST`.

Two consequences follow, and both bite in practice.

The first is that **a `PUT` handler is not automatically idempotent**. If your `PUT
/accounts/42` writes an audit row, publishes an event, or increments a counter, calling it
twice produces two audit rows, two events and a counter that is wrong. The method is
idempotent by definition; your implementation of it is not. The specification does not check.

The second is that **the requests you most need to protect are `POST`**. Creating a payment,
placing an order, provisioning a machine, sending a message. These are not idempotent by
their nature, cannot be made so by choosing a different verb, and are precisely the operations
where a duplicate costs real money. HTTP's definition offers nothing here, which is why the
`Idempotency-Key` header exists as a convention on top of the specification rather than as
part of it.

So: HTTP idempotency is a contract about **semantics**, useful for deciding what a proxy may
retry. What you need is a property of your **implementation**, and you have to build it.

## Naturally idempotent, and everything else

Some operations are idempotent without help, and knowing which is what tells you where not to
spend the effort.

```sql
-- Idempotent. Running it twice leaves the same row.
UPDATE accounts SET status = 'CLOSED' WHERE id = 42;

-- Not idempotent. Running it twice charges twice.
UPDATE accounts SET balance = balance - 100 WHERE id = 42;
```

The pattern is that **assignment is idempotent and accumulation is not**. Setting a field to
an absolute value, deleting a row by primary key, and writing an object to a known key in
object storage are all safe to repeat. Incrementing, appending, inserting a row with a
generated id, publishing a message, and calling someone else's API are not.

A great deal of accidental idempotency comes from this, and a great deal of accidental
breakage comes from a change that turns an assignment into an accumulation. Adding an
audit row per call to a naturally idempotent `PUT` handler converts it into a
non-idempotent one, and nothing about the change looks dangerous in review.

A unique constraint on a caller-supplied identifier is the other source of natural
protection, and the most reliable one, because the database refuses the second insert however
many layers above it went wrong. It has real limits, and it is weighed against the alternatives
in [idempotency in Spring Boot](/learn/idempotency-in-spring-boot/).

## "Once" needs a scope

Here is the question that turns idempotency from a definition into a design problem.

An order service and a fulfilment service both consume `OrderPlaced` events. The same event
arrives at both. It must be processed **once by each**, not once in total. A duplicate for the
order service is a duplicate; the fulfilment service's first delivery is not.

So "process this once" is incomplete. The real statement is "process this once **per
consumer**", or per handler, or per workflow step, and whatever identifies the unit of work has
to be part of how a duplicate is recognised. Both ways of getting it wrong are expensive, and
one of them fails silently. What to name, and what naming it costs, is in
[how idempotency keys work](/learn/how-idempotency-keys-work/).

## What happens to effects you do not own

The hardest limit, and the one most often glossed over.

Suppose you correctly recognise a duplicate. You skip the work and return the original
result. What about the payment provider you already called?

Nothing you do on your side reaches into someone else's system. If the first attempt called
the provider and then crashed before recording anything, the charge exists and your record
does not. The duplicate arrives, finds no record, and calls the provider again.

The only real answer is that **the provider must support idempotency too**, which is why
every serious payment API accepts an idempotency key of its own, and why passing yours
through is not an optional refinement. The same applies to any outbound call whose effect
outlives your process.

The rule generalises. Making your own work safe to retry is
achievable, and making someone else's endpoint safe to retry for you is not. Any library,
framework or pattern that appears to promise the second is promising something it cannot
deliver.

## Exactly-once does not exist. Effectively-once does

The phrase "exactly-once delivery" appears in a lot of marketing and describes something that
is not achievable across a network. The proof is the same uncertainty the article opened with:
a sender that cannot distinguish a lost message from a lost acknowledgement must choose
between sending again, which risks a duplicate, and not sending, which risks a loss. There is
no third option and no protocol that invents one.

What is achievable is **at-least-once delivery combined with idempotent processing**, which
produces exactly one effect from possibly many deliveries. Some people call this
effectively-once. The distinction matters because it tells you where to spend your effort: not
on preventing duplicate delivery, which is impossible, but on making duplicate delivery
harmless, which is ordinary engineering. Brokers and outboxes are where this gets concrete, and
[idempotency in message-driven systems](/learn/idempotency-in-message-driven-systems/) works
through it.

## What this actually requires

Pulling the threads together, a correct answer needs four things:

1. **An identifier for the unit of work** that both the original and its duplicate carry, and
   that is stable across a retry.
2. **A record, in durable storage**, that survives a restart and is visible to every instance.
3. **Something that handles concurrency**, because the duplicate frequently arrives while the
   original is still running. Checking for a record and then doing the work is two operations,
   and a duplicate can land between them.
4. **A stored result**, so the duplicate can be answered rather than merely refused. A caller
   that retried because it never saw the response still needs the response.

The fourth is the one most homegrown implementations skip, and it is why so many of them
solve the database half of the problem and leave the caller in the same uncertainty it started
in.

Each of these is a design decision with real tradeoffs, and the identifier in the first one
carries most of them. That is
[how idempotency keys work](/learn/how-idempotency-keys-work/).

---

If you are on Java or Spring, the mechanics of doing this are covered in
[the documentation](/docs/what-it-does/).
