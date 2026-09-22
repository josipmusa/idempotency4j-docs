The only source of words for the site. One Markdown file per standalone page (`home.md`,
`specs.md`, `404.md`), plus `docs/` and `learn/`, which are Astro content collections.

Each standalone file: front matter with title and meta description, then one `## section`
per anatomy slot, in order. `src/data/home.ts` mirrors `home.md` verbatim as typed data.

Two rules. Every factual claim - versions, coordinates, matrix rows, limits - is the
library's own, from `README.md` at the released version; anything the library does not
answer goes to `QUESTIONS.md` rather than being written here. And nothing on a page
describes the site or how it was made: the words are about the library, for someone
deciding whether to use it.

`__VERSION__` renders from `site.config.mjs`. Never type a version or a coordinate out.
