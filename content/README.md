One Markdown file per page (`home.md`, `specs.md`, `404.md`, ...). Each file: front matter with title and meta description, then one `## section` per anatomy slot in order, each with headline, body, button label and image path. Stage 2 copy that is not from the client is marked `[mock]`; Stage 3 removes every `[mock]` or moves the fact to QUESTIONS.md.

`docs/` and `learn/` are the two collections, loaded by `src/content.config.ts` and rendered by the routes under `src/pages`. They are prose rather than section slots, and they carry three conventions:

- Links are written root-absolute (`/docs/quickstart`); the deployment base is applied at build time, because the repository may be renamed.
- `__VERSION__` renders as the released version from `site.config.mjs`. Never write a version number out.
- `:::note[Title]`, `:::tip`, `:::caution` and `:::danger` render as the page's asides. A file that needs tabs, numbered steps or the support matrix is `.mdx` and imports the component it needs from `src/components/prose/`.

`docs/index.md` and `learn/index.md` are the front sheets of their sections: their words are here, their lists of pages are generated from the reading order in `src/data/docs.ts` and from the articles' own `order`.
