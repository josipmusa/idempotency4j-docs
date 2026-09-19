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
2026-09-19, GitHub stars added to BRIEF.md as a secondary goal earned downstream of the one job, not as a second action; the star count is never displayed, because 31 stars argues against the library to the tech lead the honesty pitch is aimed at.
2026-09-19, homepage structure: option A mechanism-first, over B problem-first; the visitor arrives already holding the problem, and B would have pushed the mechanism below the fold twice on a site whose Showpiece tier was justified by that mechanism.
2026-09-19, three GitHub entry points were added to SITEMAP.md beyond what the boards drew (homepage closing, end of /learn/ index, end of article); the boards carried GitHub only in the footer and nav, and the amended brief makes the end of a read the lever for stars.
2026-09-19, phase 2 done
2026-09-19, the storage SPI is described as five methods with the three that carry the protocol named, not as "a three-method SPI"; the interface has five abstract methods and the tech lead the honesty pitch targets is exactly the reader who opens it and counts. Corrected in BRIEF.md, the carried-over docs prose and the library README.
2026-09-19, the footer attribution matches the library NOTICE verbatim, "Copyright 2026 Josip Musa", rather than a friendlier byline, because it is the legally meaningful text and invents nothing.
2026-09-19, the version renders from one build-time constant rather than literals or a Maven Central lookup; the coordinate is the thing the site exists to get copied, and a build-time fetch could publish a coordinate whose surrounding docs describe another version.
2026-09-19, the published list of non-goals came off the homepage and lives only at /docs/operating/limitations/, reached by a link from the closing section; Boss judged it did not belong above the call to action. This edits SITEMAP.md after its checklist passed, so the homepage is six sections rather than seven.
2026-09-19, the hero names the category before the mechanism ("Idempotency for Java") and the mechanism sentence moved from the hero into section 2, because the headline has to pass the five-second test alone and the hero was carrying a paragraph that section 2 already owns.
2026-09-19, phase 3 done
