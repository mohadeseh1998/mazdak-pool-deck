#!/usr/bin/env node
// Makes the Gate 2 PDF and a screenshot of every slide from the built page.
// Run after `npm run publish` (it reads docs/):
//   node scripts/gate2-export.mjs [--shots <folder>] [--phone <folder>]
// Writes docs/gate2/Mazdak-Gate2-Final-Pitch.pdf: one 1920 by 1080 page per
// slide, text kept as text, the video slide as its poster plus a link.
// Needs Playwright with Chromium.
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require("playwright");
} catch {
  playwright = require(join(process.env.NODE_PATH ?? "/usr/lib/node_modules", "playwright"));
}

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const shots = arg("--shots");
const phone = arg("--phone");
const PDF = "docs/gate2/Mazdak-Gate2-Final-Pitch.pdf";
const SLIDES = 9;

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" };
const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join("docs", path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/gate2/`;

const browser = await playwright.chromium.launch();
try {
  const ready = async (page) => {
    await page.waitForSelector("section.slide");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
  };

  // Screenshots, as the room sees them at 1920 by 1080.
  if (shots) {
    mkdirSync(shots, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    for (let n = 1; n <= SLIDES; n++) {
      await page.goto(`${base}?export#/${n}`);
      await ready(page);
      await page.evaluate((i) => document.querySelectorAll("section.slide")[i].scrollIntoView({ block: "start" }), n - 1);
      await page.waitForTimeout(400);
      await page.screenshot({ path: join(shots, `slide-${n}.png`) });
    }
    await page.close();
  }

  // Phone screenshots, one per slide, full section height.
  if (phone) {
    mkdirSync(phone, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto(`${base}?export#/1`);
    await ready(page);
    const sections = await page.$$("section.slide");
    for (let i = 0; i < sections.length; i++) {
      await sections[i].screenshot({ path: join(phone, `phone-${i + 1}.png`) });
    }
    await page.close();
  }

  // The PDF: print media, the page's own print styles (dark ground kept).
  mkdirSync("docs/gate2", { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`${base}?export#/1`);
  await ready(page);
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: PDF, width: "1920px", height: "1080px", printBackground: true, preferCSSPageSize: false });
  console.log(`Wrote ${PDF}`);
} finally {
  await browser.close();
  server.close();
}
