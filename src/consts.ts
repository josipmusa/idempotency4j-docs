/**
 * The one place the deployment path is written down.
 *
 * The site ships to GitHub Pages in its own repo, so every URL carries the repo
 * name as a prefix (docs/DECISIONS.md D5). Set BASE to '' the day a custom
 * domain lands (D7) and nothing else needs to change.
 *
 * Nothing else in the codebase hardcodes either of these values. Internal links
 * go through href() below or Astro's import.meta.env.BASE_URL.
 */
export const BASE = '/idempotency4j-docs';
export const SITE = 'https://josipmusa.github.io';

export const SITE_TITLE = 'idempotency4j';
export const SITE_DESCRIPTION =
  'Idempotency for Java and Spring Boot: make a retried request produce one effect, not two.';

/** The library's own repository, linked from the header and the footer. */
export const GITHUB_URL = 'https://github.com/josipmusa/idempotency4j';

/**
 * Resolve an internal path against the deployment base.
 *
 * Use this for anything referenced as a string - links, `public/` assets, meta
 * tags. Assets imported through Astro are rewritten by the build and must not
 * be passed through here.
 *
 *   href('/docs/quickstart')  ->  '/idempotency4j-docs/docs/quickstart'
 *   href('/')                 ->  '/idempotency4j-docs/'
 */
export function href(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/** The same path as an absolute URL, for canonical tags, Open Graph and the sitemap. */
export function absoluteUrl(path: string): string {
  return new URL(href(path), SITE).toString();
}
