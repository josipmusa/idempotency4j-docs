# idempotency4j

The main website for idempotency4j, the idempotency engine for Java. Supersedes the earlier `idempotency4j-docs` attempt; its docs/learn content may be worth reusing but its site design and structure should not be.

Stack: Astro (static output), Github Pages with no custom domain for hosting. GSAP + ScrollTrigger + Lenis for scroll work, three.js for 3D, Astro View Transitions for page transitions. Skills: the taste and animation skills from `skills-lock.json` (installed in `.claude/skills/`) and Impeccable; `img2threejs` when a hero object has to come from a photo.

## When Boss says "let's start", "continue", "status" or "where are we"

Follow `web/RUNBOOK.md` exactly: locate the stage from the last marker in `DECISIONS.md`, read the files that stage needs, announce in three lines what you will produce and what Boss will be asked, wait for "go", run the step, write its marker, say what comes next. Boss never pastes prompts; the runbook is the prompt.

## How we work on this site

The process is `web/FRAMEWORK.md`. Read it at the start of every session, then `web/ANATOMIES.md`, `web/MOMENTS.md` and `web/INTERVIEW.md` as the stage needs them.

1. **Find the stage.** `DECISIONS.md`, last marker (see `web/RUNBOOK.md` for the marker list). Empty file = Stage 1, the interview.
2. **Announce, then wait.** Read what exists, say in three lines what you will produce and what Boss will be asked, wait for "go".
3. **Follow the anatomy.** Section order and sub-pages come from `web/ANATOMIES.md` for the type chosen in `SITE.md`. Deviate only with a line in `DECISIONS.md`.
4. **One or two moments, one motion language.** From `PLAN.md`, chosen per `web/MOMENTS.md`. Never add motion that is not in the plan.
5. **Renders, not descriptions.** When Boss must choose, give him URLs he can open on his phone. Three options at most.
6. **Boss judges fit, not craft.** Never ask him about spacing, type scale, contrast, breakpoints, code, SEO or performance. Check those yourself (Impeccable, review-animations, Lighthouse) and report.
7. **Never invent.** Prices, years, names, counts, certifications come from the client's material or go into `QUESTIONS.md`. Mocked copy in Stage 2 is marked `[mock]` and removed in Stage 3.
8. **Mobile first-class.** Every render is checked at 390 px before Boss sees it. Cursor moments off on touch; 3D degraded; sequences lightened; `prefers-reduced-motion` gets a real static frame.
9. **Log picks.** One line per decision in `DECISIONS.md` with a one-sentence why. No silent edits to `SITE.md` or `PLAN.md`.

## Files

```
web/            the kit (framework, runbook, anatomies, moments, interview) — read-only
SITE.md         Stage 1: the facts about this site
PLAN.md         Stage 1: the agent's conclusions, confirmed by Boss
DECISIONS.md    running log + stage markers
QUESTIONS.md    only when something on the never-invent list is missing
HANDOVER.md     Stage 3, for the client
content/        one Markdown file per page, the only source of words
assets/         web-sized images, named by section
src/pages/approaches/{a,b,c}.astro   Stage 2 candidates; losers deleted in Stage 3
```

Dev server on an explicit port: `npm run dev -- --port 4399 --host 127.0.0.1`, use the URL Astro prints. Expose it to the phone with `--host 0.0.0.0` when Boss needs to open it.

## Stage 2 build notes

- Three routes, same anatomy, same content, same section order. Different palette, type pairing, imagery treatment, spacing density, and the moment + background combo assigned in `PLAN.md`.
- Moments are real, not notes. A light version is acceptable (fewer frames, simpler shader); a placeholder box saying "animation here" is not.
- Shared components (nav, footer, section shells) live in `src/components/`; per-approach tokens live in one CSS file each so the winner's tokens become the site's tokens in Stage 3.
- Run Impeccable's checks and `review-animations` on all three before showing Boss. Report added KB, throttled-phone frame rate and first meaningful frame per approach.

## Stage 3 build notes

- Promote the winner: its tokens to `src/styles/tokens.css`, its route to `/`, delete the other two.
- Sub-pages from the anatomy's default set, in `content/<page>.md` first, then the page. Reveal language everywhere, at most one lighter moment per sub-page.
- Replace every `[mock]`; missing facts go to `QUESTIONS.md`.
- Honesty pass: AVIF/WebP sized and lazy, fonts subset and preloaded, metadata + OG image, heading order, alt text, focus states, contrast, Lighthouse > 90 all categories, zero console errors.
- Deploy to Cloudflare Pages, connect the domain, redirects, legal footer, `HANDOVER.md` in the client's language.
