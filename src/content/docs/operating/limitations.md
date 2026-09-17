---
title: Limitations
description: No reactive, no tenant isolation, no Redis Cluster, and what downstream side effects the library does not cover.
sourceOf: README "Limitations", "What this is not"
---

Read this before adopting rather than after. If one of these is a problem for you, it is
better found now.

## No reactive support

The HTTP adapter is built on `OncePerRequestFilter` (Servlet API), and the engine's `execute`
is blocking.

Spring WebFlux is not supported: nothing registers, and no error is raised. An application
that is WebFlux-only gets no idempotency from the HTTP adapter and no warning that this is
the case.

## No tenant isolation

Records are scoped per method, but within a scope there is no built-in per-tenant or per-user
isolation: two callers using the same key in the same scope share idempotency state.

Prefix keys at the application level where that matters, for example `userId:clientKey`.

This is worth taking seriously on a public API. A client that generates keys from a sequence
rather than a UUID will collide with another tenant's keys, and the second tenant gets the
first tenant's stored response replayed to them. Prefixing the key is the fix, and it is
yours to apply.

## Redis Cluster is not supported

The provider takes Lettuce's non-cluster `StatefulRedisConnection`, and its bounded SCAN
purge is not node-aware. Standalone and Sentinel master-replica connections work.

## Downstream side effects

**This is not an exactly-once guarantee for arbitrary downstream side effects.** Lease
fencing protects the idempotency record, not the third-party charge your action made just
before the process died. If you need that guarantee you still need a shared transaction, a
transactional outbox, or an idempotency key passed to the downstream service. This library
makes *your* work safe to retry; it cannot make *someone else's* endpoint safe to retry for
you.

The practical version: annotate your payment endpoint, and also pass the payment provider its
own idempotency key. The library stops your handler running twice. Only the provider can stop
the provider charging twice.

Where the first execution published messages downstream, store their ids in a payload's
`attributes` so the duplicate can reference them instead of republishing - see
[payloads and codecs](/docs/concepts/payloads-and-codecs/).

## Buffered request bodies over HTTP

The filter buffers the request body so it can fingerprint it and still hand it to your
handler, which means Servlet non-blocking reads are unsupported on an annotated endpoint and
the body is held in memory up to `idempotency.web.max-body-bytes`. Streaming upload endpoints
should not be annotated. See [HTTP endpoints](/docs/http-endpoints/).

## Also not

It is not a distributed lock you can borrow for general use. The HTTP adapter is
Servlet-only. The [in-memory store](/docs/storage/in-memory/) is not for more than one
instance, and [Redis](/docs/storage/redis/) cannot join your transaction.

## Spring Boot 3

0.4.0 moved to Spring Boot 4. Boot 3 applications stay on 0.3.0 - see
[upgrading](/docs/operating/upgrading/).
