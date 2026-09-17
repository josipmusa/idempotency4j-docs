---
title: Documentation
description: How to use idempotency4j - installation, the mental model, the adapters and the reference.
---

idempotency4j gives a unit of work a key: it runs once, and every duplicate gets the stored
result back.

## Start here

**[Quickstart](/docs/quickstart/)** - the starter, one storage backend and one annotation,
running in five minutes.

## Explore the docs

- **[What it does](/docs/what-it-does/)** - the mental model in about four hundred words,
  before any code. Read this first if you are still deciding.
- **[Core concepts](/docs/concepts/scope-and-key/)** - scope and key, the record lifecycle,
  leases, outcomes, payloads and fingerprints. The vocabulary the rest of the docs assume.
- **[Using it](/docs/annotated-methods/)** - the adapter you will actually write against:
  annotated methods, HTTP endpoints, or the raw engine.
- **[Storage](/docs/storage/choosing/)** - JDBC, Redis or in-memory, and how to write your
  own.
- **[Reference](/docs/reference/configuration/)** - every configuration key, every annotation
  attribute, every status code.
- **[Operating it](/docs/operating/purging-and-retention/)** - retention, security, and what
  the library does not do.

The groups are ordered so you can stop after any one of them and have something that works.
