/**
 * Fail the build when an internal link or asset does not resolve under the base prefix.
 *
 * This exists because the defect is invisible in development. The dev server serves
 * from the root, so a bare `/docs/quickstart` works there and 404s in production -
 * the worst failure shape available (docs/DECISIONS.md D5, CLAUDE.md rule 1).
 *
 * Two classes of defect are checked, and the second is why a grep is not enough:
 *
 *   1. An internal URL emitted without the prefix. The Sätteri plugin in
 *      src/plugins/base-links.mjs resolves Markdown links, but it only sees mdast
 *      `link` nodes - an `href` passed as a prop to a component (`<LinkCard href="/docs/…">`)
 *      never reaches it and ships unprefixed.
 *   2. A prefixed URL pointing at a page that does not exist, usually after a rename.
 *   3. A `#fragment` naming an element id the target page does not have. Heading ids are
 *      generated from the heading text, so an anchor written by hand goes stale the moment
 *      the heading is reworded, and nothing in the build notices.
 *
 * Run against dist/ after a build. Reads the base from src/consts.ts so the prefix is
 * still written down exactly once.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const consts = readFileSync(new URL('../src/consts.ts', import.meta.url), 'utf8');
const base = consts.match(/export const BASE = '([^']*)'/)?.[1];

if (base === undefined) {
  console.error('check-links: could not read BASE from src/consts.ts');
  process.exit(1);
}

if (!existsSync(dist)) {
  console.error('check-links: dist/ is missing - run `npm run build` first');
  process.exit(1);
}

/** Every .html file under dist/, recursively. */
function htmlFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return full.endsWith('.html') ? [full] : [];
  });
}

/**
 * Whether a prefixed URL resolves to something the build emitted.
 *
 * Astro writes `/docs/quickstart/` as `dist/docs/quickstart/index.html`, so a
 * directory-shaped URL is checked against its index. A fragment or query is
 * stripped first; a bare fragment links within the page and is not our concern.
 */
function pageFor(url) {
  const path = url.split(/[?#]/)[0].slice(base.length) || '/';
  const target = join(dist, path);
  if (existsSync(target) && statSync(target).isFile()) return target;
  const index = join(target, 'index.html');
  return existsSync(index) ? index : null;
}

/** Every `id` attribute in a page, cached because pages are linked to repeatedly. */
const idCache = new Map();
function idsIn(file) {
  let ids = idCache.get(file);
  if (!ids) {
    const html = readFileSync(file, 'utf8');
    ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id));
    idCache.set(file, ids);
  }
  return ids;
}

const unprefixed = [];
const broken = [];
const danglingFragments = [];

for (const file of htmlFiles(dist)) {
  const html = readFileSync(file, 'utf8');
  const where = relative(dist, file);

  // A bare `#fragment` points within the page it is written on.
  for (const [, fragment] of html.matchAll(/\bhref="#([^"]+)"/g)) {
    if (!idsIn(file).has(decodeURIComponent(fragment))) {
      danglingFragments.push(`${where}: href="#${fragment}"`);
    }
  }

  for (const [, attr, url] of html.matchAll(/\b(href|src)="(\/[^"]*)"/g)) {
    // Protocol-relative URLs (`//example.com`) are external.
    if (url.startsWith('//')) continue;

    if (base && !url.startsWith(`${base}/`) && url !== base) {
      unprefixed.push(`${where}: ${attr}="${url}"`);
      continue;
    }

    const page = pageFor(url);
    if (!page) {
      broken.push(`${where}: ${attr}="${url}"`);
      continue;
    }

    const fragment = url.split('#')[1];
    if (fragment && !idsIn(page).has(decodeURIComponent(fragment))) {
      danglingFragments.push(`${where}: ${attr}="${url}"`);
    }
  }
}

for (const [label, hits] of [
  ['Internal URLs missing the base prefix', unprefixed],
  ['Internal URLs that resolve to nothing', broken],
  ['Fragments naming an id the target page does not have', danglingFragments],
]) {
  if (hits.length === 0) continue;
  console.error(`\n${label} (${hits.length}):`);
  for (const hit of hits) console.error(`  ${hit}`);
}

if (unprefixed.length || broken.length || danglingFragments.length) process.exit(1);

console.log(`check-links: every internal URL resolves under ${base || '(no prefix)'}`);
