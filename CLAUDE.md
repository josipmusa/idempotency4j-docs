# idempotency4j-docs

The documentation and articles site for idempotency4j, the Java library for making HTTP and message handlers safely repeatable.

Stack: Astro, static output, deployed to GitHub Pages on the project subpath (no custom domain; the base path is a build constraint). Motion (if any) with GSAP + ScrollTrigger + Lenis, or three.js for 3D, as decided in MOTION.md.

## How we work on this site

This project follows `FRAMEWORK.md` (Website Build Framework v2). Read it once at the start of every session; it is short.

1. **Find the phase.** Read `DECISIONS.md`. The last "phase N done" line tells you where we are. If the file has only "brief agreed" or is empty, we are in Phase 0.
2. **Announce before acting.** At the start of every phase, read the files earlier phases produced, then say in three lines: what you are about to produce, what Boss will be asked to do, and which checklist he will run. Wait for "go".
3. **One output per phase.** Each phase owns exactly one file (see the table in FRAMEWORK.md, "Rules that hold everywhere"). Produce that file, nothing else.
4. **Never edit an earlier phase's file silently.** If a later phase needs to change `BRIEF.md`, `LOOK.md`, `SITEMAP.md` or `CONTENT.md`, say so out loud, make the change, and add a line to `DECISIONS.md` with a one-sentence why.
5. **Never invent.** Prices, years, names, certifications, counts of anything come from the client's material or go into `QUESTIONS.md`. Never a plausible guess.
6. **Boss judges fit, not craft.** Do not ask him to evaluate spacing, type scale, contrast, breakpoints, code, SEO or performance. Check those yourself with tools and report. Ask him only the questions his checklist for the current phase says he answers.
7. **Renders, not descriptions.** When Boss has to pick, show rendered options with the same real content, three at most. Never describe options in words and ask him to choose.
8. **Phase done = output exists + Boss ran the checklist.** When he says the checklist passed, append "YYYY-MM-DD, phase N done" to `DECISIONS.md`.

## Source of truth

- `LOOK.md` is the only source of colour and type tokens. When the Claude Design handoff bundle arrives in Phase 5, its tokens are mapped onto LOOK.md's, not the other way around.
- `CONTENT.md` is the only source of words. Pages are assembled from it; text baked into the handoff bundle is replaced.
- `MOTION.md` is the only source of motion. Nothing animates that is not listed there.

## Repo layout

```
FRAMEWORK.md     the process (read-only, copy of the doc)
CLAUDE.md        this file
DECISIONS.md     one line per pick, running log, phase markers
BRIEF.md         phase 0
LOOK.md          phase 1
SITEMAP.md       phase 2
CONTENT.md       phase 3
QUESTIONS.md     phase 3, only if something on the never-invent list is missing
MOTION.md        phase 3b, only for Expressive / Showpiece
BUILD-DIFF.md    phase 5
HANDOVER.md      phase 6
NOTES.md         Boss's notes on the framework itself, not on the site
assets/          web-sized images, named by section
spikes/          phase 3b throwaway motion spikes, one self-contained HTML file each
```

## Carried over from the previous build

Everything from the earlier Astro/Starlight build was deleted except the prose, which sits
unchanged at `src/content/docs/` (reference documentation) and `src/content/learn/`
(articles). It is real, fact-checked content and is the starting material for Phase 3, not
a finished output. Several `.mdx` files still import Starlight components
(`@astrojs/starlight/components`) and a `href` helper from a deleted `src/consts.ts`; those
imports resolve to nothing today and must be reworked when Phase 5 scaffolds the site.

The library itself lives at `~/Private/idempotency4j`. This repo does not depend on it at
build time.

Astro lives in the usual places (`src/`, `public/`, `astro.config.mjs`) once Phase 5 scaffolds it. Run the dev server on an explicit port (`npm run dev -- --port 4399 --host 127.0.0.1`) and use the URL Astro prints.
