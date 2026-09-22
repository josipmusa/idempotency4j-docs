---
title: HTTP endpoints
description: The Idempotency-Key header, the four request outcomes, what gets stored, and throw versus return.
sourceOf: README "HTTP endpoints"
---

Clients send a key they generate themselves:

```http
POST /payments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{ "amount": 100, "currency": "USD" }
```

Send it twice and the second response comes back from the store, carrying
`Idempotent-Replayed: true`. Send the same key with a different body and it is rejected with
`422`.

## The four paths

Every request carrying a key resolves down one of four paths, decided entirely by the state
the record already holds in the store.

| The record | What happens |
|---|---|
| Absent | The handler runs and its response is stored |
| `COMPLETE`, body matches | The stored response is replayed |
| `COMPLETE`, body differs | `422`, nothing runs |
| `IN_PROGRESS` past `waitTimeout` | `409` with `Retry-After`, nothing runs |

## The annotation on an endpoint

An HTTP request brings its own key, so the filter reads only the durations and the scope from
the annotation:

```java
@PostMapping("/payments")
@Idempotent(ttl = "PT24H", lease = "PT30S", waitTimeout = "PT10S")
public ResponseEntity<Payment> createPayment(@RequestBody PaymentRequest request) {
    // Duplicates get the stored response replayed.
    // The payment provider should also receive its own idempotency key.
    return ResponseEntity.ok(paymentService.charge(request));
}
```

An annotated endpoint belongs to the filter alone. The advisor that intercepts
[annotated methods](/docs/annotated-methods/) leaves request mapping handlers to it, so the two never guard the same call under two different keys, and the three
attributes only a method can honour - `key`, `codec` and `completion` - are rejected at
startup rather than silently ignored on an endpoint.

The comment on that example is not decoration. Replaying your own response does not undo the
charge the provider took; the provider needs its own idempotency key. See
[what it does](/docs/what-it-does/).

## One answer for the whole API

Whether a request without a key is rejected is `idempotency.web.required`, one answer for the
whole API rather than a per-endpoint one: an API that answers it differently per endpoint is
one clients cannot reason about.

Set it to `false` where idempotency is offered rather than demanded - a request with a key
gets full enforcement, one without passes straight through.

## What gets stored

The filter stores whatever your handler returns, **including 4xx and 5xx responses**, as long
as the handler returns normally. A handler that returns `500` has that `500` replayed to
every duplicate for the full TTL.

A handler that *throws* is different: the engine releases the lease, which deletes the
record, and the next request with that key sees a key that was never used and runs the
handler again.

:::danger[If you want a failed request to be retriable, throw]
Returning an error status tells the library that error is the final answer for that key, and
it is replayed for the full TTL.

A `@ControllerAdvice` that converts every exception into a `ResponseEntity` will, without
anyone intending it, make every failure permanent for its key. If you use one, let the
exceptions you want retried propagate past it, or map them to a throw rather than a return.
:::

The engine records the completion before the response body is released, so normally a
client that sees a response can rely on a retry replaying it. The exception is a store that
fails at that moment: under the default `completion-failure-policy: log-and-return` the
response still goes out and the failure is logged, and a retry after the lease expires runs
the handler again. Set it to `propagate` if you would rather fail the request.

## The request body is buffered

To fingerprint a body and still let your handler read it, the filter wraps the request in a
replayable one that buffers what it reads. Two consequences follow.

:::caution[Non-blocking reads are not supported]
The wrapped input stream rejects `setReadListener` with `Non-blocking IO is not supported`.
A handler using the Servlet async read API on a request carrying an idempotency key will hit
this. Ordinary blocking reads, including everything Spring MVC does for `@RequestBody`, are
unaffected.
:::

**The body is held in memory** up to `idempotency.web.max-body-bytes`, which defaults to
1 MiB. A larger body is rejected with `413` rather than buffered, which is what keeps the
ceiling predictable rather than letting a large upload decide it.

Endpoints that stream large uploads should not be annotated. The key is not a good fit for
them anyway - a retried upload is rarely the same bytes.

## Status codes and replay headers

The full tables are in the [HTTP reference](/docs/reference/http/). In short: the filter can
return `413`, `422` or `409` (the in-flight status is configurable) on its own, and a replay
carries `Idempotent-Replayed: true` and
`Cache-Control: no-store`.
