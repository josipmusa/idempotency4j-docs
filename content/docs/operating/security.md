---
title: Security
description: What the store holds, encryption and TLS, why keys are never logged, and ResponseSanitizer.
sourceOf: README "Security"
---

The store persists whatever an adapter hands it. Over HTTP that means full response bodies,
which depending on your endpoints may include PII, tokens, or financial data.

:::caution[The idempotency table is a copy of your responses]
It needs whatever protection your responses need. That is the whole security model in one
line.
:::

## What to do

- Enable encryption at rest on the backing database.
- Use TLS and ACLs for Redis, and restrict the ACL to the configured key prefix.
- Keep TTL values short to limit retention, and let `idempotency.purge.cron` remove expired
  records promptly. Purging needs `@EnableScheduling` - see
  [purging and retention](/docs/operating/purging-and-retention/).
- Audit what is annotated `@Idempotent`, what its results contain, and how large they can
  get.

The last one is the one people skip. An endpoint annotated for good reasons may return a
field nobody thought about, and the annotation means that field is now stored for the full
TTL somewhere it was not stored before.

:::note[There is no log line anywhere containing a raw idempotency key]
Alerting and correlation have to go through the scope-and-digest form below, or through your
own request id.
:::

## Keys are never logged

Idempotency keys are client-controlled and may themselves carry identifying data, so the
library never writes one to a log or an exception message.

Both render a record as its scope followed by a short digest of the key. For a key sent to
a `create` method on `PaymentController`, that looks like:

```
PaymentController.create/#3f9a2c71
```

That form is stable enough to tie two lines together without putting the value in the log. If
you are correlating a support request to a log line, ask the client for the key and hash it
the same way rather than searching for the raw value - it will not be there.

## `ResponseSanitizer`

To strip or redact sensitive fields before storage, register a `ResponseSanitizer` bean
(`io.github.josipmusa.idempotency.spring.web.ResponseSanitizer`). The default is a no-op
pass-through. A sanitizer receives the captured response as a `StoredResponse` - status
code, headers and body - and returns the `StoredResponse` to store:

```java
@Bean
public ResponseSanitizer responseSanitizer() {
    return response -> {
        Map<String, List<String>> headers = new HashMap<>(response.headers());
        headers.remove("Set-Cookie");
        return new StoredResponse(response.statusCode(), headers, response.body());
    };
}
```

It runs before storage, so what it removes never reaches the store. Removing `Set-Cookie` is
the common case: a replayed response should not re-issue a session cookie minted for a
different request.

Whatever the sanitizer returns is what a duplicate receives, so it must not strip something
the client needs to act on the response.

## What the log actually contains

The digest form is applied in both directions - log lines and exception messages - so an
exception that escapes into an error tracker carries no key either.

This is worth knowing before you build alerting on it. A listener that throws is logged the
same way, naming the record by scope and digest rather than by key.

## Size is a security property too

`idempotency.web.max-body-bytes` defaults to 1 MiB and bounds what the filter will
fingerprint; a larger body is rejected with `413` rather than buffered into memory without bound.

Response size has no equivalent ceiling. An endpoint returning a large collection has that
collection stored for the full TTL, once per distinct key. Auditing what is annotated includes
auditing how big its responses get, which is why that appears in the list above rather than as
a performance note.

## Reporting a vulnerability

See the library's
[SECURITY.md](https://github.com/josipmusa/idempotency4j/blob/main/SECURITY.md).
