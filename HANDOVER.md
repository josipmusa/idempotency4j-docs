# Running this site

The site is the marketing and documentation front for **idempotency4j**. It is a static
Astro build, published by GitHub Actions to GitHub Pages at
`https://josipmusa.github.io/idempotency4j-docs/`. There is no server, no database and no
account to pay for.

## Changing the words

Every sentence on the site lives in `content/`, one Markdown file per page. Nothing in
`src/` contains prose you would want to edit.

| You want to change | Edit |
| --- | --- |
| The homepage | `content/home.md` |
| A reference page | `content/docs/<the page>.md` |
| A learn article | `content/learn/<the article>.md` |
| The specification sheet | `content/specs.md` |
| The "nothing at this address" page | `content/404.md` |

Edit the file, commit, push to `main`. The site rebuilds and republishes itself in about
two minutes. Watch it under the repository's **Actions** tab.

`content/README.md` is the authoring guide: how the front matter works, what the
`:::caution` blocks are, and the house rules for the prose. Read it before writing a new
page. The one rule worth repeating here: **nothing on a page describes the site or how it
was made.** Every sentence is about the library.

## Adding a page

1. Write `content/docs/<group>/<name>.md` with `title` and `description` in its front
   matter.
2. Add its id to the right group in `src/data/docs.ts`. That file is the reading order,
   and it is what the reference index and the previous/next links are built from. A page
   that is not listed there does not appear in the index; a page listed there that has no
   file fails the build on purpose.

A learn article needs no list. Drop the file in `content/learn/` with `title`,
`description`, the `question` it answers and an `order` number, and it takes its place
among the others.

## When the library is released again

Open `site.config.mjs` and change `LIBRARY_VERSION`. That is the whole job. Every
coordinate, every dependency snippet and every `__VERSION__` token in the prose is
generated from it, so no version number is written out anywhere else and none of them can
drift.

Then re-read the pages against the library's `README.md` and its Java sources. The front
matter's `sourceOf` field on each reference page says which part of the library it was
taken from. That field is never shown to a reader; it exists so this check is possible.

## Images

There are none, by design. The direction is a printed plate: the drawing is done in CSS
and SVG, and the only raster file on the site is `public/og.png`, the card that appears
when a link is shared. If a photograph is ever added it goes in `assets/`, sized for the
web and named by its section, and it needs real alt text.

`public/og.svg` is the source for that card. Re-rasterise it to `og.png` at 1200×630 if
its words ever change.

## Deploying

Pushing to `main` is the deploy. `.github/workflows/deploy.yml` runs `npm ci`, then
`npm run build`, which is `astro build` followed by `pagefind` indexing the result, and
hands the folder to Pages.

To publish without a code change - to re-run a failed build, for instance - open
**Actions → Deploy → Run workflow**.

Nothing in the workflow names the repository. If it is ever renamed, the base path follows
automatically and no file needs editing.

## Running it locally

```
npm install
npm run dev -- --port 4399 --host 127.0.0.1
```

Use the URL Astro prints; the base path is part of it. `npm run build && npm run preview`
gives you the real static output, which is the only way to test search - Pagefind indexes
the built files, so it does not exist in dev.

## What it costs

Nothing. GitHub Pages is free for a public repository. There is no domain, so there is no
renewal. If a custom domain is ever wanted, it is a `CNAME` file and a DNS record, and the
only code change is that `SITE` in `site.config.mjs` stops being the github.io host.

## Where things are

```
content/          every word on the site
src/data/         docs.ts is the reference's reading order; home.ts and specs.ts the
                  structured parts of those two pages
src/components/   the pieces pages are built from
src/styles/       tokens.css is the palette, type and spacing; fonts.css the three faces
site.config.mjs   version, coordinates, deployment path - the single source of all four
web/              the process kit this site was built with; not part of the site
DECISIONS.md      why the site is the way it is, one line per decision
```

## If something breaks

The build fails loudly rather than publishing something wrong: a page listed in
`src/data/docs.ts` with no file, or front matter missing a title or description, stops the
build. Read the error in the Actions log - it names the file.

If the site is up but a page 404s, the likely cause is a link written with a leading `/`
that skipped the `url()` helper. Every internal link has to go through it, because the
site is served from a sub-path.
