/**
 * Resolve root-absolute Markdown links and images against the deployment base.
 *
 * Starlight rewrites the links it generates itself - the sidebar, pagination,
 * the header - but a link written in Markdown is emitted exactly as authored.
 * A bare `/docs/quickstart/` therefore resolves in dev, where the site is served
 * from the root, and 404s in production, where it is served from a subpath. That
 * is the worst failure shape available (docs/DECISIONS.md D5), so it is closed
 * at build time rather than left to authoring discipline.
 *
 * Authors write root-absolute paths; this resolves them. The base is still
 * written down exactly once, in src/consts.ts.
 *
 * A Sätteri mdast plugin rather than a remark one: remark plugins would pull in
 * `@astrojs/markdown-remark` and swap the whole Markdown pipeline, which is a
 * large change to make for a link prefix.
 */
import { defineMdastPlugin } from 'satteri';

import { BASE } from '../consts.ts';

const base = BASE.replace(/\/$/, '');

/** Root-absolute, and not protocol-relative (`//example.com`). */
function isInternal(url) {
  return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');
}

function prefix(node, ctx) {
  if (isInternal(node.url)) {
    ctx.setProperty(node, 'url', `${base}${node.url}`);
  }
}

export const baseLinks = defineMdastPlugin({
  name: 'idempotency4j:base-links',
  link: prefix,
  image: prefix,
  definition: prefix,
});
