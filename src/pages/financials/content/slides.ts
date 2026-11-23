import {
  count,
  FOUNDERS_INVESTMENT,
  money,
  money2,
  PACKAGE,
  PAYBACK_YEAR,
  PMRA_ANNUAL,
  RESULTS,
  SEASONS,
  STARTUP_CASH,
  STORE_SHARE_TEST,
  UNIT,
  type SeasonResult,
} from "../../../content/poolModel";
import type { PageSlide, PageUi, Rich } from "../../shared/types";
import { countClaims } from "../../shared/types";
import { claims, type ClaimId } from "./claims";

// All copy for /financials/ (version 2 changes, Part B), set word for word.
// One package is the Atlantic Pool Pack: 1 L Atlantic Clarifier plus 1 L
// Atlantic Anti-Algae. Every figure is computed from src/content/poolModel.ts,
// never typed here. scripts/check-content.mjs rebuilds the totals on its own
// and holds every string below to the version 2 file's exact words, with the
// 23 November change: the $60,000 is the founders' own investment, so cash on
// hand never goes below zero.

type C = { text: Rich; claim: ClaimId };
const claim = (text: Rich, id: ClaimId): C => ({ text, claim: id });

const pct = (share: number) => Math.round(share * 100);
const running = SEASONS.filter((s) => s.runningCosts > 0);

/* 1. What one package earns (about 60 s) --------------------------- */

export const saleSlide = {
  n: 1,
  title: "What one package earns",
  ground: "deep",
  headline: "What one package earns.",
  honesty: "Every number here is a planning assumption. No store has quoted our price and we have not run a full production batch yet.",
  unit: {
    column: "Atlantic Pool Pack",
    // The whole table carries one [assumption] tag.
    claim: "unit-economics" as ClaimId,
    rows: [
      { label: "Suggested retail", value: money2(UNIT.pack.retail) },
      { label: `Store keeps ${UNIT.pack.storePct}% (negotiable)`, value: money2(UNIT.pack.storeKeeps) },
      { label: "We sell to the store at", value: money2(UNIT.pack.wholesale) },
      { label: "Our cost to make (2 bottles, labels, contents)", value: money2(UNIT.pack.cost) },
    ],
    keep: {
      label: "We keep, per package",
      /** In cents, for the count-up. */
      cents: Math.round(UNIT.pack.weKeep * 100),
      pct: `(${UNIT.pack.weKeepPct}%)`,
    },
  },
  negotiable: `The store share is negotiable. Even at ${pct(STORE_SHARE_TEST)} percent, we still keep ${money2(UNIT.packAtTest.weKeep)} per package.`,
  startup: {
    figure: FOUNDERS_INVESTMENT,
    label: "Founders' investment in the pool line, 2027",
    covers: [
      claim("Covers set-up, licences, PMRA registration and the first season's running costs. Founders' estimate.", "startup"),
    ] as Rich,
    running: [
      claim(`Running costs after that: ${running.map((s) => `${money(s.runningCosts)} in ${s.year}`).join(", ")}.`, "running"),
    ] as Rich,
  },
  footnote: `Founders are unpaid in this plan. PMRA annual charge after registration: ${pct(PMRA_ANNUAL.rate)} percent of the previous year's revenue, up to ${money2(PMRA_ANNUAL.max)}.`,
  notes: [
    `"Here is one package, the Atlantic Pool Pack. It sells for 49.99. The store keeps 25 percent, and that is negotiable, so we sell to the store at 37.49. It costs us 8 dollars to make, so we keep 29.49. Even if a store wants 40 percent, we still keep 21.99. In 2027 we, the founders, invest 60,000 dollars of our own money in the pool line. Running costs after that are 12,000 in 2028 and 20,000 in 2029."`,
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/* 2. Three pool seasons (about 60 s) ------------------------------- */

export interface TableRow {
  key: keyof Omit<SeasonResult, "year">;
  label: string;
  format: (n: number) => string;
  /** Money rows can go negative: those are shown in silt with a minus sign. */
  money: boolean;
  strong?: boolean;
  /** A rule above the row, to group it. */
  rule?: boolean;
}

export const TABLE_ROWS: readonly TableRow[] = [
  { key: "packages", label: "Packages", format: count, money: false },
  { key: "litresEach", label: "Litres of each product", format: count, money: false },
  { key: "revenue", label: "Revenue", format: money, money: true, rule: true },
  { key: "cogs", label: "Cost of goods", format: money, money: true },
  { key: "startupAndRunning", label: "Start-up and running costs", format: money, money: true },
  { key: "pmra", label: "PMRA annual charge", format: money, money: true },
  { key: "investment", label: "Founders' investment", format: money, money: true, rule: true },
  { key: "net", label: "Net", format: money, money: true, strong: true, rule: true },
  { key: "cashOnHand", label: "Cash on hand (year-end)", format: money, money: true, strong: true },
  { key: "cumulative", label: "Cumulative net, before founders' money", format: money, money: true },
];

/** The table exactly as it reads when settled: what the content check compares to the file. */
export function seasonTable(): { label: string; cells: string[] }[] {
  return TABLE_ROWS.map((row) => ({ label: row.label, cells: RESULTS.map((r) => row.format(r[row.key])) }));
}

/** "about 2 tonnes": a litre of each product is taken as about a kilogram. */
const amount = (litres: number) => (litres < 1000 ? `${count(litres)} litres` : `about ${litres / 1000} tonnes`);

export const seasonsSlide = {
  n: 2,
  title: "Three pool seasons",
  ground: "deep",
  headline: "Three pool seasons.",
  hero: {
    figure: FOUNDERS_INVESTMENT,
    label: "Founders' investment, one-time",
    tail: PAYBACK_YEAR === null ? "CHECK THE MODEL" : `Profitable and paid back in the ${PAYBACK_YEAR} season.`,
  },
  chart: {
    label: "Revenue, total costs and cash on hand at year-end, by season",
    seasons: RESULTS.map((r) => `${r.year} season`),
    legend: { revenue: "Revenue", costs: "Total costs", cash: "Cash on hand (year-end)" },
  },
  years: RESULTS.map((r) => String(r.year)),
  // The source of the founders' investment, tagged: it is a plan, not yet in the bank.
  capital: [claim("The founders' investment comes from the founders' own capital.", "founders-capital")] as Rich,
  footnote: [claim("Year-end figures. Cash during 2027 may be lower before spring sales.", "year-end")] as Rich,
  assumptions: SEASONS.map((s) => `${s.year}: ${amount(s.litresEach)} of each${s.litresEach < 1000 ? " product" : ""}.`).join(" "),
  closing: [
    claim(
      "These numbers are conservative. With the right conditions, we will produce more, and faster, and every customer conversation makes our numbers sharper.",
      "conservative",
    ),
  ] as Rich,
  notes: [
    `"Here are three pool seasons. In 2027 we, the founders, invest 60,000 dollars of our own money, and we sell 500 packages. The first year loses 45,255 dollars, so we end 2027 with 14,745 in cash. In 2028 we sell 2,000 packages: we are profitable, the investment is paid back, and we end the year with 60,975. In 2029 we sell 4,000 and end with 155,936. These figures are at year-end, so cash in early 2027 may be lower before spring sales. These numbers are conservative. Do they look realistic to you?"`,
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/* 3. Your two questions (about 60 s) ------------------------------- */

export const questionsSlide = {
  n: 3,
  title: "Your two questions",
  ground: "deep",
  headline: "Your two questions.",
  first: {
    heading: "How will we get our first customer?",
    steps: [
      { text: "We talk to local pool stores, starting with your introduction to Gabriela at Amazon Pools and Spas, and compare our product with what is on their shelf." },
      { text: "We send them photos of our jar test, so they can see the result." },
      { text: "From our experience, stores usually accept a small first order." },
      {
        text: "For feedback, we give them 20 litres of samples.",
        small: "Both products once the anti-algae is registered. Clarifier only before that.",
      },
    ],
  },
  holding: {
    heading: "What is holding us back?",
    items: [
      { lead: "Capital:", text: `the ${money(STARTUP_CASH)} start-up cost.` },
      { lead: "Our co-founder's visa:", text: "Dr. Ali Kalateh's visa." },
    ],
  },
  notes: [
    "\"My first customer: we talk to local pool stores, starting with your introduction to Gabriela, and compare our product with what is on their shelf. We send photos of our jar test. Stores usually accept a small first order, and we give them 20 litres of samples for feedback. What holds us back: capital, the 60,000 dollar start-up cost, and Dr. Ali Kalateh's visa.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

export const slides = [saleSlide, seasonsSlide, questionsSlide] as const;

export const SLIDE_COUNT = slides.length;

/** The shared DemoTimer reads these; this page has no live demo, so T is off. */
export const liveSlide = { timerNotStarted: "", timerPrint: "", timerCaption: "" };

/** For the content check: the package price the page uses. */
export const packageRetail = PACKAGE.retail;

/* Interface strings ------------------------------------------------ */

export const ui: PageUi = {
  deckLabel: "Mazdak Atlantic AgriAqua, pool line financials",
  companyName: "Mazdak Atlantic AgriAqua",
  logoAlt: "Mazdak Atlantic AgriAqua",
  assumptionTag: "assumption",
  proofLead: "How this gets proven:",
  notesHeading: "Presenter note",
  sourcesHeading: "Source register",
  sourcesHint: "Press S or Escape to close.",
  close: "Close",
  prev: "Previous section",
  next: "Next section",
  timerFooter: "",
  timerLabel: "",
  slideOf: (n: number, total: number) => `${n} of ${total}`,
  goTo: (n: number, title: string) => `Go to section ${n}, ${title}`,
  openImage: (caption: string) => `Open image full size: ${caption}`,
  auditCount: (onSlide: number, inDeck: number) =>
    `${onSlide} unproven ${onSlide === 1 ? "claim" : "claims"} on this section, ${inDeck} on the page.`,
  announce: (n: number, total: number, title: string) => `Section ${n} of ${total}, ${title}`,
};

/* Claim counting for audit mode ------------------------------------ */

const counted = countClaims(slides, claims);
export const claimsPerSlide = counted.perSlide;
export const claimsInDeck = counted.inDeck;
