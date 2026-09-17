# Brief

Written at kickoff, 2026-09-17. The record of what this site is, for whom, with what.
Every later document derives from it.

## Switches

- **Site type:** tech product (an open-source Java library)
- **Materials level:** thin
- **Client presence:** own site
- **Default motion profile implied:** Kinetic

## The one job

Get idempotency4j into a Java engineer's build file.

**Desired visitor action:** copy the dependency coordinate, or open the quickstart.
One primary action, worded **"Get started"** everywhere, leading to `/docs/quickstart`.
GitHub is a secondary, visually subordinate action.

**Success in six months:**

- Maven Central downloads trending up month over month.
- The site, not the GitHub README, is what people link when they recommend the library.
- The three Learn articles bring organic search traffic for the queries in
  [Audience](#audience), and a measurable share of that traffic reaches `/docs/quickstart`.

Not success: stars, newsletter signups, time on page.

## Business

idempotency4j is an idempotency engine for Java. Give a unit of work a key: it runs once,
and every duplicate gets the stored result back.

What sets it apart in its category: the category is mostly *absent*. The alternatives a
Java engineer actually weighs are (a) hand-rolling a `processed_events` table, (b) a
Spring `@Cacheable` misuse that does not survive concurrency, (c) a platform such as
Temporal or Inngest, which is a much larger commitment than one annotation. idempotency4j
is a small library with no framework types in its engine, three-method storage SPI, and an
explicit, published list of what it does not do.

What the site emphasises, in order: the duplicate-side-effect problem; the execution model
(acquire, heartbeat, execute, store, replay); that adopting it is one dependency and one
annotation; the module and storage matrix; the limitations.

## Audience

**Primary: Java and Spring backend engineers, mid to senior, who have just been bitten.**
A duplicate charge, a double-shipped order, a Kafka consumer that reprocessed on rebalance.
They arrive from a search engine on queries like "spring boot idempotency",
"idempotency key java", "kafka consumer duplicate processing", "prevent duplicate payment
retry"; from Maven Central; or from a link in a discussion thread. They know Java and
Spring fluently. They may not know the words *lease*, *fencing*, or *at-least-once*, and
the site must not assume they do.

They care most about, in order: does this actually solve my case; what does it cost me to
adopt; what does it not do; is it maintained.

**Secondary: tech leads and architects** deciding between adopting a small library and
building it in-house. They read the limitations page first and the quickstart second. For
them, the honesty *is* the sales pitch.

**Explicitly not a target:** non-JVM developers, no-code audiences, engineering managers
looking for a platform, anyone who needs reactive or WebFlux support (the library does not
have it and the site says so).

**Language:** English only.

## Taste

### Admired, with what specifically

Full shortlist with per-reference likes and dislikes in
[docs/DESIGN-CANDIDATES.md](docs/DESIGN-CANDIDATES.md); captures in `docs/refs/`.

- **encore.dev** - the hero split: claim on the left, a copyable install command in a real
  panel on the right, given equal weight. Monospace uppercase eyebrows. `//`-prefixed
  section labels. Hairline rules used as a spatial grid rather than as dividers.
- **inngest.com** - enormous uppercase section headings that break the measure; a
  hairline-divided panel row with exactly one cell filled in the accent colour; thin-stroke
  wireframe icons; the willingness to put a real trace timeline on the marketing page.
- **encore.dev/docs** - monospace uppercase sidebar group labels; one prominent "start
  here" card at the top; 20px body copy, which reads as confidence; a right-hand utility
  rail instead of stuffing links into the content.
- **trigger.dev** - one thing only: treating a real terminal as a composed object in space.

### Disliked, and why

- **restate.dev** - centred hero, pastel gradient, a logo wall above the fold, cartoon
  illustration. The register the site must not have. Domain-adjacent, which makes it the
  most useful anti-reference.
- **temporal.io** - purple enterprise gradient, funding banner, logo wall. Reads as a sales
  organisation. One thing to take: a section whose entire job is "watch this mechanism
  work".
- **tigerbeetle.com** - the mascot and the "1000x FASTER" energy. We have no benchmarks and
  will not imply any. Keeps the confidence of very large type on near-black.
- **trigger.dev** - centred everything, and blurred decorative code as a background
  texture. Code on this site is readable or it is absent.

### Personality sliders

| | | |
|---|---|---|
| traditional ·····•···· progressive | closer to progressive | modern tooling aesthetic, no nostalgia |
| reserved •········· welcoming | firmly reserved | it does not ingratiate |
| serious •········· playful | firmly serious | the failure mode it prevents is money moving twice |
| quiet ····•······ loud | mostly quiet, one loud moment | the signature scene is the only raised voice |
| decorated •········· instrumental | firmly instrumental | every mark on the page carries information |

Target adjectives: **instrumented, exact, unembarrassed.**
Explicitly not: friendly, approachable, playful, enterprise.

### Brand guidelines

None written, but a real de-facto system exists in the library repo and is treated as
given. See [Content and materials](#content-and-materials).

## Content and materials

Everything lives in `~/Private/idempotency4j`. Full inventory in
[docs/CONTENT.md](docs/CONTENT.md).

**What exists:**

- Logo, light and dark, as vector (`docs/logo.svg`, `docs/logo-dark.svg`). Mark is two
  identical chevrons - a request and its retry - running into a single stop bar. Wordmark
  is Inter SemiBold 22 at `-0.4` tracking, converted to outlines.
- ~~A five-colour palette already in use across logo and diagrams.~~ **Not a usable
  material.** Those colours (`#2d3142`, `#4f5d75`, `#bfc0c0`, `#eb6c36`) are the
  design-diagram skill's stock palette, not a brand decision, and carry no authority. The
  site's palette is designed from the brief instead (DECISIONS.md D16). Only the logo's
  *geometry* is a real material - see the line above.
- Two diagram pairs (light and dark, each as HTML source, SVG and PNG): the record
  lifecycle state machine, and the four HTTP request outcomes.
- A social preview image and its HTML source.
- ~700 lines of finished reference prose in `README.md`, in exactly the voice the site
  wants. This is the raw copy source for most of `/docs`.
- `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`.

**What does not exist and is not needed:** photography, video, 3D models, team bios,
testimonials, case studies, user logos, benchmarks.

**Gaps and the imagery policy:** the site needs no photographic or generated imagery. Every
visual is an information graphic drawn in SVG from the library's real behaviour, authored in
this repo. **Imagery policy: no photography, no stock, no AI-generated imagery.** Nothing
on this site is decorative, so there is nothing for those categories to fill. This removes
the usual phase-2 gap plan entirely and is the main reason a "thin" materials level is not
a problem here.

**Who knows the subject best:** the site owner, who wrote the library.

**Referenced but missing:** `docs/BRANDING.md` is cited in both logo SVGs and does not
exist in the library repo. Logged in docs/CONTENT.md.

## Scope

**Must-have pages**

- `/` - home, eight sections, in the order fixed in DESIGN.md
- `/docs/*` - the reference, Starlight, six sidebar groups
- `/learn/` and three articles
- Footer: licence, links, attribution

**Explicitly out of scope for v1**

- A changelog page
- Versioned docs (the 0.3.x / Boot 3 line is served by a single migration page instead)
- Self-hosted Javadoc (deep-link to javadoc.io)
- Blog, newsletter, search beyond Starlight's built-in, comments, analytics dashboard,
  playground, pricing page (there is no price)

## Constraints

**Timeline:** no external deadline. Phase order is the constraint, not the calendar.

**Sign-off:** own site, so the owner decides everything. The three playbook gates still
apply to stop drift. Own-site addition: **one outside reader before copy is locked** at the
end of phase 4.

**Stack:** Astro, static output, Starlight for `/docs`, restyled to this site's tokens.
Hand-built `/` and `/learn`. Markdown and MDX content collections. No CMS.

**Hosting:** GitHub Pages, from this repo, deployed by GitHub Actions
(`actions/deploy-pages`, `GITHUB_TOKEN` only - no secrets, no cross-repo push).

**Domain:** none. Serving from the Pages subpath:
`https://josipmusa.github.io/idempotency4j-docs/`.

> **This repo and this directory must be renamed to `idempotency4j-docs` before
> `git init`.** The current directory name `idempotency4j-website` would put "website" in
> every public URL. The repo name is the URL path segment.

Astro must be configured with `site` and `base`, and `base` must come from a single
exported constant that every internal link and asset URL goes through, so that adding a
custom domain later is a one-line change. See AGENTS.md.

**Deferred decision, not blocking:** a custom domain (`idempotency4j.dev`, ~$12/yr) would
remove the base path entirely. Deliberately deferred. Nothing in the design depends on the
URL shape.

**Legal and privacy:** library is Apache 2.0; footer states it and links `LICENSE` and
`NOTICE`. No cookies, no analytics, no third-party scripts, no forms, so no privacy policy
and no consent banner. If analytics are ever wanted, cookieless only.

**Maintenance after launch:** the owner. The load is Learn articles and keeping `/docs` in
step with library releases.

## Open items

| Item | Depends on | Status |
|---|---|---|
| Directory and repo rename to `idempotency4j-docs` | owner, before `git init` | done 2026-09-17 |
| Create `josipmusa/idempotency4j-docs` on GitHub and push `main` | owner | open; local git only so far |
| Display and mono typeface pairing | phase 6b spikes | on schedule |
| Design language | phase 6a spikes | on schedule |
| Whether "Execution model" and "Architecture" stay two homepage sections or merge | phase 6a; see the feeling-curve note in DESIGN.md | on schedule |
| Custom domain | owner, any time | deferred by choice |
| `docs/BRANDING.md` in the library repo | owner | cosmetic; does not block |

No item is TBD for want of materials.
