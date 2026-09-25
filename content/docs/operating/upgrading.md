---
title: Upgrading
description: What 0.5.x changes for a 0.4.x application, the move from Spring Boot 3 to 4, and what Boot 3 applications should do.
sourceOf: README "Spring Boot 3", CHANGELOG.md
---

## 0.4.x to 0.5.x

0.5.0 makes completions follow the caller's transaction: nothing is recorded as complete until
the work commits, and a rollback frees the key. For most applications the upgrade is the
version bump. Check these:

- **An `IdempotentAdvisor` bean now fails startup.** The starter no longer registers one.
  Remove yours; without the starter, register `IdempotentBeanPostProcessor` instead. An
  `@EnableTransactionManagement(order = ...)` kept for joined completion is no longer needed,
  and harmless if it stays.
- **A custom transactional store must override `completeInTransaction`.** Joined completion
  now calls it, and `complete` always means a write of its own. A store that cannot join a
  transaction needs no change. See [writing a store](/docs/storage/writing-a-store/).
- **Inside a transaction, the record is written after the commit.** `onCompleted` fires then,
  and a rollback fires `onFailed` with `FailurePhase.ROLLBACK` and frees the key at once.
  Listeners that assumed `onCompleted` fired before the commit need a look.
- **The same key twice in one transaction no longer replays.** The second call reports in
  flight; see [joining your transaction](/docs/joining-your-transaction/) for the
  `noRollbackFor` that keeps a batch alive.
- **Size the connection pool** above the number of concurrent transactional `@Idempotent`
  calls - see [annotated methods](/docs/annotated-methods/#inside-a-transaction).

Records written by 0.4.x remain readable; the stored format did not change.

## 0.3.x to 0.4.x

0.4.0 moved to Spring Boot 4 and Spring Framework 7.

Spring Boot 3.5 reached open source end of life on 30 June 2026, and 3.5.16 was its final OSS
patch, so the 3.x line no longer receives fixes from Spring itself.

:::caution[Boot 3 applications should stay on 0.3.0]
It remains on Maven Central. The `0.3.x` branch exists so a serious fix could still be
published from it, but no releases are scheduled and none are promised.
:::

If you are moving off 0.3.x, the move is a Spring Boot 4 migration first. Upgrade Boot, then
the coordinate:

```xml
<dependency>
    <groupId>io.github.josipmusa</groupId>
    <artifactId>idempotency-spring-boot-starter</artifactId>
    <version>__VERSION__</version>
</dependency>
```

Records written by 0.3.x remain readable; the stored format did not change.

## There are no versioned docs

These pages document the current release. A library at this size with one supported line does
not need a version switcher, and an upgrade page that states what changed is more useful than
a frozen copy of the previous release's prose.

The authoritative per-release detail is the library's
[CHANGELOG.md](https://github.com/josipmusa/idempotency4j/blob/main/CHANGELOG.md).

## Checking what you are on

The starter logs the selected [store](/docs/storage/choosing/) at startup. The artifact
version is whatever your build file pins; the
[BOM](/docs/quickstart/) keeps the modules on one version, which is the failure worth
avoiding when upgrading several at once.
