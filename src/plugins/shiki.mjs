// Code wraps rather than scrolling sideways, and a wrapped line should continue under
// its own indent, not at the left edge of the block. CSS cannot see how many spaces a
// line starts with, so each Shiki line carries it as --i and the stylesheet hangs the
// continuation from there.
//
// The indent is also glued to the line's first character. A run of spaces is a place
// the browser prefers to wrap, so a long indented line - a Maven coordinate on a phone -
// would otherwise wrap straight after its indent and leave an empty row above itself.
// The characters are untouched, so Copy and a hand selection still get the real text.
const leaves = (node, out = []) => {
  if (node.type === 'text') out.push(node);
  else (node.children ?? []).forEach((child) => leaves(child, out));
  return out;
};

const parentOf = (root, target) => {
  for (const child of root.children ?? []) {
    if (child === target) return root;
    const found = parentOf(child, target);
    if (found) return found;
  }
  return undefined;
};

export const hangingIndent = {
  name: 'idempotency4j:hanging-indent',
  line(node) {
    const texts = leaves(node);
    const indent = /^ */.exec(texts.map((t) => t.value).join(''))[0].length;
    if (indent === 0) return;
    node.properties.style = `--i:${indent}ch`;

    // Carry any all-space leaves into the first leaf that has something in it.
    let spaces = '';
    while (texts.length > 1 && /^ *$/.test(texts[0].value)) {
      spaces += texts[0].value;
      texts[0].value = '';
      texts.shift();
    }
    const first = texts[0];
    first.value = spaces + first.value;
    const lead = /^ +\S?/.exec(first.value)?.[0];
    if (!lead) return;

    const parent = parentOf(node, first);
    const at = parent.children.indexOf(first);
    parent.children.splice(
      at,
      1,
      {
        type: 'element',
        tagName: 'span',
        properties: { class: 'lead' },
        children: [{ type: 'text', value: lead }],
      },
      ...(first.value.length > lead.length ? [{ type: 'text', value: first.value.slice(lead.length) }] : []),
    );
  },
};
