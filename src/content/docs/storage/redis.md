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
