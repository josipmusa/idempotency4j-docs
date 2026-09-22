---
title: Annotated methods
description: '@Idempotent on any Spring bean - SpEL keys, every attribute, and why consumer threads set waitTimeout to zero.'
sourceOf: README "Annotated methods"
---

`@Idempotent` works on any Spring bean method - a listener, a consumer, a service method. It
needs no web stack.

A method has no transport to take a key from, so you write a SpEL expression over its
parameters:

```java
@Component
class OrderListener {

    @Idempotent(key = "#event.id()", waitTimeout = "PT0S")
    @KafkaListener(topics = "orders")
    void on(OrderPlaced event) {
        // Runs once per event id, however many times the broker redelivers.
    }
}
```

## Every attribute

```java
@Idempotent(
    key = "#event.id()",        // SpEL over the method's parameters. Required here
    scope = "",                 // Empty: <simple class name>.<method name>
    ttl = "PT24H",              // How long the record stays replayable (ISO-8601)
    lease = "PT30S",            // How long this acquisition is protected
    waitTimeout = "PT10S",      // How long a concurrent caller blocks. "PT0S" to not block
    completion = "",            // autonomous | join-transaction
    codec = ""                  // PayloadCodec bean name, for a method that returns a value
)
```

Every attribute except `key` and `scope` takes the application default from
[configuration](/docs/reference/configuration/) when left empty.

## Validation happens at startup

Anything malformed - an unparseable duration, an unknown completion mode, an over-long scope -
is rejected when the context starts, not on the first message.

This is deliberate and it is the reason the attributes are strings. A misconfigured
annotation on a rarely-hit consumer would otherwise stay invisible until the day that
consumer receives traffic, which is the worst moment to discover it.

## `waitTimeout = "PT0S"` on a consumer thread

:::tip[Set it on every consumer]
Declining a redelivery is cheap. Parking a consumer thread is not, and a pool of threads
parked on each other is how a consumer group stops making progress.
:::

A call that finds the key in flight throws `IdempotencyInFlightException`, which carries
`retryAfter` so the broker can redeliver later. Register an `OutcomeMapper` bean to answer
differently.

The default of `PT10S` suits a request thread, where blocking briefly to hand the caller the
real answer beats telling them to come back. A consumer is the opposite case, which is why
the default is the wrong one there.

## Returning a value

A method that returns a value needs a `PayloadCodec` bean named in `codec`, so a duplicate
call can be given the original answer back. The module does not guess at a serialisation
format, and a value-returning method without a codec fails at startup:

```java
@Bean
PayloadCodec<Receipt> receiptCodec() { ... }

@Idempotent(key = "#command.id()", codec = "receiptCodec")
Receipt settle(SettleCommand command) { ... }
```

`codec` names the bean, so `receiptCodec` here is the `PayloadCodec<Receipt>` declared above.

A `void` method needs none - there is nothing to replay - and must leave `codec` empty.

See [payloads and codecs](/docs/concepts/payloads-and-codecs/) for writing one, including
what to put in `attributes`.

## On an endpoint

An annotated request mapping handler belongs to the [HTTP filter](/docs/http-endpoints/)
alone, and `key`, `codec` and `completion` are rejected on one at startup. The advisor that
intercepts annotated methods leaves those handlers to the filter so the two never guard the same call under two different
keys.
