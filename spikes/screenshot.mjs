// Spike harness: serves spikes/ over a local static server, screenshots every
// spikes/*.html variant (except index.html and contact-sheet.html) at three
// widths, then writes spikes/contact-sheet.html so all variants can be judged
// side by side at each width.
//
// Usage: node spikes/screenshot.mjs [--widths 1440,768,390]
// Requires: playwright (npm i -D playwright && npx playwright install chromium)

import { createReadStream } from "node:fs";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const argWidths = process.argv.find((a) => a.startsWith("--widths="))?.split("=")[1];
const widths = (argWidths ?? "1440,768,390").split(",").map(Number);
const spikesDirectory = resolve(fileURLToPath(new URL(".", import.meta.url)));
const screenshotsDirectory = resolve(spikesDirectory, "screenshots");
const excluded = new Set(["index.html", "contact-sheet.html"]);

const mimeTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".mjs": "text/javascript; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function serveSpikes() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://localhost");
      const relativePath = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
      const filePath = resolve(spikesDirectory, relativePath);
      if (!filePath.startsWith(`${spikesDirectory}${sep}`)) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      const file = await stat(filePath);
      if (!file.isFile()) {
        response.writeHead(404).end("Not found");
        return;
      }
      response.writeHead(200, {
        "Content-Type": mimeTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream",
      });
      if (request.method === "HEAD") {
        response.end();
        return;
      }
      createReadStream(filePath).pipe(response);
    } catch (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500).end("Not found");
    }
  });
  return new Promise((resolveServer, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolveServer(server));
  });
}

function contactSheet(variantNames) {
  const rows = widths
    .map(
      (width) => `
    <h2>${width}px</h2>
    <div class="row">
      ${variantNames
        .map(
          (name) => `
      <figure>
        <figcaption><a href="../${name}.html">${name}</a></figcaption>
        <a href="${name}-${width}.png"><img src="${name}-${width}.png" alt="${name} at ${width}px" loading="lazy" /></a>
      </figure>`,
        )
        .join("")}
    </div>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Contact sheet</title>
<style>
  body { margin: 0; padding: 32px; font: 14px/1.5 system-ui, sans-serif; color: #222; background: #f4f4f2; }
  h1 { font-size: 20px; margin: 0 0 8px; }
  p { margin: 0 0 24px; color: #666; max-width: 70ch; }
  h2 { font-size: 14px; letter-spacing: .08em; text-transform: uppercase; color: #666; margin: 40px 0 12px; border-top: 1px solid #ddd; padding-top: 16px; }
  .row { display: flex; gap: 24px; overflow-x: auto; padding-bottom: 12px; align-items: flex-start; }
  figure { margin: 0; flex: 0 0 auto; }
  figcaption { font-weight: 600; margin-bottom: 8px; }
  figcaption a { color: inherit; }
  img { display: block; width: 360px; max-height: 1400px; object-fit: cover; object-position: top; border: 1px solid #ddd; background: #fff; }
</style>
</head>
<body>
<h1>Contact sheet</h1>
<p>Every variant at every width, top-aligned and cropped to the same height so the comparison tests the design, not the page length. Click a figure to open the full-page capture; click a caption to open the live variant.</p>
${rows}
</body>
</html>
`;
}

async function main() {
  const variants = (await readdir(spikesDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html") && !excluded.has(entry.name))
    .map((entry) => entry.name)
    .sort();

  if (variants.length === 0) {
    console.log("No spikes/*.html variants found; nothing to capture.");
    return;
  }

  await mkdir(screenshotsDirectory, { recursive: true });
  const server = await serveSpikes();
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  let browser;
  const captured = [];
  const variantNames = [];

  try {
    browser = await chromium.launch();
    for (const variant of variants) {
      const variantName = variant.slice(0, -extname(variant).length);
      variantNames.push(variantName);
      for (const width of widths) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        const response = await page.goto(`${baseUrl}/${encodeURIComponent(variant)}`, { waitUntil: "networkidle" });
        if (!response?.ok()) {
          throw new Error(`Could not load ${variant} at ${width}px (${response?.status() ?? "no response"}).`);
        }
        await page.evaluate(() => document.fonts.ready);
        const outputPath = resolve(screenshotsDirectory, `${variantName}-${width}.png`);
        await page.screenshot({ path: outputPath, fullPage: true });
        await page.close();
        captured.push(`${variantName}-${width}.png`);
      }
    }
    await writeFile(resolve(screenshotsDirectory, "contact-sheet.html"), contactSheet(variantNames));
  } finally {
    await browser?.close();
    await new Promise((resolveClose, reject) => server.close((error) => (error ? reject(error) : resolveClose())));
  }

  console.log(`Captured ${captured.length} screenshot(s) from ${variants.length} variant(s).`);
  for (const screenshot of captured) console.log(`- spikes/screenshots/${screenshot}`);
  console.log(`Contact sheet: spikes/screenshots/contact-sheet.html`);
}

await main();
