---
title: Requirements
description: Supported Java, Spring Boot, database and Redis versions, what is not supported, and the licence.
sourceOf: README "Requirements"
---

| | Supported | Notes |
|---|---|---|
| Java | 21+ | Compiled to 21, tested on 21 and 25 |
| `idempotency-core` | No framework | Plain Java, plus SLF4J |
| Spring Boot | 4.0.x, 4.1.x | Built against 4.0.8, for the adapters and the starter |
| Annotated methods | Spring AOP | No web stack needed - works in a consumer or a batch job |
| Spring MVC (Servlet) | Yes | The HTTP filter activates only for Servlet web applications |
| Spring WebFlux | No | Nothing registers, and no error is raised |
| PostgreSQL | Tested on 16 | Via `idempotency-jdbc` |
| MySQL | Tested on 8.0 | Via `idempotency-jdbc` |
| H2 | Tested on 2.x | Via `idempotency-jdbc`, for development. The store contract runs on it |
| Redis | 7+, tested on 7 | Standalone and Sentinel. Redis Cluster is not supported |

Every row above is a combination CI runs: the build matrix covers Java 21 and 25 against
Spring Boot 4.0 and 4.1.

## The core has no framework

`idempotency-core` is plain Java plus SLF4J. If you are not on Spring, that module and a
store are all you need - see [the engine](/docs/the-engine/).

## What is not supported

:::caution[WebFlux fails silently]
Nothing registers and no error is raised, so a WebFlux application gets no idempotency from
the HTTP adapter and no warning that this is the case. The engine's `execute` is blocking.
:::

**Redis Cluster.** Standalone and Sentinel master-replica connections work.

The full list is on [limitations](/docs/operating/limitations/).

## Spring Boot 3

0.4.0 moved to Spring Boot 4 and Spring Framework 7. Boot 3 applications should stay on
**0.3.0** - see [upgrading](/docs/operating/upgrading/).

## Licence

Apache 2.0. See
[LICENSE](https://github.com/josipmusa/idempotency4j/blob/main/LICENSE) and
[NOTICE](https://github.com/josipmusa/idempotency4j/blob/main/NOTICE) in the library
repository.
