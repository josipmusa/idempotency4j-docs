// The bar on top of every code block: what the block is, and the button that copies it.
// Rendered at build time so the box has its final height in the first frame; the copy
// script only switches the button on, because without script it could do nothing.

// Shiki's grammar ids are not what a reader calls them: a Gradle build file is
// highlighted as groovy, a Maven one as xml.
const LANGUAGES = {
  java: 'Java',
  xml: 'Maven',
  groovy: 'Gradle',
  kotlin: 'Kotlin',
  yaml: 'YAML',
  yml: 'YAML',
  properties: 'Properties',
  sql: 'SQL',
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
  json: 'JSON',
  http: 'HTTP',
};

export const languageLabel = (id = '') =>
  LANGUAGES[id] ?? (id && id !== 'plaintext' && id !== 'text' ? id : '');

export const codeBar = (id) => ({
  type: 'element',
  tagName: 'div',
  properties: { class: 'code__bar' },
  children: [
    {
      type: 'element',
      tagName: 'span',
      properties: { class: 'code__lang' },
      children: [{ type: 'text', value: languageLabel(id) }],
    },
    {
      type: 'element',
      tagName: 'button',
      properties: { type: 'button', class: 'code__copy', hidden: true },
      children: [{ type: 'text', value: 'Copy' }],
    },
  ],
});
