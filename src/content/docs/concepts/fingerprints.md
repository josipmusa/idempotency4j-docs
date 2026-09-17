---
title: Fingerprints
description: Guarding a key against reuse with a different payload, and why two acquisitions clash only when both carry one.
sourceOf: README "The engine"
---

A key says "this is the same attempt". A fingerprint checks that claim against the payload.

Add `.fingerprint(sha256Hex)` to the context builder when the payload is worth guarding
against key reuse:

```java
IdempotencyContext context = IdempotencyContext.builder("PaymentService.charge", key)
        .fingerprint(sha256Hex(requestBody))
        .build();
```

## The clash rule

**Two acquisitions clash only when both carry a fingerprint and the two differ.**

Each half of that matters:

- **Both must carry one.** An acquisition with no fingerprint makes no claim about its
  payload, so there is nothing to contradict. This is what lets fingerprinting be adopted on
  one path without every other path having to change at the same time.
- **They must differ.** Matching fingerprints are the normal case - the same request sent
  twice - and proceed as an ordinary duplicate.

A mismatch is a client error, not a race. The same key was deliberately used for two
different pieces of work, which means the caller's key generation is wrong and the library
cannot repair it. Over HTTP this surfaces as `422`. A fingerprint mismatch acquires no lease
and fires no [lifecycle callback](/docs/lifecycle-callbacks/).

## Over HTTP you get it for free

The HTTP adapter fingerprints the request body for you. Send the same key with a different
body and it is rejected with `422`. The body it will fingerprint is bounded by
`idempotency.web.max-body-bytes`, which defaults to 1 MiB; a larger body is rejected with
`413` rather than stored unchecked.

## Choosing what to hash

The fingerprint is yours to compute, which means the decision of what counts as "the same
request" is yours too. Hash the fields that determine the effect - amount, currency,
destination - and leave out the ones that do not, such as a client-side timestamp or a trace
id. Hashing too much produces false mismatches on requests that would have been safe to
replay; hashing too little lets a genuinely different request through.

If you cannot name what should be in the hash, leave the fingerprint off. An absent
fingerprint is honest about making no claim. A wrong one rejects real work.
