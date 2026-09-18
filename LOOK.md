# LOOK - idempotency4j

**Direction: Bench Instrument** (option 1a, as originally drawn - without the 2a changes).
A measurement bench at rest: quiet panel, hairline grid, nothing filled, and a single lit
accent reserved for the idempotent path.

The accent is **Cathode Cyan**. It reads as an instrument signal rather than a brand colour,
and it is the only hue in the system that carries meaning.

## Dark palette - product, marketing, panels

| Role | Hex |
| --- | --- |
| background | `#0A0C0F` |
| surface | `#131820` |
| foreground (text, logo mark + wordmark) | `#DCE2E8` |
| body text | `#BDC6D1` |
| muted label | `#8A94A2` |
| quiet label | `#7D8795` |
| hairline | `#2A313B` |
| dim rule | `#1B212A` |
| ruler tick | `#3A4250` |
| diagram stroke | `#58667B` |
| accent - idempotent path | `#3BE3DC` |
| callout note | `#6B9BFF` |
| callout tip | `#6BD46B` |

Accent contrast: 12.3:1 on background, 11.2:1 on surface - it can label text, not only stroke
a line.

**Quiet label, resolved.** The old `#6D7787` failed as text (4.33:1 on background, 3.93:1 on
surface). It is lifted to `#7D8795` - 5.4:1 on background, 4.9:1 on surface - and is the floor
for any 11px mono label. `#6D7787` is retired; `#3A4250` and `#2A313B` are non-text marks only
(ticks, hairlines, rules) and must never carry a glyph.

**Callouts, resolved against the accent.** The accent appears as a 1px stroke and a mono label
inside figures; callouts are bordered boxes with an icon in the content column, so they never
compete for the same reading. They are also separated by hue: note-blue `#6B9BFF` sits at 220
degrees against the accent's 178 (7.2:1 on background), and tip-green pulls back to a true
green `#6BD46B` at 120 degrees with no cyan in it (10.5:1 on background). Caution-amber and
danger-red are unchanged and remain owned by documentation.

## Light palette - documentation, long reading

A light bench, not an inversion. The ink is a cool near-black, the surface is one shade of the
paper rather than a lifted panel, and the accent is the same cyan hue taken far down in
lightness, because a saturated cyan cannot hold 4.5:1 on an off-white ground.

| Role | Hex |
| --- | --- |
| background | `#EFF2F4` |
| surface | `#E4E9ED` |
| ink (text, logo mark + wordmark) | `#10151A` |
| body text | `#2E3841` |
| muted label | `#3F4A54` |
| quiet label | `#55606B` |
| hairline | `#C3CCD3` |
| dim rule | `#D6DDE2` |
| ruler tick | `#9FAAB3` |
| diagram stroke | `#80868F` |
| accent - idempotent path | `#0B6A66` |
| callout note | `#1A4FBF` |
| callout tip | `#1C6B2E` |

Accent contrast: 5.7:1 on background, 5.3:1 on surface. Note 6.4:1, tip 5.9:1 on background.
The light accent is the same hue as the dark one - 177.5 degrees in both - so the two palettes
say the same thing at different lightness.

**Quiet label, light equivalent.** `#55606B` passes as text - 5.7:1 on background, 5.3:1 on
surface - so it needs no lift. `#9FAAB3`, `#C3CCD3` and `#D6DDE2` are non-text marks only.

## Type

- **Space Grotesk 500** - headlines and the wordmark's typographic setting. -2.5% tracking,
  sentence case, never centred.
- **IBM Plex Sans 400** - body and docs prose at 17/26 on the dark panel, 17/27 on the light
  bench.
- **IBM Plex Mono 400/500** - labels, axes, keys, durations, versions, status codes, and every
  number on the page. If a value could be copied, it is monospaced. Labels 11px; uppercase for
  axes, lowercase for values.

## Drawing language

One stroke weight - 1px at every scale, so a 2px stroke reads as emphasis. Nothing is filled:
records and leases are open rectangles on the hairline grid. The accent is a stroke, never a
fill - the replayed path is drawn, the first pass is not. Ruler ticks along one edge give time
a scale, and every diagram declares its unit. The light bench follows the same rules with the
light roles substituted.

**Hairline versus diagram stroke.** The hairline separates regions and carries no information,
so it may sit at 1.5:1. Any stroke that *is* the content - the outline of a record, a lease, a
boundary, an arrow - uses the diagram stroke role, which clears 3:1 on both grounds as
WCAG 1.4.11 requires of a graphic that must be seen to be understood. A diagram never draws its
own subject in the hairline.

## Do

1. Keep the accent for the idempotent path only - the replay, the stored record, the primary
   action, nothing else.
2. Monospace anything copyable: keys, durations, versions, coordinates, status codes.
3. Separate regions with a hairline, not with a box, a shadow or a second background.

## Don't

1. Fill with the accent or tint a surface with it. It strokes and it labels; it never floods.
2. Add a font. Space Grotesk, IBM Plex Sans and IBM Plex Mono are the whole system.
3. Round corners, add gradients or drop shadows - the panel is flat and square.

## Logo

`assets/logo-fg.svg` - the real application mark and wordmark, recoloured to the foreground
`#DCE2E8`. The vertical bar is foreground too, not accent. Full lockup 210px wide (desktop
header, docs nav); compact 150px wide (390 header); never below 132px. On the light bench the
same lockup is drawn in the ink `#10151A`.

## Rejected directions

- **1b Ledger Print** (cream `#F3F0E9`, Newsreader + Work Sans, magenta plate) - rejected
  because the printed-record voice reads editorial rather than like a running engine.
- **1c Cut Steel** (light steel `#E2E5E8`, Archivo uppercase, rose `#FF3D6E`) - rejected because
  the oversize machined headings shout over the technical content they are framing.

## Open against this document

1. **Contrast is verified.** Every text role clears 4.5:1 on both its background and its
   surface, in both palettes. Measured, dark: foreground 15.0/13.6, body 11.3/10.3, muted
   6.4/5.8, quiet 5.4/4.9, accent 12.3/11.2, note 7.2/6.6, tip 10.5/9.5. Light: ink 16.3/15.0,
   body 10.6/9.8, muted 8.1/7.4, quiet 5.7/5.3, accent 5.7/5.3, note 6.4/5.9, tip 5.9/5.4.
   Claude Design's own figures ran 5 to 10 per cent low throughout; these are the ones to use.
2. **The diagram stroke role is an addition made here**, not something Design supplied. The
   hairline at 1.5:1 cannot carry a record outline under WCAG 1.4.11, and the drawing language
   asks for exactly that. `#58667B` and `#80868F` are the lightest neutrals in the family that
   clear 3:1 on the surface. Confirm them when the first diagram is drawn in Phase 3b.
3. **Background and surface differ by 1.1:1** in both palettes. That is intentional for a flat
   panel, but it means a surface can never be the only cue that a region is separate - the
   hairline has to do that work. Watch it on the phone layout where panels stack.
4. **Callout amber and red are still undefined** for either palette. Documentation owns them,
   but they need to be pinned before Phase 5 restyles Starlight.
