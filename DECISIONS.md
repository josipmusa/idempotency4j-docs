# Decisions

One line per pick, newest at the bottom: date, what was decided, one sentence why.
Phase markers look like `2026-09-18, phase 0 done`. Claude reads the last marker to know where we are.

<!-- Example:
2026-09-18, brief agreed. Motion tier: Expressive, because the studio's work is visual and they have real photography.
2026-09-19, phase 0 done
2026-09-19, Look: chose "Warm Concrete" over "Ink Editorial"; closer to "grounded" and "honest", the competitor already looks like Ink.
-->

2026-09-18, reset onto Website Build Framework v2; kept only the docs and learn prose, deleted the previous build and its planning documents, because the process changed rather than the subject.
2026-09-18, brief agreed.
2026-09-18, motion tier: Showpiece, because the library's mechanism is the argument and watching it run persuades better than a claim about it; the show is hand-authored SVG scenes made in-repo, so no asset is commissioned.
2026-09-18, hosting stays GitHub Pages on the project subpath, no custom domain; the base-path discipline is carried as a build constraint.
2026-09-18, /docs stays Starlight, restyled to the Phase 1 tokens; redesigning 29 reference pages from scratch buys nothing the restyle does not.
2026-09-18, the homepage is not inherited from the previous build; Phase 2 shapes it from nothing.
2026-09-18, phase 0 done
2026-09-18, the logo's colours carry no authority and the mark is rendered in the foreground colour; that keeps the accent free for its one meaning and leaves recolouring the library's artifacts as a phase 5 decision made against a real palette.
2026-09-18, direction: Bench Instrument, because it shows the library as a running instrument rather than a document about one; the other two framed the technical content instead of drawing it.
2026-09-18, accent: Cathode Cyan #3BE3DC, replacing the violet #7C5CFF the direction shipped with, which read as a template default rather than a signal; the cyan is effectively the accent the previous build had reasoned its way to, and it is the nearest hue that is neither a status nor a link.
2026-09-18, the palette is two-mode: the dark bench for marketing and panels, a light bench at the same accent hue for /docs, because long-form reference reading is not the same task as looking at a panel.
2026-09-18, a diagram stroke role was added to LOOK.md beyond what the design studio supplied, because the hairline sits below the 3:1 that WCAG requires of a stroke that is itself the content.
2026-09-18, phase 1 done
2026-09-19, CLAUDE.md and HANDOVER.md said Cloudflare Pages against the phase 0 hosting decision; corrected both to GitHub Pages so the build phase does not inherit the wrong base-path assumption.
