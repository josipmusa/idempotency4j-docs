// The four things the prose needs that Markdown does not do on its own. All of them are
// tree rewrites rather than authoring conventions, so the content in content/ stays plain
// Markdown that reads correctly in an editor.
//
// Written for Sätteri, the Markdown processor Astro runs by default: a plugin subscribes
// to node types and mutates through the context rather than walking the tree itself.
import { defineHastPlugin, defineMdastPlugin } from 'satteri';
import { BASE, LIBRARY_VERSION } from '../../site.config.mjs';
import { codeBar } from './code-bar.mjs';

const base = BASE.replace(/\/$/, '');

/* The pages are authored with root-absolute links - /docs/quickstart - because the
   repository may be renamed and the deployment path is derived, never written down. The
   base is applied here, once, for every link in every page. The trailing slash the
   content carries comes off, because the site's own URLs do not have one. */
function prefix(node, ctx) {
  const target = node.url;
  if (typeof target !== 'string' || !target.startsWith('/') || target.startsWith('//')) return;
  const [path, rest = ''] = target.split(/(?=[?#])/, 2);
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path;
  ctx.setProperty(node, 'url', `${base}${clean}${rest}`);
}

export const baseLinks = defineMdastPlugin({
  name: 'idempotency4j:base-links',
  link: prefix,
  image: prefix,
  definition: prefix,
});

/* The released version appears in coordinates all through the docs. It is written as
   __VERSION__ in the content and rendered from the one constant, in prose and in code. */
const TOKEN = '__VERSION__';

function substitute(node, ctx) {
  if (typeof node.value === 'string' && node.value.includes(TOKEN)) {
    ctx.setProperty(node, 'value', node.value.replaceAll(TOKEN, LIBRARY_VERSION));
  }
}

export const versionToken = defineMdastPlugin({
  name: 'idempotency4j:version-token',
  code: substitute,
  inlineCode: substitute,
  text: substitute,
  // In prose the token is read as emphasis before this plugin sees it: __VERSION__ is
  // strong text saying VERSION. Inside a code block it survives as written, which is
  // why the token looks like it works until the first time it is used in a sentence.
  strong(node, ctx) {
    if (ctx.textContent(node) !== 'VERSION') return;
    ctx.replaceNode(node, { type: 'text', value: LIBRARY_VERSION });
  },
});

/* :::note[Title] blocks. The four kinds the content uses are two registers - something
   worth knowing, and something that will bite - so they render as two, marked by their
   own words rather than by an icon and a colour. */
const KINDS = { note: 'note', tip: 'note', caution: 'warn', danger: 'warn' };

export const asides = defineMdastPlugin({
  name: 'idempotency4j:asides',
  containerDirective(node) {
    const kind = KINDS[node.name];
    if (!kind) return;

    const children = node.children ?? [];
    const label = children.find(
      (child) => child.type === 'paragraph' && child.data?.directiveLabel,
    );

    return {
      type: 'blockquote',
      data: { hName: 'aside', hProperties: { class: `aside aside--${kind}` } },
      children: [
        ...(label
          ? [
              {
                type: 'paragraph',
                data: { hProperties: { class: 'aside__label' } },
                children: label.children,
              },
            ]
          : []),
        ...children.filter((child) => child !== label),
      ],
    };
  },
});

/* A code block and a table both need a box around them: the table so it can be read
   across on a phone by scrolling the plate rather than the page, the code block so the
   bar naming it and carrying its Copy button is inside the same box as the code. Both
   are structural, so they are added here and not by the script that wires the button. */
export const wrapBlocks = defineHastPlugin({
  name: 'idempotency4j:wrap-blocks',
  element: {
    filter: ['pre', 'table'],
    visit(node, ctx) {
      const parent = ctx.parent(node);
      const klass = node.tagName === 'pre' ? 'code' : 'table';
      const already = parent?.type === 'element' && [parent.properties?.class]
        .flat()
        .join(' ')
        .split(/\s+/)
        .includes(klass);
      if (already) return;

      ctx.wrapNode(node, {
        type: 'element',
        tagName: 'div',
        properties: { class: klass },
        children: node.tagName === 'pre' ? [codeBar(node.properties?.dataLanguage)] : [],
      });
    },
  },
});
