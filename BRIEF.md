# Brief

Phase 0, agreed 2026-09-18. One page. Everything later is checked against it.

## 1. The business

idempotency4j is an idempotency engine for Java. Give a unit of work a key: it runs once,
and every duplicate gets the stored result back. It is for mid-to-senior Java and Spring
backend engineers who have just been bitten by a duplicate side effect - a payment charged
twice, an order shipped twice, a Kafka consumer that reprocessed on a rebalance. They
arrive from search, from Maven Central, or from a link in a discussion thread. The category
is mostly absent, so the real alternatives are hand-rolling a `processed_events` table,
misusing `@Cacheable` in a way that does not survive concurrency, or committing to a
platform like Temporal. Against those, idempotency4j is one dependency and one annotation:
no framework types in the engine, a five-method storage SPI, and a published list of what
it does not do. A secondary audience, tech leads choosing between a small library and an
in-house table, reads that list of limits first - for them the honesty is the pitch.

## 2. The one job

**Copy the dependency coordinate, or open the quickstart.** Worded "Get started" wherever
it appears, leading to `/docs/quickstart`. The hero also carries the coordinate as copyable
text, because for part of this audience copying it is the conversion. GitHub and Maven
Central are secondary and visually subordinate. GitHub stars are a real secondary goal, but
they are earned downstream of the one job rather than competed for beside it: a visitor stars
the repo after the quickstart worked or after the limitations page convinced them, never from
the nav on arrival. The site's lever is therefore a GitHub entry point at the end of a read -
the footer, the last homepage section, the end of the quickstart - and never a second hero
button. Not the job: signups, time on page.

## 3. The feel

- Should be: **instrumented, exact, unembarrassed**
- Must never be: **friendly, enterprise**
- Admired sites and what specifically in them:
  - **encore.dev** - the hero split that gives a copyable install command equal weight to
    the claim; hairlines used as a spatial grid rather than as dividers.
  - **inngest.com** - enormous uppercase section headings that break the measure; the
    willingness to put a real trace timeline on a marketing page.
  - **trigger.dev** - one thing only: a real terminal treated as a composed object in space.
- Disliked site and why:
  - **restate.dev** - centred hero, pastel gradient, logo wall above the fold, cartoon
    illustration. Domain-adjacent, which makes it the most useful anti-reference.

## 4. The motion tier

**Showpiece.** The site is partly a demonstration: the library's mechanism (acquire a
lease, run under a heartbeat, store the result, replay it) is the argument, and watching it
run is more persuasive than reading a claim about it. Motion is not confined to one
signature scene; several surfaces may animate.

The asset that makes the show is a set of hand-authored SVG mechanism scenes, produced in
this repo during Phase 3b, by Claude, before Phase 4 starts. Nothing is commissioned and
nothing waits on an outside producer, which is why Showpiece is affordable here.

The tier buys more animated surfaces, not licence to decorate. Every animated thing encodes
real library behaviour - a lease expiring, a duplicate returning the stored result - or it
comes off the page. No photography, no stock, no AI-generated imagery.

## 5. The facts

- **Pages needed:** `/` home; `/docs/*` reference; `/learn/` and its articles; footer with
  licence, links and attribution. The docs and learn structure carries over; the homepage
  is deliberately open, to be shaped in Phase 2.
- **Languages:** English only.
- **Materials in hand:** ~29 finished reference pages and 4 articles, already in this repo
  at `src/content/docs/` and `src/content/learn/`. In `~/Private/idempotency4j`: logo in
  light and dark vector (two chevrons, a request and its retry, running into one stop bar),
  two diagram pairs (record lifecycle, four HTTP outcomes), README, CHANGELOG, CONTRIBUTING,
  SECURITY, LICENSE, NOTICE.
- **Materials missing:** none. No photography, video, 3D, bios, testimonials or benchmarks
  are needed, and none may be invented.
- **Deadline:** none. Phase order is the constraint, not the calendar.
- **Domain and hosting:** GitHub Pages from this repo, deployed by GitHub Actions
  (`actions/deploy-pages`, `GITHUB_TOKEN` only). No custom domain, so the site serves from
  the subpath `https://josipmusa.github.io/idempotency4j-docs/` and every internal link and
  asset URL must resolve through one exported base constant.
- **Legal footer needs:** Apache 2.0, linking LICENSE and NOTICE. No cookies, no analytics,
  no third-party scripts, no forms, so no privacy policy and no consent banner.
- **Explicitly out of scope:** a changelog page, versioned docs, self-hosted Javadoc
  (deep-link to javadoc.io instead), blog, newsletter, comments, playground, pricing page,
  any form or email capture.

## Standing constraints

- **Never invent.** No download or user counts, no adoption claims, no benchmarks or "Nx
  faster", no logo wall, no claim of exactly-once, no invented roadmap. Version numbers and
  support matrices are copied from the library at a named version, never from memory.
- **The star count is never displayed.** It is a real number rather than an invented one, so
  the rule above does not cover it, but at its current size it argues against the library to
  the tech lead who is the hardest visitor to convince. Revisit only if the count grows into
  the high hundreds.
- **The name** is always lowercase, always one word: `idempotency4j`.
- **`/docs` stays Starlight,** restyled to the Phase 1 tokens rather than themed. A
  default-looking `/docs` against a designed `/` is a failure.
- **The logo's colours carry no authority.** `#2d3142` and `#eb6c36` are a stock diagram
  palette, not a brand decision. Only the mark's geometry is a real material: two identical
  chevrons, a request and its retry, running into a single stop bar. The mark is rendered in
  the foreground colour, so the accent keeps its one meaning, unless Phase 5 shows a reason
  to decide otherwise.
- **The previous build is reference, not authority.** Its DESIGN.md, PRODUCT.md and
  homepage structure are recoverable from git at `b770e57`; nothing is inherited from them
  without being decided again.
