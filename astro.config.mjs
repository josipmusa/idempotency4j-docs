// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { BASE, SITE } from './site.config.mjs';
import { asides, baseLinks, versionToken, wrapBlocks } from './src/plugins/markdown.mjs';
import { hangingIndent } from './src/plugins/shiki.mjs';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },

  // The docs and learn prose lives in content/ as Markdown. MDX is there for the few
  // pages that need a real component in the middle of the prose - build-tool tabs, the
  // support matrix - and inherits this same Markdown configuration.
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: satteri({
      // :::caution[…] blocks are in the content already; the plugin below turns them
      // into the page's own asides.
      features: { directive: true },
      mdastPlugins: [asides, baseLinks, versionToken],
      hastPlugins: [wrapBlocks],
    }),
    shikiConfig: { theme: 'css-variables', transformers: [hangingIndent] },
  },
});
