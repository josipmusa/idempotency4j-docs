# Decisions

One row per decision that would otherwise be re-argued later, with the reasoning and the
cost accepted. Append; do not rewrite history. If a decision is reversed, add a new row
referencing the old one.

All entries dated 2026-09-17 are from the kickoff conversation.

---

## Locked at kickoff

### D1. Astro + Starlight, not VitePress or hand-rolled docs
**2026-09-17.** Astro for the whole site; Starlight powers `/docs`, restyled to the site's
tokens; `/` and `/learn` hand-built.

VitePress gets to good docs fastest but makes a distinctive homepage and custom article
layouts a fight - and the homepage is where this project's design risk lives. Hand-rolling
the docs shell gives perfect coherence at the cost of owning search, sidebar state,
prev/next and their accessibility forever, which is not where a one-maintainer project
should spend.

**Cost accepted:** real Starlight override work in phase 7, and a `/docs` that must be
reviewed at all three viewports rather than assumed correct.

### D2. Dark-first, light supported
**2026-09-17.** Dark is the designed and reviewed default; light is a supported second.

The instrumentation register the brief asks for is a dark register, both named references
that read as "lab" are dark, and the library already ships dark diagram variants.

**Cost accepted:** light mode gets less design attention and must still pass review. Encore
inverts (dark marketing, light docs); this site deliberately does not - one theme system
across both surfaces.

### D3. The one job is "get it into their build"
**2026-09-17.** Primary action `Get started` → `/docs/quickstart`, plus a copyable
coordinate in the hero. GitHub secondary.

Success is Maven Central downloads, not stars. Rejected: leading with Learn (teaching is a
route to adoption, not the goal) and leading with GitHub (stars are a vanity metric for a
library whose value is being depended on).

### D4. README and site both maintained; site is a superset
**2026-09-17.** The library's README stays as it is. The site restructures the same material
and adds what a README cannot hold.

Rejected: shrinking the README to a pitch and making the site canonical, which would be one
source of truth but requires editing the library repo and leaves a GitHub visitor with less.
Rejected: generating docs from the library repo at build time, which couples the repos and
constrains authoring.

**Cost accepted - and this is a real one.** Two copies of the same reference prose will
drift. A reader landing on GitHub and a reader landing on the site will eventually get
different stories, and the version-sensitive content (support matrix, coordinates,
configuration keys) is exactly the content most likely to diverge.

**Mitigation, to be set up in phase 7:**
1. Each `/docs` page records its README source section in frontmatter (`sourceOf:`).
2. A script cross-checks the version-sensitive facts - every `<version>`, the Java and Boot
   version rows, the configuration key list - between the two and fails the build on a
   mismatch. These are the facts that matter and the only ones worth machine-checking.
3. Prose drift is accepted and not policed.

Revisit if the mitigation proves insufficient after two library releases.

### D5. GitHub Pages at a subpath, in its own repo, no custom domain
**2026-09-17.** Site source and Pages both in `josipmusa/idempotency4j-docs`, deployed by
`actions/deploy-pages` with `GITHUB_TOKEN` only.

**Rejected: publishing into the library repo's `gh-pages` branch** to get the bare
`/idempotency4j/` path. It buys ten characters of URL for: a long-lived write credential to
the library repo stored in another repo's secrets (a fine-grained PAT that expires within a
year and fails opaquely, or a non-expiring deploy key); every build of the website
accumulating in the library repo's object store, which anyone cloning the library then
fetches; Pages settings and deployment records living in a different repo from the build
logs; the library's one Pages slot spent; and a `gh-pages` branch that confuses contributors
unless the library's README explains it.

**Rejected: the site inside the library repo** - the owner wants it separate, and it couples
the release cycles.

**Cost accepted:** the URL is `josipmusa.github.io/idempotency4j-docs/`, and every internal
link carries a base prefix.

**Escape hatch, and the reason this is the right cheap choice:** a custom domain removes the
prefix entirely for ~$12/yr with no CI machinery. `base` therefore comes from a single
exported constant so the switch is a one-line change. See D6.

### D6. Repo and directory renamed to `idempotency4j-docs`
**2026-09-17.** The repo name is the URL path segment, so `idempotency4j-website` would put
"website" in every public URL.

`-docs` over `-site` and `-web` because "docs" is the near-universal convention for a
library's whole site, and it undersells the Learn section less than it appears to. **Must
happen before `git init`.** Open item in BRIEF.md.

### D7. Custom domain deferred, not declined
**2026-09-17.** Ship on the Pages subpath. `idempotency4j.dev` remains available as a
one-line change whenever wanted. Nothing in the design depends on the URL shape.

### D8. The signature moment fuses Problem and Solution into one controllable scene
**2026-09-17.** *Two charges, or one* - one scene at homepage §2 containing both states,
resolved by a switch the visitor flips.

The owner's sketch had `THE PROBLEM` and `IDEMPOTENCY4J` as separate full-height sections.
Fusing them puts before and after in a single frame - a direct comparison rather than a
remembered one - and removes a section from a homepage that must not grow.

**Also a deliberate override of a playbook default:** the playbook puts the signature moment
at the emotional centre, after the hero has had room. This one is at §2. For this audience
the duplicate side effect is the reason they are on the page, and delaying the answer would
be withholding the one thing they came for.

**Cost accepted:** the split version has a stronger feeling curve - genuine discomfort, then
relief - which a single toggled frame flattens. Recorded as the phase 6a alternative and
spiked, not assumed away.

### D9. Three Learn articles at launch
**2026-09-17.** `what-is-idempotency`, `how-idempotency-keys-work`,
`idempotency-in-spring-boot`. Index designed to grow; five-article backlog in SITEMAP.md.

Depth earns search traffic; volume does not. Three properly written beats six thin.

### D10. No changelog page, no versioned docs, no self-hosted Javadoc
**2026-09-17.** Changelog links out to GitHub. Javadoc deep-links to javadoc.io, which
already serves it for free.

**Versioned docs are the one genuinely arguable exclusion.** The Boot 3 / Boot 4 split is
real and live: `0.3.0` is the last Boot 3 release and `0.4.0` moved to Boot 4 and Framework
7. A version switcher is a structural commitment, not a later bolt-on, and it doubles the
surface every docs edit touches - for a 3.x line with no scheduled releases and no promised
ones.

**Instead:** one `/docs/operating/upgrading` page covering the 0.3 → 0.4 move, and a clear
statement on `/docs/requirements` that Boot 3 applications stay on `0.3.0`.

**Revisit if** a 0.3.x release actually ships, or if a second supported major line appears.

### D11. One accent, one meaning
**2026-09-17.** `--signal` marks the idempotent path - the replayed result, the guarded
boundary, the stored record - and nothing else. Not hover states, not headings, not links,
not focus rings.

This is the design's load-bearing rule. It is what makes the page an instrument rather than
a landing page, and it forces the palette to do its work through structure and hairlines.

**Cost accepted:** links are underlined rather than coloured, and the interface has one
accent-filled element. Both are features.

### D12. No imagery of any kind
**2026-09-17.** No photography, no stock, no AI-generated images, no rendered 3D. Every
visual is an information graphic drawn in SVG from real library behaviour.

Locked in DESIGN.md rather than left open, because it follows from "every mark carries
information" rather than from taste. It also removes the phase-2 gap plan entirely.

### D13. No animation library
**2026-09-17.** CSS scroll-driven animations for reveals, ~3KB of hand-written JS for the
signature scene, CSS transitions for feedback. No Motion, no GSAP, no anime.js, no Lenis.

There is no pinning, no scrub and no spring on this site, which is what those libraries
exist for. Near-absence of motion is also the differentiator - the category over-animates.

### D14. No contact page, no About, no Pricing
**2026-09-17.** Overrides three house navigation defaults; each override is written down in
DESIGN.md as the playbook requires.

The contact route for a one-maintainer library is its issue tracker, in the footer. There is
no price. An About page for a single library is a README section.

### D15. No analytics, no cookies, no third-party scripts
**2026-09-17.** The playbook default adds cookieless analytics so the one job can be checked
after launch. Declined: Maven Central download figures already measure the one job directly
and better than page analytics would, and a genuinely zero-script static site is worth more
to this audience than a funnel chart.

**Cost accepted:** no data on which Learn article converts. Revisit only if the Learn
strategy needs tuning and Maven Central's figures are not enough to tune it.

### D16. The palette is designed for this site, not inherited from the library
**2026-09-17.** Direction **A. Instrument** - cool near-black `#0a0c11` with a single
cyan-teal accent `#3ddbd9` (`#0d7373` in light mode). Full token table and the verified
contrast table in DESIGN.md.

**This reverses the palette half of the kickoff.** D2 and the original DESIGN.md adopted
the library's `#2d3142 / #4f5d75 / #bfc0c0 / #eb6c36` as an existing brand system. The
owner identified that those colours are the **design-diagram skill's stock palette** - the
README diagrams were generated with the skill's defaults, and the logo was drawn from the
same set. They were never a brand decision, so they carried no authority, and treating
them as fixed was constraining the design to an accident.

What survives from the library is the **mark's geometry** - two identical chevrons running
into a stop bar, which genuinely encodes a request, its retry, and the thing that stops it.
That is a real design; the hex values around it were not.

**Method.** Six directions rendered on identical real content - hero, the Fig. 1 signature
frame, a code line and the module row - in `spikes/palette.html`, captured at 1440 into
`spikes/screenshots/`. Decided from the renders, per the roadmap's north star.

**Rejected, and why - the eliminations were structural, not aesthetic:**

| | Direction | Why not |
|---|---|---|
| B | cool black + signal green `#6ee787` | Green is the docs' `tip` aside. The accent would be ambiguous with a status in the one place the site is used. |
| D | cool black + amber `#f0a83c` | Same collision against `caution`. |
| E | cool black + ice blue `#7aa2f7` | Blue is `note`, and blue is *the* link colour. With links underlined rather than coloured, a blue accent invites a click on inert text. Also the most Restate-adjacent option. |
| C | no hue, accent is pure luminance | Fails the one-accent rule outright, and the render proved it: with the accent and the headings both pure white, `Outcome.Replayed` and `1 charge` read as ordinary text and the idempotent path lost all emphasis. The only fix - dropping every heading to grey - costs more hierarchy than it buys. |
| F | cool black + cold magenta `#f062a8` | Survived both tests and was a genuine finalist. Rejected on register: screenshot the Fig. 1 diagram into a Slack thread with no context and cyan reads as a measurement while magenta reads as somebody's design system. For a library positioned on exactness and stated limitations, looking like an instrument is worth more than looking distinctive. |

**The general rule extracted, now on the DESIGN.md refuse list:** the accent can never be a
status hue, because `/docs` needs note / tip / caution / danger and those own blue, green,
amber and red.

**Costs accepted, both real:**
1. **The library's logo needs re-colouring** - four values across `docs/logo.svg` and
   `docs/logo-dark.svg`, in the library repo. Geometry and outlined wordmark untouched, so
   nothing is regenerated. Until it lands the README and the site disagree on the mark's
   colour. Target values in CONTENT.md.
2. **The two existing README diagrams no longer drop in for free.** "Zero rework in either
   theme" was a stated benefit of the inherited palette and it is spent. Both pairs are
   re-authored as single token-driven SVGs - which is what every new diagram on the site is
   anyway, so the cost is smaller than it looks.

**Also retired by this decision:** the Inngest-adjacency prohibition and the phase-6a
side-by-side check against `docs/refs/inngest-hero.png`. Both existed solely because the
inherited coral `#eb6c36` sat close to Inngest's accent over a similar near-black. With a
cyan accent the risk is gone. The refuse-list slot is taken by the status-hue rule and a
new "no second accent, ever".

**Supersedes:** the palette anchors in D2 (dark-first still stands, and stands more
strongly now that light mode is designed rather than copied) and the `#0b0d12` page ground
recorded in the original CONTENT.md palette note.


---

## Corrections to the initial sketch

Recorded because they are factual, not stylistic, and would otherwise be reintroduced.

### C1. Kafka is not an integration
**2026-09-17.** The owner's sketch had the integrations row as
`Spring Boot · Kafka · JDBC · Redis · Core`. **The library has no Kafka module.** Kafka works
by putting `@Idempotent` on a `@KafkaListener` method - it is a *use case* for the Spring
adapter, not an adapter.

Shipping a "Kafka" logo or cell in an integrations row would claim an integration that does
not exist, which is on PRODUCT.md's never-invent list.

**The honest row** is the real module set:

| | |
|---|---|
| `idempotency-core` | no framework, plain Java + SLF4J |
| `idempotency-spring-boot-starter` | autoconfiguration |
| `idempotency-spring` | `@Idempotent`, AOP, transaction participation |
| `idempotency-spring-web` | Servlet capture and replay |
| `idempotency-jdbc` | PostgreSQL, MySQL, H2 |
| `idempotency-redis` | Lettuce, standalone and Sentinel |
| `idempotency-inmemory` | development and tests |
| `idempotency-bom` | version management |

Kafka belongs in §5 (Code), where the first tab is a real annotated `@KafkaListener` - which
shows the Kafka case more convincingly than a logo would.

### C2. No emoji in diagrams
**2026-09-17.** The sketch used `💳` for a charge and `💥` for the duplicate-payment
failure. Both come off: the existing diagram set uses no emoji, and a charge is drawn as a
labelled object. Refuse-list item in DESIGN.md.

### C3. `docs/BRANDING.md` is missing from the library repo
**2026-09-17.** Both logo SVGs cite it for wordmark regeneration instructions. It does not
exist. Cosmetic, blocks nothing; the logo files are the authority. Worth creating in the
library repo at some point.

---

## Open, to be decided by spike

| # | Question | Phase | Where specified |
|---|---|---|---|
| O1 | Design language, from five candidates | 6a | docs/DESIGN-CANDIDATES.md |
| O2 | Whether §3 Execution model and §4 Architecture merge, or §4 moves to `/docs` | 6a | DESIGN.md feeling-curve adjacency check |
| O3 | Whether the fused signature (D8) beats the split Problem / Solution sections | 6a | D8 above |
| O4 | Display and mono typeface pairing | 6b | DESIGN.md OPEN |
| O5 | Grid density, and docs body copy at 16 / 17 / 18px | 6b | DESIGN.md OPEN |
| O6 | Whether the hairline draw-in survives as the one piece of decorative motion | 8 | MOTION.md reveal language |
