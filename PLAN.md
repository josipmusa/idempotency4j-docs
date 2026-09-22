# Plan

The agent's conclusions from the interview. Boss confirms this before Stage 2; changes are logged in DECISIONS.md.

All three directions are dark, per round 3. They differ in *what the dark is made of* - lit material, lit instrument, or printed plate - so the spread is wide without reopening a decision already made. None of them is a centred column with rules down the sides.

## Three look directions

| | Name (two words) | One sentence | Palette lean | Type character | Imagery treatment |
| --- | --- | --- | --- | --- | --- |
| A | **Machined Ink** | The safe read: near-black as a machined material, everything at a real elevation under one warm light, very few things on screen and all of them large. | Graphite black, cool grey steps, one warm off-white light, a single amber signal used only for the duplicate path. | Large tight neo-grotesque for display; mono at equal status, never demoted to "code font". | Mechanism scenes are lit panels with contact shadows and bevelled edges; code blocks are objects with a thickness, not flat rectangles. |
| B | **Signal Bench** | The bold push: the page is an instrument on a dark bench, with something genuinely running on it - a trace advancing, a lease counting down, readouts that are real values rather than decoration. | Deep petrol-black, cold greys, one phosphor accent (green or amber, decided in build) plus a red reserved strictly for the rejected duplicate. | Mono-dominant, including headings at display size; a grotesque only for the hero claim. | Scope traces, tick marks, live numeric readouts; the mechanism drawn as a running instrument, not as an illustration of one. |
| C | **Foundry Plate** | The unexpected angle: a parts catalogue printed in black, rendered on screen at poster scale - hard edges, no glow anywhere, one orange used as a stamped marking. | Flat true black, paper-white, one orange marking. No gradients, no glow, no blur. | Enormous tight uppercase display breaking the measure; a small precise grotesque for body; figures set like part numbers. | Diagrams as printed plates: pure black and white line and solid, numbered, with plate captions and callout leaders. Print grain over everything. |

Guard on C, because it is the direction closest to the thing Boss hated: its lines are **drawing** - they describe the mechanism and carry callouts. There are no lines that merely frame or bound the page. If a rule is not part of a diagram, it does not exist.

## Moments shortlist

| Candidate | Slot | Job (reveal / demonstrate / respond) | Asset needed | Mobile version | Fallback | Cost |
| --- | --- | --- | --- | --- | --- | --- |
| 1. **The duplicate** - two calls enter with the same key; the first acquires, runs and stores; the second arrives and is handed the stored result without the work running again. Visitor can fire another duplicate and watch it replay. | Hero ★ | Demonstrate, and respond | Authored SVG/canvas scene. No external asset | Tap to fire instead of hover; plays once on entry, then on tap | The frame at the instant of replay, captioned: the second call, and the work that did not run | Medium |
| 2. **Lease under heartbeat** - one execution on a timeline: the lease is acquired, the heartbeat extends it at `lease / 2`, the action runs longer than its lease and keeps it; a second caller waits inside `tryAcquire` and gets the real result. Then the branch where the owner dies, the lease expires, and the next caller steals it atomically. | Section 3 ★ | Demonstrate, and reveal in order | Authored scene, scroll-scrubbed | Unpinned: each beat is its own stacked card that auto-runs once when it enters | The expired-lease-stolen frame, the one that is hardest to describe in words | Medium |
| 3. **The four outcomes** - one request with an `Idempotency-Key`, routed by the state the record already holds: new runs the handler; completed with a matching body replays; completed with a different body is refused 422; still held past the wait timeout is refused 409 with `Retry-After`. | Section 3 or 6 | Demonstrate | Authored scene; the existing `request-outcomes` diagram is the source of truth for the logic | Four stacked rows, each lighting in turn | All four paths drawn at once, the static diagram | Low–medium |
| 4. **The annotation lands** - a plain listener method sits on the page; `@Idempotent(key = "#event.id()")` arrives above it and the method is now idempotent. The whole change, as one gesture. | Hero ★ (alternative) | Demonstrate | None. Type and code only | Full, it is cheap | The finished annotated method | Low |

Not shortlisted, and why: a cursor spotlight, a particle field, magnetic buttons, tilt cards - none of them encodes library behaviour, so by the round-6 rule they are decoration and come off.

## Background shortlist

| Candidate | Why it fits | Inner-page variant |
| --- | --- | --- |
| 1. **Graphite + grain, one soft light** - near-black with a single large, very soft light source and fine grain over everything. | Carries "physical" without a second animated layer, and gives the lit mechanism panels something to sit on. Costs almost nothing and never competes with a moment. | Light source weaker and fixed; grain unchanged, so docs and home are obviously the same site. |
| 2. **Flat black + print grain + typographic watermark** - no gradient at all; the wordmark or a large numeral set enormous and nearly invisible behind the content. | Confident and brand-first, and the only option with zero rendering cost, which leaves the whole motion budget for the scenes. Pairs with the printed-plate treatment. | Watermark smaller and per-section (the section number), so a long docs page still has a spine. |
| 3. **Petrol dark + faint scanline** - a cold dark bench with a barely-present horizontal texture and a slow bloom where the running scene sits. | Only for Signal Bench, where the page is an instrument. Single layer, no WebGL background, so the running scene stays the one animated thing. | Scanline only, bloom dropped. |

## Assignment for Stage 2

| Approach | Look | Hero moment | Second moment | Background |
| --- | --- | --- | --- | --- |
| A | Machined Ink | 1. The duplicate, as lit panels under the one light | 2. Lease under heartbeat, pinned and scroll-scrubbed | 1. Graphite + grain, one soft light |
| B | Signal Bench | 2. Lease under heartbeat, running live as a trace with a real countdown | 3. The four outcomes, as a routing panel with readouts | 3. Petrol dark + faint scanline |
| C | Foundry Plate | 4. The annotation lands, set at poster scale as plate 01 | 1. The duplicate, as numbered printed frames advancing on scroll | 2. Flat black + print grain + typographic watermark |

Each approach therefore differs in feel *and* in what moves, not only in colour. Each carries exactly two moments, and no approach puts a shader background under an animated scene.

## Real vs mocked in Stage 2

- **Real:** all of it, and this is unusual enough to be worth stating. Every code sample is the library's own at 0.4.0. The support matrix, the four HTTP outcomes, the status codes, the configuration keys, the limits and the Maven coordinate are copied from the library, rendered from one build-time version constant. The logo geometry is real. The docs and learn content already exist.
- **Mocked (`[mock]`):** no facts. Section copy - headline, sub-line, section headings, the compare section's wording - is drafted by me and marked `[mock]` only where a claim is mine rather than the library's, so Boss's truth check in Stage 3 has something precise to tick against.
- Nothing on the never-invent list is missing, so `QUESTIONS.md` stays empty for now.

## Asset production to start now

| Asset | How (shoot / render / img2threejs / typographic) | Owner | By when |
| --- | --- | --- | --- |
| - | Nothing. Every visual is authored in code during Stage 2 | Agent | n/a |

Nothing blocks Stage 2, and nothing waits on anyone outside this repo.

## Motion language (proposed, locked after Stage 2)

- **Easing:** one family for the interface - `cubic-bezier(0.23, 1, 0.32, 1)`, fast out and slow to settle, the way a mechanism comes to rest. One deliberate exception, and it is a matter of honesty rather than taste: anything representing real elapsed time - a lease counting down, a heartbeat, a wait timeout - runs **linear**. A clock that eases is lying about the thing the library does.
- **Durations:** 180 ms hovers and state changes · 320 ms reveals · 600 ms section entrances · mechanism scenes run in fixed proportion to the real durations they depict (a 30 s lease renders as 3 s) and the scene says so.
- **Stagger:** 60 ms between siblings, capped at six items, then the rest arrive together.
- **Reduced motion:** every scene renders its single most informative frame - the instant of replay, the stolen lease - not a blank and not the first frame. Scrubbing is disabled, nothing autoplays, and a control to step the scene manually stays available. Lenis off on touch and off under reduced motion.

Boss: confirm, or say what to swap. One round, then "go".
