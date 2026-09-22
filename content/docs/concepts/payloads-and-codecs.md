---
title: Payloads and codecs
description: PayloadCodec, the Payload record, and using attributes for correlation data so a duplicate need not republish.
sourceOf: README "The engine"
---

A duplicate can only be given the original answer back if the original answer was stored.
That is what a `PayloadCodec<T>` is for: the library does not guess at a serialisation format,
so you supply one for whatever your action returns.

## The `Payload`

A `Payload` is three things:

- **`type`** - a string saying how to read the bytes. Yours to choose; the store keeps it
  verbatim.
- **`body`** - the bytes themselves.
- **`attributes`** - flat string key-value pairs the store returns verbatim.

```java
PayloadCodec<Handled> codec = new PayloadCodec<>() {
    @Override
    public Payload encode(Handled handled) {
        return new Payload(
                "shipment/handled",
                objectMapper.writeValueAsBytes(handled),
                Map.of("publicationId", handled.publicationId()));
    }

    @Override
    public Handled decode(Payload payload) {
        return objectMapper.readValue(payload.body(), Handled.class);
    }
};

Outcome<Handled> outcome = engine.execute(context, () -> handler.handle(event), codec);
```

`type` is worth setting honestly. It is what lets a decoder refuse a payload written by an
older version of the code rather than deserialising it into something wrong.

## What `attributes` are for

`attributes` are where correlation data goes - the ids of the messages the first execution
published, say - so a duplicate can reference them instead of publishing again.

:::caution[Replaying a value does not undo what the first execution published]
The library makes *your* work safe to retry; it cannot make *someone else's* endpoint safe
to retry for you. If the first execution published three messages downstream, the duplicate
must not publish them a second time.
:::

Storing their ids as attributes gives the duplicate something to point at:

```java
return new Payload(
        "order/accepted",
        objectMapper.writeValueAsBytes(accepted),
        Map.of("outboxIds", String.join(",", accepted.outboxIds())));
```

They are flat strings by design. An attribute map that could nest would become a second
serialisation format with no schema, and the `body` already exists for structured data.

## When you need no codec

A `void` method has nothing to replay and must leave `codec` empty - supplying one is
rejected at startup. The engine's runnable overload is the same case:

```java
switch (engine.execute(context, () -> handler.handle(event))) { ... }
```

A value-returning annotated method without a codec fails at startup rather than at the first
duplicate, which is the only moment the mistake would otherwise show.

## Over HTTP

The HTTP adapter's `StoredResponseCodec` is exactly this for HTTP responses: status, headers
and body encoded into a `Payload` so a duplicate replays the response the first caller got.
You do not write it.
