#!/usr/bin/env node
// Content guard (brief Sections 7.4, 9, 10 and 11), reused from the Gate 1
// deck. Runs before every build and on every commit (.githooks/pre-commit).
// Fails if:
//   - the em dash character appears in any file in the repository,
//   - the private brief or the private banned-words list is tracked by git,
//   - a word from banned-words.local.txt (gitignored, never committed) appears,
//   - a Section 11 item appears (country names, endorsements, testimonials,
//     market size, sale claims, store names on a slide, unknown images),
//   - the root deck's ask does not add up: $300 + $150 + $150 + $400 = $1,000
//     today, plus $1,000 of licences = $2,000 (deck version 2),
//   - a root deck price differs from version 2 ($25.00, $30.00, $49.99, and
//     the three shelf rows unchanged), or a line version 2 removed comes back,
//   - the pool line model (src/content/poolModel.ts), recomputed here on its
//     own, differs from the version 2 season table, or any figure or line on
//     /financials/ or /customer/ differs from the version 2 changes, or either
//     page says something version 2 removed,
//   - a claim on a new page is missing from that page's claims.ts.
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
const copyFiles = sourceFiles.filter(
  (f) => /^src\/.*\.(ts|tsx)$/.test(f) || f === "README.md" || /^(customer\/|financials\/)?index\.html$/.test(f),
);

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
// The financials brief's approved copy for the mentor names her introduction.
// That one line may name the store; nothing else on any page may.
const STORE_LINES = [
  ["src/pages/financials/content/slides.ts", "starting with your introduction to Gabriela at Amazon Pools and Spas, and compare"],
];

for (const file of copyFiles) {
  const lines = read(file).split("\n");
  lines.forEach((line, i) => {
    const at = `${file}:${i + 1}`;
    for (const [re, label] of section11) if (re.test(line)) problems.push(`${at}: ${label}`);
    for (const name of countries) {
      if (wordPattern(name).test(line)) problems.push(`${at}: country other than Canada (item 1)`);
    }
    const inStoreNote = file === "src/content/slides.ts" && line.includes(STORE_NOTE);
    const approved = STORE_LINES.some(([f, text]) => f === file && line.includes(text));
    if (!inStoreNote && !approved && stores.some((re) => re.test(line)))
      problems.push(`${at}: local store named outside the presenter note (item 8)`);
  });
}

// Item 11: only the client's approved images may ship.
const ALLOWED_ASSETS = new Set(["logo.png", "pool-pack-bottles.png", "pool-pack-bottles-cutout.webp", "jar-test.jpg", "iron-removal.jpg", "mohadeseh-zamani.jpg", "ali-kalateh.jpg", "pool-video.mp4"]);
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
const BUDGET = [
  ["raw", 300, "Today's ask"],
  ["bottles", 150, "Today's ask"],
  ["labels", 150, "Today's ask"],
  ["lab", 400, "Today's ask"],
  ["licences", 1000, "Founders"],
];
const rowsById = new Map(budget.budgetRows.map((r) => [r.id, r]));
if (budget.budgetRows.length !== BUDGET.length) problems.push(`src/content/budget.ts: ${budget.budgetRows.length} rows, not ${BUDGET.length}`);
for (const [id, amount, funder] of BUDGET) {
  const r = rowsById.get(id);
  if (!r) problems.push(`src/content/budget.ts: row "${id}" is missing`);
  else {
    if (r.amount !== amount) problems.push(`src/content/budget.ts: ${r.line} is $${r.amount}, not $${amount}`);
    if (r.fundedBy !== funder) problems.push(`src/content/budget.ts: ${r.line} is funded by "${r.fundedBy}", not "${funder}"`);
    if (r.claim) problems.push(`src/content/budget.ts: ${r.line} carries an assumption tag; version 2 has none on the ask`);
  }
}
const askSum = budget.budgetRows.filter((r) => r.fundedBy === "Today's ask").reduce((t, r) => t + r.amount, 0);
const allSum = budget.budgetRows.reduce((t, r) => t + r.amount, 0);
if (askSum !== 1000 || budget.ask !== askSum) problems.push(`src/content/budget.ts: today's ask is $${budget.ask} (rows $${askSum}), not $1,000`);
if (allSum !== 2000 || budget.prototypeTotal !== allSum) problems.push(`src/content/budget.ts: the prototype is $${budget.prototypeTotal} (rows $${allSum}), not $2,000`);
if (budget.dollars(1000) !== "$1,000" || budget.dollars(2000) !== "$2,000") problems.push("src/content/budget.ts: dollars() does not print $1,000 and $2,000");
notes.push(`budget: ask $${budget.ask}, prototype $${budget.prototypeTotal}`);

/* 6. Prices (Sections 7.3 and 9): every shelf row traced to a source. ---- */
const pricing = await loadTs("src/content/pricing.ts");
const sourceKeys = new Set(Object.keys((await loadTs("src/content/sources.ts")).sources));
for (const row of pricing.priceRows) {
  if (!row.ours && row.sources.length === 0) problems.push(`src/content/pricing.ts: "${row.label}" has no source`);
  for (const key of row.sources) if (!sourceKeys.has(key)) problems.push(`src/content/pricing.ts: unknown source "${key}"`);
  if (row.max > pricing.PRICE_SCALE_MAX) problems.push(`src/content/pricing.ts: "${row.label}" is off the $0 to $70 scale`);
}
// Deck version 2: the exact rows, in order.
const PRICES = [
  ["clarifiers", "$17.99 to $21.99", false],
  ["algaecides", "$26.99 to $43.99", false],
  ["both", "about $45 to $66", false],
  ["atlantic-clarifier", "$25.00", true, 25, "pool", "price-clarifier"],
  ["atlantic-anti-algae", "$30.00", true, 30, "algae", "price-anti-algae"],
  ["atlantic-pack", "$49.99", true, 49.99, "pool", "price-pack"],
];
PRICES.forEach(([id, display, ours, value, tone, claim], i) => {
  const r = pricing.priceRows[i];
  if (!r || r.id !== id) return problems.push(`src/content/pricing.ts: row ${i + 1} should be "${id}"`);
  if (r.display !== display) problems.push(`src/content/pricing.ts: ${r.label} shows "${r.display}", not "${display}"`);
  if (ours && (r.min !== value || r.max !== value)) problems.push(`src/content/pricing.ts: ${r.label} bar is not at ${display}`);
  if (ours && r.tone !== tone) problems.push(`src/content/pricing.ts: ${r.label} should be ${tone}`);
  if (ours && r.claim !== claim) problems.push(`src/content/pricing.ts: ${r.label} must keep its assumption tag`);
});

/* 6b. The root deck, version 2: what it removed stays removed. ------------- */
// The deck's own files only. /customer/ and /financials/ keep their briefs.
const ROOT_DECK = files.filter(
  (f) =>
    /^src\/(content\/(slides|claims|pricing|budget|sources|assets)\.ts|slides\/[^/]+\.tsx|App\.tsx|components\/BudgetTable\.tsx)$/.test(f) ||
    f === "index.html",
);
const REMOVED = ["1 min 15 s", "about 5 minutes", "UNB does not test", "50/50", "GST", "bank account", "production run", "$800", "$39.99", "$16.99", "205 L", "7 / 10 / 43", "tuRgEGqjRyk"];
// One competitor's shelf price in the source register is genuinely $39.99
// (an algaecide); it backs the algaecide range and is not our old pack price.
const SHELF_EXCEPTION = "Summer Smiles Alg Out Ultra 60% 1 L, $39.99";
for (const file of ROOT_DECK) {
  read(file)
    .split("\n")
    .forEach((line, i) => {
      for (const gone of REMOVED) {
        if (!line.includes(gone)) continue;
        if (gone === "$39.99" && file === "src/content/sources.ts" && line.includes(SHELF_EXCEPTION)) continue;
        problems.push(`${file}:${i + 1}: "${gone}" was removed in deck version 2`);
      }
    });
}
// The team section names none of these.
const slidesText = read("src/content/slides.ts");
const team = slidesText.slice(slidesText.indexOf("export const teamSlide"), slidesText.indexOf("export const askSlide"));
for (const word of ["GST", "HST", "bank account", "runs the company in Fredericton"])
  if (team.toLowerCase().includes(word.toLowerCase())) problems.push(`src/content/slides.ts: the team section says "${word}"`);
if (!slidesText.includes('const YOUTUBE_ID = "rKsXcTqSfsI"')) problems.push("src/content/slides.ts: the video is not rKsXcTqSfsI");
const sectionCount = (slidesText.match(/^\s+n: \d+,$/gm) || []).length;
if (sectionCount !== 9) problems.push(`src/content/slides.ts: ${sectionCount} sections, not 9`);

/* 7. The pool line model (version 2 changes, Part B). -------------------- */
// Recomputed here from the inputs alone, with this script's own arithmetic,
// then compared with the version 2 season table, with what poolModel.ts
// computes, and with every figure /financials/ puts on screen.
const esbuild = require("esbuild");
async function loadModule(path) {
  const out = await esbuild.build({ entryPoints: [path], bundle: true, write: false, format: "esm", platform: "node", logLevel: "silent" });
  return import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString("base64")}`);
}

const MODEL = "src/content/poolModel.ts";
const model = await loadModule(MODEL);
const fin = await loadModule("src/pages/financials/content/slides.ts");
const cust = await loadModule("src/pages/customer/content/slides.ts");
const custPricing = await loadModule("src/pages/customer/content/pricing.ts");
const custSources = await loadModule("src/pages/customer/content/sources.ts");
const custClaims = (await loadModule("src/pages/customer/content/claims.ts")).claims;
const finSources = await loadModule("src/pages/financials/content/sources.ts");
const finClaims = (await loadModule("src/pages/financials/content/claims.ts")).claims;

const MINUS_SIGN = String.fromCharCode(0x2212);
const plain = (s) => String(s).split(MINUS_SIGN).join("-");
const expect = (where, got, want) => {
  if (plain(got) !== plain(want)) problems.push(`${where}: shows "${plain(got)}", the version 2 file says "${want}"`);
};

// The inputs, exactly as the version 2 file sets them.
const P = model.PACKAGE;
if (P.retail !== 49.99 || P.storeShare !== 0.25 || P.wholesale !== 37.49 || P.costPerPackage !== 8)
  problems.push(`${MODEL}: PACKAGE is ${JSON.stringify(P)}, not 49.99 / 0.25 / 37.49 / 8.00`);
if (model.STARTUP_CASH !== 60000) problems.push(`${MODEL}: STARTUP_CASH is ${model.STARTUP_CASH}, not 60000`);
const SEASONS_WANT = [
  [2027, 500, 500, 0],
  [2028, 2000, 2000, 12000],
  [2029, 4000, 4000, 20000],
];
SEASONS_WANT.forEach(([year, packages, litresEach, runningCosts], i) => {
  const s = model.SEASONS[i];
  if (!s || s.year !== year || s.packages !== packages || s.litresEach !== litresEach || s.runningCosts !== runningCosts)
    problems.push(`${MODEL}: season ${i + 1} is ${JSON.stringify(s)}, not ${year}, ${packages} packages, ${litresEach} L, $${runningCosts}`);
});
if (model.SEASONS.length !== 3) problems.push(`${MODEL}: ${model.SEASONS.length} seasons, not 3`);
if (model.PMRA_ANNUAL.rate !== 0.04 || model.PMRA_ANNUAL.max !== 4509.9) problems.push(`${MODEL}: PMRA annual charge is not 4 percent, up to $4,509.90`);

// The root deck is the source of truth for prices: the package is its pack.
const rootPack = pricing.priceRows.find((r) => r.id === "atlantic-pack");
if (!rootPack || rootPack.max !== P.retail) problems.push(`${MODEL}: package retail $${P.retail} differs from the root deck's pack price`);

// Unit math: 49.99 x 0.75 = 37.49; 37.49 - 8.00 = 29.49. At 40%: 29.99 - 8.00 = 21.99.
const c100 = (d) => Math.round(d * 100);
const at = (share) => Math.floor(c100(P.retail) * (1 - share)) / 100;
if (at(P.storeShare) !== P.wholesale) problems.push(`${MODEL}: 49.99 x 0.75 is ${at(P.storeShare)}, not the wholesale ${P.wholesale}`);
if ((c100(P.wholesale) - c100(P.costPerPackage)) / 100 !== 29.49) problems.push(`${MODEL}: we keep is not $29.49`);
if (at(0.4) !== 29.99 || (c100(at(0.4)) - c100(P.costPerPackage)) / 100 !== 21.99) problems.push(`${MODEL}: at 40 percent we do not keep $21.99`);
if (model.UNIT.pack.weKeep !== 29.49 || model.UNIT.pack.weKeepPct !== 79) problems.push(`${MODEL}: UNIT.pack keeps ${model.UNIT.pack.weKeep} (${model.UNIT.pack.weKeepPct}%)`);
if (model.UNIT.packAtTest.weKeep !== 21.99) problems.push(`${MODEL}: UNIT.packAtTest keeps ${model.UNIT.packAtTest.weKeep}, not 21.99`);

// This script's own arithmetic, in whole cents.
function recompute() {
  let prev = 0;
  let cum = 0;
  return model.SEASONS.map((s, i) => {
    const revenue = (s.packages * c100(P.wholesale)) / 100;
    const cogs = (s.packages * c100(P.costPerPackage)) / 100;
    const startupAndRunning = (i === 0 ? model.STARTUP_CASH : 0) + s.runningCosts;
    const pmra = Math.min(4509.9, Math.round(0.04 * prev));
    const net = (c100(revenue) - c100(cogs) - c100(startupAndRunning) - c100(pmra)) / 100;
    cum = (c100(cum) + c100(net)) / 100;
    prev = revenue;
    return { revenue, cogs, startupAndRunning, pmra, net, cumulative: cum };
  });
}

// The version 2 season table, as the file states it.
const WANT = {
  revenue: [18745, 74980, 149960],
  cogs: [4000, 16000, 32000],
  startupAndRunning: [60000, 12000, 20000],
  pmra: [0, 750, 2999],
  net: [-45255, 46230, 94961],
  cumulative: [-45255, 975, 95936],
};
const mine = recompute();
for (const key of Object.keys(WANT)) {
  WANT[key].forEach((want, i) => {
    const year = 2027 + i;
    if (mine[i][key] !== want) problems.push(`${MODEL}: ${key} ${year} recomputes to ${mine[i][key]}, the file says ${want}`);
    if (model.RESULTS[i][key] !== want) problems.push(`${MODEL}: ${key} ${year} is ${model.RESULTS[i][key]} on screen, the file says ${want}`);
  });
}
if (model.PAYBACK_YEAR !== 2028) problems.push(`${MODEL}: profitable and paid back in ${model.PAYBACK_YEAR}, the file says 2028`);

// Every cell of the season table on screen, word for word (a true minus sign).
const TABLE_WANT = [
  ["Packages", "500", "2,000", "4,000"],
  ["Litres of each product", "500", "2,000", "4,000"],
  ["Revenue", "$18,745", "$74,980", "$149,960"],
  ["Cost of goods", "$4,000", "$16,000", "$32,000"],
  ["Start-up and running costs", "$60,000", "$12,000", "$20,000"],
  ["PMRA annual charge", "$0", "$750", "$2,999"],
  ["Net", "-$45,255", "$46,230", "$94,961"],
  ["Cumulative cash", "-$45,255", "$975", "$95,936"],
];
const table = fin.seasonTable();
if (table.length !== TABLE_WANT.length) problems.push(`financials: the season table has ${table.length} rows, not ${TABLE_WANT.length}`);
TABLE_WANT.forEach(([label, ...cells], r) => {
  expect(`financials table row ${r + 1} label`, table[r]?.label, label);
  cells.forEach((cell, j) => expect(`financials table, ${label}, ${2027 + j}`, table[r]?.cells[j], cell));
});

// Slide 1, word for word.
const s1 = fin.saleSlide;
expect("financials slide 1 title", s1.headline, "What one package earns.");
expect(
  "financials honesty line",
  s1.honesty,
  "Every number here is a planning assumption. No store has quoted our price and we have not run a full production batch yet.",
);
expect("financials unit column", s1.unit.column, "Atlantic Pool Pack");
[
  ["Suggested retail", "$49.99"],
  ["Store keeps 25% (negotiable)", "$12.50"],
  ["We sell to the store at", "$37.49"],
  ["Our cost to make (2 bottles, labels, contents)", "$8.00"],
].forEach(([label, value], r) => {
  expect(`financials unit row ${r + 1}`, s1.unit.rows[r]?.label, label);
  expect(`financials unit, ${label}`, s1.unit.rows[r]?.value, value);
});
if (s1.unit.rows.length !== 4) problems.push("financials: the unit table has more rows than the file");
expect("financials, we keep", `${s1.unit.keep.label} $${(s1.unit.keep.cents / 100).toFixed(2)} ${s1.unit.keep.pct}`, "We keep, per package $29.49 (79%)");
expect("financials, negotiable", s1.negotiable, "The store share is negotiable. Even at 40 percent, we still keep $21.99 per package.");
expect("financials start-up figure", model.money(s1.startup.figure), "$60,000");
expect("financials start-up label", s1.startup.label, "Start-up cash, one-time, 2027");
expect(
  "financials start-up text",
  s1.startup.covers[0].text,
  "Covers set-up, licences, PMRA registration and the first season's running costs. Founders' estimate.",
);
expect("financials running costs", s1.startup.running[0].text, "Running costs after that: $12,000 in 2028, $20,000 in 2029.");
if (!s1.startup.covers[0].claim || !s1.startup.running[0].claim) problems.push("financials: the start-up lines must each keep an assumption tag");
expect(
  "financials footnote",
  s1.footnote,
  "Founders are unpaid in this plan. PMRA annual charge after registration: 4 percent of the previous year's revenue, up to $4,509.90.",
);

// Slide 2, word for word.
const s2 = fin.seasonsSlide;
expect("financials slide 2 title", s2.headline, "Three pool seasons.");
expect("financials big stat", model.money(s2.hero.figure), "$60,000");
expect("financials big stat label", s2.hero.label, "Cash we need up front.");
expect("financials big stat line", s2.hero.tail, "Profitable and paid back in the 2028 season.");
expect("financials assumptions", s2.assumptions, "2027: 500 litres of each product. 2028: about 2 tonnes of each. 2029: about 4 tonnes of each.");
expect(
  "financials bottom line",
  s2.closing[0].text,
  "These numbers are conservative. With the right conditions, we will produce more, and faster, and every customer conversation makes our numbers sharper.",
);
if (!s2.closing[0].claim) problems.push("financials: the bottom line must keep its assumption tag");

// Slide 3, word for word.
const s3 = fin.questionsSlide;
expect("financials question 1", s3.first.heading, "How will we get our first customer?");
[
  "We talk to local pool stores, starting with your introduction to Gabriela at Amazon Pools and Spas, and compare our product with what is on their shelf.",
  "We send them photos of our jar test, so they can see the result.",
  "From our experience, stores usually accept a small first order.",
  "For feedback, we give them 20 litres of samples.",
].forEach((t, i) => expect(`financials first customer step ${i + 1}`, s3.first.steps[i]?.text, t));
if (s3.first.steps.length !== 4) problems.push(`financials: ${s3.first.steps.length} first-customer steps, not 4`);
expect("financials step 4 small text", s3.first.steps[3]?.small, "Both products once the anti-algae is registered. Clarifier only before that.");
expect("financials question 2", s3.holding.heading, "What is holding us back?");
const held = s3.holding.items.map((x) => `${x.lead} ${x.text}`);
expect("financials holding 1", held[0], "Capital: the $60,000 start-up cost.");
expect("financials holding 2", held[1], "Our co-founder's visa: Dr. Ali Kalateh's visa.");
if (held.length !== 2) problems.push(`financials: ${held.length} items hold us back, not 2`);
notes.push("pool model: version 2 season table reproduced, every figure on /financials/ matches");

/* 8. The customer page (version 2 changes, Part A). ---------------------- */
expect("customer title", cust.openingSlide.headline.join(" "), "Clear pools, made in New Brunswick.");
expect("customer subtitle", cust.openingSlide.sub, "Atlantic Clarifier and Atlantic Anti-Algae, sold together as the Atlantic Pool Pack.");
expect("customer problem card 2", cust.problemSlide.lines[1].lead, "Algae in the water:");
const flat = (rich) => (typeof rich === "string" ? rich : rich.map((n) => (typeof n === "string" ? n : n.b ?? flat(n.text))).join(""));
expect(
  "customer clarifier card",
  flat(cust.answerSlide.products[0].body),
  "A clarifier made pool-ready through a complementary reaction. Available first, for the 2027 season.",
);
expect("customer anti-algae card", flat(cust.answerSlide.products[1].body), "A chelated anti-algae, made for pools. Available after PMRA registration.");
expect("customer video link", cust.answerSlide.videoLink, "Watch the video");
expect("customer video", cust.video.watchUrl, "https://youtu.be/rKsXcTqSfsI");
expect("customer statement", cust.liveSlide.statement, "Same water. Same soil. One bottle.");
["The fine particles settle to the bottom.", "They are removed with a pool vacuum, or caught by the filter.", "The water turns clear."].forEach((t, i) =>
  expect(`customer step ${i + 1}`, cust.liveSlide.steps[i], t),
);
expect("customer team title", cust.teamSlide.headline, "A local team you can call.");
const people = cust.teamSlide.people.map((p) => `${p.name}, ${p.role}: ${p.bio}`);
expect(
  "customer team, first",
  people[0],
  "Mohadeseh Zamani, Co-founder and CEO: Leads the company: strategy, partnerships, regulatory approvals, funding and customers. Graduate studies in Electrical Engineering at UNB.",
);
expect(
  "customer team, second",
  people[1],
  "Dr. Ali Kalateh, Co-founder and CTO: Inorganic chemist with years of hands-on experience developing and producing pool-care and water-treatment products. Leads science, formulation and production.",
);
expect("customer team line", cust.teamSlide.local, "Local, so when a customer has a question, you call us and we come in.");
expect("customer gentler", flat(cust.differentSlide.columns[1].line), "A gentler choice than copper salts or aluminum sulfate.");
expect("customer local", flat(cust.differentSlide.columns[2].line), "Made in New Brunswick. Short restock times, bilingual labels.");
for (const i of [1, 2]) if (!JSON.stringify(cust.differentSlide.columns[i].line).includes('"claim"')) problems.push(`customer: column ${i + 1} lost its assumption tag`);
expect("customer price headline", cust.priceSlide.headline, "A fair price for high quality.");
expect("customer price line", cust.priceSlide.flexible, "Our prices are flexible while we learn from stores and pool owners.");
const RETAIL_WANT = [
  ["Atlantic Clarifier, 1 L", "$25.00"],
  ["Atlantic Anti-Algae, 1 L", "$30.00"],
  ["Atlantic Pool Pack, 2 x 1 L", "$49.99"],
];
if (custPricing.atlanticRows.length !== RETAIL_WANT.length) problems.push("customer: the retail table has rows other than the file's three");
RETAIL_WANT.forEach(([product, retail], i) => {
  expect(`customer retail row ${i + 1}`, custPricing.atlanticRows[i]?.product, product);
  expect(`customer retail, ${product}`, custPricing.atlanticRows[i]?.retail, retail);
});
expect("customer retail columns", custPricing.atlanticColumns.join(" | "), "Product | Suggested retail");
const SHELF_WANT = [
  ["Pool clarifiers", "$17.99 to $21.99"],
  ["Pool algaecides", "$26.99 to $43.99"],
  ["Buying both", "about $45 to $66"],
];
if (custPricing.priceRows.length !== SHELF_WANT.length) problems.push("customer shelf: rows other than the brief's three");
SHELF_WANT.forEach(([label, display], i) => {
  expect(`customer shelf row ${i + 1}`, custPricing.priceRows[i]?.label, label);
  expect(`customer shelf, ${label}`, custPricing.priceRows[i]?.display, display);
});
expect("customer how we sell", cust.sellSlide.rows.map((r) => r.lead).join(" "), "Sizes: Ordering: Delivery:");
expect("customer work headline", cust.workSlide.headline, "Start with us this spring.");
expect("customer offer", flat(cust.workSlide.offer), "We begin with 500 litres this spring. If you are not satisfied, we take it back.");
if ((JSON.stringify(cust.workSlide.offer).match(/"claim"/g) || []).length !== 1) problems.push("customer: the offer must keep exactly one assumption tag");
expect("customer feedback heading", cust.workSlide.helpHeading, "Your customers' feedback on quality");
["How clear is the water after one dose?", "How fast does it work for your customers?", "What would make it even better?"].forEach((q, i) =>
  expect(`customer feedback question ${i + 1}`, cust.workSlide.questions[i], q),
);
expect("customer footer", cust.workSlide.founder, "Mohadeseh Zamani, Co-founder and CEO");

// What the customer page may not say: everything a viewer can see or hear on
// it, the presenter notes, hover cards and source register included. The
// source register cites one competitor product whose own name has "40%" in
// it (a copper strength, not a store margin); that citation is the exception.
const PRODUCT_NAME_40 = "Summer Smiles Alg Out 40% 1 L";
const customerText = [
  JSON.stringify(cust.slides),
  JSON.stringify(cust.video),
  JSON.stringify(custClaims),
  JSON.stringify(custPricing.atlanticRows),
  JSON.stringify(custPricing.priceRows.map((r) => [r.label, r.display])),
  custPricing.priceFootnote,
  custPricing.atlanticHeading,
  JSON.stringify(custSources.sources).split(PRODUCT_NAME_40).join(""),
  ...["01Opening", "02Problem", "03Answer", "04Live", "05Team", "06Different", "07Price", "08Sell", "09Work"].map((f) => read(`src/pages/customer/sections/${f}.tsx`)),
].join("\n");
const CUSTOMER_BANNED = [
  [/green water/i, '"Green water"'],
  [/clump/i, '"clump"'],
  [/no cross-border/i, '"no cross-border"'],
  [/demo kit/i, '"demo kit"'],
  [/\bCMO\b/, '"CMO"'],
  [/40\s?%|40 percent/i, '"40%" (store margin)'],
  [/\$16\.99/, '"$16.99"'],
  [/\$29\.99/, '"$29.99"'],
  [/\$10\.20/, '"$10.20"'],
  [/\$18\.00/, '"$18.00"'],
  [/\$6\.79/, '"$6.79"'],
  [/\$11\.99/, '"$11.99"'],
  [/store margin|your cost|you keep/i, "store margin or wholesale"],
  [/\bsafe\b/i, '"safe"'],
  [/non-toxic/i, '"non-toxic"'],
  [/not harmful/i, '"not harmful"'],
  [/harmless/i, '"harmless"'],
  [/tuRgEGqjRyk|1 min 15 s|75-second/i, "the old video"],
  [/timerNotStarted|DemoTimer|a few minutes/, "the demo timer"],
];
for (const [re, label] of CUSTOMER_BANNED) if (re.test(customerText)) problems.push(`customer: says ${label}, which version 2 removed`);
if (/<PageShell[^>]*\btimer\b/.test(read("src/pages/customer/App.tsx"))) problems.push("customer: the T timer is still on");

// Our own prices on the customer page: $25.00, $30.00 and $49.99 only. The
// shelf figures and the root deck's spoken price note ($25, $30) aside.
const SHELF_FIGURES = ["$17.99", "$21.99", "$26.99", "$43.99", "$45", "$66", "$19.99", "$36.99", "$39.99", "$18", "$22", "$27", "$44", "$25", "$30"];
const allowedPrices = new Set(["$25.00", "$30.00", "$49.99", ...SHELF_FIGURES]);
for (const m of customerText.matchAll(/\$\d{1,3}(?:,\d{3})*(?:\.\d\d)?/g)) if (!allowedPrices.has(m[0])) problems.push(`customer: shows the price ${m[0]}`);
notes.push("customer page matches version 2");

// What the financials page may not say.
const finText = [
  JSON.stringify(fin.slides),
  JSON.stringify(finClaims),
  JSON.stringify(finSources.sources),
  ...["01Sale", "02Seasons", "03Questions"].map((f) => read(`src/pages/financials/sections/${f}.tsx`)),
  read("src/pages/financials/App.tsx"),
].join("\n");
const FIN_BANNED = [
  [/\$16\.00|\$21\.49|\$13\.99|-\$49,255|-\$19,025/, "a number the file rules out"],
  [new RegExp(`(${MINUS_SIGN}|-)\\$(49,255|19,025)`), "a number the file rules out"],
  [/\bworst\b|\bBase\b|KeyW|toggle|radiogroup/i, "the Base / Worst view"],
  [/\$29\.99|\$39\.99|\$6\.00|60 cents|\$2,713|\$2,954|\$906|\$5,214|\$6,573|\$11,787|\$3,600|\$10,000|\$55,000/, "a removed figure"],
  [/Clarifier bottles|Pool Packs|per sale/, "the old units (say package)"],
  [/No customer conversation yet|Thin margin|Licences\./, "a removed line"],
];
for (const [re, label] of FIN_BANNED) if (re.test(finText)) problems.push(`financials: says ${label}`);
if (!/package/.test(fin.saleSlide.headline) || !TABLE_WANT[0][0].startsWith("Packages")) problems.push("financials: does not say package");

/* 9. Claims on the new pages point at their own registry. ---------------- */
const CUSTOMER_CLAIMS = ["market-stores", "season-2027", "pmra", "gentler", "local", "prices", "sizes", "case-12", "delivery", "take-back"];
for (const id of CUSTOMER_CLAIMS) if (!(id in custClaims)) problems.push(`customer claims: "${id}" is missing`);
for (const id of Object.keys(custClaims)) if (!CUSTOMER_CLAIMS.includes(id)) problems.push(`customer claims: "${id}" is not on the page in version 2`);
function usedClaims(value, into = new Set()) {
  if (Array.isArray(value)) value.forEach((v) => usedClaims(v, into));
  else if (value && typeof value === "object") {
    if (typeof value.claim === "string") into.add(value.claim);
    Object.values(value).forEach((v) => usedClaims(v, into));
  }
  return into;
}
for (const [page, mod, registry] of [
  ["customer", cust, custClaims],
  ["financials", fin, finClaims],
]) {
  const used = usedClaims(mod.slides);
  for (const id of used) if (!(id in registry)) problems.push(`${page}: claim "${id}" is not in its claims.ts`);
  for (const id of Object.keys(registry)) if (!used.has(id)) problems.push(`${page}: claim "${id}" is never used`);
  if (mod.slides.length !== { customer: 9, financials: 3 }[page]) problems.push(`${page}: ${mod.slides.length} sections`);
}
notes.push(`claims: ${Object.keys(custClaims).length} on /customer/, ${Object.keys(finClaims).length} on /financials/`);

/* Report. --------------------------------------------------------------- */
if (problems.length) {
  console.error("Content check failed:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log(`Content check passed (${textFiles.length} files; ${notes.join("; ")}).`);
