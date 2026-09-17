# Phase 4 - Product and copy

**Goal:** every page named in docs/SITEMAP.md has real, final copy in the site's voice, and
every diagram is assigned, so phase 6a can spike on real content and phase 7 can build
without writing a word.

## Approach

Content only. No design work, no components, no styling. The four remaining phase 4
checkboxes plus the outside-reader gate.

`/docs` and `/learn` are written directly into their final home - Astro content collections -
because markdown in a collection *is* the finished artifact for those pages; there is no
intermediate form worth inventing. The homepage is different: its eight sections become
components in phase 7, and O2 (whether sections 3 and 4 merge) is not resolved until 6a, so
its copy lands as a deck at `docs/COPY-HOME.md` rather than a typed collection that would
presuppose the layout.

Docs pages restructure the README against the IA and add the connective material a README
cannot hold - per-page framing, cross-links, and the pages with no README section at all.
Version-sensitive facts are copied verbatim, never rewritten (PRODUCT.md).

## Design

### Facts and provenance

Source: `~/Private/idempotency4j` README.md (708 lines), CHANGELOG.md, at latest release
**`0.4.0`** (working tree `0.5.0-SNAPSHOT`). Every coordinate, version row and configuration
key is copied from that tree, not written from memory. The version pinned in copy is
`0.4.0`.

The never-invent list in PRODUCT.md governs every file: no adoption numbers, no benchmarks,
no testimonials, no exactly-once claim, no invented roadmap, and nothing implying the
library protects downstream side effects.

### `/docs` - 24 pages

Files land under `src/content/docs/` following docs/SITEMAP.md exactly: 4 in
`GETTING STARTED`, 6 under `concepts/`, 5 in `USING IT`, 5 under `storage/`, 4 under
`reference/`, 4 under `operating/`. The existing `index.md` is rewritten as the docs landing
card.

Two mechanical changes support them:

- **Frontmatter carries `sourceOf`** - the README section each page derives from, per D4's
  mitigation. Starlight's schema is extended in `src/content.config.ts` with
  `docsSchema({ extend: z.object({ sourceOf: z.string().optional() }) })`. The field is
  optional because four pages have no README source. This is the input the parity script
  reads.
- **The sidebar gets its six named groups** in `astro.config.ts`, in the SITEMAP order, and
  the comment deferring this to phase 7 is removed. Order is content, not styling; the
  labels' monospace uppercase treatment remains phase 7.

Diagram assignment: `record-lifecycle` on `/docs/concepts/record-lifecycle`,
`request-outcomes` on `/docs/http-endpoints`, both with the README's `alt` text verbatim.
The assets themselves are placed in phase 7; phase 4 records the assignment in each page's
frontmatter and in docs/CONTENT.md.

### `/learn` - 3 articles

A second collection, `src/content/learn/`, MDX, with its own schema (title, description,
question, publish order). The custom layout is phase 7; phase 4 writes the content and the
collection definition so the files validate and build.

The Docs/Learn rule is the acceptance test for each: strip every mention of idempotency4j
and the article must still be worth reading. At most one link to `/docs`, at the end.

### Homepage - `docs/COPY-HOME.md`

Eight sections, one per feeling-curve row in DESIGN.md. Each records: eyebrow, heading,
body, any captions, the asset it needs, and its links. Section 2's captions are the
signature scene's OFF and ON frames and must read as neutral narration - the diagram makes
the point, the caption does not make it again.

### README-parity check - specified, not built

Phase 4 owes D4's script as a written spec at `docs/specs/readme-parity-check.md`; phase 7
wires it into the build. The spec fixes what is checked (every `<version>`, the Java and Boot
version rows, the configuration key list), what is deliberately not checked (prose), how the
two trees are located given they are separate repos, and how it fails.

## Delivery plan

Four commits, each independently landable with a green `npm run build`.

1. **`docs: draft the reference pages`** - 24 files under `src/content/docs/`, the schema
   extension, the sidebar groups. Landable alone: the pages render and are navigable.
2. **`docs: draft the homepage copy`** - `docs/COPY-HOME.md`. Purely additive, touches no
   source.
3. **`docs: write the three learn articles`** - the `learn` collection and three MDX files.
   Landable alone: the collection validates; routes arrive in phase 7.
4. **`docs: spec the readme-parity check`** - `docs/specs/readme-parity-check.md`. Purely
   additive.

Review checkpoint with the owner after each.

## Out of scope

- Any styling, component, layout or motion work - phases 6a, 7 and 8.
- Building the parity script. Phase 4 specifies it; phase 7 builds and wires it.
- The `/learn` route and layout, and the homepage components. Phase 7.
- Placing the diagram assets. Phase 4 assigns them; phase 7 places them.
- Backlog Learn articles. Three at launch, per SITEMAP.
- `/llms.txt`, robots, sitemap, 404, OG images - phase 7 routes.
- Editing the library repo. This repo does not write to `~/Private/idempotency4j`.

## Success criteria

- Every page in docs/SITEMAP.md exists with real copy. No lorem ipsum, no placeholders, no
  TODO markers.
- `npm run build` is green after each of the four commits, and `npm run preview` resolves
  every internal link under the `/idempotency4j-docs` prefix.
- Every `/docs` page carries `sourceOf` or is one of the four with no README source.
- Every version number, coordinate and configuration key in the copy matches the library at
  `0.4.0`.
- No copy violates the never-invent list, and none of the banned voice words appear
  ("simply", "just", "easily", "seamlessly", "powerful", "robust", "elegant", "modern").
- Each Learn article survives the strip-the-library test.
- Every diagram named in SITEMAP is assigned to a page.

## The gate phase 4 cannot close by itself

**One outside reader before copy is locked** - the own-site substitute for the client content
gate. A Java or Spring engineer who is not the owner reads the homepage, `/docs/quickstart`
and `/docs/operating/limitations`, and answers three questions: what does this do, would you
add it to a build file, and what did you not believe. This needs a person; the owner
arranges it. Phase 4 is not done until it happens, and the reading package is prepared as
part of commit 4.

**Outcome: waived by the owner on 2026-09-17 without being run.** See the deviation below.

---

## Deviations

Recorded after implementation, per docs/specs convention.

### The docs pages gained structure the spec did not ask for

The spec treated `/docs` as prose, and the first pass delivered exactly that: twenty-nine
pages of paragraphs, code fences and ten tables, with no asides, tabs, steps or cards
anywhere, and two diagrams across the whole section.

That is a phase 4 defect rather than a phase 7 one. Phase 7's contract is to build without
writing a word, and restyling cannot introduce structure the content layer never asked for -
a wall of text restyled is a wall of text. Whether a sequence is a numbered sequence, whether
two coordinates are a choice between tabs, and whether a caveat is a callout are content
decisions.

So phase 4 also delivers:

- **Asides** on the traps that were previously prose - roughly one or two per page, with
  `danger` reserved for the three that lose data silently (`auto` not falling back to
  in-memory, Redis without `maxmemory-policy noeviction`, and returning an error status
  rather than throwing). The budget is deliberate: the docs own blue, green, amber and red
  for note / tip / caution / danger (DECISIONS.md D16), and used freely they become a colour
  field that means nothing.
- **Steps** for the three real sequences: the quickstart, the Redis three-bean setup, and
  implementing a store against the contract.
- **Tabs** for genuinely exclusive choices: Maven / Maven+BOM / Gradle, the three databases,
  and YAML / properties. Synced across pages by key, so a Gradle reader stays a Gradle
  reader.
- **Cards** on the docs landing page and on `storage/choosing`, so the entry points are
  doors rather than a bulleted list.
- **A symptom index** on `troubleshooting` and a "does this rule the library out for you"
  table on `limitations` - the two pages most likely to be read under time pressure.
- **Three more diagrams assigned**, recorded in docs/CONTENT.md and constrained by the
  `diagram` enum in `src/content.config.ts`. Phase 7 still draws them.

Seven pages became `.mdx` because Starlight's Steps, Tabs and Card components are Astro
components. This added no dependency: `@astrojs/mdx` is already a Starlight dependency and
Starlight registers the integration itself. Asides need no MDX - Starlight turns on directive
support in the Sätteri processor, so `:::caution` works in plain Markdown.

No icons. Starlight ships about twenty generic ones, and mapping six sidebar groups onto them
would be decoration rather than signal, which DESIGN.md's refuse list rules out.

### A link checker, because components made the old guarantee false

`src/plugins/base-links.mjs` resolves Markdown links against `base`, but it is an mdast
plugin and only sees mdast `link` nodes. An `href` passed as a prop - `<LinkCard
href="/docs/quickstart/">` - never reaches it, and the first card written shipped
unprefixed: correct in dev, 404 in production, which is the failure CLAUDE.md rule 1 names as
the worst shape available.

Component props now go through `href()` from `src/consts.ts`, and `scripts/check-links.mjs`
fails on any internal URL that is unprefixed, resolves to nothing, or names a fragment the
target page does not have. The third check exists because this phase added hand-written
anchors to generated heading ids, which go stale silently when a heading is reworded.

Run with `npm run check:links` after a build. Phase 7 wires it into CI alongside the
README-parity check.

### A second standing build warning

Each `.mdx` content file now produces a Rollup advisory:

```
[MODULE_LEVEL_DIRECTIVE] The semantics of the module level directive
"use astro:head-inject" in "src/content/docs/<page>.mdx?astroPropagatedAssets"
may not be preserved when bundling.
```

The directive is injected by Astro core - `astro/dist/content/vite-plugin-content-assets.js`
- and stripped by it again; nothing in `src/` writes it. Silencing it would mean registering
`@astrojs/mdx` here without Starlight's `optimize: true`, which trades a real build
optimisation for a cosmetic warning. Recorded rather than fixed, alongside the phase 3
`i18n` collection warning in `docs/specs/phase-3-workspace.md`.

### The parity check cannot be the two-way diff the spec implied

The spec put `sourceOf` in every page's frontmatter as "the input the parity script reads",
which reads as a comparison of each page against its README section. By the time the docs
were written that was no longer buildable, and the reason is the phase working as intended:
the site now asserts a great deal the README does not. The troubleshooting page is derived
from library source and has no README counterpart at all, and three pages have no `sourceOf`
rather than the four the spec anticipated.

So [readme-parity-check.md](readme-parity-check.md) specifies a one-way, fact-by-fact check
that tolerates the site being a superset, and `sourceOf` stays as provenance for a human
rather than as a script's input. The spec also proposes a `LIBRARY_VERSION` constant in
`src/consts.ts`: the version is pinned in fourteen places inside code fences a reader copies
verbatim, so it cannot be templated, and the same shape that solved `base` applies - write it
down once and let a check enforce the literals.

### The outside-reader gate was waived, not run

A reading package was prepared as commit 4 specified: the qualifying criteria for the reader,
the three questions with what a pass and a failure look like for each, and a findings table.
The owner closed the gate on 2026-09-17 without running it and removed the package as
redundant.

Recorded here because the gate was the own-site substitute for the playbook's client content
gate, and waiving it is a decision rather than an omission. What it would have caught is copy
that is mechanically correct and does not land: every other phase 4 check is automated, and
none of them can tell whether a Java engineer who has never seen this library reads the
homepage and decides. The first outside reader is now a visitor.

One limitation the package named, which stands regardless: the homepage is not a page until
phase 7, so the reader would have read `docs/COPY-HOME.md`. That tests the claims and their
order and cannot test whether the hero lands. Phase 7 and 8 own that question, and it is still
open.
