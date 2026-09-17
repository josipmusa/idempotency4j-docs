---
title: '@Idempotent'
description: Every attribute of the annotation, its default, and which are rejected on an HTTP endpoint.
sourceOf: README "Annotated methods", "HTTP endpoints"
---

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

## Attributes

| Attribute | Default when empty | Notes |
|---|---|---|
| `key` | - | SpEL over the method's parameters. Required on a method; rejected on an endpoint |
| `scope` | `<simple class name>.<method name>` | See [scope and key](/docs/concepts/scope-and-key/) |
| `ttl` | `idempotency.default-ttl` | ISO-8601 duration |
| `lease` | `idempotency.default-lease` | ISO-8601 duration |
| `waitTimeout` | `idempotency.default-wait` | ISO-8601 duration. `PT0S` to not block |
| `completion` | `idempotency.completion-mode` | `autonomous` or `join-transaction`. Rejected on an endpoint |
| `codec` | - | `PayloadCodec` bean name. Required on a value-returning method, rejected on a `void` one and on an endpoint |

Every attribute except `key` and `scope` takes the application default from
[configuration](/docs/reference/configuration/) when left empty.

## Rejected on an endpoint, and why

Three attributes are rejected at startup on a request mapping handler:

| Attribute | Why |
|---|---|
| `key` | An HTTP request brings its own key in the header. A second key from the annotation would mean two identities for one call |
| `codec` | The filter stores the HTTP response through its own `StoredResponseCodec` |
| `completion` | The filter completes after the response is captured, outside any method transaction |

:::note[Rejected rather than ignored]
An attribute that is silently ignored reads as though it took effect, and the reader has no
way to discover otherwise.
:::

## Validation

Anything malformed - an unparseable duration, an unknown completion mode, an over-long scope,
a value-returning method with no codec, a `void` method with one - is rejected when the
context starts, not on the first message.

## Behaviour on a `void` method

There is nothing to replay, so `codec` must be empty. A duplicate returns without running the
method. The [outcome](/docs/concepts/outcomes/) still distinguishes `Executed` from
`Replayed` for a [lifecycle listener](/docs/lifecycle-callbacks/) that cares.
