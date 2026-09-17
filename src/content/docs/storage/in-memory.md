---
title: In-memory
description: Development and tests only - single JVM, lost on restart, and asked for by name.
sourceOf: README "Storage backends"
---

`idempotency-inmemory` keeps records in a map inside one JVM. It is for local development and
tests.

```yaml
idempotency:
  store-type: in-memory
```

## What it actually gives you

An in-memory record set deduplicates within one JVM until it restarts.

That is the whole guarantee, and both halves of it are limits.

:::caution[One JVM, and only until it restarts]
Two instances of your application do not share records, so a duplicate that lands on the
other instance re-executes. Any deployment with more than one replica has no idempotency at
all.

Records do not survive a redeploy, a crash, or a pod eviction.
:::

It also does not support [joined completion](/docs/joining-your-transaction/).

## Why it must be asked for by name

`auto` does not fall back to the in-memory store. This is not a property anything should
acquire by accident - see [choosing a store](/docs/storage/choosing/) for the failure that
rule prevents.

Setting `store-type: in-memory` is a statement that a single JVM and a lost record set are
acceptable here. That is true in a test and on a developer machine. It is worth checking that
the setting cannot reach a deployed environment through a shared configuration file.

## In tests

This is the store to use in integration tests that exercise the idempotent boundary itself.
The store contract runs on H2 as well, so a test that needs
[joined completion](/docs/joining-your-transaction/) can use
[JDBC against H2](/docs/storage/jdbc/) instead.
