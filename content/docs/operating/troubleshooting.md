---
title: Troubleshooting
description: The startup failures, warnings and runtime surprises by their exact message, each with its cause and its fix.
---

Every entry carries the message the library actually prints, quoted verbatim under a heading
that says what went wrong - so the page is scannable, and a search for the exact string still
lands on the right section.

Most of these are startup failures by design: a misconfigured annotation on a rarely-hit
consumer would otherwise stay invisible until the day that consumer receives traffic.

:::tip[If duplicates are reaching your handler, check one thing first]
Whether a store is actually active. Under the default `store-type: auto` a missing provider
is a warning, not a failure, and the application serves traffic deduplicating nothing -
[jump to it](#no-store-is-active-so-nothing-is-deduplicated).
:::

## By symptom

| What you are seeing | Go to |
|---|---|
| The application will not start | [Startup failures](#startup-failures) |
| It starts, but duplicates still run | [No store is active](#no-store-is-active-so-nothing-is-deduplicated), then [the checklist](#a-duplicate-re-executed-instead-of-replaying) |
| Every idempotent call fails with a 500 | [The records table could not be queried](#the-records-table-could-not-be-queried) |
| The records table keeps growing | [Purging is enabled but scheduling is not](#purging-is-enabled-but-scheduling-is-not) |
| A failed request keeps returning the same error | [An error response is replayed for hours](#an-error-response-is-replayed-for-hours) |
| A duplicate got `204 No Content` | [Completed through a non-HTTP path](#an-http-duplicate-got-204-no-content) |
| Two different requests shared a result | [Two different requests were treated as the same](#two-different-requests-were-treated-as-the-same) |
| Records vanished | [After a Redis failover](#records-disappeared-after-a-redis-failover) |
| Consumers stopped making progress | [Consumer threads are parked](#consumer-threads-are-parked) |
| A batch fails on a key it already processed | [The same key twice in one transaction](#the-same-key-twice-in-one-transaction-reports-in-flight) |
| Transactional calls stall waiting for a connection | [The connection pool is too small](#transactional-calls-stall-on-the-connection-pool) |

## Startup failures

### A demanded store could not be built

> `idempotency.store-type` is jdbc but no store could be built. Add the matching provider
> dependency (io.github.josipmusa:idempotency-jdbc) and make sure exactly one DataSource
> bean is available.

You demanded a store and the conditions for building it were not met. Either the provider
dependency is missing, or there is no `DataSource` bean, or there is **more than one** - the
JDBC store is built from a single `DataSource` and will not guess between two.

With several data sources, declare the store yourself against the one you want. See
[JDBC](/docs/storage/jdbc/).

### The store cannot complete inside a caller's transaction

> `idempotency.completion-mode` is join-transaction, but the configured idempotency store
> (`<store class>`) cannot complete inside a caller's transaction. Use a store that can, such as the JDBC one,
> or set `idempotency.completion-mode=autonomous`.

Only the JDBC store supports [joined completion](/docs/joining-your-transaction/). The Redis
and in-memory stores report that they cannot, and asking for it anyway fails the context
rather than silently downgrading to autonomous completion. Asking for it on a single
annotation fails the same way, with a message naming the method:

> `@Idempotent(completion = "join-transaction")` on `<Class>.<method>` cannot be honoured:
> the configured idempotency store cannot complete inside a caller's transaction. Use a store
> that can, such as the JDBC one, or drop the attribute to complete autonomously.

### An `IdempotentAdvisor` is declared as a bean

> IdempotentAdvisor must not be registered as a bean: an auto-proxy creator would apply it at
> an order that ties with the transaction advisor's. Register IdempotentBeanPostProcessor
> instead - the starter already does.

Remove the bean. With the starter there is nothing to replace it with; without the starter,
register `IdempotentBeanPostProcessor` instead. The post-processor places the idempotency
advice inside the bean's own transaction, which is what
[joined completion](/docs/joining-your-transaction/) and a completion that waits for the
commit both depend on. An `@EnableTransactionManagement(order = ...)` kept from 0.4.x is
harmless and no longer needed.

### A codec is required on a value-returning method

> `@Idempotent(codec = ...)` is required on `<method>`: it returns `<type>`, and a duplicate
> call has to be given that value back. Name a `PayloadCodec` bean that encodes it, or make
> the method void.

A value-returning method needs somewhere for the value to be stored, and the library does not
guess at a serialisation format. Write a [codec](/docs/concepts/payloads-and-codecs/), or make
the method `void` if a duplicate genuinely needs nothing back.

### A key is required on an annotated method

> `@Idempotent(key = ...)` is required on `<method>`: a method has no transport to take an
> idempotency key from, so the key must be an expression over its parameters, for example
> `"#event.id()"`

A method has no transport to take a key from, so the SpEL expression is required. On an HTTP
endpoint the opposite holds and `key` is rejected - the client's header is the key. See
[the annotation reference](/docs/reference/annotation/).

### The purge cron expression is invalid

> Invalid `idempotency.purge.cron` value: `'<cron>'`

The value is not a valid Spring cron expression. The default is `0 0 * * * *`, which is six
fields, not five - Spring cron expressions carry a leading seconds field.

### Malformed durations and out-of-range values

Every duration on the annotation is ISO-8601, so thirty seconds is `PT30S`, not `30s`.
A malformed one fails startup naming the attribute and the method:

> Invalid `@Idempotent(ttl = "30s")` on `<Class>#<method>`: not a valid ISO-8601 duration
> (e.g. "PT10S", "PT5M", "PT1H")

Several bounds are validated at construction and name the value they received:
`defaultTtl must be at least 1ms`, `defaultLeaseDuration must be at least 2ms`,
`inFlightStatus must be a 4xx or 5xx status`, `requestFingerprint must be a hex string`.

## Warnings worth treating as errors

### No store is active, so nothing is deduplicated

> No IdempotencyStore bean is present, so idempotency is inactive: no engine, no filter, and
> no request is deduplicated. Add a provider dependency, or declare a store bean, or set
> `idempotency.store-type=none` to silence this.

**This is the one to check first if duplicates are reaching your handler.** Under the default
`store-type: auto`, a missing provider or absent `DataSource` is a warning rather than a
failure, and the application starts and serves traffic with no idempotency at all.

Nothing else in the application looks wrong. Every request succeeds. The duplicates arrive
later, in production.

`auto` deliberately does not fall back to the in-memory store - see
[choosing a store](/docs/storage/choosing/). If this warning is acceptable in a given
environment, set `store-type: none` so the silence is a decision rather than an accident.

The selected store is logged at startup, so the positive confirmation is in the same log.

### The records table could not be queried

> The `idempotency_records` table could not be queried (`<SQL error>`), so every idempotent call will fail
> until it exists. Create it from the `idempotency-schema-postgresql.sql` or
> `idempotency-schema-mysql.sql` file shipped in the `idempotency-jdbc` jar, or set
> `idempotency.jdbc.initialize-schema=always` to let the store create it.

The default `initialize-schema: embedded` creates the table only on an embedded database, so
a real database never receives DDL from a library behind its owner's back. Point your
migration tool at the shipped schema file. See [JDBC](/docs/storage/jdbc/).

### Purging is enabled but scheduling is not

> `idempotency.purge.enabled` is true but `@EnableScheduling` was not detected. Expired
> idempotency records will NOT be purged automatically. Add `@EnableScheduling` to your
> application class, or set `idempotency.purge.enabled=false` to suppress this warning.

The setting reads as on, the scheduler is never registered, and the table grows until someone
notices. Add `@EnableScheduling`, or set `purge.enabled=false` so the configuration matches
reality. See [purging and retention](/docs/operating/purging-and-retention/).

## Expected debug output

### Leaving an annotated endpoint to the HTTP adapter

> Leaving `@Idempotent` `<Class>.<method>` to the HTTP adapter: it is a request mapping
> handler, so its key comes from the request header rather than its parameters

Logged at DEBUG, and nothing is wrong. The advisor that intercepts
[annotated methods](/docs/annotated-methods/) deliberately skips endpoints so the filter and
the advisor never guard the same call under two different keys.

## Runtime behaviour that surprises people

### A duplicate re-executed instead of replaying

Work through these in order:

1. **Is a store actually active?** See the warning above. This is the common answer.
2. **Did the first attempt throw, or its transaction roll back?** Releasing deletes the
   record, so the next caller sees a key that was never used, and a rollback releases the key
   just as an exception does. That is the intended contract - see
   [the record lifecycle](/docs/concepts/record-lifecycle/).
3. **Has the TTL elapsed?** After `default-ttl` the record is purged and a retry is a fresh
   execution.
4. **Is the scope what you expect?** The default is `<simple class name>.<method name>`, so
   renaming a class or method changes the scope and orphans existing records. See
   [scope and key](/docs/concepts/scope-and-key/).
5. **Did the completion fail?** Under the starter's default
   `completion-failure-policy: log-and-return`, a store that refused the completion is logged
   and the caller still gets its result - the guarantee is lost for that one key. A
   [joined](/docs/joining-your-transaction/) completion is the exception: its failure always
   propagates, so the transaction cannot commit your writes without the record.

### An error response is replayed for hours

The filter stores whatever the handler returns, including 4xx and 5xx, as long as the handler
returns normally.

**If you want a failed request to be retriable, throw. If you return an error status, you are
telling the library that error is the final answer for that key.**

A `@ControllerAdvice` that converts every exception into a `ResponseEntity` will make every
failure permanent for its key without anyone intending it. See
[HTTP endpoints](/docs/http-endpoints/).

### An HTTP duplicate got `204 No Content`

The key was completed through a non-HTTP path, so there is no stored response to replay. The
record is `COMPLETE` and its payload is not an HTTP response. If both paths need to serve HTTP
clients, give them separate [scopes](/docs/concepts/scope-and-key/).

### Two different requests were treated as the same

Over HTTP this cannot happen with different bodies: the filter fingerprints the body and
answers `422`. On an annotated method there is no fingerprint, so make the `key` expression
distinguish the two requests, or drive [the engine](/docs/the-engine/) directly and add
`.fingerprint(...)` to the context. Without one the library has no way to know the payloads
differ, and a caller that reuses a key for different work gets the first result back.

Note the asymmetry: two acquisitions clash **only when both carry a fingerprint and the two
differ**. A stored record without one cannot be contradicted by an incoming request that has
one, and the reverse also holds - both are duplicates, not mismatches. See
[fingerprints](/docs/concepts/fingerprints/).

### Records disappeared after a Redis failover

Redis replication is asynchronous, so a completed record acknowledged by the primary may not
have reached a replica when the primary was lost. The Redis store can require replica
acknowledgement on each mutation - see [Redis](/docs/storage/redis/).

Also confirm `maxmemory-policy noeviction`. Under any other policy Redis may evict a record to
make room, and the store cannot detect that this happened.

### Consumer threads are parked

The default `default-wait` is `PT10S`, which suits a request thread and not a consumer. Set
`waitTimeout = "PT0S"` on consumer methods so a redelivery is declined rather than blocking a
thread from a small fixed pool. See [leases and waiting](/docs/concepts/leases-and-waiting/).

### The same key twice in one transaction reports in flight

A record is only complete once its transaction commits, so a second call with the same key
inside the same transaction does not replay the first. It waits out its `waitTimeout` and
reports in flight. If the method is itself `@Transactional`, that exception marks the shared
transaction rollback-only on its way out, and the whole batch fails at commit with
`UnexpectedRollbackException` even when the caller catches it. Declare
`@Transactional(noRollbackFor = IdempotencyInFlightException.class)` to keep the rest of the
batch. See [joining your transaction](/docs/joining-your-transaction/).

### Transactional calls stall on the connection pool

Inside a transaction, each `@Idempotent` call briefly needs a second pooled connection next to
the one its transaction holds. A pool no larger than the number of concurrent transactional
`@Idempotent` calls can starve until the pool's own timeout gives up. Size the pool above that
number, or put a `LazyConnectionDataSourceProxy` in front of the `DataSource`. See
[annotated methods](/docs/annotated-methods/#inside-a-transaction).
