# Design Brief

**Status: DRAFT.** Two decision sections, LOCKED and OPEN. Becomes FINAL when phase 6b
closes and the cold-regeneration gate passes.

Nothing in OPEN is secretly decided in LOCKED. Nothing in LOCKED reopens without rewriting
this document first.

Site: **idempotency4j**, the central home for the library, its documentation and its
articles. Dark-first. Tech product, own site, Kinetic motion profile.
Reads as a piece of distributed-systems instrumentation, not as a SaaS landing page.

---

## LOCKED

### Palette anchors

Designed for this site, not inherited. The library's existing colours
(`#2d3142 / #4f5d75 / #bfc0c0 / #eb6c36`) were the design-diagram skill's stock palette
rather than a considered brand, so they carry no authority - see DECISIONS.md D16. What
survives from the library is the **mark's geometry**, not its colours.

Direction **A. Instrument**: cool near-black, one cyan-teal accent. Chosen from six
rendered directions on identical content (`spikes/palette.html`, captures in
`spikes/screenshots/`). Dark is designed and reviewed first; light is a supported second
and not an inversion.

```
DARK (default - defined on bare :root)

--ink-0      #0a0c11   page ground           cool near-black
--ink-1      #10131a   raised surface        panels, cards, figure grounds
--ink-2      #171b24   recessed              code blocks, table header rows, inset wells
--rule       #242a36   decorative hairline   section dividers, panel borders
--rule-hi    #566275   load-bearing line     diagram axes, lane baselines, active borders
--dim        #7c8798   tertiary text         captions, mono labels, metadata
--text       #c3cad6   body text
--text-hi    #f2f5f9   headings, display, emphasis, focus rings
--signal     #3ddbd9   THE accent
--signal-hi  #82f0ee   the one accent-filled control, hover only
--on-signal  #04141a   text on an accent fill

LIGHT (supported - under prefers-color-scheme and [data-theme="light"])

--ink-0      #f7f8fa   --rule      #d3d8e0   --text       #2a3038
--ink-1      #eef0f4   --rule-hi   #7f8998   --text-hi    #0d1117
--ink-2      #e4e7ed   --dim       #5c6675   --signal     #0d7373
                                             --signal-hi  #0a5f5f
                                             --on-signal  #ffffff
```

**The accent darkens in light mode and that is not a mistake.** A saturated cyan cannot
carry 4.5:1 as text on an off-white ground, so light mode uses the same hue at a much
lower lightness. The consequence is honest and worth knowing: the accent is a quieter
mark in light mode than in dark. Dark is where the signature scene is designed.

**Why not a status hue.** `/docs` needs note / tip / caution / danger asides, and those
own blue, green, amber and red. An accent in any of those families makes a `tip` or a
`caution` ambiguous with the idempotent path, breaking the one-accent rule in the one
place the site is actually used. Blue is additionally the universal link colour, and
since links here are underlined rather than coloured, a blue accent would invite a click
on something inert. Cyan-teal is the nearest hue that is neither a status nor a link.

**One accent, one meaning - the load-bearing rule of this design.**
`--signal` marks the idempotent path and nothing else: the replayed result, the guarded
boundary, the stored record, the single filled cell in a panel row. It never appears on a
hover state, a heading, a link, a border, a focus ring, a bullet, or a chart series that
is not the replayed path.

A reader who has scrolled the homepage once should be able to answer "what does the cyan
mean?" with one sentence. If they cannot, the page has failed and the accent comes off it.

Consequences, all deliberate:
- Links are underlined, not coloured. Underline offset `0.2em`, thickness `1px`,
  `--rule-hi`, going to `--text-hi` on hover.
- The primary button is `--signal` ground with `--on-signal` text. It is the only
  accent-filled interactive element on the site, which is why it does not need to shout.
- Focus rings are `--text-hi`, 2px, with a 2px offset. Never the accent.
- Nav link states use text colour and a 1px `--rule-hi` underline.
- An accent **fill** is reserved for objects, never for large areas. A filled cell wider
  than roughly a fifth of its row reads promotional; above that width, outline the cell
  and mark it with an accent rule instead.

**Two line tokens, two jobs.** `--rule` is decorative: section dividers and panel borders,
whose removal costs no information, so it sits below the contrast floors deliberately.
`--rule-hi` is load-bearing: a diagram axis or lane baseline is a graphical object needed
to understand the figure, so it must clear 3:1. **A diagram never draws structure with
`--rule`.**

**Contrast floors.** Every pair below was computed, not estimated, and all of them pass in
both themes. The reviewer re-checks rather than assumes.

| Pair | Floor | Dark | Light |
|---|---|---|---|
| `--text` on `--ink-0` | 4.5 | 11.87 | 12.52 |
| `--text` on `--ink-2` (code) | 4.5 | 10.45 | 10.74 |
| `--dim` on `--ink-0` | 4.5 | 5.38 | 5.47 |
| `--dim` on `--ink-2` | 4.5 | 4.74 | 4.69 |
| `--text-hi` on `--ink-0` | 4.5 | 17.89 | 17.81 |
| `--signal` as text on `--ink-0` | 4.5 | 11.49 | 5.32 |
| `--signal` as text on `--ink-1` | 4.5 | 10.91 | 4.95 |
| `--on-signal` on `--signal` | 4.5 | 11.01 | 5.65 |
| `--rule-hi` on `--ink-0` | 3.0 | 3.17 | 3.33 |
| `--rule-hi` on `--ink-1` | 3.0 | 3.01 | 3.10 |

`--dim` clears 4.5 on `--ink-2` with little headroom in both themes, so **`--dim` is never
used below 12px on a code-block ground.**

**Theme switching.** Tokens are defined on bare `:root` as the dark set. Light is applied
under both `@media (prefers-color-scheme: light)` guarded as
`:root:not([data-theme="dark"])` and `:root[data-theme="light"]`, so an explicit toggle wins
in both directions. No colour is defined only inside a media query. `color-scheme` is set
so form controls and scrollbars follow.

### Spacing scale

Base unit **4px**. The only permitted values:

```
4  8  12  16  24  32  48  64  96  128  192
```

No arbitrary values. Anything that needs a twelfth step needs a different layout.

**Section rhythm:** 128 desktop / 96 tablet / 72 mobile, applied as `padding-block`.
The signature section gets **192 above and below** - that extra air is the silence before
the peak and is not available to any other section.

**Measure:** prose 60–70ch, hard capped at 70ch. Docs body copy 68ch.
**Page cap:** 1280px content, 1440px for full-bleed rule lines and the signature scene.
**Gutters:** 24px at 390, 32px at 768, 48px at 1440. Never below 16px at any width.

**Hairlines** are 1px `--rule`, and they extend to the 1440 cap rather than to the content
cap. Objects sit *on* them. They are the site's grid made visible, which is the single
device carried over from Encore.

### Motion authority

**MOTION.md governs.** Profile: **Kinetic.** The three rules a designer must hold:

1. **One ease, one duration scale.** Enter and settle on `cubic-bezier(0.16, 1, 0.3, 1)`;
   on-screen movement on `cubic-bezier(0.4, 0, 0.2, 1)`. Never ease-in. Durations are
   **120 / 240 / 480 / 800ms** and nothing else; 120 is reserved for interface feedback.
2. **Transform and opacity only.** Never `filter`, never layout properties, never
   `transition: all`.
3. **Reduced motion is mandatory and is a design state, not a degradation.** Every scene
   has a designed settled frame that is fully legible with nothing moving. Design the
   settled frame first; the motion is what gets added to it.

Corollary, specific to this site and non-negotiable: **every diagram must read as a single
still frame.** The reduced-motion state, the social preview image and a printed page all
consume that still. A diagram whose meaning depends on having watched it is a failed
diagram.

### One-peak rule

**The signature moment: "Two charges, or one."**

One scene, at homepage section 2, that contains both the problem and the fix and resolves
from one to the other under the visitor's control.

A request fires down a timeline and a payment is charged. The network times out before the
response lands. The client retries. The request runs again and the payment is charged a
second time. One control - a physical switch labelled `@Idempotent`, not a toggle
pill - flips, and the same sequence replays: the second request meets a stored record under
its key, and `Outcome.Replayed` returns the original result. One charge.

Details:

- **Placement:** section 2, directly after the hero, with 192px of air above it. This is
  earlier than the playbook's "emotional centre, after the hero has had room" default, and
  the override is deliberate: for this audience the duplicate side effect *is* the reason
  they are on the page, and the scene is the fastest possible answer to "does this solve my
  problem". Delaying it to section 4 would be withholding the one thing they came for.
- **It replaces two sections.** The owner's sketch had `THE PROBLEM` and `IDEMPOTENCY4J` as
  separate full-height sections. Fusing them into one controllable scene puts the before and
  after in a single frame - a direct comparison instead of a remembered one - and removes a
  section from a homepage that must not grow. The split version is the phase 6a alternative,
  spiked and judged, not assumed away.
- **Control, not autoplay.** The switch starts in the OFF position showing two charges. The
  scene does not animate on load and does not loop. A visitor who never touches it still
  sees a complete, labelled diagram of the problem.
- **Fallback, if the interactive scene fails its feasibility test:** the same comparison as
  a static two-panel SVG figure, OFF on the left and ON on the right, captioned. This
  fallback is also the reduced-motion state and the source of the social preview image, so
  it gets built first regardless.
- **Asset budget:** hand-authored SVG, no library, under 8KB gzipped for the scene's markup
  and under 3KB for its script. Nothing loaded from a CDN.
- **At 390px** the timeline stacks vertically and the switch moves below the scene. It
  remains the peak; it does not become a link to the peak.
- No other section on the site gets a scene, a scrub, a pin, or an interactive control.
  A page with three peaks has none.

### Refuse list

The full house list applies: scroll-hint cues; `01 / 06` section counters; gradient text;
identical feature-card grids; three rounded cards with thin-line icons; generic parallax;
fade-in on every element; animation on body text; glassmorphism outside a nav or modal; the
indigo-to-purple gradient; fake trusted-by logos, testimonials, metrics or awards; "for
modern teams" copy; unmodified component-library defaults; `transition: all`; cursor-follow
blobs; a polished homepage with thin inner pages.

Plus, from what the references taught and from this library's own honesty:

- **The accent is never a status hue.** No green, amber, red or blue as `--signal`. The
  docs own those four for note / tip / caution / danger, and blue additionally reads as a
  link. Enforced in the palette section; repeated here because it is the easiest rule to
  break by "warming the accent up a little".
- **No second accent, ever.** Not for a "secondary" action, not for a chart series, not to
  distinguish two things in one diagram. A second colour is the fastest way to destroy the
  one rule this design rests on. Use luminance, weight, fill-versus-outline, or position.
- **No centred hero, and nothing centred above the fold.** (restate, temporal, trigger)
- **No logo wall, no "used by", no download count, no star count written as copy.** There
  are no users to name. A live GitHub star badge in the nav is data; a sentence claiming
  traction is invention.
- **No performance or scale claims.** There are no benchmarks. No "1000x", no "handles
  millions", no latency numbers. (tigerbeetle)
- **No mascot, character or illustrated scene.** (tigerbeetle, restate)
- **No emoji anywhere in the interface, including in diagrams.** The owner's sketch used
  `💳` and `💥`; they come off. The existing diagram set uses none, and a charge is drawn as
  a labelled object.
- **No pastel or enterprise gradients, no funding or announcement banner.** (restate,
  temporal)
- **No decorative code.** Code on this page is readable at its rendered size or it is not
  on the page. No blurred code as background texture (trigger), no code that types itself,
  no fake terminal title bars with traffic-light dots.
- **No particle field, starfield, noise texture or atmospheric background.** (inngest)
- **No accent on anything that is not the idempotent path.**
- **No claim of exactly-once.** The library is explicit that exactly-once delivery is not
  what this is, and the site must be at least as explicit. This is a copy rule with a
  visual consequence: no section may be headed "exactly once".
- **No section that exists to be scrolled past.** Eight sections is the cap and each one
  has a job named in the feeling curve.

### Navigation and site structure

**Bar, left to right:** wordmark (links home) · Docs · Learn · GitHub · Maven Central ·
**[ Get started ]**

Four items plus the primary action, under the cap of five. Overrides of the house
tech-product default, written down as required:

- **No Pricing.** The house default says pricing is never hidden; there is no price. Apache
  2.0 is stated in the footer and on `/docs/requirements`.
- **No About and no Contact.** A one-maintainer library's contact route is its issue
  tracker. The footer carries GitHub Issues, Discussions and `SECURITY.md`; there is no
  contact page and no form.
- **GitHub and Maven Central are outbound**, marked with a small external-link glyph in
  `--dim`, and they sit to the right of the internal items so the internal set reads as one
  group. GitHub carries a live star count as data.

**Primary action:** `Get started`, right of the bar, `--signal` filled, on every page, at
every viewport, in the hero, and as the final block of every page. The same two words
everywhere. A page that ends without it is a dead end.

**Persistent identity:** the bar is visible at load and stays available for the whole page.
It is *not* translucent and does not blur what is behind it; it becomes a solid `--ink-0`
bar with a 1px `--rule` bottom edge once the page scrolls past the hero.

**Sitemap:** full IA in [docs/SITEMAP.md](docs/SITEMAP.md). Summary:

```
/                          home, eight sections
/docs/                     Starlight, six sidebar groups, ~24 pages
/learn/                    index + 3 articles at launch
```

**The Docs / Learn boundary is a locked content rule,** because it is what keeps both
credible:

- **`/docs` answers "how do I use idempotency4j".** Every page contains idempotency4j code
  or configuration.
- **`/learn` answers "help me understand the problem".** Every article must be useful to a
  reader who never adopts the library. At most one link to `/docs`, at the end. An article
  that only makes sense as an advertisement belongs in `/docs`.

### Layout requirements

**Breakpoints reviewed:** 1440, 768, 390. The signature scene and the architecture section
are judged at **390 first**, because both are horizontal-timeline shaped and that is where
they will break.

**Grid:** 12 columns at 1440, 8 at 768, 4 at 390. Gutter 24px throughout.

**The homepage is eight sections and does not grow.** Adding a ninth means removing one.
A homepage of fifteen screens is the specific failure mode this brief exists to prevent.
Technical depth lives in `/docs` and `/learn`.

**What the content forces:**

- **Monospace is content, not styling.** State names (`IN_PROGRESS`, `COMPLETE`),
  outcomes (`Outcome.Replayed`), ISO-8601 durations (`PT30S`), configuration keys
  (`idempotency.default-wait`), headers (`Idempotency-Key`), status codes and Maven
  coordinates all appear in running prose and must be set in mono at a size that optically
  matches the surrounding text. The mono face is therefore a first-class typographic
  decision, not a code-block afterthought. Its x-height relative to the body face is a
  pairing criterion in phase 6b.
- **Long identifiers must not force horizontal scroll.**
  `io.github.josipmusa:idempotency-spring-boot-starter` and
  `TransactionAwareConnectionResolver` appear in body text and in tables. Mono inline spans
  wrap at word boundaries; code blocks get their own `overflow-x: auto` container and are the
  only horizontally scrolling elements permitted.
- **Tables are design objects.** The support matrix (9 rows × 3 columns), the configuration
  reference, the filter status codes and the store comparison are among the most valuable
  content on the site. They get real design attention, not a default table style, and they
  scroll horizontally in their own container rather than reflowing into cards.
- **Two diagram sets already exist** as light/dark SVG pairs at fixed aspect ratios. They
  drop into `/docs` unmodified. Any new diagram joins their language: 1px strokes, no fill
  except `--signal` on the idempotent path, labels in mono, no shading, no gradients, no
  emoji, no rounded-corner boxes beyond 2px.
- **The hero coordinate block** must hold `<dependency>` XML (5 lines) and a Gradle line in
  a two-tab switcher, readable at 390px without shrinking below 13px. This constrains hero
  layout more than the headline does.
- **Starlight is being restyled, not themed.** Its sidebar, TOC, search modal, code blocks,
  asides and pagination all have to accept these tokens. Budget this as real work in phase 7
  and check it at all three viewports; a default-looking `/docs` against a designed `/` is
  the "polished homepage, thin inner pages" refuse-list item in reverse.

### Selected design language

*Empty until phase 6a.* Candidates in [docs/DESIGN-CANDIDATES.md](docs/DESIGN-CANDIDATES.md).

### Typography

*Empty until phase 6b.* Constraints that phase 6b must satisfy are recorded in OPEN below.

### Grid and density

*Empty until phase 6b.*

### Image treatment

*Locked early, because there is no imagery to treat.*

There are no photographs, no stock images, no AI-generated images and no rendered 3D on this
site, now or later. Every visual is an information graphic drawn in SVG from the library's
real behaviour, in the diagram language described above. The only raster assets are the
social preview image (generated from an SVG) and the favicon.

This is recorded as LOCKED rather than OPEN because it is a consequence of the brief's
"no decorative marks" constraint, not a stylistic choice awaiting a spike.

### Interaction scope

*Empty until phase 6b, except for what the one-peak rule already fixes:* the signature
switch is the only interactive control on the homepage, and the scene is fully legible
before it is touched. Nothing anywhere on the site depends on hover or interaction to be
readable.

---

## OPEN

Decided in phase 6. Remove each item as it locks.

**Design language** - the five candidates in docs/DESIGN-CANDIDATES.md. Phase 6a.

**Typeface pairing** - phase 6b. The pairing must satisfy:
- *A constraint from the existing brand:* the wordmark is **Inter SemiBold 22 at `-0.4`
  tracking**, converted to outlines. Either the display face sits comfortably beside Inter,
  or the wordmark is accepted as a distinct lockup. Inter for display and body is therefore
  the zero-friction baseline that every alternative must beat, not merely match.
- *Mono is load-bearing* (see Layout requirements). Judge it on x-height against the body
  face, on `0`/`O` and `1`/`l`/`I` discrimination, and on how a 45-character coordinate
  looks inline at 15px - not on how a code block looks.
- Self-hosted, subset, `font-display: swap`, a real fallback stack, and under 100KB total
  for all faces and weights.
- Faces to spike: display/body - Inter, Inter Tight, Geist, Instrument Sans;
  mono - JetBrains Mono, Geist Mono, IBM Plex Mono, Commit Mono. No licensed face
  (Suisse Intl, Circular, Berkeley Mono) since this is an unfunded open-source site.

**Grid density** - phase 6b. Specifically whether the architecture and integrations sections
are a four-cell hairline grid or a stacked list, and whether docs body copy is 16, 17 or
18px. Encore's 20px is the upper bound to test against.

**Whether "Execution model" and "Architecture" remain two sections** - phase 6a. See the
adjacency note under the feeling curve.

---

## Homepage feeling curve

One line per section: the feeling, and what on screen causes it.

| # | Section | Feeling | What causes it |
|---|---|---|---|
| 1 | **Hero** | Recognition - "this is the thing I was searching for" | The name, one claim in the library's own words, and a Maven coordinate already copyable. No scroll needed to know what this is. |
| 2 | **Two charges, or one** *(signature)* | Discomfort, then relief | Watching a payment charge twice on a timeline, flipping one switch, and watching it charge once. Their own bug, on screen, then fixed. |
| 3 | **Execution model** | Comprehension | Five named stages - Request, Acquire, Execute, Store, Replay - with the real vocabulary, so the fix they just saw stops being magic. |
| 4 | **Architecture** | Trust through restraint | Four layers on hairlines, and the sentence that the engine contains no framework or transport types. The discipline is the proof. |
| 5 | **Code** | Familiarity - "that is three lines" | Three tabs of real code in their own language: an annotated Kafka listener, an annotated endpoint, the raw engine. |
| 6 | **Integrations** | Fit, and relief at the honesty | Their store and their stack on the list, and what is *not* supported stated plainly on the same row rather than buried. |
| 7 | **Learn** | Curiosity | Three real article titles with real first sentences. No teaser cards, no "read more". |
| 8 | **Get started** | Decision | The coordinate again, the one action, and nothing else on screen. |

**Adjacency check.** Sections 3 and 4 both sit in the comprehension/trust register, which
by the playbook's own test means one of them may be filler. Two candidate resolutions, to be
decided by spike in phase 6a and not by argument:

- **(a)** Merge them: the five stages drawn *across* the four layers in one figure, so the
  execution model and the architecture are the same diagram read in two directions. Seven
  sections.
- **(b)** Keep 3 on the homepage and move 4 to `/docs/architecture`, replacing it with the
  integrations row promoted up. Seven sections.

Either resolution shortens the homepage, which is the direction the brief wants. The
eight-section version above is the baseline to beat, not the target.
