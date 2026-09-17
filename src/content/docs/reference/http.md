---
title: HTTP reference
description: Status codes the filter returns, replay headers, and what a non-HTTP completion replays.
sourceOf: README "HTTP endpoints"
---

The behaviour behind these tables is on [HTTP endpoints](/docs/http-endpoints/). This page is
the lookup.

## Status codes the filter can return

These come from the filter itself, before or instead of your handler. Each carries a
`{"error": "..."}` JSON body.

| Status | When |
|---|---|
| `413 Payload Too Large` | Request body exceeds `idempotency.web.max-body-bytes` |
| `422 Unprocessable Entity` | Key header missing or blank while `idempotency.web.required` is true |
| `422 Unprocessable Entity` | Key longer than 255 characters |
| `422 Unprocessable Entity` | Key reused with a different request body |
| `409 Conflict` | Another request still holds the key after `waitTimeout`; carries `Retry-After`. Configurable through `idempotency.web.in-flight-status` |

:::note[Any other status your client sees came from your handler]
Including a replayed one. The five above are the only statuses the filter produces itself.
:::

## Response headers on a replay

| Header | Value |
|---|---|
| `Idempotent-Replayed` | `true` |
| `Cache-Control` | `no-store` |

The stored status code and headers are replayed as they were captured.

## A key completed through a non-HTTP path

A key completed through a non-HTTP path has no response to replay, so an HTTP duplicate for
that key gets `204 No Content`.

This happens when the same scope and key were completed by an
[annotated method](/docs/annotated-methods/) or by
[the engine directly](/docs/the-engine/). The record is `COMPLETE` and its payload is whatever
that path stored, which is not an HTTP response. Returning `204` says the work is done and
there is nothing to hand back, which is true.

If an HTTP client needs a real body in that case, the two paths need separate
[scopes](/docs/concepts/scope-and-key/) rather than a shared one.

## Request headers

| Header | Purpose |
|---|---|
| `Idempotency-Key` | The client-generated key. Name configurable through `idempotency.web.key-header` |

Keys are limited to 255 characters and are never written to a log or an exception message -
see [security](/docs/operating/security/).
