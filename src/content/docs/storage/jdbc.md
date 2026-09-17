---
title: JDBC
description: Autoconfiguration from a DataSource, initialize-schema, and pointing a migration tool at the shipped schema.
sourceOf: README "Storage backends"
---

Nothing to declare: with `idempotency-jdbc` on the classpath and a `DataSource` in the
context, the store is built for you, complete with the `TransactionAwareConnectionResolver`
that [joined completion](/docs/joining-your-transaction/) needs.

```xml
<dependency>
    <groupId>io.github.josipmusa</groupId>
    <artifactId>idempotency-jdbc</artifactId>
    <version>0.4.0</version>
</dependency>
```

Tested on PostgreSQL 16, MySQL 8.0 and H2 2.x.

## The table

The table is another matter. `idempotency.jdbc.initialize-schema` follows the convention
Spring Boot uses for Session and Quartz:

```yaml
idempotency:
  jdbc:
    initialize-schema: embedded   # embedded (default) | always | never
```

`embedded` creates the table only on an embedded database, so a development H2 works out of
the box while a real database never gets DDL from a library behind its owner's back.

On PostgreSQL or MySQL, point Flyway, Liquibase, or your own migration at the
`idempotency-schema-postgresql.sql` or `idempotency-schema-mysql.sql` file shipped in the
provider jar, or set `always` if you would rather the store created it.

If the table still cannot be queried once the context has started, the starter logs a warning
saying so, rather than leaving the first keyed request to fail with a 500.

## Constructing it by hand

Constructing the store by hand still works, and there the `initSchema` flag is yours:

```java
@Bean
public IdempotencyStore idempotencyStore(DataSource dataSource) {
    return new JdbcIdempotencyStore(dataSource, false, new TransactionAwareConnectionResolver(dataSource));
}
```

A store bean you declare always wins, so this is also how you point the store at a second
`DataSource` - a separate database for idempotency records - rather than the application's
primary one.

## Joined completion

The JDBC store is the only shipped store that supports it. The
`TransactionAwareConnectionResolver` runs `COMPLETE` on the transaction-bound connection and
everything else on a connection of its own, which is what lets the record commit with your
business writes while the lease work stays outside your transaction.
