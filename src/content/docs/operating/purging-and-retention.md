---
title: Purging and retention
description: The purge scheduler, its cron, TTL as a retention control, and the @EnableScheduling requirement.
sourceOf: README "Configuration", "Security"
---

Records do not accumulate forever. Each carries a TTL, and a scheduler removes the expired
ones.

```yaml
idempotency:
  default-ttl: PT24H
  purge:
    enabled: true                 # Default: true
    cron: "0 0 * * * *"           # Default: hourly
```

## `@EnableScheduling` is required

**`purge.enabled` needs `@EnableScheduling` on your application to do anything.** The starter
warns at startup if it is on without it, rather than quietly never purging.

```java
@SpringBootApplication
@EnableScheduling
class Application { }
```

Without it the setting reads as on, the scheduler is never registered, and the table grows
until someone notices. The warning exists because the symptom - a slowly growing table - is
one nobody attributes to this library for months.

## TTL is a retention control

`default-ttl` decides two things at once, and they pull in opposite directions.

**How long a duplicate can still replay.** A client that retries after the TTL has elapsed
gets a fresh execution, because the record is gone. The TTL therefore has to outlast your
clients' retry behaviour - including a client that retries the next morning after an
overnight outage.

**How long the data is kept.** The store holds whatever the adapter hands it, which over HTTP
means full response bodies. Keeping TTLs short limits retention, which is the main lever you
have over the exposure described in [security](/docs/operating/security/).

The default of 24 hours is a reasonable middle. Set it per method on
[`@Idempotent`](/docs/reference/annotation/) where a particular endpoint needs longer
replayability or holds data that should not linger.

## What gets purged, and when

A **completed** record is purged once its TTL elapses.

An **abandoned `IN_PROGRESS`** record is purged only once its TTL has elapsed *and* its lease
has expired too. Both conditions are required so a legitimately long-running action, whose
[heartbeat](/docs/concepts/leases-and-waiting/) is still extending its lease, is never purged
out from under itself.

## Tuning the cron

The default is hourly. Purging more often keeps the table smaller and each run cheaper;
purging less often is lighter on the database. The Redis provider's purge is a bounded SCAN,
so a single run does not block the server.

If you run several instances, they all purge. The operation is safe to run concurrently -
it removes rows that have already expired - so no coordination is needed.
