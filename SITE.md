# Site

Filled by the agent during the Stage 1 interview. Facts only; conclusions go in PLAN.md.

## Client and customer
- Client: our own site. **idempotency4j**, an idempotency engine for Java. Give a unit of work a key: it runs once, and every duplicate gets the stored result back. Apache 2.0, on Maven Central as `io.github.josipmusa:idempotency-spring-boot-starter`, currently 0.4.0.
- Customer: mid-to-senior Java and Spring backend engineers who have just been bitten by a duplicate side effect - a payment charged twice, an order shipped twice, a Kafka consumer reprocessing after a rebalance. They arrive from search, from Maven Central, or from a link in a discussion thread. Secondary: tech leads choosing between a small library and an in-house `processed_events` table, who read the list of limits first. Desktop-leaning, but phones are real and are judged first. English only.
- The one action: **Get started → `/docs/quickstart`.** The hero also carries the copyable Maven coordinate, because for part of this audience copying it *is* the conversion. GitHub and Maven Central are secondary and visually subordinate; no second hero button.
- Good six months after launch: real teams running it in production *and* the install and star curve moving. The site optimises for an engineer who installs, not for a browser.

## Type and anatomy
- Site type: **Product** - one thing you download. Not SaaS: nothing to log into, no trial, no sales motion.
- Anatomy: Product anatomy from `web/ANATOMIES.md`, adapted. Deviations logged in `DECISIONS.md`:
  - Slot 3 "social proof strip" is **dropped**. There are no logos, testimonials, ratings or adoption numbers we are allowed to show, and the star count argues against the library at its current size. Proof within two screens is carried instead by the mechanism running and by the published limits.
  - Slot 10 "reviews" is **dropped**, same reason.
  - Slot 7 "compare" is **promoted** and made real: against a hand-rolled `processed_events` table, against misused `@Cacheable`, against committing to Temporal.
  - A **limits** section is **added** before the closing CTA. The honesty is the pitch for the secondary audience, so the non-goals go on the homepage rather than only in the docs.
- Homepage section order:
  1. Navbar - logo · Docs · Learn · GitHub · Maven Central · **[Get started]**
  2. Hero ★ - headline, one line, copyable coordinate panel, **[Get started]**
  3. The mechanism running ★ - acquire the lease · run under a heartbeat · store the result · the duplicate replays it
  4. The whole change - the annotation on a consumer, on an HTTP endpoint, and the engine as a plain Java object
  5. What it prevents - charged twice · shipped twice · reprocessed on a rebalance
  6. Compare - your own table · `@Cacheable` · Temporal
  7. Specs - the support matrix, every row a combination CI runs
  8. Limits - what it is not, stated plainly
  9. Closing - the coordinate again, **[Get started]**, Learn, GitHub
  10. Footer
- Sub-pages: `/docs/*` (~29 reference pages, existing content, rebuilt in our own components) · `/learn/` and its four articles · `/learn/<article>` · 404. No contact, no privacy policy, no terms - there are no forms, no cookies and no analytics.
- Must-have features: copy-to-clipboard on every coordinate and snippet; build-tool tabs (Maven and Gradle); static search over the docs (Pagefind); one exported constant for the version, one for the base path.
- Out of scope: a changelog page, versioned docs, self-hosted Javadoc (deep-link javadoc.io), blog, newsletter, comments, playground, pricing, any form or email capture, displaying the star count.

## Personality and position
- Should be: **exact · physical · unembarrassed**
- Must never be: **friendly · enterprise** (and, operationally, never **flat**)
- Five seconds in, the visitor feels: this was engineered, not published; and I can see the thing working before anyone asks me to believe a claim.
- Position: the category is mostly absent, so the real alternatives are hand-rolling, misusing a cache, or adopting a platform. We must clearly not look like **restate.dev** (centred hero, pastel gradient, logo wall above the fold, cartoon illustration) - domain-adjacent, which makes it the most useful anti-reference. Nor like **inngest.com**, whose red-orange sits too close to our own accent.
- Stated preferences and quirks:
  - **Dark, done properly** - dark as a material with depth and a light source, not dark as a default background.
  - **Banned shape:** a centred column of content on a dark page with vertical hairline rules down both sides. This is the specific thing that made the previous attempt read as generic, named by Boss at source.
  - The previous attempt (`~/Private/idempotency4j-docs`) is **not** reference. Its content is reusable; its design and structure are not to be looked at again.
  - The logo's geometry is the only real material: two identical chevrons - a request and its retry - running into a single stop bar. Its colours (`#2d3142`, `#eb6c36`) carry no authority and are not binding.
  - The name is always lowercase, always one word: `idempotency4j`.
  - Spread of the three Stage 2 approaches: **wide** - one safe, one bold, one from an unexpected angle.

## References
Five, all fetched and read on 2026-09-21. Three were named by Boss; two are Boss-delegated picks from outside developer tooling, because dev-tool sites converge on one silhouette and that convergence is part of how the last attempt got generic.

- **trigger.dev** (Boss-supplied) - their own trace view is rotated in 3D, defocused and lit, sitting *behind* the type as the hero's material rather than pasted beside it. The page's subject is a real piece of machinery occupying space. **Take:** real machinery as a physical, lit object in perspective. **Reject:** the centred hero stacked in front of it. **Serves:** physical.
- **inngest.com** (Boss-supplied) - enormous uppercase type, left-aligned, breaking the measure, with the second line drawn in outline only; real code assembles on the right half. It is a two-column composition, not a centred stack. **Take:** asymmetry and extreme scale contrast; the nerve to put real machinery on a marketing page. **Reject:** the particle field, and the red-orange accent - too close to ours, we would read as a clone. **Serves:** unembarrassed.
- **encore.dev** (Boss-supplied) - the hero split gives a copyable install command its own panel, equal in weight to the claim. **Take:** exactly that split; our one action is the same shape. **Reject:** the hairline rules running the page - confirmed at source as the origin of the guardrails Boss disliked. **Serves:** exact.
- **teenage.engineering** (Boss-delegated) - the navigation is built as an instrument panel of pictograms and spec-sheet numerals; one orange is used as a marking, never as decoration. **Take:** utilitarian chrome; an accent that means one thing. **Reject:** the illustration and the whimsy - wrong register entirely. **Serves:** physical, exact.
- **ciechanow.ski** (Boss-delegated) - the reader drags and scrubs the mechanism; the explanation is a thing you operate, not a video played at you. **Take:** the interaction model. It is the strongest available argument that watching the mechanism run beats reading a claim about it. **Reject:** nothing visual; its chrome is deliberately plain. **Serves:** exact, physical.
- **restate.dev** - anti-reference, carried over. Centred hero, pastel gradient, logo wall, cartoon illustration.

## Content and assets
| Item | Have / missing | From whom, by when | Notes |
| --- | --- | --- | --- |
| Logo (vector) | Have | `~/Private/idempotency4j/docs/logo.svg`, `logo-dark.svg` | Geometry binding, colours not |
| Photos | Not needed | - | None permitted. No stock, no AI imagery, no people |
| Copy / notes | Have | README, CHANGELOG, CONTRIBUTING, SECURITY, NOTICE | Every claim traceable to the library at 0.4.0 |
| Video | Not needed | - | |
| 3D / drawings | Have (2 pairs) + authored | Record lifecycle and four HTTP outcomes, light and dark | New mechanism scenes are authored in code during Stage 2 |
| Brand colours / guidelines | None | - | Deliberately open; decided by the Stage 2 pick |
| Reviews / testimonials | None, never | - | Not permitted |
| Certifications / facts | Have | Support matrix from README; every row a combination CI runs | |
| Price list / product list | N/A | - | Free and open source |
| Docs content | Have, ~29 pages | `~/Private/idempotency4j-docs/src/content/docs/` | Reused as content, not as design |
| Learn content | Have, 4 articles | `~/Private/idempotency4j-docs/src/content/learn/` | Same |

- Languages and who checks copy in each: English only. Boss checks.
- Never-invent list: download or user counts, adoption claims, benchmarks or "Nx faster", a logo wall, any claim of exactly-once, an invented roadmap, the star count (real, but not displayed - revisit only in the high hundreds). Version numbers and the support matrix are copied from the library at a named version, never from memory, and render from one build-time constant.

## Constraints
- Deadline: none. Stage order is the constraint, not the calendar.
- Domain and hosting: GitHub Pages, deployed **from this repository** by GitHub Actions, no custom domain, so the site serves from a subpath. **The repository may be renamed once Boss likes the implementation, so the path is never written out anywhere** - every internal link and asset URL resolves through one exported base constant, and renaming the repo is a one-line change.
- Legal footer, analytics, cookies: Apache 2.0 linking LICENSE and NOTICE; attribution "Copyright 2026 Josip Musa", matching NOTICE exactly. No analytics, no cookies, no third-party scripts, no forms - so no privacy policy and no consent banner.
- Asset budget: **code only.** Nothing is commissioned, nothing waits on an outside producer, every animated thing encodes real library behaviour or comes off the page.
- Who signs off: Boss, alone.
