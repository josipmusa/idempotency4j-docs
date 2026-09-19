# Content

Phase 3. One block per skeleton section, in page order. Final words. The only source of
words for the build.

**The version is one build-time constant.** Every coordinate below renders from a single
exported constant in the repo, bumped once per release; the literal `0.4.0` is what that
constant holds today. Phase 5 wires it, alongside the base-path constant GitHub Pages needs.

Grounded in the library at **v0.4.0** (tag `v0.4.0`, released 2026-09-15). Every version,
coordinate, method name and limitation below was read out of `~/Private/idempotency4j` or
the prose already in `src/content/`, not from memory. Where the library's own material
contradicts itself, the line is in `QUESTIONS.md` and is **not** resolved here.

## Never-invent list

Checked, and the status of each on this site:

| Item | Status |
| --- | --- |
| Version numbers | `0.4.0` everywhere, from the `v0.4.0` tag and `pom.xml` |
| Maven coordinate | `io.github.josipmusa:idempotency-spring-boot-starter`, from the README badge and quickstart |
| Java / Spring Boot support | Java 21+, Spring Boot 4.0.x and 4.1.x, from `requirements.md` |
| Download or user counts | Never stated. None exist |
| GitHub star count | Never displayed, per `BRIEF.md` |
| Adoption claims, named users, logos | Never stated. None exist |
| Benchmarks, "Nx faster" | Never stated. None exist |
| Roadmap, dates, future versions | Never stated |
| "Exactly-once" | Never claimed. Section 6 states the opposite explicitly |
| Count of SPI methods | **Open, see `QUESTIONS.md` Q1.** Copy below avoids the count |

## / (home)

### 1. hero

- Headline: **Idempotency for Java. Give a unit of work a key: it runs once.**
- Body (two short lines, not a paragraph): Every duplicate gets the stored result back.
  One dependency, one annotation, and no framework types in the engine.
- Coordinate (copyable, monospaced):
  `io.github.josipmusa:idempotency-spring-boot-starter:0.4.0`
- Coordinate caption: Java 21+ · Spring Boot 4.0 and 4.1 · Apache 2.0
- Button: **Get started** → `/docs/quickstart/`
- Secondary links: GitHub · Maven Central
- Image: typographic, no image

### 2. the library running

- Headline: **What happens when the same key arrives twice**
- Body: The engine acquires a lease on the key, runs your action under a heartbeat, stores
  what it returned, and hands that stored result to whoever shows up with the same key next.
  It is one call, `execute`, and everything else in the library is an adapter over it.
- Step 1 - **Acquire.** The first caller with this scope and key creates a record,
  `IN_PROGRESS`, and takes a lease on it.
- Step 2 - **Run under a heartbeat.** Your action runs. The heartbeat fires at half the
  lease duration, so an action that legitimately outlives its lease keeps it instead of
  having it stolen mid-flight.
- Step 3 - **Store.** The action returned. The record moves to `COMPLETE` carrying a
  replayable payload, and stays replayable for its TTL.
- Step 4 - **Replay.** The duplicate arrives, finds the completed record, and gets the
  stored result. The action does not run again.
- Closing line: An action that throws releases instead, and releasing deletes the row - so a
  failed attempt leaves no trace and the next caller sees a key that was never used. There
  is no failed state.
- Image: `assets/run-sequence.svg` - the four steps on one timeline, authored in Phase 3b
  and listed in `MOTION.md`. Section 2 is the site's primary animated surface.

### 3. the annotation in place

- Headline: **On a consumer, this is the whole change**
- Code (verbatim from `src/content/docs/annotated-methods.md`):

  ```java
  @Component
  class OrderListener {

      @Idempotent(key = "#event.id()", waitTimeout = "PT0S")
      @KafkaListener(topics = "orders")
      void on(OrderPlaced event) {
          // Runs once per event id, however many times the broker redelivers.
      }
  }
  ```

- Caption: `key` is a SpEL expression over the method's parameters, because a consumer has
  no transport to take a key from. `waitTimeout = "PT0S"` tells a concurrent duplicate to
  decline immediately rather than park the consumer thread.
- Second line: Over HTTP the client sends the key as a header and the annotation needs
  nothing from you. Without Spring, the engine is a plain Java object you call directly.
- Image: typographic, no image

### 4. the storage SPI

- Headline: **Bring your own store**
- Body: Five methods. Three carry the protocol, and every hard part that is not the
  engine's job lives behind the first of them - all blocking, waiting and stale-lease
  stealing happens inside `tryAcquire`, so a store can wait the way its technology actually
  waits instead of the engine polling on a schedule it would have to tune per backend.
- `tryAcquire` - take the lease, or report who holds it
- `complete` - store the result against the key
- `release` - the action threw; delete the row
- Second line: The other two are mechanical. `extendLock` is the heartbeat, and
  `purgeExpired` is the garbage collection.
- Closing line: `idempotency-core` is plain Java plus SLF4J, with no framework or transport
  types in it. JDBC, Redis and in-memory stores ship with the library, and
  `IdempotencyStoreContract` in `idempotency-test` is the specification your own store has
  to pass - all of it, not most of it.
- Image: typographic, no image

### 5. the duplicate side effects this prevents

- Headline: **Callers retry. That is not the problem.**
- Body: The problem is what a second run costs. A payment endpoint gets the same request
  twice because a mobile client lost its connection and tried again. A Kafka consumer sees
  the same message twice because the broker rebalanced. A provisioning job runs twice
  because an operator was not sure the first run took.
- Case 1 - **Money charged twice.**
- Case 2 - **Two orders shipped.**
- Case 3 - **Two VMs started.**
- Closing line: You need this if callers retry and a duplicate would cause a real problem.
  If a duplicate is merely wasteful, you probably do not.
- Image: typographic, no image

### 6. closing

- Headline: **Take it**
- Coordinate (copyable, monospaced):
  `io.github.josipmusa:idempotency-spring-boot-starter:0.4.0`
- Button: **Get started** → `/docs/quickstart/`
- Secondary line: Background reading in `/learn/` · the source on GitHub
- Limits line: What it does not do → `/docs/operating/limitations/`
- Image: typographic, no image

## /learn/ (index)

### 1. page head

- Headline: **Learn**
- Body: Long-form background on idempotency as a problem, written to stand on its own. The
  API reference is in the docs.
- Link: Reference documentation → `/docs/`
- Image: typographic, no image

### 2. article list

Four articles, in this order. Summaries are each article's own `question` frontmatter, which
is already the one line the piece answers.

1. **What idempotency actually means** - What does idempotency mean, and why is it hard?
2. **How idempotency keys work** - How do I design an idempotency key, and what do I store
   against it?
3. **Idempotency in Spring Boot** - What are my options for handling duplicate work in a
   Spring application?
4. **Idempotency in message-driven systems** - How does idempotency fit with the outbox
   pattern and at-least-once messaging?

- Image: typographic, no image

### 3. end of page

- Line: The reference material lives in the docs.
- Button: **Get started** → `/docs/quickstart/`
- Link: The source on GitHub
- Image: typographic, no image

## /learn/&lt;article&gt; (template)

The four articles' words are the existing files at `src/content/learn/*.mdx` and are not
redrafted here; they are fact-checked prose already. This section fixes only the words the
template supplies around them.

- Breadcrumb: `Learn / <article title>`
- Standfirst: each article's `question` frontmatter, as listed above.
- On-page contents heading: **On this page**
- End of article, heading: **Get it running**
- End of article, body: The reference documentation covers every attribute, the storage
  backends and the configuration.
- End of article, button: **Get started** → `/docs/quickstart/`
- End of article, list heading: **The other articles**
- End of article, link: The source on GitHub
- Image: per article, the diagram slots already referenced in the existing prose. No new
  imagery.

## /docs/ (landing)

### 1. landing head

- Headline: **Documentation**
- Body: The reference pages: installation, the model, the adapters, the storage backends and
  the operational detail.
- Coordinate (copyable, monospaced, same block as the hero):
  `io.github.josipmusa:idempotency-spring-boot-starter:0.4.0`
- Image: typographic, no image

### 2. the one action

- Line: Start here.
- Button: **Get started** → `/docs/quickstart/` - the starter, one storage backend and one
  annotation, running in five minutes.
- Image: typographic, no image

### 3. routes into the existing pages

Presentational grouping over pages that already exist. No new pages.

- **Start** - Quickstart · Requirements · What it does
- **The model** - Scope and key · Record lifecycle · Leases and waiting · Outcomes ·
  Fingerprints · Payloads and codecs
- **Adapters** - Annotated methods · HTTP endpoints · Joining your transaction ·
  Lifecycle callbacks · The engine
- **Storage** - Choosing a backend · JDBC · Redis · In-memory · Writing a store
- **Reference** - Annotation attributes · Configuration · HTTP · Javadoc on javadoc.io
- **Operating** - Limitations · Purging and retention · Security · Troubleshooting ·
  Upgrading
- Image: typographic, no image

### 4. back to the marketing side

- Line: Background reading on the problem itself is in Learn.
- Links: Learn → `/learn/` · GitHub · Maven Central
- Image: typographic, no image

## Global header

- Logo/wordmark → `/`
- Items: **Docs** · **Learn** · **GitHub** · **Maven Central**
- Button: **Get started** → `/docs/quickstart/`

## Global footer

- Licence line: idempotency4j is licensed under the Apache License 2.0.
- Links: LICENSE · NOTICE
- Attribution line (from the library's `NOTICE`, verbatim in substance):
  Copyright 2026 Josip Musa
- Repeat links: Docs · Learn
- External links: GitHub · Maven Central
