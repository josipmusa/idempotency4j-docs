# Homepage copy

Final copy for `/`, eight sections, one per row of the feeling curve in
[DESIGN.md](../DESIGN.md). Phase 4 output; phase 7 builds the components from it without
writing a word.

**This is a deck, not a page.** The homepage's eight sections become one component each in
`src/components/home/`, and O2 (whether sections 3 and 4 merge) is not resolved until phase
6a, so the copy lands here rather than in a typed collection that would presuppose the
layout. If 6a merges 3 and 4, the merged section takes section 3's eyebrow and heading and
section 4's boundary sentence; nothing else is rewritten.

## How to read an entry

Every section records the same six fields. A field reading **none** is a decision, not an
omission.

| Field | What it is |
|---|---|
| Eyebrow | The small label above the heading. Mono, uppercase in phase 7. Never a sentence. |
| Heading | The section's one claim. |
| Body | The prose. One idea per section, shorter than the docs (PRODUCT.md). |
| Captions | Labels that belong to the asset rather than the prose. |
| Asset | What docs/CONTENT.md owes this section. |
| Links | Every outbound and internal link, in the order they appear. |

**Everything version-sensitive is pinned to `0.4.0`** and copied from the library, never
written from memory. That is the coordinate in sections 1 and 8, the version rows in section
6, and every code sample in section 5. A release bumps them through the parity check
(DECISIONS.md D4), not by hand.

**Two sentences on this page are quoted from the library verbatim** and are marked where
they appear. They are on PRODUCT.md's use-verbatim list because the README already says them
better than a rewrite would.

---

## 1. Hero

*Feeling: recognition. No scroll needed to know what this is.*

**Eyebrow:** none. The wordmark is directly above and a label between them would be noise.

**Heading:**

> It runs once, and every duplicate gets the stored result back.

**Body:**

> An idempotency engine for Java. Give a unit of work a key: the first call executes, and
> every retry, redelivery and double-click after it gets that first result instead of a
> second execution.
>
> One dependency and one annotation. Postgres, MySQL or Redis for storage, whichever you
> already run.

**Captions:**

The coordinate block sits under the actions and is copyable, because for part of this
audience copying it *is* the conversion (PRODUCT.md). It carries no label beyond the tab
names.

```xml
<dependency>
    <groupId>io.github.josipmusa</groupId>
    <artifactId>idempotency-spring-boot-starter</artifactId>
    <version>0.4.0</version>
</dependency>
```

Gradle tab:

```groovy
implementation 'io.github.josipmusa:idempotency-spring-boot-starter:0.4.0'
```

Copy button states: `Copy` → `Copied`. No third state, no toast.

**Asset:** none. The hero carries no illustration; section 2 is 192px below it and the page
should reach it fast.

**Links:** `[ Get started ]` → `/docs/quickstart`. `GitHub` → the repository, outbound, with
the live star count as data. No third action.

**Notes.** The heading is the second half of the library's own one-liner, used verbatim
(PRODUCT.md). Splitting it this way puts the consequence in the heading and the definition in
the body, which is the order a reader arriving from a search result needs. The full sentence
still appears intact across heading and body.

No adjectives, and the word "simple" does not appear. The claim is a mechanism, so it does
not need one.

---

## 2. Two charges, or one *(signature)*

*Feeling: discomfort, then relief. Their own bug on screen, then fixed.*

**Eyebrow:** `THE FAILURE`

**Heading:**

> The client never saw the response, so it retried.

**Body:**

> A timeout tells the caller nothing about whether the work happened. Retrying is the only
> thing it can do, and the second request is indistinguishable from the first.

Two sentences, and no more. The scene is the argument; prose underneath it is a second
argument competing with the first.

**Captions:**

These are the OFF and ON frames' captions. They narrate and do not conclude: the diagram
makes the point, and a caption that makes it again reads as a sales line under a technical
figure (PRODUCT.md, tone by surface).

- **OFF:** `The response is lost. The client retries. The payment provider receives two
  charges.`
- **ON:** `The retry finds a record under the same key and returns the stored result. The
  provider receives one charge.`

Switch label: `@Idempotent`. In-scene mono labels, fixed by MOTION.md and repeated here so
the copy deck is complete: lane labels `Client`, `Server`, `Payments`, and `Store` in the ON
frame only; the broken response path is labelled `timeout`; the replay path is labelled
`Outcome.Replayed`; the counter reads `2 charges` and `1 charge`.

**Asset:** the signature scene. One SVG, two frames, switch-driven. Specified in MOTION.md,
feasibility passed 2026-09-17. Its ON frame is also the homepage Open Graph image, so the ON
caption is the image's alt text.

**Links:** none. A link here competes with the switch, which is the one thing on screen worth
touching.

**Notes.** The `timeout` label stays in both frames. The library does not prevent the
timeout, and a scene that quietly removed it would be claiming something the library does not
do.

The scene shows a payment because that is the failure the primary audience arrives from
(PRODUCT.md). It is drawn as a labelled object, not an emoji: `💳` and `💥` appear in the
owner's original sketch and are on DESIGN.md's refuse list.

---

## 3. Execution model

*Feeling: comprehension. The fix they just saw stops being magic.*

**Eyebrow:** `HOW IT WORKS`

**Heading:**

> Five stages, and you can name all of them.

**Body:**

> A call acquires a lease on its scope and key. The work runs under a heartbeat that keeps
> the lease alive while it takes as long as it takes. The result is encoded and stored. Every
> later call under that key is answered from the store.
>
> Nothing is inferred and nothing is cached. A record exists or it does not.

**Captions:**

The five stage labels, in order, mono:

`Request` · `Acquire` · `Execute` · `Store` · `Replay`

**Asset:** the execution model diagram, five stages, static, drawn for this site
(docs/CONTENT.md).

**Links:** `The record lifecycle` → `/docs/concepts/record-lifecycle/`. One link, placed
after the body.

**Notes.** "Nothing is cached" is worth the line: a reader who has reached for `@Cacheable`
needs to know this is a different mechanism, and that comparison is the `/learn` article's
whole middle section.

The vocabulary is deliberately the library's own (lease, scope, key, heartbeat, record,
replay), because it is the vocabulary the docs then use without a glossary.

---

## 4. Architecture

*Feeling: trust through restraint. The discipline is the proof.*

**Eyebrow:** `BOUNDARIES`

**Heading:**

> The engine contains no framework or transport types.

**Body:**

> Four layers, each owning one thing. The engine owns the lifecycle and knows nothing about
> Spring or HTTP. The Spring layer owns the annotation and the interceptor. The HTTP layer
> owns capture and replay over Servlet. The store owns all blocking, waiting and stale-lease
> stealing, inside one method.
>
> Take the layers you want. The core plus a store is a working library with no Spring in it
> at all.

**Captions:**

The four rows, copied from the library's own table:

| Layer | Module | Owns |
|---|---|---|
| Engine | `idempotency-core` | The whole lifecycle: acquire, heartbeat, run, encode, complete, release on failure |
| Spring | `idempotency-spring` | Everything Spring but not HTTP: `@Idempotent`, the AOP interceptor, transaction participation |
| HTTP | `idempotency-spring-web` | Servlet capture and replay, error mapping, turning an `Outcome` into a response |
| Store | `providers/*` | The SPI. All blocking, waiting and stale-lease stealing happens inside `tryAcquire` |

**Asset:** the four-layers diagram, static, drawn for this site. May merge with section 3's
per the DESIGN.md adjacency check.

**Links:** `The engine` → `/docs/the-engine/`. `Writing a store` →
`/docs/storage/writing-a-store/`.

**Notes.** The heading is a constraint stated as a fact, which is the only form of
architectural claim this audience has any reason to believe. It is checkable in the source in
under a minute, which is the point.

Module paths are shortened here (`idempotency-spring`, not `spring/idempotency-spring`)
because the homepage names modules and the build file names paths. `/docs/requirements`
carries the full coordinates.

---

## 5. Code

*Feeling: familiarity. "That is three lines."*

**Eyebrow:** `WHAT YOU WRITE`

**Heading:**

> Three lines on the method you already have.

**Body:**

> The annotation goes on any Spring bean. Endpoints take their key from the
> `Idempotency-Key` header and need no expression; everything else names one over its own
> parameters.

**Captions:**

Three tabs, in this order. Tab labels: `Consumer` · `Endpoint` · `Without Spring`.

`Consumer`:

```java
@Idempotent(key = "#event.id()", waitTimeout = "PT0S")
@KafkaListener(topics = "orders")
void on(OrderPlaced event) {
    // Runs once per event id, however many times the broker redelivers.
}
```

`Endpoint`:

```java
@PostMapping("/payments")
@Idempotent(ttl = "PT24H")
ResponseEntity<Payment> createPayment(@RequestBody PaymentRequest request) {
    // A duplicate Idempotency-Key replays the stored response.
    return ResponseEntity.ok(payments.charge(request));
}
```

`Without Spring`:

```java
switch (engine.execute(context, () -> handler.handle(event))) {
    case Outcome.Executed<Void> ignored -> { }
    case Outcome.Replayed<Void> ignored -> { }
    case Outcome.InFlight<Void> inFlight -> consumer.nack(inFlight.retryAfter());
}
```

**Asset:** none. The code is the asset.

**Links:** `Annotated methods` → `/docs/annotated-methods/`. `HTTP endpoints` →
`/docs/http-endpoints/`. `The engine` → `/docs/the-engine/`. One per tab, following the
active tab.

**Notes.** `waitTimeout = "PT0S"` stays in the consumer sample even though it costs a line.
It is the attribute a consumer needs and does not know to look for, and a homepage sample
that omits it teaches the wrong default to the reader most likely to copy it.

The endpoint sample carries only `ttl` because the filter reads the key from the header. A
`key` expression on an endpoint is rejected at startup, so showing one would be a sample that
does not compile into a working application.

These three samples are the same code as the docs pages they link to, not variants. They are
kept in agreement by hand until phase 7; the parity check covers coordinates and
configuration keys, not sample bodies.

---

## 6. Integrations

*Feeling: fit, and relief at the honesty.*

**Eyebrow:** `WHAT IT RUNS ON`

**Heading:**

> Your store, and what it cannot do, on the same row.

**Body:**

> Three storage backends and one SPI if none of them fit. The unsupported combinations are on
> the list rather than under it.

**Captions:**

| | Supported | Not |
|---|---|---|
| Java | 21+, tested on 21 and 25 | |
| Spring Boot | 4.0.x, 4.1.x | Boot 3 applications stay on `0.3.0` |
| Spring MVC | Servlet | WebFlux, and nothing registers to tell you so |
| PostgreSQL | Tested on 16 | |
| MySQL | Tested on 8.0 | |
| H2 | Tested on 2.x, for development | |
| Redis | 7+, standalone and Sentinel | Redis Cluster |
| Anything else | The store SPI, with a contract test suite | |

**Asset:** none. The table is the asset, and a diagram of a table is decoration.

**Links:** `Requirements` → `/docs/requirements/`. `Limitations` →
`/docs/operating/limitations/`. `Choosing a store` → `/docs/storage/choosing/`.

**Notes.** The `Not` column is the section. Putting the gaps in their own column on the same
row is the difference between honesty and a disclaimer, and for the secondary audience the
honesty is the pitch (PRODUCT.md).

The WebFlux row states that nothing registers and no error is raised, because the failure
being silent is the part that costs someone an afternoon.

No download count, no adoption claim, no logo wall. There are none to cite and the never-
invent list is not negotiable.

---

## 7. Learn

*Feeling: curiosity. No teaser cards, no "read more".*

**Eyebrow:** `LEARN`

**Heading:**

> Four articles about the problem, not the library.

**Body:** none. The titles and their first sentences are the section.

**Captions:**

Each article shows its title and its real opening. These are the opening lines of the articles
themselves and must match them exactly. The fourth needs both of its opening sentences, because
the first does not stand without the second.

**What idempotency actually means**

> "The same request twice has the same effect once" is a sentence everyone agrees with and
> almost nobody can implement, because the effect it refers to usually lives in a system that
> has no idea a retry happened.

**How idempotency keys work**

> A key is a promise the client makes and the server has to keep, which means every hard
> decision about it is really a decision about who is allowed to forget.

**Idempotency in Spring Boot**

> A `processed_events` table, a unique constraint, `@Cacheable` and a distributed lock are
> four real answers to duplicate work, and three of them are wrong under concurrency in a way
> that only shows up in production.

**Idempotency in message-driven systems**

> A duplicate message is usually treated as something to discard. It is also evidence: the
> first attempt got far enough to leave a record, and it may have died before it finished.

**Asset:** none.

**Links:** each title links to its article. No "read more", no card affordance beyond the
title itself.

**Notes.** The heading states the Docs/Learn boundary as a promise to the reader: these
articles are useful whether or not anyone adopts the library, and a reader who suspects
otherwise will not open one.

None of the three sentences names idempotency4j. That is the acceptance test for the articles
and it applies to their first lines first.

---

## 8. Get started

*Feeling: decision. The coordinate, the one action, nothing else on screen.*

**Eyebrow:** none.

**Heading:**

> Give a unit of work a key.

**Body:**

> One dependency, one annotation, and a table your migration tool creates. The quickstart is
> five minutes and ends by pointing at exactly one next page.

**Captions:**

The same coordinate block as section 1, same tabs, same copy button. Repeating it is
deliberate: a reader who scrolled the whole page should not have to scroll back.

**Asset:** none. Nothing shares this section.

**Links:** `[ Get started ]` → `/docs/quickstart`. Below it, one line in `--dim`:
`Or read what it cannot do first` → `/docs/operating/limitations/`.

**Notes.** The limitations link in the closing block is not a hedge. The secondary audience
reads limitations before the quickstart, and giving them that door at the point of decision
is more likely to convert them than hiding it (PRODUCT.md principle 2).

The heading is the first half of the library's one-liner, closing the loop the hero opened
with the second half.

---

## What the homepage deliberately does not contain

Each of these was considered and rejected. Listed so a later phase does not add one back as
an improvement.

| Not on the page | Why |
|---|---|
| Testimonials, logo wall, "used in production by" | No user has consented to be named, and none has been asked |
| Download, star or adoption counts as copy | A live badge rendering the GitHub API is data; a number written into copy is invention |
| Benchmarks or latency figures | None have been run |
| A comparison table against other libraries | The honest comparison is `/learn/idempotency-in-spring-boot`, where the alternatives get a fair hearing |
| A newsletter, a form, an email capture | The site collects nothing (PRODUCT.md) |
| A ninth section | Eight is the cap. Adding one means removing one (DESIGN.md) |
| The word "exactly-once" | The library is explicit that this is not that, and the site is at least as explicit |

## Open against phase 6a

- **O2, sections 3 and 4.** Both sit in the comprehension/trust register, so one may be
  filler. The merge is decided by spike, not by argument. The copy above is written so either
  resolution works: section 4's body is the only place the four layers are described in
  prose, and it survives being folded under section 3's heading.
- **Star count in the hero.** Rendered from the GitHub API at build time, so it is data rather
  than copy. If it cannot be fetched without a third-party request at runtime (DECISIONS.md
  D15), the count comes off and `GitHub` stands alone.
