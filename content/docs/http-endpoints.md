---
title: HTTP endpoints
description: The Idempotency-Key header, the four request outcomes, what gets stored, throw versus return, releasing a key, and custom rejection responses.
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
it is replayed for the full TTL - unless a
[`ResponseStoragePolicy`](#releasing-the-key-instead-of-storing) says otherwise.

A `@ControllerAdvice` that converts every exception into a `ResponseEntity` will, without
anyone intending it, make every failure permanent for its key. If you use one, let the
exceptions you want retried propagate past it, or map them to a throw rather than a return.
:::

## Releasing the key instead of storing

Some responses mean nothing happened: a `503` because a downstream system was unreachable
before anything was sent to it, a `400` from validation the client will fix, a `429`. Declare
a `ResponseStoragePolicy` bean (`io.github.josipmusa.idempotency.spring.web`) and return
`false` for those. The client still gets the response, once, but the record is deleted instead
of stored, and the next request with that key runs the handler again - with any body, so a
corrected request is not refused as a mismatch.

A status alone rarely tells you that nothing happened: a `504` after the downstream system
received the request must be stored, or the retry runs the operation twice. Let the code that
knows mark the request, typically your exception handler, and have the policy read the mark:

```java
@Bean
ResponseStoragePolicy responseStoragePolicy() {
    return (request, response) -> request.getAttribute("idempotency.release") == null;
}

@ExceptionHandler(DownstreamUnreachableException.class)
ResponseEntity<ApiError> unreachable(DownstreamUnreachableException e, HttpServletRequest request) {
    request.setAttribute("idempotency.release", true);   // nothing was sent: let the client retry
    return ResponseEntity.status(503).body(ApiError.of("DOWNSTREAM_UNAVAILABLE"));
}
```

:::caution[`false` is permission to run again, not an undo]
It does not undo anything the handler did and does not roll back a transaction. Return it only
for responses that mean the operation did not happen.
:::

The policy sees the handler's response before the `ResponseSanitizer` and is asked only for
fresh executions, never for a replay or for the filter's own rejections. Without a bean, every
response is stored, as before.

- **Only an explicit `false` releases the key.** A policy that throws counts as a failure to
  record the completion, so the record is kept and `idempotency.completion-failure-policy`
  applies.
- **A release the store refuses** with an exception is logged, the client keeps its response,
  and the key stays in flight until its lease expires. An `Error` from the release fires
  `onFailed` with `FailurePhase.RELEASE` and propagates.
- **Inside a transaction, the release waits for the commit**, the same way a completion does.
- [Lifecycle listeners](/docs/lifecycle-callbacks/) see a release as `onReleased`.

## When a client can rely on a replay

The engine records the completion before the response body is released, so a client that sees
a response can usually rely on a retry replaying it. That does not hold in two cases:

- **A storage policy declined the response.** The key was released, and a retry runs the
  handler again.
- **Recording the completion failed and the failure was only logged.** Under the default
  `completion-failure-policy: log-and-return`, or for a completion deferred to a commit, the
  response still goes out and the failure is logged, and a retry after the lease expires runs
  the handler again. Set the policy to `propagate` if you would rather fail the request.

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

## Custom rejection responses

The responses the filter writes itself - missing key, key too long, body too large, key reused
with a different body, and in flight - carry a `{"error": "..."}` JSON body by default. An API
with its own error format can render them itself by declaring an
`IdempotencyRejectionHandler` bean (`io.github.josipmusa.idempotency.spring.web`).

The handler gets an `IdempotencyRejection`, a sealed type with one record per case:
`MissingKey`, `KeyTooLong(maxLength)`, `BodyTooLarge(maxBytes)`, `FingerprintMismatch` and
`InFlight(retryAfter, suggestedStatus)`. Nothing runs or is stored for a rejected request,
whatever the handler writes. Handle every case with an exhaustive `switch`, so the compiler
tells you when you miss one:

```java
@Bean
IdempotencyRejectionHandler idempotencyRejectionHandler() {
    return (rejection, request, response) -> {
        switch (rejection) {
            case IdempotencyRejection.MissingKey m -> writeApiError(response, 400, "IDEMPOTENCY_KEY_REQUIRED");
            case IdempotencyRejection.KeyTooLong t -> writeApiError(response, 400, "IDEMPOTENCY_KEY_TOO_LONG");
            case IdempotencyRejection.BodyTooLarge b -> writeApiError(response, 413, "BODY_TOO_LARGE");
            case IdempotencyRejection.FingerprintMismatch f -> writeApiError(response, 409, "IDEMPOTENCY_KEY_REUSED");
            case IdempotencyRejection.InFlight i -> writeApiError(response, i.suggestedStatus(), "IN_FLIGHT");
        }
    };
}
```

Or render the cases you care about and delegate the rest to
`DefaultIdempotencyRejectionHandler`, which writes the default responses:

```java
@Bean
IdempotencyRejectionHandler idempotencyRejectionHandler() {
    IdempotencyRejectionHandler defaults = new DefaultIdempotencyRejectionHandler();
    return (rejection, request, response) -> {
        if (rejection instanceof IdempotencyRejection.InFlight inFlight) {
            writeApiError(response, inFlight.suggestedStatus(), "IN_FLIGHT");
        } else {
            defaults.handle(rejection, request, response);
        }
    };
}
```

For `InFlight`, the filter sets `Retry-After` before the handler runs, so a handler that only
changes the body keeps it; set the header yourself to send another value. `suggestedStatus` is
`idempotency.web.in-flight-status`: use it to stay consistent with the configuration, or
choose your own status.

:::note[A new rejection case is a compatibility-sensitive change]
A `switch` over every case stops compiling if a later release adds one, so adding a kind of
rejection is treated as a compatibility-sensitive change.
:::

## Status codes and replay headers

The full tables are in the [HTTP reference](/docs/reference/http/). In short: the filter can
return `413`, `422` or `409` (the in-flight status is configurable) on its own, and a replay
carries `Idempotent-Replayed: true` and
`Cache-Control: no-store`.
