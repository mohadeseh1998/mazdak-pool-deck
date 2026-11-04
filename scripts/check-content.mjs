#!/usr/bin/env node
// Content guard (brief Sections 7.4, 9, 10 and 11), reused from the Gate 1
// deck. Runs before every build and on every commit (.githooks/pre-commit).
// Fails if:
//   - the em dash character appears in any file in the repository,
//   - the private brief or the private banned-words list is tracked by git,
//   - a word from banned-words.local.txt (gitignored, never committed) appears,
//   - a Section 11 item appears (country names, endorsements, testimonials,
//     market size, sale claims, store names on a slide, unknown images),
//   - the budget does not add up: run total 800, ask 500 core or 800 full,
//   - the pool line model (src/content/poolModel.ts), recomputed here on its
//     own, differs from the financials brief's Section 4, or any figure or
//     approved line on /financials/ or the /customer/ price table differs
//     from the briefs,
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
  ["src/pages/financials/content/slides.ts", "Your introduction to Gabriela at Amazon Pools and Spas: 30 minutes"],
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
const ALLOWED_ASSETS = new Set(["logo.png", "pool-pack-bottles.png", "pool-pack-bottles-cutout.webp", "jar-test.jpg", "mohadeseh-zamani.jpg", "ali-kalateh.jpg", "pool-video.mp4"]);
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

/* 7. The pool line model (financials brief, Sections 3 and 4). ----------- */
// Recomputed here from the inputs alone, with this script's own arithmetic,
// then compared with the brief's totals, with what poolModel.ts computes, and
// with every figure the two new pages put on screen.
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

// Section 4, as the brief states it.
const BRIEF = {
  base: {
    revenue: [6120, 44640, 138600],
    fixedAndPmra: [16573, 12245, 21786],
    net: [-14053, 3595, 26814],
    cumulative: [-14053, -10458, 16356],
  },
  worst: {
    revenue: [1700, 2550, 30800],
    fixedAndPmra: [12000, 25787, 20102],
    net: [-11740, -25397, -18102],
    cumulative: [-11740, -37137, -55239],
  },
};

// The Section 2 tables, word for word (the page sets a true minus sign).
const BRIEF_TABLES = {
  base: [
    ["Stores", "3", "6", "15"],
    ["Clarifier bottles", "600", "1,200", "3,000"],
    ["Pool Packs", "0", "1,800", "6,000"],
    ["Revenue", "$6,120", "$44,640", "$138,600"],
    ["Cost of goods", "$3,600", "$28,800", "$90,000"],
    ["Fixed costs and PMRA", "$16,573", "$12,245", "$21,786"],
    ["Net", "-$14,053", "$3,595", "$26,814"],
    ["Cumulative cash", "-$14,053", "-$10,458", "$16,356"],
  ],
  worst: [
    ["Stores", "2", "3", "8"],
    ["Clarifier bottles", "200", "300", "800"],
    ["Pool Packs", "0", "0", "1,600"],
    ["Revenue", "$1,700", "$2,550", "$30,800"],
    ["Cost of goods", "$1,440", "$2,160", "$28,800"],
    ["Fixed costs and PMRA", "$12,000", "$25,787", "$20,102"],
    ["Net", "-$11,740", "-$25,397", "-$18,102"],
    ["Cumulative cash", "-$11,740", "-$37,137", "-$55,239"],
  ],
};

const MINUS_SIGN = String.fromCharCode(0x2212);
const plain = (s) => String(s).split(MINUS_SIGN).join("-");
const expect = (where, got, want) => {
  if (plain(got) !== plain(want)) problems.push(`${where}: shows "${plain(got)}", the brief says "${want}"`);
};

// This script's own arithmetic, in whole cents.
const c100 = (d) => Math.round(d * 100);
function recompute(s) {
  let prev = 0;
  let cum = 0;
  return s.seasons.map((x) => {
    const clar = x.stores * x.clarPerStore;
    const packs = x.stores * x.packPerStore;
    const revenue = (clar * c100(s.clarWholesale) + packs * c100(s.packWholesale)) / 100;
    const cogs = (clar * c100(s.clarCost) + packs * c100(s.packCost)) / 100;
    const fee = x.year === s.pmraYear ? s.pmraFee : 0;
    const annual = x.year <= s.pmraYear ? 0 : Math.max(100, Math.min(3600, Math.round(0.04 * prev)));
    const fixedAndPmra = x.fixed + fee + annual;
    const net = (c100(revenue) - c100(cogs) - c100(fixedAndPmra)) / 100;
    cum = (c100(cum) + c100(net)) / 100;
    prev = revenue;
    return { revenue, fixedAndPmra, net, cumulative: cum };
  });
}

for (const id of ["base", "worst"]) {
  const mine = recompute(model.SCENARIOS[id]);
  for (const key of Object.keys(BRIEF[id])) {
    BRIEF[id][key].forEach((want, i) => {
      const year = 2027 + i;
      if (mine[i][key] !== want) problems.push(`${MODEL}: ${id} ${key} ${year} recomputes to ${mine[i][key]}, Section 4 says ${want}`);
      if (model.RESULTS[id][i][key] !== want)
        problems.push(`${MODEL}: ${id} ${key} ${year} is ${model.RESULTS[id][i][key]} on screen, Section 4 says ${want}`);
    });
  }
  // Every cell of the table on screen, as the brief prints it.
  const table = fin.seasonTable(id);
  BRIEF_TABLES[id].forEach(([label, ...cells], r) => {
    expect(`financials ${id} table row ${r + 1} label`, table[r]?.label, label);
    cells.forEach((cell, j) => expect(`financials ${id} table, ${label}, ${2027 + j}`, table[r]?.cells[j], cell));
  });
}

// The price check: at $39.99 (pack wholesale $24.00), pack margin $12.00 (50 percent).
const check = model.UNIT.packAtCheck;
if (check.weKeep !== 12 || check.weKeepPct !== 50 || model.PRICE_CHECK.packWholesale !== 24)
  problems.push(`${MODEL}: price check is $${check.weKeep} (${check.weKeepPct}%), Section 4 says $12.00 (50 percent)`);

// Fixed costs add up to the 2027 input; the PMRA range adds up from its fees.
const fixedSum = model.FIXED_COSTS_2027.reduce((s, f) => s + f.amount, 0);
if (fixedSum !== model.SCENARIOS.base.seasons[0].fixed)
  problems.push(`${MODEL}: fixed cost items add up to $${fixedSum}, not the 2027 input $${model.SCENARIOS.base.seasons[0].fixed}`);
if (model.PMRA_FEE_RANGE.low !== model.SCENARIOS.base.pmraFee || model.PMRA_FEE_RANGE.high !== model.SCENARIOS.worst.pmraFee)
  problems.push(`${MODEL}: PMRA fee range does not match the base and worst pmraFee inputs`);

// Every other figure on /financials/, word for word.
const s1 = fin.saleSlide;
const unitWant = [
  ["Suggested retail", "$16.99", "$29.99"],
  ["Store keeps 40%", "$6.79", "$11.99"],
  ["We sell to the store at", "$10.20", "$18.00"],
  ["Our cost to make (bottle, label and contents)", "$6.00", "$12.00"],
];
unitWant.forEach(([label, a, b], r) => {
  expect(`financials unit table row ${r + 1}`, s1.unit.rows[r]?.label, label);
  expect(`financials unit table, ${label}, clarifier`, s1.unit.rows[r]?.values[0], a);
  expect(`financials unit table, ${label}, pack`, s1.unit.rows[r]?.values[1], b);
});
const keep = s1.unit.keep.cents.map((cents, j) => `$${(cents / 100).toFixed(2)} ${s1.unit.keep.pct[j]}`);
expect("financials, we keep (clarifier)", keep[0], "$4.20 (41%)");
expect("financials, we keep (pack)", keep[1], "$6.00 (33%)");
[
  ["Product liability insurance", "$1,500"],
  ["Production space and utilities", "$3,000"],
  ["Label compliance and safety data sheets", "$1,500"],
  ["Samples, demos and marketing", "$2,000"],
  ["Local delivery", "$1,000"],
  ["Admin and software", "$1,000"],
].forEach(([label, amount], i) => {
  expect(`financials fixed cost ${i + 1}`, s1.fixed.items[i]?.label, label);
  expect(`financials fixed cost, ${label}`, s1.fixed.items[i]?.amount.text, amount);
});
expect("financials fixed total", `${s1.fixed.total.label} ${s1.fixed.total.amount}`, "Total, 2027 $10,000");
expect("financials PMRA one-time", s1.fixed.oneTime.amount, "$6,573 to $11,787");
expect(
  "financials footnote",
  s1.footnote,
  "Founders are unpaid in this plan. PMRA fees from the Pest Control Products Fees and Charges Regulations: product chemistry $2,713, acute toxicity $2,954, value $906, plus $5,214 exposure data if PMRA asks for it. Annual PMRA charge after registration: 4 percent of the previous year's revenue, minimum $100, maximum $3,600.",
);
expect(
  "financials warning 1",
  s1.warnings[0],
  "At $29.99, the pack earns us $6. If a store wants 50 percent and our cost rises 20 percent, that drops to 60 cents. The price, or the cost, has to move.",
);
expect(
  "financials warning 2",
  s1.warnings[1],
  "Price check: at $39.99 retail, the pack would earn us $12 per sale, twice as much, and still be cheaper than buying a clarifier and an algaecide today ($45 to $66).",
);
expect(
  "financials hero (base)",
  fin.hero.base.sentence,
  "Cash we need before we turn positive: about $14,000. Positive in the 2029 season.",
);
expect(
  "financials hero (base), as set",
  `${fin.hero.base.lead} about ${model.money(fin.hero.base.figure)}. ${fin.hero.base.tail}`,
  fin.hero.base.sentence,
);
expect("financials hero (worst)", fin.hero.worst.sentence, "Cash we need: about $55,000, and still not positive after three seasons.");
expect(
  "financials hero (worst), as set",
  `${fin.hero.worst.lead} about ${model.money(fin.hero.worst.figure)}, ${fin.hero.worst.tail}`,
  fin.hero.worst.sentence,
);
expect(
  "financials closing line",
  fin.seasonsSlide.closing[0].text,
  "We plan for the worst case: about $55,000 over three seasons, from founder capital and the non-dilutive grants we are applying for.",
);
const lists = fin.seasonsSlide.lists;
[
  "200 clarifier bottles per store per season",
  "From 2028, 300 packs per store, then 400 in 2029",
  "Stores grow from Fredericton (2027) to other New Brunswick cities (2028) and Atlantic Canada (2029)",
  "PMRA registration in time for the 2028 season",
].forEach((t, i) => expect(`financials base assumption ${i + 1}`, lists.base.items[i], t));
[
  "Stores keep 50 percent",
  "Our cost rises 20 percent",
  "Half the bottles per store",
  "PMRA asks for exposure data and takes a year longer, so the pack starts in 2029",
].forEach((t, i) => expect(`financials worst-case change ${i + 1}`, lists.worst.items[i], t));
const held = fin.questionsSlide.holding.items;
expect(
  "financials, PMRA for the anti-algae",
  held[1].text,
  "$6,573 to $11,787 in application fees, and the time it takes. If the fee is more than 10 percent of expected revenue, PMRA lets us pay 10 percent up front.",
);
expect("financials, thin margin", held[3].lead, "Thin margin at $29.99.");
expect("financials, cash for the worst case", held[4].text, "About $55,000 over three seasons.");
notes.push("pool model: Section 4 totals reproduced, every figure on /financials/ matches");

/* 8. The customer price table (customer brief, Section 3, section 7). ---- */
const atlanticWant = [
  ["Atlantic Clarifier, 1 L", "$16.99", "$10.20", "$6.79 (40%)"],
  ["Atlantic Pool Pack, 2 x 1 L", "$29.99", "$18.00", "$11.99 (40%)"],
];
atlanticWant.forEach(([product, retail, cost, keepText], i) => {
  const row = custPricing.atlanticRows[i];
  expect(`customer price row ${i + 1}`, row?.product, product);
  expect(`customer price, ${product}, suggested retail`, row?.retail, retail);
  expect(`customer price, ${product}, your cost`, row?.cost, cost);
  expect(`customer price, ${product}, you keep`, `${row?.keep} ${row?.keepPct}`, keepText);
});
const shelfWant = [
  ["Pool clarifiers", "$17.99 to $21.99"],
  ["Pool algaecides", "$26.99 to $43.99"],
  ["Buying both", "about $45 to $66"],
];
shelfWant.forEach(([label, display], i) => {
  expect(`customer shelf row ${i + 1}`, custPricing.priceRows[i]?.label, label);
  expect(`customer shelf, ${label}`, custPricing.priceRows[i]?.display, display);
});
if (custPricing.priceRows.length !== shelfWant.length) problems.push("customer shelf: rows other than the brief's three");
notes.push("customer price table matches the brief");

/* 9. Claims on the new pages point at their own registry. ---------------- */
const custClaims = (await loadModule("src/pages/customer/content/claims.ts")).claims;
const finClaims = (await loadModule("src/pages/financials/content/claims.ts")).claims;
const BRIEF_CUSTOMER_CLAIMS = ["market-stores", "season-2027", "pmra", "gentler", "local", "wholesale", "sizes", "case-12", "delivery", "support", "take-back"];
for (const id of BRIEF_CUSTOMER_CLAIMS) if (!(id in custClaims)) problems.push(`customer claims: "${id}" from the brief's Section 4 is missing`);
for (const id of Object.keys(custClaims)) if (!BRIEF_CUSTOMER_CLAIMS.includes(id)) problems.push(`customer claims: "${id}" is not in the brief`);
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
