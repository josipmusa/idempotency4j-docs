# Runbook (for the agent)

How to run each stage when Boss says "let's start", "start", "continue", "where are we" or "status". Boss never has to paste a prompt; this file is the prompt.

## 0. Locate

1. Read `DECISIONS.md`. Find the last marker line. Markers, in order:
   - *(none)* → Stage 1, interview not started
   - `interview done` → Stage 1, PLAN.md awaiting confirmation
   - `stage 1 done` → Stage 2, approaches not built
   - `approaches built` → Stage 2, awaiting Boss's pick
   - `stage 2 done` → Stage 3, promote + sharpen
   - `sharpen done` → Stage 3, sub-pages
   - `sub-pages done` → Stage 3, real content
   - `content done` → Stage 3, motion polish + honesty pass
   - `honesty done` → Stage 3, ship
   - `stage 3 done` → finished; only maintenance
2. Read the files that stage needs (listed per stage below). Never re-ask what they already answer.
3. On "status" or "where are we": report the marker, the next step in one line, and what Boss will be asked. Stop.
4. Otherwise announce in three lines — what you will produce, what Boss will be asked, which checks he runs — and wait for "go". Then run the step, write its marker when finished, and say in one line what comes next.

If `DECISIONS.md` is missing, create it from `template/DECISIONS.md` shape and start Stage 1.

## Stage 1 — Interview

Reads: `web/FRAMEWORK.md`, `web/INTERVIEW.md`, `web/ANATOMIES.md`, `web/MOMENTS.md`, `SITE.md`, `PLAN.md`, any client material Boss points at (ask once for its location if none is obvious).

1. Read the client material first. Draft the parts of `SITE.md` it answers.
2. Run the seven rounds of `web/INTERVIEW.md` one at a time. AskUserQuestion for closed choices, plain questions for open ones. Confirm what you already know instead of asking. Push back once on vague words.
3. Fetch every reference site named; record principles, not features.
4. Write `SITE.md` as you go, reading each section back in two or three lines.
5. After round 7 write `PLAN.md`: three look directions, the moments shortlist and background shortlist derived with the heuristics table in `web/MOMENTS.md`, the A/B/C assignment, real vs mocked, asset production to start now, a proposed motion language.
6. Write `interview done` to `DECISIONS.md`. Ask Boss: "Confirm the plan, or tell me what to swap." Apply one round of changes, log each swap with its why, then write `stage 1 done`.
7. If asset production must start (a photo for `img2threejs`, a render, a shoot), say so now with owner and date; it runs in parallel with Stage 2.

## Stage 2 — Three approaches

Reads: `web/FRAMEWORK.md`, `CLAUDE.md`, `SITE.md`, `PLAN.md`, `web/ANATOMIES.md`, `web/MOMENTS.md`.

1. If Astro is not scaffolded: `npm create astro@latest -- ./_scaffold --template minimal --no-install --git --skip-houston --yes`, merge `_scaffold/` into the project without overwriting existing files, `devToolbar: { enabled: false }`, install deps. Install the skills: `npx --yes skills experimental_install -y` (reads `skills-lock.json`; symlink into `.claude/skills/` if not discovered) and `npx --yes impeccable install --project -y` (let its init read `SITE.md` and `PLAN.md`). Report what was installed.
2. Write `content/home.md` following the anatomy's section order, from `SITE.md` and the client material. Mark anything not from the client as `[mock]`; realistic, in the client's voice, never facts from the never-invent list.
3. Build `src/pages/approaches/a.astro`, `b.astro`, `c.astro`: same anatomy, same content, same order. Per approach: its own tokens file (`src/styles/approach-a.css` …), its look per `PLAN.md`, its assigned hero moment, second moment and background implemented for real (light versions allowed, placeholders not). Shared shells in `src/components/`. Use `design-taste-frontend`, `animate`, `animation-vocabulary`.
4. Mobile: check every approach at 390 px. Cursor moments off on touch, 3D degraded, sequences lightened, `prefers-reduced-motion` gives a real static frame. Lenis off on touch.
5. Run Impeccable's checks and `review-animations` on all three. Fix what they flag.
6. Measure per approach: added KB, throttled-phone frame rate, first meaningful frame. Put the numbers in a short table.
7. Start the dev server with `--host 0.0.0.0 --port 4399`, print the three URLs for Boss's phone and the table. Write `approaches built`. Tell Boss: phone first, then desktop, five checks in order, pick one, one line why.
8. When Boss picks: log the pick and the two losers as "rejected because …" in `DECISIONS.md`, write `stage 2 done`.

## Stage 3 — Sharpen and finish

Reads: `web/FRAMEWORK.md`, `CLAUDE.md`, `SITE.md`, `PLAN.md`, `DECISIONS.md`, `web/ANATOMIES.md`.

**Promote and sharpen** (until `sharpen done`)
1. Move the winner's tokens to `src/styles/tokens.css`, its route to `/`, delete the other two approaches and their tokens. Lock the motion language in `PLAN.md` from what the winner actually uses.
2. Ask Boss for the one thing that bothers him most. Fix it, give the URL again. At most three rounds; stop when a round produces nothing. Palette, type and the moments are not reopened. Write `sharpen done`.

**Sub-pages** (until `sub-pages done`)
3. For each page in the anatomy's default set for this type (as recorded in `SITE.md`): `content/<page>.md` first, then the page. Reveal language everywhere; at most one lighter moment per sub-page; nav and footer identical. Write `sub-pages done`.

**Real content** (until `content done`)
4. Replace every `[mock]` from client material. Anything on the never-invent list that is missing goes to `QUESTIONS.md`; tell Boss it is ready to send. Complete all languages. Ask Boss to run the truth check. Write `content done`.

**Motion polish and honesty pass** (until `honesty done`)
5. `review-animations` over the whole site: one easing family, consistent durations, reduced motion respected, every moment has its fallback.
6. Images AVIF/WebP, sized, lazy; fonts subset and preloaded; titles, descriptions, OG image, sitemap, favicon; heading order, alt text, focus states, contrast; Lighthouse above 90 in every category; zero console errors. Report the numbers. Ask Boss to run the phone test. Write `honesty done`.

**Ship** (until `stage 3 done`)
7. Cloudflare Pages, custom domain, redirects from old URLs, legal footer and any AI-imagery disclosure, `HANDOVER.md` in the client's language (how to change text, add a photo, who to call, what it costs). Give Boss the live URL and the one-line message to send the client. When the approval arrives, paste it into `DECISIONS.md` and write `stage 3 done`.

## Always

- Renders, never descriptions, when Boss has to choose. URLs he can open on his phone.
- Never ask Boss to evaluate spacing, type scale, contrast, breakpoints, code, SEO or performance.
- Never invent facts. Never add motion that is not in `PLAN.md`.
- One line in `DECISIONS.md` per pick, with a one-sentence why. No silent edits to `SITE.md` or `PLAN.md`.
- If Boss says something belongs in `NOTES.md` (a confusion, a wasted step), append it there and carry on.
