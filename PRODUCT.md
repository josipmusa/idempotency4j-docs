# Product

<!-- impeccable:product-schema 1 -->

Sourced from the Stage 1 interview already completed in this project. `SITE.md` holds
the facts and `PLAN.md` the confirmed conclusions; this file is the durable product
record derived from them. Nothing here is inferred without a source in those files.

## Platform

web

## Stack

Astro, static output, deployed to GitHub Pages from this repository by GitHub Actions.
GSAP + ScrollTrigger + Lenis for scroll work, three.js only if a scene needs it, Astro
View Transitions between pages, Pagefind for docs search. Decided by the project owner
before this record existed.

## Users

Mid-to-senior Java and Spring backend engineers who have just been bitten by a duplicate
side effect: a payment charged twice, an order shipped twice, a Kafka consumer
reprocessing after a rebalance. They arrive from search, from Maven Central, or from a
link in a discussion thread, and they are looking for something they can add to a build
file in the next ten minutes.

Secondary: tech leads choosing between a small library and an in-house `processed_events`
table. They read the list of limits before they read the pitch.

Desktop-leaning audience, but phones are real and every render is judged at 390 px first.
English only.

## Product Purpose

idempotency4j is an idempotency engine for Java. Give a unit of work a key: it runs once,
and every duplicate gets the stored result back. Apache 2.0, published to Maven Central as
`io.github.josipmusa:idempotency-spring-boot-starter`, currently 0.4.0.

The site has one job: get an engineer to `/docs/quickstart`, or get the Maven coordinate
onto their clipboard. For part of this audience, copying the coordinate is the conversion.
Success six months after launch is real teams running it in production, with the install
and star curve moving.

## Positioning

The category is mostly absent, so the honest alternatives are hand-rolling a
`processed_events` table, misusing `@Cacheable`, or adopting a workflow platform such as
Temporal. The differentiator is the protocol, not the storage: a key/scope pair, a state
machine of absent to `IN_PROGRESS` to `COMPLETE`, leases held under a heartbeat at
`lease / 2`, a blocking `wait` for in-flight duplicates, and a sealed `Outcome` of
`Executed`, `Replayed` or `InFlight`. Three of the five storage SPI methods carry that
protocol, which is why a hand-rolled table is not the same thing.

## Operating Context

The visitor is in a browser with an IDE open behind it and a build file already on screen.
They will copy a coordinate, skim a code sample, and check the support matrix against their
own stack (Java 21+, Spring Boot 4.0.x/4.1.x, Postgres 16, MySQL 8.0, H2 2.x, Redis 7+)
before they read any claim. The tech lead's evaluation starts at the non-goals.

## Capabilities and Constraints

- Static site, no backend, no forms, no analytics, no cookies, no third-party scripts, and
  therefore no privacy policy and no consent banner.
- No custom domain, so the site serves from a subpath. The repository may be renamed once
  the owner is happy with the implementation, so the path is never written out: every
  internal link and asset URL resolves through one exported constant in `site.config.mjs`,
  derived from the environment.
- The library version renders from one build-time constant in the same file.
- Docs (~29 reference pages) and Learn (4 articles) exist as content from a previous
  attempt and are rebuilt in this site's own components. Search comes from Pagefind at
  build time.
- Out of scope: changelog page, versioned docs, self-hosted Javadoc (deep-link javadoc.io),
  blog, newsletter, comments, playground, pricing, any form or email capture.

## Brand Commitments

- The name is always lowercase, always one word: `idempotency4j`.
- The logo geometry is binding: two identical chevrons, a request and its retry, running
  into a single stop bar. Its colours (`#2d3142`, `#eb6c36`) are not binding.
- Personality: exact, physical, unembarrassed. Never friendly, never enterprise, and
  operationally never flat.
- Footer attribution reads exactly `Copyright 2026 Josip Musa`, matching NOTICE.
- Banned shape, named by the owner as the reason a previous attempt failed: a centred
  column of content on a dark page with vertical hairline rules down both sides.

## Evidence on Hand

- `~/Private/idempotency4j/README.md` at 0.4.0 is the single source of truth for every
  technical claim: code samples, configuration keys, HTTP status codes, the support matrix,
  the limits.
- Logo in `~/Private/idempotency4j/docs/logo.svg` and `logo-dark.svg`.
- Existing diagrams for the record lifecycle and the four HTTP outcomes, light and dark.
- Docs and Learn content in `~/Private/idempotency4j-docs/src/content/`.
- **Absent, and never to be fabricated:** download or user counts, adoption claims,
  benchmarks or "Nx faster", a logo wall, any claim of exactly-once, a roadmap,
  testimonials, reviews, ratings. The star count is real but is not displayed.

## Product Principles

1. Show the mechanism running before making a claim about it. The strongest available
   argument is a visitor watching a duplicate get replayed.
2. Every number, key, status code and coordinate comes from the library at a named version,
   never from memory, and renders from one constant.
3. Publish the limits on the homepage. For the tech lead deciding between this and an
   in-house table, the non-goals are the pitch.
4. One action per page. Get started, with the coordinate as the second path to the same
   decision.
5. Anything that moves encodes real library behaviour, or it comes off the page.

## Accessibility & Inclusion

No product-specific standard was set beyond the general bar: reduced motion gets a real
static frame rather than a blank, every scene can be read as a still, and the site is
usable at 390 px and by keyboard.
