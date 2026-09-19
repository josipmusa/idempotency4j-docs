# Sitemap

Phase 2, agreed 2026-09-19. Structure only: no colour, type or image talk here (that goes
in LOOK.md). Drawn as grey boxes in the Claude Design project "Idempotency",
`Wireframes.dc.html`, boards 1a to 1g. The homepage is option A, mechanism-first; option B,
problem-first, was rejected.

Two breakpoints were drawn: 1440 and 390. Where 390 changes the structure rather than just
the width, it is stated under the page.

## Navigation (in order, max five items + one button)

Logo/wordmark → `/` · Docs · Learn · GitHub · Maven Central · **[Get started]**

Four items plus one button. The current section is marked. At 390 the four items collapse
behind a menu toggle and the button stays visible in the bar.

GitHub and Maven Central are nav items but are subordinate to the button; neither is a
second primary action.

## Pages

### /

- Purpose: show an engineer the library running, then let them take it.
- Sections, top to bottom:
  1. hero: headline, sub-line (one dependency, one annotation, no framework types in the
     engine), copyable dependency coordinate with a copy affordance, **[Get started]**
     → `/docs/quickstart`, secondary text links to GitHub and Maven Central
  2. the library running: the four-step run sequence as one diagram, left to right -
     acquire the key for the unit of work · run the work under a heartbeat · store the
     result against the key · a duplicate call replays the stored result and the work does
     not run again. This is the section that makes this option A.
  3. the annotation in place: a service method with the annotation and its key expression,
     beside a two-line caption naming what changed
  4. the storage SPI: the three named methods as three boxes, plus one line stating the
     engine holds no framework types and any store implementing the three works
  5. the duplicate side effects this prevents: three named cases - payment charged twice ·
     order shipped twice · Kafka consumer reprocessing after a rebalance
  6. what it does not do: the published list of non-goals, plainly stated. No numbers and
     no comparison table against named vendors, only the boundary of the library
  7. closing: the copyable coordinate again · **[Get started]** → `/docs/quickstart` ·
     link to `/learn/` · link to the GitHub repository
- Pushes toward: copy the coordinate, or **[Get started]** → `/docs/quickstart`.
- At 390: the four steps in section 2 stack vertically, one per row, in order. The
  coordinate block is full width and wraps, with the copy affordance on its own line. The
  button is full width. The code block in section 3 scrolls horizontally. Nothing is cut.

### /learn/

- Purpose: present the four existing long articles so a reader can pick the one matching
  their situation.
- Sections, top to bottom:
  1. page head: title · one line stating this section is long-form background rather than
     reference material · one line pointing readers who want the API to `/docs/`
  2. article list: exactly four entries, one row each, no pagination. Each row is the
     article title, a one-line summary of what it answers, and a link to
     `/learn/<article>`
  3. end of page: one line stating the reference material lives in `/docs/` ·
     **[Get started]** → `/docs/quickstart` · link to the GitHub repository
- Pushes toward: open an article. **[Get started]** stays available in the header and at
  the foot of the page.

### /learn/&lt;article&gt;

One template holding any of the four long technical articles end to end.

- Purpose: carry one long technical article from its question to its answer.
- Sections, top to bottom:
  1. title block: breadcrumb `Learn / <article>` · article title · one-line standfirst
     naming the question the article answers
  2. on-page contents, left column: the article's section headings with the current one
     marked, sticky as the reader scrolls
  3. body column, built from these blocks in any order and any number:
     - prose block
     - section heading, anchored, appears in the on-page contents
     - code block, Java, horizontal scroll, with a copy affordance
     - callout block: a caveat or a boundary of the library, set apart from prose
     - diagram slot: a sequence or state figure at full body-column width, caption below
     - inline link into `/docs/`: a named reference page, for readers who want the API
       detail at that point
  4. end of article: **[Get started]** → `/docs/quickstart` · the other three articles
     listed by title · link to the GitHub repository
- Pushes toward: **[Get started]** → `/docs/quickstart` at the end of the read.
- At 390: the on-page contents move above the body as a collapsed disclosure and are not
  sticky. Everything else stacks in the same order.

### /docs/

The landing page only. The 29 existing reference pages inside the docs framework are fixed
and are not restructured by this sitemap.

- Purpose: hand a visitor arriving from the marketing side into the existing docs without
  restructuring them.
- Fixed, not redesigned: the docs framework supplies its own header, its own left sidebar
  nav over the 29 reference pages, and an on-page table of contents on the right. This
  sitemap specifies only the landing page's content column and the seam into it.
- Content column, top to bottom:
  1. landing head: title · one line stating these are the reference pages · the copyable
     dependency coordinate, the same block as the homepage hero
  2. the one action: **[Get started]** → `/docs/quickstart`, stated as the first page to
     read
  3. routes into the existing pages: a short set of grouped links pointing at pages that
     already exist in the sidebar. The grouping is presentational only; it creates no new
     pages and no new hierarchy.
  4. back to the marketing side: link to `/learn/` for background reading · links to
     GitHub and Maven Central
- Pushes toward: open `/docs/quickstart`.
- The seam: every **[Get started]** on the marketing site lands on `/docs/quickstart`
  directly, not here. This landing page is for visitors who click "Docs" in the global
  header.
- Footer: whichever footer the docs framework renders, which must still carry Apache 2.0,
  LICENSE, NOTICE and attribution.

## Global footer

On every marketing page, in this order:

1. licence: Apache 2.0, stated in words
2. link: LICENSE
3. link: NOTICE
4. attribution line
5. repeat links: Docs · Learn
6. GitHub
7. Maven Central

No forms, no email capture, no social row. At 390 every block stacks in this order.

## Not in the tree

No blog, changelog, playground, pricing, about page, forms or newsletter. The docs are
unversioned. Javadoc deep-links to javadoc.io rather than being self-hosted.
