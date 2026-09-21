# Web kit v3 — the framework

Three stages. The agent drives; Boss answers questions, confirms one plan, picks one of three, and says what bothers him. Everything else is the agent's job. Boss starts or resumes with "let's start" or "continue"; the agent runs `RUNBOOK.md` from the last marker in `DECISIONS.md`.

```
1. Interview  →  SITE.md + PLAN.md  →  Boss confirms PLAN
2. Three approaches (homepage, in code, real look + real moments)  →  Boss picks one
3. Sharpen and finish (sub-pages, real content, mobile, polish, ship)  →  Boss signs off
```

The backbone is a **proven anatomy** per site type (`ANATOMIES.md`). The agent picks the anatomy from the interview and follows it; deviating from it is allowed with one line of reason in `DECISIONS.md`. The thing that makes a site recognizably ours is **one or two special moments and a considered background** (`MOMENTS.md`), chosen by the agent from what the interview reveals, never by asking Boss "what effect do you want".

Building is done with the taste and animation skills in `skills-lock.json` plus Impeccable. Stack: Astro, static, Cloudflare Pages; GSAP + ScrollTrigger + Lenis for scroll work; three.js for 3D; `img2threejs` when a hero object has to come from a photo.

---

## Stage 1. Interview

**Goal.** Know this site well enough that nothing generic can come out of it, and decide the anatomy, sub-pages, look direction, special moments and background before touching code.

**How it runs.** The agent runs `INTERVIEW.md`: seven short rounds, one at a time, asking only what it cannot read from material Boss points at. It fetches every reference site named and writes down principles, not features. Then it writes two files:

- `SITE.md` — the facts: client, customer, one action, business type and chosen anatomy, sub-pages, personality (3 adjectives / 2 never), positioning, references with principles, content and asset inventory (have / missing / from whom), languages, constraints.
- `PLAN.md` — the agent's conclusions: the three look directions it will build (two words + one sentence each), the special-moments shortlist (2–3 candidates with why, where on the page, asset needed, mobile behaviour, fallback), the background shortlist (2 candidates with why), and which approach gets which moment + background combo. Also what will be mocked in Stage 2 and what is real.

**Boss's job.** Answer the interview. Then read `PLAN.md` and confirm or change the shortlist. This is the one place to redirect the agent's taste before code exists: "not the 3D hero, the sequence", "background B is too playful for them". One round, then "go".

**Done when** `SITE.md` has no TBD except items waiting on the client with a name and date, `PLAN.md` is confirmed, and `DECISIONS.md` has its first line.

---

## Stage 2. Three approaches

**Goal.** Three genuinely different homepages, in code, on your phone, each with a real look and real special moments, so the pick is made on the thing itself rather than on a description.

**How it runs.** In the real Astro project, the agent builds `/approaches/a`, `/approaches/b`, `/approaches/c`. All three share the same anatomy, the same section order and the same content (real where it exists, realistic mocked copy marked `[mock]` where it does not). They differ in look (palette, type, imagery treatment, spacing density) and in the moment + background combo from `PLAN.md`. Each approach has a two-word name. Moments are implemented for real, in a light version if needed, not described in a note. Every approach works at 390 px and passes the mobile rules in `MOMENTS.md` (cursor moments off, 3D degraded or static, reduced motion respected). Built with the taste skill, `animate` and `animation-vocabulary`; Impeccable's own checks run before Boss sees anything.

**Boss's job.** Open all three on your phone first, then on desktop. Run the judge checks in order and stop at the first that separates them:

1. **Three-adjective test.** Say aloud which of the brief's adjectives each approach hits. One miss is out.
2. **Five-second test.** Look five seconds, look away: what do they do, what would you tap?
3. **Squint test.** Blur your eyes; the headline and the one action should be what remains, not the effect.
4. **Competitor test.** Would the competitor happily use this as is? Then it is generic.
5. **Second-visit test on the moment.** Scroll it twice. Enjoying it or waiting for it?

Pick one. Say what you feel ("the hero feels cold"), not what to change. Never ask for a merge of two approaches. Write one line in `DECISIONS.md`: which and why.

**Done when** one approach is chosen and its two losers are recorded as "rejected because" in `DECISIONS.md`.

---

## Stage 3. Sharpen and finish

**Goal.** The chosen approach becomes the whole site: sharpened once, all sub-pages, real content, motion polished, fast, accessible, live.

**How it runs.**

1. **Sharpen** (up to three rounds). Boss names the one thing that bothers him most; the agent fixes it; look again. Stop when a round produces nothing. Taste is not reopened; this is finishing, not redesigning.
2. **Sub-pages.** The agent builds every sub-page from the anatomy's defaults for this site type, in the chosen look, with the same motion language. Moments do not repeat on every page; sub-pages get the reveal language and at most one lighter moment.
3. **Real content in.** Every `[mock]` is replaced from client material; anything on the never-invent list (prices, years, names, certifications, counts) that is missing becomes `QUESTIONS.md`, never a guess. Languages complete.
4. **Motion polish.** `review-animations` skill over the whole site; one easing family, durations consistent, reduced motion respected, every moment has its fallback.
5. **Honesty pass.** Images AVIF/WebP sized and lazy, fonts subset, metadata and OG image, heading order, alt text, focus states, contrast, Lighthouse above 90 in every category, zero console errors.
6. **Ship.** Cloudflare Pages, domain, redirects, legal footer, `HANDOVER.md` in the client's language.

**Boss's job.**

- Sharpen rounds: one thing per round, three rounds maximum.
- Truth check on `CONTENT` blocks: every number, name and claim ticked against the client's material.
- Phone test on mobile data from a cold start: hero readable in about two seconds, nothing jumps, main action under the thumb, menu opens and closes. Then reduced motion on, reload: fallbacks show, nothing moves except on tap.
- Click every nav item, button and footer link once; send the contact form.
- Sign-off: send the live URL and `HANDOVER.md`, "reply approved and it is yours". The reply goes into `DECISIONS.md`.

**Done when** the client's approval is in `DECISIONS.md`.

---

## Rules that hold everywhere

- **Files.** `SITE.md`, `PLAN.md`, `DECISIONS.md` (log + stage markers), `QUESTIONS.md` (when needed), `HANDOVER.md`, `NOTES.md` (Boss's notes on the process). Content lives in `content/` as one Markdown file per page, images in `assets/`. That is all.
- **Announce, then wait.** Every stage starts with the agent reading what exists and saying in three lines what it will produce and what Boss will be asked. Then "go".
- **Renders, never descriptions.** When Boss has to choose, he chooses between things he can open on his phone.
- **Boss judges fit, not craft.** Spacing, type scale, contrast, breakpoints, code, SEO, performance are the agent's and the skills' job; Boss is never asked to evaluate them.
- **One motion language, one or two moments.** Never more than two moments on the homepage, and they share easing, tempo and physics. Background supports them; never two competing WebGL layers.
- **Mobile is a first-class render**, not a breakpoint check at the end. Every approach in Stage 2 is judged on the phone first.
- **Never invent.** Facts come from the client or go to `QUESTIONS.md`.
- **Log picks.** One line per decision in `DECISIONS.md` with a one-sentence why. Silent changes to `SITE.md` or `PLAN.md` are not allowed.
- **Client checkpoints** (when building for a client): after Stage 2, the chosen approach plus the runner-up on a preview URL, one question: "which feels more like you?"; after Stage 3, sign-off. Nothing else.
