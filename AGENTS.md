# idempotency4j-docs

The central home for idempotency4j - its documentation, its articles, and the case for using
it. Astro, static output, Starlight at `/docs`, deployed to GitHub Pages. No animation
library; motion per MOTION.md.

Built with the website playbook (`web:*` skills). The playbook's phases, gates and defaults
apply; ROADMAP.md tracks where this project is.

> **The library itself lives at `~/Private/idempotency4j`.** This repo does not depend on it
> at build time. Assets and reference prose are copied in deliberately, with provenance
> recorded in docs/CONTENT.md.

## Document authorities

- **BRIEF.md** - intake answers, the three switches, constraints. Read first.
- **ROADMAP.md** - phases, gates and status. Use it for context when pointed at a phase; do
  not choose the next phase, enforce gates, or update its checklist unless asked.
- **PRODUCT.md** - audience, the site's one job, positioning, voice, the never-invent list.
  Authority for all copy.
- **DESIGN.md** - the visual brief. DRAFT with LOCKED and OPEN sections until phase 6b closes
  it as FINAL; never treat it as final before then.
- **MOTION.md** - the motion authority. All animation follows it, including its refuse list.
- **docs/SITEMAP.md** - the information architecture. Authority for what page exists, where,
  and which README section it derives from.
- **docs/CONTENT.md** - authority for assets, diagrams, the palette's provenance and the
  imagery policy. Do not reselect from the library repo without updating it.
- **docs/DECISIONS.md** - why things are the way they are, and what was rejected. **Read this
  before proposing a change to structure, hosting, stack or scope.** Most reversals have
  already been considered and costed.
- **docs/DESIGN-CANDIDATES.md** - the candidate languages and reference shortlist.
- **docs/specs/** - one short spec per build task, with deviations recorded after
  implementation.

## The four rules most easily broken

1. **`base` is never hardcoded.** The site serves from a subpath
   (`/idempotency4j-docs`). Every internal link and asset URL resolves through one exported
   constant. A hardcoded `/docs/quickstart` will 404 in production and work perfectly in
   dev, which is the worst failure shape available. See [Base URL](#base-url).
2. **One accent, one meaning.** `--signal` marks the idempotent path - the replayed result,
   the guarded boundary, the stored record - and nothing else. Not hover, not headings, not
   links, not focus rings. This is the design's load-bearing rule (DESIGN.md).
   Two corollaries that get broken first: **never a second accent** (use luminance, weight,
   fill-versus-outline or position instead), and **the accent is never a status hue** -
   the docs own blue, green, amber and red for note / tip / caution / danger, which is why
   the accent is cyan-teal (docs/DECISIONS.md D16).
3. **Never invent a fact about the library.** No download counts, no adoption claims, no
   benchmarks, no users, no Kafka module (docs/DECISIONS.md C1), no claim of exactly-once.
   Version numbers and support matrices are copied from the library at a named version, never
   written from memory. Full list in PRODUCT.md.
4. **Every diagram must be legible as one still frame.** Reduced motion, the Open Graph
   image and a printed page all consume the still. Design the settled frame first.

## Base URL

```js
// src/consts.ts
export const BASE = '/idempotency4j-docs';   // '' once a custom domain exists
```

- `astro.config.mjs` sets `site` and `base` from it.
- Internal links use Astro's `import.meta.env.BASE_URL` (or a `href()` helper wrapping it),
  never a bare absolute path.
- Assets imported through Astro (`import logo from '../assets/logo.svg'`) are rewritten
  automatically. Anything referenced as a string in `public/` is not, and must go through the
  helper.
- **Verify after every build**, not after launch: every internal link and asset resolves
  under the prefix. This is the single most likely launch defect (docs/DECISIONS.md D5).

## Conventions

- **Structure.** `src/pages/index.astro` and `src/pages/learn/` are hand-built.
  `src/content/docs/` is Starlight. Homepage sections are one component each in
  `src/components/home/`, named for the feeling-curve row they serve.
- **Motion** lives in `src/motion/`. Global setup once; one module per concern. Animate
  transform and opacity only. Every animation sits inside a reduced-motion branch.
  `stroke-dashoffset` is permitted in the signature scene's SVG and nowhere else.
- **No animation library.** CSS scroll-driven animations behind `@supports` for reveals,
  hand-written JS for the signature scene, CSS transitions for feedback. Do not add Motion,
  GSAP, anime.js or Lenis (docs/DECISIONS.md D13).
- **No third-party scripts, no analytics, no fonts from a CDN.** Typefaces are
  open-licensed, self-hosted and subset. Zero third-party requests is a verified property
  (docs/DECISIONS.md D15).
- **Spacing** uses only the eleven steps in DESIGN.md. No arbitrary values.
- **Diagrams** are hand-authored inline SVG in the existing diagrams' language: 1px strokes,
  no fill except `--signal` on the idempotent path, mono labels, no shading, no gradients, no
  emoji, no rounded corners beyond 2px. One SVG for both themes via `currentColor` and custom
  properties.
- **Content** is Markdown and MDX collections in `src/content/`. No CMS.
- **Starlight is restyled, not themed.** Overrides live in one place and are reviewed at all
  three viewports. A default-looking `/docs` against a designed `/` is a refuse-list failure.
- **Spikes** live in `spikes/` as standalone HTML: no build step, never imported. Dead after
  phase 6b.
- **Dev-only variant routes** live under `src/pages/_variants/` and never ship.
- **`docs/refs/*.png` are never published.** Exclude them from the build.
- **Real content only, everywhere.** No lorem ipsum, no placeholder code, no stand-in
  diagrams, no invented facts.

## Verification

- Run the dev server on an explicit port (`npm run dev -- --port 4399 --host 127.0.0.1`) and
  pass the URL Astro prints; Astro silently bumps the port when another checkout holds it.
- After any visual change, start or reuse the local dev server and invoke the
  `design-reviewer` agent in a fresh, self-contained context. Give it only the local URL,
  the changed routes and the changed source files - never the builder's rationale or
  conclusions.
- Treat its rendered evidence as the review authority. Fix all in-scope P0 and P1 findings
  and material P2 findings, then invoke it once more if those fixes changed rendered output.
  Stop after two review passes per task; if a P0 or P1 remains, report it instead of looping
  or weakening the rubric.
- The reviewer is read-only. The main agent owns fixes. Easing and timing feel, and
  real-device performance, remain human review items.
- **Review `/docs` and `/learn` as seriously as `/`.** The docs are where this site is
  actually used.

## Build and deploy

```bash
npm run dev -- --port 4399 --host 127.0.0.1
npm run build          # static output to dist/
npm run preview        # serves dist/ with the base prefix applied
```

Deployment is GitHub Actions on push to `main`, using `actions/deploy-pages` and
`GITHUB_TOKEN` only. No secrets, no PAT, no cross-repo push (docs/DECISIONS.md D5).

**Always check a change with `npm run preview`, not just `npm run dev`.** The preview server
applies the `base` prefix; the dev server is more forgiving, and base-path bugs only appear
in preview and production.

## Agent tooling

Third-party skills and the Impeccable engine are installed, not committed - together they
are ~12MB across three duplicated trees, most of it a platform-specific binary and a font
index. `skills-lock.json` pins the first set. On a fresh clone:

```bash
npx --yes skills experimental_install -y     # reads skills-lock.json -> .agents/skills/
npx --yes impeccable install --project -y    # .claude, .agents, .github
```

`npx skills` installs into `.agents/skills/`; symlink each one into `.claude/skills/` so
Claude Code discovers it. `.claude/agents/design-reviewer.md` comes from the playbook
template and *is* committed.

## Astro notes

From the Astro scaffold, kept verbatim.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
