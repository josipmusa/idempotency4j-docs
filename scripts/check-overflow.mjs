/**
 * Fail on horizontal overflow, at every route and every viewport.
 *
 * ROADMAP phase 9 asks that every table and code block scroll in its own container and
 * that the page body never scroll horizontally at 390. Two distinct defects produce that,
 * and only one of them is visible from the page:
 *
 *   1. Content pushing the body wider than the viewport - a horizontal scrollbar, which
 *      makes every vertical swipe on a phone feel unstable.
 *   2. Content wider than a box that neither scrolls nor lets it out. The overflow is
 *      simply lost: a title reading "... on your applicatio", with no scrollbar and no
 *      page-level symptom to notice. An unbreakable inline code token in a flex row is
 *      the usual cause.
 *
 * Run against a dev or preview server. Pass the base URL and the routes file:
 *
 *   npm run build
 *   node scripts/check-overflow.mjs http://127.0.0.1:4399 routes.txt
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const [origin, routesFile] = process.argv.slice(2);

if (!origin || !routesFile) {
  console.error('usage: node scripts/check-overflow.mjs <origin> <routes-file>');
  process.exit(1);
}

const routes = readFileSync(routesFile, 'utf8').trim().split('\n');
const widths = [390, 768, 1440];
const browser = await chromium.launch();
let bad = 0;

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const route of routes) {
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const doc = document.documentElement;
      const clipped = [];
      // Content wider than its box, where the box neither scrolls nor lets it out:
      // the overflow is simply lost, and the page shows no symptom at all.
      for (const el of document.querySelectorAll('.sl-markdown-content *')) {
        if (el.scrollWidth <= el.clientWidth + 1) continue;
        const s = getComputedStyle(el);
        if (/auto|scroll/.test(s.overflowX)) continue;
        if (s.overflowX === 'visible') continue;
        // Visually-hidden text is clipped on purpose.
        if (el.classList.contains('sr-only') || s.clip !== 'auto' || el.clientWidth <= 1) continue;
        clipped.push(`${el.tagName}.${(el.className || '').toString().slice(0, 40)} ${el.scrollWidth}>${el.clientWidth} "${(el.textContent || '').trim().slice(0, 50)}"`);
      }
      return { body: doc.scrollWidth - doc.clientWidth, clipped };
    });
    if (r.body > 0 || r.clipped.length) {
      bad++;
      console.log(`${width}px  ${route}`);
      if (r.body > 0) console.log(`    page body overflows by ${r.body}px`);
      for (const c of r.clipped) console.log(`    clipped: ${c}`);
    }
  }
  await page.close();
}

console.log(bad === 0
  ? `\nNo page overflow and no clipped content across ${routes.length} routes at ${widths.join(' / ')}`
  : `\n${bad} route/viewport combination(s) with a problem`);
await browser.close();
process.exit(bad === 0 ? 0 : 1);
