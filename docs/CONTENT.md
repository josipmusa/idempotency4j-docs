# Content

The authority for what goes on the site and where every asset lives. Do not reselect from
raw materials without updating this document.

Phase 2 is unusually light here: the site needs no photography, no video and no generated
imagery, so there is no gap plan to write. What exists instead is a copy source and a
diagram language.

## Materials location

**Raw source:** `~/Private/idempotency4j` (the library repo, outside this repo).

Nothing is imported at build time - the site does not couple to the library repo. Assets are
**copied in once**, and the table below records the provenance so a copy can be refreshed
deliberately after a library release.

**Working copies:** `src/assets/` for SVG, `public/` for favicon and social images.

**Web derivatives:** the only raster outputs are the favicon set and the Open Graph images,
both generated from SVG by a script in `scripts/`. No image pipeline is needed because there
are no photographs.

## Brand assets

| Asset | Source | Use |
|---|---|---|
| Wordmark + mark, light | `docs/logo.svg` | light theme navigation, footer |
| Wordmark + mark, dark | `docs/logo-dark.svg` | dark theme navigation (the default), footer |
| Mark alone | to be extracted from the logo SVG (the two-chevron group, viewBox cropped) | favicon, Open Graph, `apple-touch-icon` |

**The mark** is two identical chevrons - a request and its retry - running into a single stop
bar. **The geometry is the asset; the colours are not.** The library's files use
`#2d3142` strokes with an `#eb6c36` stop bar, which came from the design-diagram skill's
stock palette rather than from a brand decision (DECISIONS.md D16). The site re-colours
the mark to its own tokens:

| Element | Light | Dark |
|---|---|---|
| chevron strokes, wordmark fill | `--text-hi` `#0d1117` | `--text-hi` `#f2f5f9` |
| stop bar | `--signal` `#0d7373` | `--signal` `#3ddbd9` |

**This requires a commit in the library repo** to keep the README and the site in
agreement: four fill and stroke values across `docs/logo.svg` and `docs/logo-dark.svg`.
The outlined wordmark paths and the viewBox are untouched, so nothing is regenerated and
no `BRANDING.md` is needed. Until that lands, the README and the site disagree on the
mark's colour - a known, accepted, temporary drift.

**The wordmark** is Inter SemiBold 22 at `-0.4` tracking, converted to outlines so it renders
identically everywhere. **Do not re-set it as live text**, and do not scale it below 24px
tall.

**Referenced but missing:** both logo files cite `docs/BRANDING.md` for regeneration
instructions. That file does not exist in the library repo. The logo SVGs are the authority;
the missing file is cosmetic and logged in [DECISIONS.md](DECISIONS.md).

## Palette

**Designed for this site, not inherited.** Full token table, roles, contrast table and the
one-accent rule in DESIGN.md. Provenance and the rejected alternatives in DECISIONS.md D16.

| | Light | Dark |
|---|---|---|
| ground / surfaces | `#f7f8fa` `#eef0f4` `#e4e7ed` | `#0a0c11` `#10131a` `#171b24` |
| lines | `#d3d8e0` `#7f8998` | `#242a36` `#566275` |
| text | `#5c6675` `#2a3038` `#0d1117` | `#7c8798` `#c3cad6` `#f2f5f9` |
| accent | `#0d7373` | `#3ddbd9` |

Nothing here is copied from the library. The earlier plan - adopt the library's five
colours and make the site's light theme the light diagram palette exactly - was dropped
once it became clear those colours were stock skill output. See the cost this incurs in
the diagram section directly below.

## Diagrams

### Existing, drop in unmodified

| Diagram | Files | Placement |
|---|---|---|
| **Record lifecycle** state machine - absent → `IN_PROGRESS` → `COMPLETE` → purged, with the release edge, the heartbeat, and lease stealing | `docs/diagrams/record-lifecycle{,-dark}.{html,svg,png}` | `/docs/concepts/record-lifecycle` |
| **Request outcomes** flowchart - the four paths a keyed HTTP request resolves down | `docs/diagrams/request-outcomes{,-dark}.{html,svg,png}` | `/docs/http-endpoints` |

Both ship as light/dark SVG pairs with full, genuinely descriptive `alt` text already
written in the README's `<picture>` elements. **Reuse that alt text verbatim** - it is better
than anything that would be rewritten for the site.

**They need re-colouring, and this is a real cost.** The earlier palette plan made these
drop in untouched; deriving the palette fresh spent that saving. Two light/dark pairs must
be brought onto the site's tokens before they are placed:

- ground to `--ink-1`, structure to `--rule-hi`, labels to `--dim`, text to `--text`
- the accent only where the mark is the idempotent path, per the one-accent rule; in the
  lifecycle diagram that is `COMPLETE` and the replay edge, and nothing else
- re-authored as **one** SVG per diagram driven by custom properties, not as a light and a
  dark file, so the pair cannot drift

Re-authoring beats recolouring here: the originals are skill output with hardcoded fills,
and a single token-driven SVG is what every new diagram on the site will be anyway.

### To be drawn for this site

All hand-authored SVG, in the existing diagrams' language: 1px strokes, no fill except
`--signal` on the idempotent path, mono labels, no shading, no gradients, no emoji, no
rounded corners beyond 2px. Each must be legible as a single still frame (MOTION.md
principle 10).

| Diagram | Placement | Notes |
|---|---|---|
| **Two charges, or one** | home §2, the signature | Two frames, one SVG, switch-driven. Full spec in MOTION.md. Its ON frame is also the homepage Open Graph image. |
| **Execution model** - Request → Acquire → Execute → Store → Replay | home §3 | Five stages. Static. |
| **Four layers** - Engine / Spring / HTTP / Store, with what each owns | home §4 | Static. May merge with the above per the DESIGN.md adjacency check. |

## Copy source

`README.md` in the library repo - roughly 700 lines of finished reference prose in exactly
the voice PRODUCT.md specifies. It is the raw source for most of `/docs`, mapped page by page
in [SITEMAP.md](SITEMAP.md).

**It is a source, not a paste.** Restructuring is the point of having a docs site: the README
is one linear document, and the site splits it into pages that can be landed on directly and
adds the navigation, cross-links and diagram placement a README cannot hold.

Other sources: `CHANGELOG.md` (for `/docs/operating/upgrading`), `SECURITY.md`,
`CONTRIBUTING.md`, `LICENSE`, `NOTICE` (footer), and the `pom.xml` files (module names and
the current version).

**Version-sensitive content** - the support matrix, every dependency coordinate, and the
configuration reference - is copied from the library at a named version and never written
from memory. Current: `0.4.0` released, `0.5.0-SNAPSHOT` in development.

**The three Learn articles do not exist yet** and are original writing, not derived from the
README. Titles, questions and target queries are fixed in SITEMAP.md; drafting is phase 4.

## Rights

Everything is the site owner's own work. The library is Apache 2.0 and the footer says so.
No third-party assets, no licensed fonts, no stock, no credits owed.

Typefaces must be open-licensed and self-hosted (DESIGN.md OPEN section). Licensed faces seen
on the reference sites - Suisse Intl, Circular, WhyteMono, Berkeley Mono - are ruled out.

## Gaps and imagery policy

**Imagery policy: no photography, no stock, no AI-generated imagery, no rendered 3D.**

Not a budget decision. Every visual on this site encodes real library behaviour, so there is
nothing for a photograph or a generated image to do. This closes the phase-2 gap plan
entirely and is why a "thin" materials level is not a problem for this project.

The one thing that would normally be a gap - a hero image - is filled by the signature
diagram, which is content rather than decoration.

## Signature moment

**Chosen:** *Two charges, or one.* Full specification in MOTION.md; placement and rationale
in DESIGN.md.

**Feasibility test:** build both static frames as a single SVG pair at 1440 and 390 before
writing any motion. Gate: each frame is comprehensible on its own with no caption beyond its
mono labels, and the 390 version is legible without zooming.
**Status: run 2026-09-17, passed.** Both frames built in `spikes/signature.html`, captured at
1440 / 768 / 390 in both themes. The interactive version proceeds; the fallback below stays
as the reduced-motion state and the Open Graph source. Findings for phase 6a are in
`docs/specs/phase-2-signature-feasibility.md`.

**Fallback:** a static side-by-side two-panel figure, OFF left and ON right, captioned. The
fallback is also the reduced-motion state and the Open Graph source, so it gets built first
regardless of whether the interactive version proceeds.

## Reference captures

`docs/refs/*.png` - eight captures of the seven reference sites at 1440, taken 2026-09-17,
with per-reference notes in [DESIGN-CANDIDATES.md](DESIGN-CANDIDATES.md). They are working
material for phase 6a comparison of design *language*. The adjacency check against
`inngest-hero.png` is retired: it existed because the inherited coral accent sat close to
Inngest's, and the palette no longer does (DECISIONS.md D16). **They are never published
and must be excluded from the build.**

## Exclusions

| Material | Why not used |
|---|---|
| `docs/social-preview.png` and its HTML source | The site generates its own Open Graph images from the signature frame; the library's is sized and composed for GitHub's card. |
| README badges (Maven Central, CI, Javadoc, Java 21+, licence) | Badge strips belong on a README. The site states the same facts as designed elements - a live star count in the nav, the support matrix on `/docs/requirements`, the licence in the footer. |
| The library's colour palette, in whole or in part | Stock design-diagram skill output, not a brand. Only the mark's geometry is carried over (DECISIONS.md D16). |
| Emoji used in the owner's homepage sketch (`💳`, `💥`) | Refuse-list item in DESIGN.md. The existing diagram set uses none; a charge is drawn as a labelled object. |
