# Roadmap

Tailored at kickoff from the website playbook for: **tech product · materials thin · own
site**. Each phase has a goal and a gate. Gates exist because the next phase is cheaper when
they hold; skills warn when one is unmet and then do what was asked.

**What we are building:** the central home for idempotency4j - its documentation, its
articles, and the case for using it.

**North star:** every phase before coding exists to make PRODUCT.md, DESIGN.md and MOTION.md
so specific that the coding agent cannot produce anything generic. Decide by rendered
variants, never by description.

**DESIGN.md lifecycle:** drafted in phase 5 with LOCKED and OPEN sections, language selected
after 6a, FINAL after 6b passes the cold-regeneration gate.

**Own-site tailoring:** client touchpoints struck; the three gates kept as the owner's own
checkpoints; **one outside reader before copy is locked** added to phase 4.

**Tech-product tailoring:** the product is shown as itself (real code, real diagrams, real
module names), phase 5 starts from the **Kinetic** profile, and there is no pricing page
because there is no price (docs/DECISIONS.md D14).

**Materials-thin tailoring:** phase 2 would normally become identity generation and gap
planning. It is unusually light here - a real de-facto brand system already exists in the
library repo, and the imagery policy (docs/DECISIONS.md D12) removes the gap plan
entirely by ruling out every category of asset the site does not need. No extra time
budgeted.

**Parallelism:** phases 1, 2, 3 and 4 have no dependencies on each other.

---

## Phase 0. Intake - **DONE** 2026-09-17
**Goal:** know what we are building, for whom, with what.
- [x] Three switches set, questionnaire answered, BRIEF.md written
- [x] Materials request - n/a, own site

**Done when:** BRIEF.md has no TBD except items waiting on materials. **Met.** One blocking
open item remains and it is not a materials item: the repo rename (D6).

## Phase 1. References and taste - **DONE** 2026-09-17
**Goal:** know exactly what "great" looks like for this site, in words an agent can build to.
- [x] 7 references captured at 1440 and written up with what to take and what to reject
- [x] Personality sliders and target adjectives recorded in BRIEF.md
- [x] 5 named candidate languages in docs/DESIGN-CANDIDATES.md
- [x] Feeling-curve draft in DESIGN.md

**Done when:** shortlist confirmed and candidates named. **Met.**

## Phase 2. Materials and content inventory - **DONE** 2026-09-17
**Goal:** everything that goes on the site is in hand, checked; the signature moment is
decided.
- [x] Working set: two existing diagram pairs, two logo files, the palette, the README as
      copy source - all inventoried in docs/CONTENT.md with provenance
- [x] Rights: all the owner's own work, Apache 2.0, nothing owed
- [x] Imagery policy recorded - no photography, no stock, no AI imagery, no 3D. No gap plan
      needed as a consequence
- [x] Signature moment chosen: *Two charges, or one*
- [ ] **Signature feasibility test not yet run** - build both static SVG frames at 1440 and
      390 and check each is comprehensible alone. Fallback and gate in docs/CONTENT.md

**Done when:** docs/CONTENT.md is the single authority for what goes on the site.
**Met, with the feasibility test outstanding.** It needs the workspace, so it runs at the
start of phase 6a; the fallback is specified, so it does not block.

## Phase 3. Workspace - **DONE** 2026-09-17
**Goal:** the agent can build, screenshot, review and fix without manual intervention.
- [x] **Rename this directory and the repo to `idempotency4j-docs`** (D6) - done before
      `git init`, so nothing carries the old name
- [x] Astro scaffolded with `site` and `base` from a single exported constant (D5) -
      `src/consts.ts`, with `href()` and `absoluteUrl()` helpers
- [x] Starlight added and mounted at `/docs` - by prefixing generated ids rather than
      nesting the content directory, so files stay where CLAUDE.md says they live
- [x] Playbook template copied; dev toolbar disabled
- [x] Third-party skills installed from skills-lock.json, plus Impeccable
- [x] Spike harness produced a contact sheet from two dummy variants
- [x] Reviewer returned a verdict on a dummy page - PASS WITH ISSUES; the P1 base-prefix
      defect and both material P2s fixed
- [x] GitHub Actions Pages workflow, deploying on push to `main`

**Done when:** all verified. **Met.** Live at
`https://josipmusa.github.io/idempotency4j-docs/`; `/`, `/docs/`, the favicon and the
sitemap all resolve under the prefix and the site makes zero third-party requests (D15).

Build notes and the three deviations - the Starlight mount, agent tooling treated as a
restorable dependency, and the kept palette renders - are in
`docs/specs/phase-3-workspace.md`. One standing build warning is recorded there: Starlight
looks for an `i18n` collection the English-only site has no use for.

## Phase 4. Product and copy
**Goal:** all content exists before any design work.
- [x] PRODUCT.md: audience, one job, positioning, voice, never-invent list
- [x] Sitemap and full docs IA - docs/SITEMAP.md
- [x] Content storage decided: Markdown/MDX collections, no CMS
- [x] Language strategy: English only, with the reason
- [ ] Homepage copy drafted in voice, all eight sections
- [ ] `/docs` - ~24 pages drafted from the README against the IA
- [ ] `/learn` - three articles written (original work, not README-derived)
- [ ] The README-parity check script specified in D4
- [ ] **One outside reader before copy is locked** (own-site substitute for the client
      content gate)

**Done when:** every page has real copy and every diagram is assigned.

## Phase 5. Design brief draft - **DONE** 2026-09-17
**Goal:** DESIGN.md drafted: locks what is known, states what phase 6 decides.
- [x] LOCKED: palette anchors with the one-accent rule, spacing scale, motion authority,
      one-peak rule naming the signature, refuse list, navigation with its three written
      overrides, layout requirements, image treatment
- [x] Palette re-derived from six rendered directions after the inherited colours were
      found to be stock skill output (DECISIONS.md D16); tokens verified against the
      contrast floors in both themes
- [x] OPEN: design language, typeface pairing, grid density
- [x] Homepage feeling curve, with the §3/§4 adjacency problem named rather than hidden
- [x] MOTION.md drafted ahead of phase 8 so the signature could be specified concretely

**Done when:** exactly two decision sections and nothing in OPEN is secretly decided.
**Met.**

## Phase 6a. Divergent spikes
**Goal:** test genuinely different overall feels on throwaway work, pick one.
- [ ] Run the signature feasibility test first (phase 2 carry-over)
- [ ] One self-contained HTML file per candidate (A–E), identical real content: hero,
      signature in its settled ON state, integrations row
- [ ] Each generated in an isolated context
- [ ] Contact sheet at 1440 / 768 / 390 - judge candidates A and D at **390 first**
- [ ] Resolve O2 (do §3 and §4 merge) and O3 (fused vs split signature) from the renders
- [ ] Pick. Every candidate uses the locked tokens unchanged - these spikes decide
      language, not colour
- [ ] Losers recorded as anti-references in DESIGN.md

**Done when:** one language chosen and DESIGN.md updated.

## Phase 6b. Convergent spikes
**Goal:** refine within the winner, then freeze the brief.
- [ ] 2–3 recipes varying typeface pairing and grid density
- [ ] Judge the mono face on a 45-character coordinate set inline at 15px, not on a code
      block
- [ ] Pick, lock, rewrite DESIGN.md so the winner is the only possible output
- [ ] Cold-regeneration gate passed
- [ ] Spikes declared dead

**Done when:** DESIGN.md is FINAL and passed the cold regeneration.

## Phase 7. Static build
**Goal:** the complete site, real content, zero animation.
- [ ] All pages, all breakpoints, built to DESIGN.md; motion hooks placed, nothing moves
- [ ] **Starlight restyled, not themed** - sidebar, TOC, search modal, code blocks, asides,
      pagination, all on the site's tokens, reviewed at three viewports. Budget this as real
      work, not a config change
- [ ] The two existing diagrams placed with their README `alt` text verbatim
- [ ] The three new diagrams drawn in the existing diagram language
- [ ] `/llms.txt`, sitemap, robots, designed 404, Open Graph images from the signature frame
- [ ] README-parity check script (D4) wired into the build
- [ ] Open compositions decided by `web:variants`, never by argument
- [ ] Reviewer PASS at three viewports

**Done when:** the site looks premium frozen.

## Phase 8. Motion pass
**Goal:** motion in strict hierarchy per MOTION.md.
- [ ] MOTION.md confirmed against the built site
- [ ] 1. Hero reveal
- [ ] 2. Global reveal language
- [ ] 3. The signature moment - full choreography, interruptible, reversible
- [ ] 4. Micro-interactions
- [ ] 5. Page transitions - **none** (D13); nothing to do
- [ ] Decide O6: does the hairline draw-in survive, or is it cut

**Done when:** hierarchy complete, nothing added outside it, reviewer PASS with and without
reduced motion.

## Phase 9. Performance and accessibility
**Goal:** the honesty pass.
- [ ] Reduced motion genuinely respected - the signature still usable, transitions at 0ms
- [ ] Real mid-range phone test
- [ ] Fonts subset, preloaded, under 100KB total; no raster images to optimise beyond the
      favicon and OG set
- [ ] INP under 200ms
- [ ] Keyboard, focus, contrast against the floors in DESIGN.md, alt text, landmarks; no
      console errors
- [ ] Every table and code block scrolls in its own container; the page body never scrolls
      horizontally at 390
- [ ] Zero third-party requests (D15) - verified, not assumed

**Done when:** smooth on mid-range hardware, accessible, fast first load.

## Phase 10. Launch and handover
- [ ] Final independent critique
- [ ] Owner walkthrough on the Pages preview and a written go (own-site substitute for the
      client launch gate)
- [ ] Apache 2.0 footer, `NOTICE`, the mark's meaning stated once
- [ ] Deploy; confirm every internal link and asset resolves under the `base` prefix - the
      single most likely launch defect (D5)
- [ ] Submit the sitemap; check the three Learn articles are indexable
- [ ] Add the site link to the library's README and to the Maven Central project metadata

**Done when:** live and linked from the library.
