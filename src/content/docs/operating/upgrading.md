---
title: Upgrading
description: 0.3.x on Spring Boot 3 to 0.4.x on Spring Boot 4, and what Boot 3 applications should do.
sourceOf: README "Spring Boot 3", CHANGELOG.md
---

## 0.3.x to 0.4.x

0.4.0 moved to Spring Boot 4 and Spring Framework 7.

Spring Boot 3.5 reached open source end of life on 30 June 2026, and 3.5.16 was its final OSS
patch, so the 3.x line no longer receives fixes from Spring itself.

**Boot 3 applications should stay on 0.3.0**, which remains on Maven Central. The `0.3.x`
branch exists so a serious fix could still be published from it, but no releases are
scheduled and none are promised.

If you are moving to 0.4.x, the move is a Spring Boot 4 migration first. Upgrade Boot, then
the coordinate:

```xml
<dependency>
    <groupId>io.github.josipmusa</groupId>
    <artifactId>idempotency-spring-boot-starter</artifactId>
    <version>0.4.0</version>
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
