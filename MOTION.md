# Motion

The motion authority. All animation follows it, including the refuse list. Deviations
require updating this document first.

Drafted at kickoff so the signature moment could be specified concretely. Phase 8 confirms
it against the built site; the principles, refuse list and signature choreography below
already apply.

## Profile

**Kinetic.** Fast, precise, immediate - but at the quiet end of Kinetic. This site's motion
has one job: to let a visitor watch a duplicate request being absorbed. Everything else
holds still.

## Intent

Motion exists here to show a mechanism that is invisible in code. A reader can look at
`@Idempotent(key = "#event.id()")` for a long time without seeing what it prevents; watching
a second request meet a stored record shows it in two seconds.

Outside that one scene, motion exists only to make section entry feel composed rather than
abrupt. When in doubt, remove motion rather than add it. Consistency reads as expensive;
variety reads as template.

**Near-absence is the strategy.** This category over-animates, so restraint is the
differentiator: one moving scene, one reveal, nothing else. The site should feel like an
instrument that is idle until you use it.

## Principles

These hold under every profile and are not negotiable per section.

1. **One ease pair, one duration scale.**
   - Enter and settle: `cubic-bezier(0.16, 1, 0.3, 1)`
   - On-screen movement, and any reversible state change: `cubic-bezier(0.4, 0, 0.2, 1)`
   - Never `ease-in`. Nothing accelerates away from the reader.
   - Durations: **120 / 240 / 480 / 800ms**, and nothing else. 120 is reserved for interface
     feedback and is never used for a reveal.
2. **One reveal language, reused everywhere.** Body copy never animates. Table rows never
   animate. Code blocks never animate.
3. **One engineered peak.** The signature scene gets the asset budget, the 192px of silence
   before it, and the only interactive control on the homepage.
4. **Transform and opacity only.** Never `filter`, never `width`/`height`/`top`/`left`,
   never `transition: all`. `stroke-dashoffset` is permitted inside the signature scene's
   SVG only, which is why that scene is allowed a `will-change` hint and nothing else is.
5. **Nothing bounces.** Kinetic permits low-bounce springs on small elements; this site
   declines them. A library that prevents money moving twice does not bounce.
6. **Reduced motion is a designed state.** Every scene has a settled frame that is fully
   legible with nothing moving and no interaction. **Design the settled frame first.** The
   motion is what gets added to it, never what makes it comprehensible.
7. **60fps on mid-range hardware.** Jank disqualifies the effect. Verified on a real
   mid-range phone in phase 9, not in a throttled desktop tab.
8. **Persistent identity.** Whatever the hero does, the logo, navigation and `Get started`
   remain available for the rest of the page.
9. **The frequency rule.** Anything used many times per visit does not animate at all: the
   docs sidebar, the TOC, the search modal open, the copy button, pagination. They change
   colour and nothing more.
10. **Every diagram must be legible as a single still frame.** Reduced motion, the social
    preview image and a printed page all consume the still. A diagram whose meaning requires
    having watched it is a failed diagram and gets redrawn, not re-timed.

## Refuse list

Scroll-hint cues. Section counters. Gradient text. Identical card grids. Parallax on
anything. Fade-in on every element. Animation on body text, table rows or code. Spring or
bounce eases. More than one interactive scene per page. Any pinned scrub scene. Loops that
run offscreen. Hover effects without `@media (hover: hover)`. Smooth scroll. Animated
counters counting up. Typewriter text. A terminal that types itself. Marquees, including
"infinite logo scroll". Skeleton loaders on a static site. Anything that moves on page load
except the hero's own single reveal.

Specific to this site:

- **The signature scene never autoplays and never loops.** It waits.
- **No accent-coloured motion.** `--signal` marks the idempotent path, not the fact that
  something moved.
- **Nothing animates in the docs.** `/docs` is consulted under pressure by someone with a
  bug. It is completely still apart from colour changes.

## Stack

| Concern | Tool | Budget |
|---|---|---|
| Section reveals | **CSS scroll-driven animations** (`animation-timeline: view()`) behind `@supports`, with no JS fallback - unsupported browsers simply see the settled state | 0 KB |
| Signature scene | Hand-written vanilla JS driving CSS custom properties and `stroke-dashoffset` on inline SVG | < 3 KB gzipped |
| Interface feedback | CSS transitions | 0 KB |

**No animation library.** No Motion, no GSAP, no anime.js, no Lenis. There is no pinning,
no scrub and no spring on this site, which is the entire reason those libraries exist. Adding
one would cost more than everything it would animate.

**No smooth scroll.** **No view transitions** - state does not need to persist across
navigation, and Starlight's own navigation is better left alone.

**Dev-only override:** on the dev server, `?motion=reduce` on any URL forces the
reduced-motion branch, so the reviewer can verify it. Compiled out of production builds.

## Reveal language

One treatment, everywhere, once.

**Section entry:** the section's heading, its eyebrow and its panel group rise **12px** and
fade from `0` to `1` over **480ms** on the enter ease, triggered when the section's top edge
crosses 85% of the viewport height. Once - never re-triggered on scroll back.

**Grouped items** (the panel row, the integration cells, the three Learn cards) stagger at
**60ms**, capped at six items. A seventh item joins the sixth rather than extending the
stagger.

**What never animates:** body paragraphs, list items, table rows and cells, code blocks and
their contents, inline mono spans, the navigation bar, the footer, anything in `/docs`,
anything in `/learn` below the article title.

**Hairlines** are the one exception worth having: a section's full-bleed rule draws from left
to right over **800ms** as the section enters, via `transform: scaleX()` from a left origin.
This is the site's only decorative motion and it is permitted because the hairline grid is
the design's structural signature. If it reads as flourish in phase 8, it is cut, and this
paragraph is deleted rather than argued with.

**Hero, on load:** the headline, support line, action pair and coordinate panel perform the
standard reveal with a 60ms stagger, beginning at 120ms. Nothing else on the page moves on
load.

## The signature moment

**Name:** *Two charges, or one.*

**Where it sits:** homepage section 2, immediately after the hero, with 192px of clear space
above and below it. Full-bleed to the 1440 cap. Nothing shares the viewport with it at
1440 except the navigation bar.

### The settled frame (built first)

A horizontal timeline. Three lanes, labelled in mono: `Client`, `Server`, `Payments`.
A request travels from `Client` to `Server`; `Server` calls `Payments`; a charge object
appears. The response path breaks - a clean gap in the line with a mono `timeout` label,
not an icon and not a colour. The client retries. The second request traverses the same
path. A second charge object appears. A mono label reads `2 charges`.

Below it, a physical switch - a rectangular track and a square thumb, drawn with the same
1px strokes as everything else - labelled `@Idempotent`, in the OFF position.

**This frame alone is a complete, captioned figure of the problem.** A visitor who never
touches the switch has understood the problem. That is the requirement.

### The ON frame

Same three lanes, plus a fourth: `Store`. The first request acquires a record, charges, and
stores the result. The timeout still happens - it is not the thing being fixed. The retry
arrives, meets the record under the same key, and returns along a path drawn in `--signal`
labelled `Outcome.Replayed`. One charge object. A mono label reads `1 charge`.

### Choreography, on switching OFF → ON

Total **800ms**. The reader flipped the switch, so the response must feel immediate; the
first 240ms is what makes it feel that way.

1. **0ms** - The switch thumb translates across its track, 120ms, movement ease. Interface
   feedback, so it lands before anything else starts.
2. **120ms** - The second charge object fades out, 240ms. The thing being removed goes
   first; this is the point of the scene and it should not be third in line.
3. **180ms** - The `Store` lane's label and baseline fade in and its hairline draws left to
   right, 240ms.
4. **240ms** - The first request's `acquire` and `store` marks draw onto the existing path
   via `stroke-dashoffset`, 240ms. The first request does not move; the same sequence gains
   two marks.
5. **420ms** - The retry's response path redraws to terminate at `Store` rather than at
   `Payments`, 240ms, in `--signal`. The single accent-coloured element in the scene.
6. **560ms** - `Outcome.Replayed` fades in on that path, 240ms.
7. **680ms** - The counter label crossfades `2 charges` → `1 charge`, 120ms.

**ON → OFF** is the exact reverse in reverse order, 800ms, same eases. Asymmetric enter and
exit are a Kinetic idiom but wrong here: the reader is toggling a comparison, and a
comparison that behaves differently in each direction stops being one.

**Interruptible.** Flipping mid-transition reverses from the current state. No queue, no
lockout, no disabled period. Implemented as a single `data-state` attribute on the scene
root with all timing in CSS transitions, so reversal is free.

### Scroll room

The scene is 640px tall at 1440 and has 192px of padding above and below. It occupies most
of one viewport and is not pinned. Scrolling past it without interacting is a legitimate
path through the page.

### Settled state

Whichever state the switch is in. On load: OFF. State is not persisted across navigation.

### Reduced motion

The switch still works; every transition above resolves in **0ms**. Both frames are complete
and captioned, so an instant cut between them is a comparison rather than a glitch. Nothing
is disabled and nothing is hidden.

### Mobile, 390px

Lanes stack vertically; time runs top to bottom. The switch moves below the scene and gets a
44px minimum touch target. Lane labels move above their lanes rather than to the left.
Scene height ~520px. **It remains the peak.** It does not become a static image with a
"see how it works" link - that would remove the one thing the homepage is for on the device
where most search traffic lands.

### Asset pipeline and budget

Hand-authored inline SVG in the Astro component. No build step, no sprite, no external file,
no library. Under **8 KB** gzipped for the markup and **3 KB** for the script. Both themes
via `currentColor` and the CSS custom properties - one SVG, not two.

### Feasibility test

Build the two static frames as a single SVG pair, at 1440 and 390, before any motion is
written. **Gate:** both frames are independently comprehensible with no caption beyond the
mono labels, and the 390px version is legible without zooming. If the gate fails, the
fallback in DESIGN.md - a static side-by-side two-panel figure - becomes the signature, and
the site has no motion beyond its reveals. That is an acceptable outcome, not a failure
state.

## Micro-interactions

| Element | Response | Duration |
|---|---|---|
| Primary button | background `--signal` → `--signal-hi` | 120ms |
| Secondary button | border `--rule` → `--rule-hi`, text `--text` → `--text-hi` | 120ms |
| Nav link | text `--text` → `--text-hi`, 1px `--rule-hi` underline appears | 120ms |
| Inline link | underline colour `--rule-hi` → `--text-hi` | 120ms |
| Code copy button | icon swaps to a check, label reads `Copied`, reverts after 1.6s | no transition on the swap |
| Code / coordinate tabs | active indicator translates along the tab row | 240ms, movement ease |
| Learn card | border `--rule` → `--rule-hi`; the title's underline appears | 120ms |
| Table row | background → `--ink-1` | none - instant |
| Focus ring | appears instantly, always, at 2px `--text-hi` with 2px offset | none |

All hover states sit inside `@media (hover: hover)`. Focus-visible styling is never a
transition - a keyboard user needs the ring at the instant they arrive.

**Never animates:** the docs sidebar and its disclosure arrows, the TOC, the search modal
open and close, Starlight pagination, the theme toggle, the mobile nav open.

The theme toggle deserves a note: it switches instantly with no crossfade. A 240ms colour
transition across every token on the page is the single most expensive thing this site could
animate, and it would be doing it on the one interaction that must feel like a switch.

## Page transitions

**None.** No `ClientRouter`, no cross-document view transitions. A static site on a fast host
with no persistent state has nothing to carry across a navigation, and a transition would add
latency to every click in the docs - the one place people click fastest.
