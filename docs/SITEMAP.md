# Sitemap and information architecture

Phase 4 output, drafted at kickoff because the docs IA is the largest single structural
decision on the site and DESIGN.md's layout requirements depend on it.

Derived from the library at `~/Private/idempotency4j` as of `0.5.0-SNAPSHOT` (latest release
`0.4.0`). Every page below maps to real, existing library behaviour. Nothing here is
aspirational.

---

## The rule that separates the two sections

Locked in DESIGN.md, repeated here because it governs every page placement:

- **`/docs` answers "how do I use idempotency4j".** Every page contains idempotency4j code
  or configuration. A reader arrives having decided, or nearly decided, to adopt.
- **`/learn` answers "help me understand the problem".** Every article must stand on its own
  for a reader who never adopts the library. At most one link to `/docs`, at the end.

Test for a new page: strip every mention of idempotency4j. If it is still useful, it is
Learn. If it is now empty, it is Docs.

---

## `/` - Home

Eight sections, capped. Full rationale and feeling curve in DESIGN.md.

| # | Section | Contains |
|---|---|---|
| 1 | Hero | Claim, support line, `[ Get started ]` + `GitHub`, copyable Maven/Gradle coordinate |
| 2 | Two charges, or one *(signature)* | The interactive duplicate-request scene |
| 3 | Execution model | Request → Acquire → Execute → Store → Replay |
| 4 | Architecture | The four layers and their boundaries |
| 5 | Code | Three tabs: annotated listener, annotated endpoint, raw engine |
| 6 | Integrations | The real module and store matrix |
| 7 | Learn | Four articles |
| 8 | Get started | The coordinate and the one action |

Sections 3 and 4 are under review in phase 6a - see the adjacency check in DESIGN.md.

---

## `/docs` - Reference

Starlight. Six sidebar groups with monospace uppercase labels. 29 pages.

Ordered so that a reader can stop after any group and have something that works. Group 1
gets them running, group 2 gives them the mental model, group 3 is the adapter they actually
use, and the rest is consulted rather than read.

### `GETTING STARTED`

| Page | Job | Source in library |
|---|---|---|
| `/docs/` | One card with the single next action, then a short "explore the docs" list. Encore's docs-landing pattern. | - |
| `/docs/what-it-does` | The mental model in ~400 words, before any code. Scope + key, runs once, duplicates get the stored result. | README intro, "What this is not" |
| `/docs/quickstart` | Starter + `idempotency-jdbc` + one `@Idempotent` method, running in five minutes. Ends by pointing at exactly one next page. | README "Quick start" |
| `/docs/requirements` | The support matrix. Java 21+, Boot 4.0/4.1, Postgres/MySQL/H2, Redis 7+, no WebFlux. States the licence. | README "Requirements" |

### `CORE CONCEPTS`

| Page | Job | Source |
|---|---|---|
| `/docs/concepts/scope-and-key` | A record is identified by scope *and* key, never key alone. Why the same message id in two consumers is two records. Default scope derivation. | README "How it works" |
| `/docs/concepts/record-lifecycle` | The state machine: absent → `IN_PROGRESS` → `COMPLETE` → purged, and the release edge. There is no failed state. Hosts the existing `record-lifecycle` diagram. | README + `docs/diagrams/record-lifecycle.*` |
| `/docs/concepts/leases-and-waiting` | `lease` vs `wait` as independent durations. The heartbeat at `lease / 2`. Stealing an expired lease. Why blocking lives in the store, not the engine. | README "How it works" |
| `/docs/concepts/outcomes` | `Outcome.Executed`, `Replayed`, `InFlight` as a sealed type you switch on. `retryAfter`. | README "The engine" |
| `/docs/concepts/payloads-and-codecs` | `PayloadCodec`, `Payload(type, body, attributes)`, and using `attributes` for correlation data so a duplicate can reference the first run's published messages instead of republishing. | README "The engine" |
| `/docs/concepts/fingerprints` | `.fingerprint(sha256Hex)`, key reuse with a different payload, and why two acquisitions clash only when both carry one. | README |

### `USING IT`

| Page | Job | Source |
|---|---|---|
| `/docs/annotated-methods` | `@Idempotent` on any Spring bean. SpEL keys over parameters. Every attribute and its default. `waitTimeout = "PT0S"` on consumer threads and why. `void` vs value-returning and the required codec. Startup-time validation. | README "Annotated methods" |
| `/docs/http-endpoints` | The `Idempotency-Key` header. The four request outcomes, with the existing `request-outcomes` diagram. What gets stored, including 4xx/5xx. Throw vs return an error status. Filter status codes. Replay headers. `idempotency.web.required` as one answer for the whole API. | README "HTTP endpoints" + `docs/diagrams/request-outcomes.*` |
| `/docs/the-engine` | `IdempotencyEngine.execute` without Spring. Building the context. The runnable and codec overloads. `CompletionFailurePolicy`. | README "The engine" |
| `/docs/joining-your-transaction` | `completion = "join-transaction"`, the window it closes, and the three preconditions - store support, an already-active transaction, the caller's connection. The `@EnableTransactionManagement(order = ...)` ordering trap, stated as the startup error names it. | README "Completing inside your transaction" |
| `/docs/lifecycle-callbacks` | `IdempotencyLifecycleListener`. The contract: synchronous on the calling thread, exceptions swallowed at WARN, exactly one terminal per lease, what `onDuplicate`/`onInFlight` do not do. | README "Lifecycle callbacks" |

### `STORAGE`

| Page | Job | Source |
|---|---|---|
| `/docs/storage/choosing` | The three-row comparison and `idempotency.store-type`. Why `auto` does not fall back to in-memory. A store bean you declare always wins. | README "Storage backends" |
| `/docs/storage/jdbc` | Autoconfiguration from a single `DataSource`. `initialize-schema: embedded | always | never`. Pointing Flyway or Liquibase at the shipped schema files. Constructing the store by hand. | README |
| `/docs/storage/redis` | The three beans and `RedisIdempotencyStore.CODEC`. Why it is not autoconfigured, stated as the honest architectural answer. `maxmemory-policy noeviction`. No Cluster. No joined completion. | README |
| `/docs/storage/in-memory` | Development and tests only. Single JVM. Ask for it by name. | README |
| `/docs/storage/writing-a-store` | The three-method SPI, `IdempotencyStoreContract`, `TransactionalStoreContract`, and that behaviour changes belong in the contract first. | README "Adding a backend" |

### `REFERENCE`

| Page | Job | Source |
|---|---|---|
| `/docs/reference/configuration` | Every key under `idempotency.*`, grouped top-level / `web` / `jdbc` / `purge`, with defaults. Calls out the two that surprise people: `completion-failure-policy` defaulting differently in the starter than in the engine, and `purge.enabled` needing `@EnableScheduling`. | README "Configuration" |
| `/docs/reference/annotation` | `@Idempotent`, attribute by attribute, with which are rejected on an endpoint and why. | README |
| `/docs/reference/http` | Status codes the filter returns, replay headers, what a non-HTTP completion replays. | README |
| `/docs/reference/javadoc` | A short page that links out to javadoc.io per module. Not self-hosted. | - |

### `OPERATING IT`

| Page | Job | Source |
|---|---|---|
| `/docs/operating/purging-and-retention` | The purge scheduler, its cron, TTL as a retention control, and the `@EnableScheduling` requirement. | README |
| `/docs/operating/security` | The store holds whatever the adapter hands it, which over HTTP means full response bodies. Encryption at rest, Redis TLS and ACLs, short TTLs. `ResponseSanitizer`. Why keys are never logged and what the `scope/#digest` form is. | README "Security" |
| `/docs/operating/limitations` | No reactive. No tenant isolation. No Redis Cluster. Downstream side effects are not covered. Verbatim in the library's own register. | README "Limitations" + "What this is not" |
| `/docs/operating/upgrading` | 0.3.x (Boot 3) → 0.4.x (Boot 4, Framework 7). What moved, and that Boot 3 apps should stay on 0.3.0 with no releases scheduled. Replaces versioned docs for v1. | README "Spring Boot 3", CHANGELOG |
| `/docs/operating/troubleshooting` | Every startup failure, warning and runtime surprise by its **exact message**, with cause and fix. Added in phase 4. | Library source, not the README |

**`/docs/operating/troubleshooting` is keyed on exact error strings**, because that is what
an engineer pastes into a search box mid-incident. It is the clearest case of the site being a
superset of the README (DECISIONS.md D4): every entry is derived from the library's own source
and none of it exists in the README. Added during phase 4 rather than at kickoff.

**Five docs pages carry a diagram, not two.** `scope-and-key`, `leases-and-waiting` and
`joining-your-transaction` were assigned one during phase 4, on the same reasoning as the
troubleshooting page above: each is a page whose central claim prose states badly, and
styling in phase 7 cannot add structure the content layer never asked for. The full list,
with what each diagram shows, is in [CONTENT.md](CONTENT.md).

**`/docs/operating/limitations` is a deliberate first-class page, linked from the homepage.**
For the secondary audience - a lead deciding between adopting and building - the honesty is
the sales pitch. It is not buried at the bottom of a reference page.

---

## `/learn` - Articles

Custom layout, not Starlight. MDX collection. Four at launch.

The route exists as a holding page, the same shape as `/`: the articles are routed and their
cross-links resolve, and phase 7 owns the layout. Each article emits its `question` as
schema.org `FAQPage` data, which is the only reason that frontmatter field is machine-read
rather than documentation.

### At launch

| Slug | Title | The question it answers | Target queries |
|---|---|---|---|
| `what-is-idempotency` | What idempotency actually means | Why "the same request twice has the same effect once" is harder than it sounds, and why HTTP's definition of an idempotent method is not the property you need. Retries, at-least-once delivery, where duplicates actually come from. | "what is idempotency", "idempotent api", "idempotency meaning" |
| `how-idempotency-keys-work` | How idempotency keys work | Who generates the key, what it must be scoped to, what happens on reuse with a different body, how long to keep records, what to store as the result. The design space, with the tradeoffs named. | "idempotency key", "idempotency-key header", "how to generate idempotency key" |
| `idempotency-in-spring-boot` | Idempotency in Spring Boot | The options a Spring engineer actually has: a `processed_events` table, a unique constraint, `@Cacheable` (and why it fails under concurrency), a distributed lock, a library. What each costs and where each breaks. | "spring boot idempotency", "spring idempotent api", "kafka consumer duplicate spring" |
| `idempotency-in-message-driven-systems` | Idempotency in message-driven systems | The outbox pattern, at-least-once delivery, and Udi Dahan's model in which a duplicate is a signal to finish what the first attempt started. Where Spring Modulith's event publication registry and a dedicated outbox fit. | "transactional outbox spring", "outbox pattern java", "idempotent consumer kafka spring" |

The Spring Boot article is the one where the Docs/Learn rule is hardest to hold. It must
survey the honest alternatives, including the ones that make the library unnecessary, and
earn the single closing link.

### Backlog, not built for v1

- `exactly-once-vs-idempotency` - why exactly-once delivery does not exist and idempotent
  processing is what people actually want
- `leases-heartbeats-and-stale-owners` - the mechanism, generalised beyond this library
- `building-an-idempotency-layer` - what you end up writing if you do it yourself, and the
  four bugs you find in month three
- `idempotency-for-kafka-consumers` - rebalances, redelivery, and why consumer-thread
  blocking is the wrong default
- `storing-http-responses-for-replay` - what to capture, what to sanitise, what it costs

---

## Footer

Present on every page, three columns plus a bottom line.

- **Project** - Docs · Learn · Changelog (outbound to GitHub) · Limitations
- **Source** - GitHub · Issues · Discussions · Contributing · Security policy
- **Artifacts** - Maven Central · Javadoc · BOM coordinate

Bottom line: `Apache 2.0` linking `LICENSE`, and `NOTICE`. No copyright line asserting more
than the licence does. No social icons beyond GitHub. No newsletter.

---

## Routes that must exist but are not pages

| Route | Purpose |
|---|---|
| `/404` | Designed, dark, with the primary action and a link to `/docs` |
| `/sitemap-index.xml` | Astro sitemap integration |
| `/robots.txt` | Allow all; point at the sitemap |
| `/llms.txt` | Plain-text index of the docs pages. The audience uses coding agents; this is cheap and directly serves them. |
| `/og/*.png` | Social preview images. The homepage's is the signature scene's settled ON frame. |

---

## What deliberately does not exist

No blog. No changelog page (outbound to GitHub). No versioned docs (one upgrade page
instead). No self-hosted Javadoc. No search beyond Starlight's built-in Pagefind. No
playground. No pricing page. No about page. No contact page or form - the contact route is
the issue tracker, in the footer. No newsletter, no analytics, no cookie banner, no chat
widget.

Each of these is a decision, not an omission, and each is recorded in
[DECISIONS.md](DECISIONS.md).
