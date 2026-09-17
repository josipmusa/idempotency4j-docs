# Phase 2 - Signature feasibility test

**Run** 2026-09-17. The last open item of roadmap phase 2. Gate defined in docs/CONTENT.md
and MOTION.md ("Feasibility test").

**Question:** can *Two charges, or one* work as two static frames, before any motion is
written? **Verdict: passed.** The interactive scene is cleared to be built in phase 6a.

## What was built

`spikes/signature.html` - a standalone page, no build step, nothing imported. Four figures:
both frames (`@Idempotent` off and on) in both themes. Each frame exists in two layouts,
the horizontal one for wide viewports and the stacked one for narrow, switched by a media
query. Captured by the existing harness at 1440 / 768 / 390; the three PNGs are committed
alongside the palette renders as the evidence this verdict rests on.

The scene uses only LOCKED tokens. The typeface is still OPEN until phase 6b, so the spike
uses the system mono stack - what is being tested is the composition, not the face.

## The gate, answered

**Each frame is comprehensible alone, on its mono labels only.** OFF reads as request →
charge → timeout → retry → charge → `2 charges`. ON reads as request → acquire → charge →
store → timeout → retry → `Outcome.Replayed` → `1 charge`. Neither needs a sentence under it.

**390 is legible without zooming.** The stacked layout renders at 1:1 - a 342-unit viewBox
in 342 CSS pixels - so 12px mono labels are 12px on screen. Nothing is scaled down.

## Four constraints the phase 6a component inherits

These are findings from the test, not preferences. Each one is a defect I hit and fixed in
the spike; rebuilding the component without them reintroduces it.

1. **The broken response is two segments with a gap, and the lower one stops short of the
   `Client` lane.** A single truncated stub reads as a short arrow, not as a break. A stub
   that lands on `Client` says the response arrived, which is the opposite of a timeout. The
   trajectory has to be established by two segments and then visibly fail to arrive.

2. **The horizontal layout hands over to the stacked one at 1024, not at 390.** The scene is
   authored in a 1200-unit viewBox; at 768 it would scale to 0.56 and its 13px labels to
   roughly 7px. The stacked layout is capped at its natural width and centred instead. The
   spec names 390 for the stacked layout, but 768 needs it too.

3. **The retry's descent to `Store` and its `--signal` return share an endpoint.** Drawn 20
   units apart they read as two unrelated marks rather than one path through the store.

4. **The OFF frame carries an empty band where the `Store` lane will appear.** The
   choreography requires that the first request does not move and that the `Store` lane fades
   in beneath the existing three, so the lane positions are fixed across both states and OFF
   cannot close the gap. As a standalone figure OFF therefore has visible dead space above
   the switch. Accepted here; phase 6a decides whether to absorb it into the switch's
   clear space.

## One conflict between the authorities, unresolved

MOTION.md says the retry's response path is "the single accent-coloured element in the
scene". DESIGN.md lists "the stored record" among what `--signal` marks. Under the first
rule the record squares on the `Store` lane stay neutral; under the second they would be
accented. **The spike follows MOTION.md**, as the narrower and scene-specific rule, and the
accent appears exactly once. Phase 6b should say which reading is final rather than leaving
the component to choose.

## Not covered by this test

Easing and timing feel, interruption behaviour, and the 800ms choreography - none of it is
built here, by design. The test was whether the settled frames carry the idea on their own,
which is the precondition for animating them at all.
