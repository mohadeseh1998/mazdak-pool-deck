#!/usr/bin/env node
// Content guard (brief Sections 7.4, 9, 10 and 11), reused from the Gate 1
// deck. Runs before every build and on every commit (.githooks/pre-commit).
// Fails if:
//   - the em dash character appears in any file in the repository,
//   - the private brief or the private banned-words list is tracked by git,
//   - a word from banned-words.local.txt (gitignored, never committed) appears,
//   - a Section 11 item appears (country names, endorsements, testimonials,
//     market size, sale claims, store names on a slide, unknown images),
//   - the budget does not add up: run total 800, ask 500 core or 800 full.
//
// This script is public, so it holds no sensitive words of its own. Those live
// only in banned-words.local.txt on the founder's machine.
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";

const EM_DASH = String.fromCharCode(0x2014);
const BANNED_FILE = "banned-words.local.txt";
const problems = [];
const notes = [];

const BINARY = /\.(png|jpe?g|webp|gif|mp4|mov|ico|pdf|woff2?|ttf|otf)$/i;

const listed = (cmd) =>
  execSync(cmd, { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);

// Everything git tracks or would track: committed, staged and new files.
const files = listed("git ls-files --cached --others --exclude-standard").filter((f) => existsSync(f));
const textFiles = files.filter((f) => !BINARY.test(f));
const read = (f) => readFileSync(f, "utf8");
const lineOf = (text, index) => text.slice(0, index).split("\n").length;

/* 1. No em dash anywhere (Section 10, item 12 of Section 11). ----------- */
for (const file of textFiles) {
  read(file)
    .split("\n")
    .forEach((line, i) => {
      if (line.includes(EM_DASH)) problems.push(`${file}:${i + 1}: em dash character`);
    });
}

/* 2. Private files must never be tracked. ------------------------------- */
const tracked = listed("git ls-files --cached");
for (const f of tracked) {
  if (f === BANNED_FILE || (/brief/i.test(f.split("/").pop()) && f.endsWith(".md")))
    problems.push(`${f}: private file is tracked by git; remove it with git rm --cached`);
}

/* 3. Private banned words, read from the gitignored list. --------------- */
// The build output (docs/) is generated from src/, so it is checked through
// src/; its minified names can collide with short words by chance.
const sourceFiles = textFiles.filter((f) => !f.startsWith("docs/") && f !== "package-lock.json" && f !== BANNED_FILE);
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wordPattern = (phrase) =>
  new RegExp(`(?<![\\p{L}\\p{N}])${phrase.trim().split(/\s+/).map(escape).join("[\\s-]+")}(?![\\p{L}\\p{N}])`, "giu");

if (existsSync(BANNED_FILE)) {
  const banned = read(BANNED_FILE)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  for (const file of sourceFiles) {
    const text = read(file);
    for (const word of banned) {
      for (const m of text.matchAll(wordPattern(word))) {
        problems.push(`${file}:${lineOf(text, m.index)}: banned word from ${BANNED_FILE} (entry ${banned.indexOf(word) + 1})`);
      }
    }
  }
  notes.push(`${banned.length} private banned words checked`);
} else {
  notes.push(`no ${BANNED_FILE} on this machine, private word check skipped`);
}

/* 4. Section 11. -------------------------------------------------------- */
// Copy files: what the room or a reader of the repo can see. CSS is left out
// because its font fallback stack names a typeface that shares a country name.
const copyFiles = sourceFiles.filter((f) => /^src\/.*\.(ts|tsx)$/.test(f) || f === "README.md" || f === "index.html");

// Item 1: no country other than Canada. Names come from the runtime's own
// region list, so no country is written in this file.
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const countries = new Set();
const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
for (const a of A)
  for (const b of A) {
    const code = a + b;
    let name;
    try {
      name = regionNames.of(code);
    } catch {
      continue;
    }
    if (name && name !== code && !/Canada|Pseudo|Unknown/.test(name)) countries.add(name);
  }

const section11 = [
  [/trusted by/i, "\"trusted by\" strip (item 8)"],
  [/testimonial/i, "testimonial (item 8)"],
  [/no competition|no competitors/i, "\"no competition\" (item 9)"],
  [/market size|\bbillion\b|\bTAM\b|\bSAM\b|\bSOM\b/i, "market size figure (item 9)"],
  [/(UNB\s+(has\s+)?(tested|tests|validated|validates|endorsed|endorses|approved|approves|certified|certifies))|((tested|validated|endorsed|approved|certified)\s+by\s+UNB)/i, "UNB endorsement (item 5)"],
  [/clarifier[^.\n]*\b(kills?|sanitiz\w*|disinfects|antibacterial|prevents algae|stops algae)\b/i, "algae or sanitising claim for the clarifier (item 6)"],
  [/anti-algae[^.\n]*\b(available now|on sale now|for sale now|buy now|in stock)\b/i, "anti-algae offered for sale now (item 7)"],
  [/past customers?|our customers say/i, "past customers (items 1 and 8)"],
];

// Item 8: the six local stores are targets. They may appear only in the
// presenter note that lists them, never on a slide.
const STORE_NOTE = "Do not name the six local stores on screen.";
const stores = [/Amazon Pools/i, /Beaverdam/i, /Capital Pool/i, /Mario's Pool/i, /PoolBoy/i, /SunSplash/i];

for (const file of copyFiles) {
  const lines = read(file).split("\n");
  lines.forEach((line, i) => {
    const at = `${file}:${i + 1}`;
    for (const [re, label] of section11) if (re.test(line)) problems.push(`${at}: ${label}`);
    for (const name of countries) {
      if (wordPattern(name).test(line)) problems.push(`${at}: country other than Canada (item 1)`);
    }
    const inStoreNote = file === "src/content/slides.ts" && line.includes(STORE_NOTE);
    if (!inStoreNote && stores.some((re) => re.test(line))) problems.push(`${at}: local store named outside the presenter note (item 8)`);
  });
}

// Item 11: only the client's approved images may ship.
const ALLOWED_ASSETS = new Set(["logo.png", "pool-pack-bottles.png", "jar-test.jpg", "mohadeseh-zamani.jpg", "ali-kalateh.jpg", "pool-video.mp4"]);
for (const f of files.filter((f) => f.startsWith("assets/") || f.startsWith("public/"))) {
  const name = f.split("/").pop();
  if (BINARY.test(name) && !ALLOWED_ASSETS.has(name.toLowerCase()))
    problems.push(`${f}: image not in the brief's asset manifest (item 11)`);
}

/* 5. Budget (Section 7.4): computed from budget.ts itself. --------------- */
const require = createRequire(import.meta.url);
const ts = require("typescript");
async function loadTs(path) {
  const out = ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(out).toString("base64")}`);
}

const budget = await loadTs("src/content/budget.ts");
const total = budget.budgetRows.reduce((sum, row) => sum + row.amount, 0);
if (total !== 800) problems.push(`src/content/budget.ts: rows add up to $${total}, not $800`);
if (budget.runTotal !== total) problems.push("src/content/budget.ts: runTotal is not computed from the rows");
if (budget.askFor("core") !== 500) problems.push(`src/content/budget.ts: core ask is $${budget.askFor("core")}, not $500`);
if (budget.askFor("full") !== 800) problems.push(`src/content/budget.ts: full ask is $${budget.askFor("full")}, not $800`);
if (!["core", "full"].includes(budget.ASK_MODE)) problems.push(`src/content/budget.ts: ASK_MODE is "${budget.ASK_MODE}"`);
if (budget.ask !== budget.askFor(budget.ASK_MODE)) problems.push("src/content/budget.ts: ask does not follow ASK_MODE");
notes.push(`budget: run $${total}, ask $${budget.ask} (${budget.ASK_MODE} mode)`);

/* 6. Prices (Sections 7.3 and 9): every shelf row traced to a source. ---- */
const pricing = await loadTs("src/content/pricing.ts");
const sourceKeys = new Set(Object.keys((await loadTs("src/content/sources.ts")).sources));
for (const row of pricing.priceRows) {
  if (!row.ours && row.sources.length === 0) problems.push(`src/content/pricing.ts: "${row.label}" has no source`);
  for (const key of row.sources) if (!sourceKeys.has(key)) problems.push(`src/content/pricing.ts: unknown source "${key}"`);
  if (row.max > pricing.PRICE_SCALE_MAX) problems.push(`src/content/pricing.ts: "${row.label}" is off the $0 to $70 scale`);
}

/* Report. --------------------------------------------------------------- */
if (problems.length) {
  console.error("Content check failed:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log(`Content check passed (${textFiles.length} files; ${notes.join("; ")}).`);
