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
