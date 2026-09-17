---
title: Configuration
description: Every key under idempotency.*, with defaults, and the two that surprise people.
sourceOf: README "Configuration"
---

Everything is under the `idempotency` prefix. Transport-neutral settings sit at the top
level; those that only make sense over HTTP live under `web`, and those that only apply to a
JDBC store under `jdbc`, so an application that uses neither never has to read past the first
group.

```yaml
idempotency:
  default-ttl: PT24H              # How long a completed record stays replayable. Default: 24h
  default-lease: PT30S            # How long an acquisition is protected. Default: 30s
  default-wait: PT10S             # How long a second caller blocks. PT0S to not block. Default: 10s
  completion-mode: autonomous     # autonomous | join-transaction. Default: autonomous
  completion-failure-policy: log-and-return   # log-and-return | propagate. Default: log-and-return
  store-type: auto                # auto | jdbc | in-memory | none. Default: auto

  jdbc:
    initialize-schema: embedded   # embedded | always | never. Default: embedded

  web:
    key-header: Idempotency-Key   # Header carrying the key. Default: Idempotency-Key
    required: true                # Reject a request that carries no key with 422. Default: true
    in-flight-status: 409         # Status when another caller holds the key. Default: 409
    max-body-bytes: 1048576       # Largest body the filter will fingerprint. Default: 1 MiB
    filter-order: 0               # Order of the filter in the chain. Default: 0

  purge:
    enabled: true                 # Register the purge scheduler. Default: true
    cron: "0 0 * * * *"           # Cron for purging expired records. Default: hourly
```

## Top level

| Key | Default | What it sets |
|---|---|---|
| `default-ttl` | `PT24H` | How long a completed record stays replayable |
| `default-lease` | `PT30S` | How long an acquisition is protected |
| `default-wait` | `PT10S` | How long a second caller blocks. `PT0S` to not block |
| `completion-mode` | `autonomous` | `autonomous` or `join-transaction` |
| `completion-failure-policy` | `log-and-return` | `log-and-return` or `propagate` |
| `store-type` | `auto` | `auto`, `jdbc`, `in-memory` or `none` |

The three durations are per-method overridable on
[`@Idempotent`](/docs/reference/annotation/).

## `jdbc`

| Key | Default | What it sets |
|---|---|---|
| `initialize-schema` | `embedded` | `embedded`, `always` or `never`. See [JDBC](/docs/storage/jdbc/) |

## `web`

| Key | Default | What it sets |
|---|---|---|
| `key-header` | `Idempotency-Key` | Header carrying the key |
| `required` | `true` | Reject a request with no key, with `422` |
| `in-flight-status` | `409` | Status when another caller holds the key |
| `max-body-bytes` | `1048576` | Largest body the filter will fingerprint |
| `filter-order` | `0` | Order of the filter in the chain |

## `purge`

| Key | Default | What it sets |
|---|---|---|
| `enabled` | `true` | Register the purge scheduler |
| `cron` | `0 0 * * * *` | Cron for purging expired records. Hourly |

## Two worth a second look

**`completion-failure-policy` defaults to `log-and-return` here, not to the engine's own
`propagate`.** When the action succeeded but the store refused to record it, the result the
action already produced still reaches the caller; the idempotency guarantee is lost for that
one key, and a later duplicate re-executes. Set `propagate` where losing the guarantee
silently is worse than failing the call.

**`purge.enabled` needs `@EnableScheduling` on your application to do anything.** The starter
warns at startup if it is on without it, rather than quietly never purging. See
[purging and retention](/docs/operating/purging-and-retention/).
