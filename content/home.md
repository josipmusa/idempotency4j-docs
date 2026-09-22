---
title: idempotency4j
description: An idempotency engine for Java. Give a unit of work a key: it runs once, and every duplicate gets the stored result back.
---

<!--
The only source of words for the homepage. All three Stage 2 approaches render this
same content in the same order; they differ in look and in the two moments.

Every factual claim below is copied from ~/Private/idempotency4j/README.md at 0.4.0.
Copy that is mine rather than the library's is marked [mock] and is replaced or
confirmed in Stage 3. The version and the Maven coordinate are never written out here:
they render from the constants in site.config.mjs.
-->

## nav

- Docs → /docs
- Learn → /learn
- GitHub → external
- Maven Central → external
- **Get started** → /docs/quickstart

## hero

### It runs once.

Give a unit of work a key. The first caller acquires a lease, runs under a heartbeat and
stores the result. Every duplicate gets that stored result back.

An idempotency engine for Java. Apache 2.0.

- **Get started** → /docs/quickstart
- Coordinate panel: the Maven and Gradle coordinate, copyable, from the version constant.

## mechanism

### How it works

[mock] Section heading.

1. **Acquire.** A record is identified by a scope and a key together, never by the key
   alone. The key identifies the attempt; the scope names the unit of work it belongs to.
2. **Run under a heartbeat.** Every acquisition carries a lease. The heartbeat fires at
   `lease / 2`, so an action that legitimately runs longer than its lease keeps it rather
   than having it stolen mid-flight.
3. **Store.** The result is encoded and recorded. A record is absent, `IN_PROGRESS` or
   `COMPLETE`; there is no failed state. Releasing deletes the row, so a failed attempt
   leaves no trace and the next caller sees a key that was never used.
4. **Replay.** A concurrent duplicate waits inside `tryAcquire` for the holder to finish
   and only gives up once `wait` elapses, which is why a duplicate arriving mid-flight
   usually gets the real result rather than an error.

An action that dies without releasing leaves an expired lease, which the next
`tryAcquire` steals atomically.

## change

### The whole change

[mock] Section heading.

**On a method**, name the key with a SpEL expression over the parameters:

```java
@Idempotent(key = "#event.id()",
            waitTimeout = "PT0S")
@KafkaListener(topics = "orders")
void on(OrderPlaced event) {
    // Runs once per event id, however
    // often the broker redelivers.
}
```

**On an HTTP endpoint**, the key is the client's header, so the annotation needs
nothing. The payment provider should still get an idempotency key of its own:

```java
@PostMapping("/payments")
@Idempotent
public ResponseEntity<Payment> pay(
        @RequestBody PaymentRequest req) {
    // A duplicate gets the stored response.
    return ResponseEntity.ok(
            payments.charge(req));
}
```

**Without Spring**, the engine is a plain Java object. `IdempotencyEngine.execute` is the
entire API, and what comes back is a sealed `Outcome` you switch on:

```java
var outcome = engine.execute(
        ctx, () -> handler.handle(event));

switch (outcome) {
    // ran now, or ran before under this key
    case Outcome.Executed<Void> e -> { }
    case Outcome.Replayed<Void> r -> { }
    // someone else holds the key right now
    case Outcome.InFlight<Void> f ->
            consumer.nack(f.retryAfter());
}
```

## prevents

### What it prevents

[mock] Section heading.

You need this if callers retry and a duplicate would cause a real problem.

- **Money charged twice.** A payment retried by an impatient client or a gateway timeout.
- **Two orders shipped.** Resource provisioning or order creation called again after a
  network blip.
- **A consumer reprocessing.** An at-least-once broker redelivering after a rebalance.

## outcomes

### Four outcomes over HTTP

Decided entirely by the state the record already holds in the store.

| The record | What happens | Response |
| --- | --- | --- |
| New key | The handler runs and its response is stored | The handler's own response |
| Completed, body matches | The stored response is replayed | `Idempotent-Replayed: true`, `Cache-Control: no-store` |
| Completed, body differs | Key reused with a different request body | `422 Unprocessable Entity` |
| Still held past `waitTimeout` | Another request has the key | `409 Conflict` with `Retry-After` |

The filter stores whatever your handler returns, including 4xx and 5xx, as long as the
handler returns normally. A handler that throws is different: the engine releases the
lease, which deletes the record, and the next request runs the handler again. If you want
a failed request to be retriable, throw.

## compare

### The alternatives

[mock] Section heading and the framing of all three rows; each row's factual content is
from the README.

- **Your own `processed_events` table.** A row and a unique constraint deduplicate. They
  do not give you a lease, a heartbeat that holds it while a slow action runs, a
  concurrent duplicate that waits for the real result instead of failing, or an atomic
  steal of a dead owner's lease. Those are the parts that are hard to get right, and they
  are what the storage SPI's contract is.
- **`@Cacheable`.** A cache is keyed on arguments and is allowed to miss. An idempotency
  record is keyed on a client-chosen key and must not. A cache has no notion of an
  in-flight first execution, so two concurrent duplicates both run.
- **A workflow platform.** Temporal and its neighbours will do this, and much more, in
  exchange for a new runtime, a new programming model and a new operational surface. This
  is a dependency and a table.

## specs

Moved off the homepage to the specs sub-page: a support matrix is read after the
decision, not during it. The words below are the source for that page.

### Supported

Every row is a combination CI runs: the build matrix covers Java 21 and 25 against Spring
Boot 4.0 and 4.1.

| | Supported | Notes |
| --- | --- | --- |
| Java | 21+ | Compiled to 21, tested on 21 and 25 |
| `idempotency-core` | No framework | Plain Java, plus SLF4J |
| Spring Boot | 4.0.x, 4.1.x | Built against 4.0.8, for the adapters and the starter |
| Annotated methods | Spring AOP | No web stack needed, works in a consumer or a batch job |
| Spring MVC (Servlet) | Yes | The HTTP filter activates only for Servlet web applications |
| Spring WebFlux | No | Nothing registers, and no error is raised |
| PostgreSQL | Tested on 16 | Via `idempotency-jdbc` |
| MySQL | Tested on 8.0 | Via `idempotency-jdbc` |
| H2 | Tested on 2.x | Via `idempotency-jdbc`, for development |
| Redis | 7+, tested on 7 | Standalone and Sentinel. Redis Cluster is not supported |

Boot 3 applications should stay on 0.3.0, which remains on Maven Central. Spring Boot 3.5
reached open source end of life on 30 June 2026.

## limits

### What this is not

This is not an exactly-once guarantee for arbitrary downstream side effects. Lease fencing
protects the idempotency record, not the third-party charge your action made just before
the process died. This library makes *your* work safe to retry; it cannot make *someone
else's* endpoint safe to retry for you.

- **No reactive support.** The HTTP adapter is built on `OncePerRequestFilter`, and the
  engine's `execute` is blocking.
- **No tenant isolation.** Within a scope, two callers using the same key share
  idempotency state. Prefix keys at the application level where that matters.
- **Redis Cluster is not supported.** Standalone and Sentinel master-replica connections
  work.
- **Not a distributed lock** you can borrow for general use.

The versions it runs on, and the ones it does not, are on the [specification
sheet](/specs).

## closing

### Add the dependency

[mock] Section heading.

- Coordinate panel again, copyable, Maven and Gradle.
- **Get started** → /docs/quickstart
- Learn → /learn
- GitHub → external

## footer

- Apache License 2.0 → LICENSE
- NOTICE → NOTICE
- Copyright 2026 Josip Musa
