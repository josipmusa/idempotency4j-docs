---
title: Redis
description: The three beans, RedisIdempotencyStore.CODEC, why it is not autoconfigured, and what it cannot do.
sourceOf: README "Storage backends"
---

The Redis store uses [Lettuce](https://lettuce.io/). Open the connection with
`RedisIdempotencyStore.CODEC` so stored bodies stay binary-safe. The application owns the
client and the connection, which is why the beans declare their shutdown methods:

```java
@Bean(destroyMethod = "shutdown")
public RedisClient redisClient() {
    return RedisClient.create("redis://localhost:6379");
}

@Bean(destroyMethod = "close")
public StatefulRedisConnection<String, byte[]> idempotencyRedisConnection(RedisClient client) {
    return client.connect(RedisIdempotencyStore.CODEC);
}

@Bean
public IdempotencyStore idempotencyStore(StatefulRedisConnection<String, byte[]> connection) {
    RedisIdempotencyStoreConfig config = RedisIdempotencyStoreConfig.builder()
            .keyPrefix("payments:idempotency:")
            .build();

    return new RedisIdempotencyStore(connection, config);
}
```

One thread-safe connection can serve the store.

## Tuning the store

`RedisIdempotencyStoreConfig` carries more than the key prefix. The defaults are sound and
most applications change none of them, but two matter under load and one matters for
durability.

| Setting | Default | What it controls |
|---|---|---|
| `keyPrefix` | provider default | Namespace for every key the store writes |
| `pollInterval` | 50ms | How often a waiting caller re-checks a held key |
| `retentionGrace` | 1 hour | Extra margin before an expired record is purged |
| `purgeBatchSize` | 500 | Records scanned per purge page |
| `maxPurgePagesPerCall` | 100 | Pages one purge run will scan before stopping |
| `replicaAcknowledgement` | disabled | Redis `WAIT` policy applied after each mutation |

**`pollInterval`** is the one to know about. Redis has no way to block on the specific
condition the store waits for, so a caller waiting out someone else's lease polls. At 50ms a
duplicate that arrives mid-flight adds up to 50ms of latency before it sees the completion.
Lowering it sharpens that at the cost of more round trips per waiting caller.

**`purgeBatchSize` and `maxPurgePagesPerCall`** bound a single purge run, which is what keeps
the SCAN from becoming a long-running command on a large keyspace. A run that hits the page
limit stops and resumes on the next scheduled purge, so the two together cap how much work one
run does rather than how much gets purged overall.

## Durability across a failover

Redis replication is asynchronous. A completion the primary acknowledged may not have reached
a replica yet, so losing the primary at that moment loses the record - and the next duplicate
re-executes.

Where that matters, require replica acknowledgement:

```java
RedisIdempotencyStoreConfig config = RedisIdempotencyStoreConfig.builder()
        .keyPrefix("payments:idempotency:")
        .replicaAcknowledgement(RedisReplicaAcknowledgement.require(1, Duration.ofMillis(200)))
        .build();
```

This applies Redis `WAIT` after each successful mutation, so a write is not treated as done
until the requested number of replicas has it. It costs latency on every mutation and it is
disabled by default, because paying it unconditionally would be the wrong default for the
majority of deployments that do not run replicas at all.

It narrows the window rather than closing it. `WAIT` reports how many replicas acknowledged;
it is not a distributed transaction. If losing a record is unacceptable, use
[JDBC](/docs/storage/jdbc/).

## Operating it

Use Redis 7 or newer. Choose an application-specific key prefix, and configure the server
with `maxmemory-policy noeviction` so records are not evicted out from under the store.

`noeviction` is not a tuning preference. Under any other policy Redis is free to drop an
idempotency record to make room, and a dropped `COMPLETE` record means the next duplicate
re-executes the action. The store cannot detect that this happened.

## Why it is not autoconfigured

The Redis store needs a `StatefulRedisConnection<String, byte[]>` - raw Lettuce with a
byte-array codec - rather than the `RedisConnectionFactory` Spring Boot produces.

Bridging the two would mean either reaching into Spring Data Redis internals or
reimplementing Boot's URL, Sentinel, SSL, and pooling handling and then running two clients
with two lifecycles. Both are worse than the three beans above.

This is the honest architectural answer rather than a gap waiting to be filled: three
explicit beans you can read beat a bridge that breaks on a Spring Data Redis upgrade.

## What it cannot do

**No joined completion.** A Redis store cannot enlist in a caller's transaction, so
`completion = "join-transaction"` is not available on top of it. Asking for it anyway fails
the context at startup.

**No Redis Cluster.** The provider takes Lettuce's non-cluster `StatefulRedisConnection`, and
its bounded SCAN purge is not node-aware. Standalone and Sentinel master-replica connections
work.

Both are listed on [limitations](/docs/operating/limitations/).

## Security

Use TLS and ACLs, and restrict the ACL to the configured key prefix. The store holds whatever
the adapter hands it, which over HTTP means full response bodies. See
[security](/docs/operating/security/).
