import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/**
 * Starlight serves its `[...slug]` route from the root of the site, so a page
 * at `src/content/docs/quickstart.md` would land on `/quickstart` and collide
 * with the hand-built pages. Prefixing every generated id with `docs/` mounts
 * the whole collection under `/docs` (docs/SITEMAP.md) while keeping the files
 * where CLAUDE.md says they live.
 *
 * `index.md` becomes the id `docs`, which is the `/docs/` landing page.
 */
const DOCS_ROUTE = 'docs';

function slugify(segment: string): string {
  return segment
    .replace(/^\d+[-_]/, '') // allow 01-ordering prefixes on filenames
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateId({ entry }: { entry: string }): string {
  const withoutExtension = entry.replace(/\.[^./]+$/, '');
  const segments = withoutExtension
    .split('/')
    .filter((segment) => segment && segment !== 'index')
    .map(slugify)
    .filter(Boolean);
  return [DOCS_ROUTE, ...segments].join('/');
}

/**
 * `/learn` is not Starlight. The articles answer "help me understand the
 * problem" rather than "how do I use idempotency4j", which is a different
 * register, a different layout and a different reader (docs/SITEMAP.md), so they
 * get their own collection rather than a seventh sidebar group.
 *
 * The route and the layout are phase 7. This collection exists now so the
 * articles are written, validated and built against a schema rather than left
 * as loose files.
 */
const learn = defineCollection({
  loader: glob({ base: './src/content/learn', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /**
     * The one question the article answers, in the reader's words rather than
     * the library's. It is the article's contract: anything that does not serve
     * it belongs in another article or in /docs.
     */
    question: z.string(),
    /** Reading order on the index. Not a date - these are not posts. */
    order: z.number().int().positive(),
  }),
});

export const collections = {
  learn,
  docs: defineCollection({
    loader: docsLoader({ generateId }),
    schema: docsSchema({
      /**
       * The README section this page derives from (docs/DECISIONS.md D4).
       * The parity check reads it to know which prose to compare against.
       * Optional: the docs landing page and the javadoc index have no README
       * source and omit it rather than carrying an empty string.
       */
      extend: z.object({
        sourceOf: z.string().optional(),
        /**
         * The diagram this page owns, named as it is in docs/CONTENT.md. Phase 4
         * assigns it; phase 7 places the asset. The first two already exist in the
         * library repo; the other three are drawn for this site.
         */
        diagram: z
          .enum([
            'record-lifecycle',
            'request-outcomes',
            'scope-and-key',
            'lease-and-wait',
            'completion-window',
          ])
          .optional(),
      }),
    }),
  }),
};
