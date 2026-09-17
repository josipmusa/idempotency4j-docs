---
title: Quickstart
description: The starter, a JDBC store and one annotation - idempotency4j running in five minutes.
sourceOf: README "Quick start"
---

Add the Spring Boot starter and one storage backend:

```xml
<dependency>
    <groupId>io.github.josipmusa</groupId>
    <artifactId>idempotency-spring-boot-starter</artifactId>
    <version>0.4.0</version>
</dependency>

<!-- Pick one storage backend -->
<dependency>
    <groupId>io.github.josipmusa</groupId>
    <artifactId>idempotency-jdbc</artifactId>
    <version>0.4.0</version>
</dependency>
```

Or import the BOM and omit the versions:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>io.github.josipmusa</groupId>
            <artifactId>idempotency-bom</artifactId>
            <version>0.4.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## The store wires itself

With `idempotency-jdbc` on the classpath and a `DataSource` in the context, the store is
wired for you.

On anything other than an embedded database, create the table first from the
`idempotency-schema-postgresql.sql` or `idempotency-schema-mysql.sql` file shipped in the
provider jar - see [JDBC](/docs/storage/jdbc/). A development H2 needs nothing.

## Annotate the work

**On a method**, name the key with a SpEL expression over the parameters:

```java
@Idempotent(key = "#event.id()", waitTimeout = "PT0S")
@KafkaListener(topics = "orders")
void on(OrderPlaced event) {
    // Runs once per event id, however many times the broker redelivers.
}
```

`waitTimeout = "PT0S"` is what you want on a consumer thread: declining a redelivery is
cheap, parking a consumer thread is not.

**On an HTTP endpoint**, the key is the client's header, so the annotation needs nothing:

```java
@PostMapping("/payments")
@Idempotent
public ResponseEntity<Payment> createPayment(@RequestBody PaymentRequest request) {
    // Duplicates get the stored response replayed.
    // The payment provider should also receive its own idempotency key.
    return ResponseEntity.ok(paymentService.charge(request));
}
```

**Without Spring**, build the engine yourself - see [the engine](/docs/the-engine/).

## Check it

Send the same request twice with the same `Idempotency-Key`:

```bash
curl -i -X POST localhost:8080/payments \
  -H 'Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Content-Type: application/json' \
  -d '{"amount": 100, "currency": "USD"}'
```

The second response carries `Idempotent-Replayed: true` and the handler did not run.

## Next

**[What it does](/docs/what-it-does/)** - the model behind what you ran, in about four
hundred words. Read it before you annotate anything else.
