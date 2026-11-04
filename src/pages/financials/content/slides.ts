import {
  cashSummary,
  count,
  FIXED_COSTS_2027,
  money,
  money2,
  moneyShort,
  PMRA_ANNUAL,
  PMRA_FEE_RANGE,
  PMRA_FEES,
  PRICES,
  RESULTS,
  SCENARIOS,
  UNIT,
  WORST_COST_RISE_PCT,
  type ScenarioId,
  type SeasonResult,
} from "../../../content/poolModel";
import type { PageSlide, PageUi, Rich } from "../../shared/types";
import { countClaims } from "../../shared/types";
import { claims, type ClaimId } from "./claims";
import { buyingBoth } from "./pricing";

// All copy for /financials/ (financials brief, Section 2), set word for word.
// Every figure is computed from src/content/poolModel.ts, never typed here.
// scripts/check-content.mjs rebuilds the totals on its own and holds every
// string below to the brief's exact words.

type C = { text: Rich; claim: ClaimId };
const claim = (text: Rich, id: ClaimId): C => ({ text, claim: id });

const base = SCENARIOS.base;
const worst = SCENARIOS.worst;
export const CASH = { base: cashSummary(RESULTS.base), worst: cashSummary(RESULTS.worst) };

/* 1. What one sale earns (about 60 s) ------------------------------ */

const unitRow = (label: string, pick: (u: typeof UNIT.clarifier) => string) => ({
  label,
  values: [pick(UNIT.clarifier), pick(UNIT.pack)],
});

export const saleSlide = {
  n: 1,
  title: "What one sale earns",
  ground: "deep",
  headline: "What one sale earns.",
  honesty: "Every number here is a planning assumption. No store has quoted our price and we have not run a full production batch yet.",
  unit: {
    columns: ["Atlantic Clarifier, 1 L", "Atlantic Pool Pack, 2 x 1 L"],
    // The whole table carries one [assumption] tag.
    claim: "unit-economics" as ClaimId,
    rows: [
      unitRow("Suggested retail", (u) => money2(u.retail)),
      unitRow(`Store keeps ${UNIT.clarifier.storePct}%`, (u) => money2(u.storeKeeps)),
      unitRow("We sell to the store at", (u) => money2(u.wholesale)),
      unitRow("Our cost to make (bottle, label and contents)", (u) => money2(u.cost)),
    ],
    keep: {
      label: "We keep, per sale",
      /** In cents, for the count-up. */
      cents: [Math.round(UNIT.clarifier.weKeep * 100), Math.round(UNIT.pack.weKeep * 100)],
      pct: [`(${UNIT.clarifier.weKeepPct}%)`, `(${UNIT.pack.weKeepPct}%)`],
    },
  },
  fixed: {
    heading: "Fixed costs, per year, before any sale",
    items: FIXED_COSTS_2027.map((f) => ({ label: f.label, amount: claim(money(f.amount), f.id) })),
    total: { label: "Total, 2027", amount: money(FIXED_COSTS_2027.reduce((s, f) => s + f.amount, 0)) },
    oneTime: {
      label: "One-time: PMRA application fees for the anti-algae",
      amount: `${money(PMRA_FEE_RANGE.low)} to ${money(PMRA_FEE_RANGE.high)}`,
    },
  },
  footnote:
    `Founders are unpaid in this plan. PMRA fees from the Pest Control Products Fees and Charges Regulations: ` +
    `product chemistry ${money(PMRA_FEES.productChemistry)}, acute toxicity ${money(PMRA_FEES.acuteToxicity)}, ` +
    `value ${money(PMRA_FEES.value)}, plus ${money(PMRA_FEES.exposureData)} exposure data if PMRA asks for it. ` +
    `Annual PMRA charge after registration: ${Math.round(PMRA_ANNUAL.rate * 100)} percent of the previous year's revenue, ` +
    `minimum ${money(PMRA_ANNUAL.min)}, maximum ${money(PMRA_ANNUAL.max)}.`,
  warnings: [
    `At ${moneyShort(PRICES.packRetail)}, the pack earns us ${moneyShort(UNIT.pack.weKeep)}. ` +
      `If a store wants ${UNIT.packWorst.storePct} percent and our cost rises ${WORST_COST_RISE_PCT} percent, ` +
      `that drops to ${Math.round(UNIT.packWorst.weKeep * 100)} cents. The price, or the cost, has to move.`,
    `Price check: at ${moneyShort(UNIT.packAtCheck.retail)} retail, the pack would earn us ${moneyShort(UNIT.packAtCheck.weKeep)} per sale, ` +
      `${UNIT.packAtCheck.weKeep === 2 * UNIT.pack.weKeep ? "twice as much" : "CHECK THE MODEL"}, ` +
      `and still be cheaper than buying a clarifier and an algaecide today ` +
      `(${money(buyingBoth.min)} to ${money(buyingBoth.max)}).`,
  ],
  notes: [
    "\"Here is one sale. The store sells our pack for 29.99, keeps 40 percent, and pays us 18 dollars. It costs us 12 to make, so we keep 6. The clarifier alone earns us 4.20. Before any sale we have about 10,000 dollars a year in fixed costs, plus a one-time PMRA fee for the anti-algae. And here is my worry: 6 dollars is thin. If a store wants 50 percent and costs go up, we earn almost nothing. At 39.99 we would earn 12 and still be cheaper than today's shelf. I'd like your view on that.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/* 2. Three seasons, base and worst (about 60 s) -------------------- */

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
  { key: "stores", label: "Stores", format: count, money: false },
  { key: "clarBottles", label: "Clarifier bottles", format: count, money: false },
  { key: "packs", label: "Pool Packs", format: count, money: false },
  { key: "revenue", label: "Revenue", format: money, money: true, rule: true },
  { key: "cogs", label: "Cost of goods", format: money, money: true },
  { key: "fixedAndPmra", label: "Fixed costs and PMRA", format: money, money: true },
  { key: "net", label: "Net", format: money, money: true, strong: true, rule: true },
  { key: "cumulative", label: "Cumulative cash", format: money, money: true, strong: true },
];

/** The table exactly as it reads when settled: what the content check compares to the brief. */
export function seasonTable(id: ScenarioId): { label: string; cells: string[] }[] {
  return TABLE_ROWS.map((row) => ({ label: row.label, cells: RESULTS[id].map((r) => row.format(r[row.key])) }));
}

const firstPackYear = worst.seasons.find((s) => s.packPerStore > 0)!.year;

export const hero = {
  base: {
    lead: "Cash we need before we turn positive:",
    figure: CASH.base.needRounded,
    tail: `Positive in the ${CASH.base.positiveYear} season.`,
    sentence: `Cash we need before we turn positive: about ${money(CASH.base.needRounded)}. Positive in the ${CASH.base.positiveYear} season.`,
  },
  worst: {
    lead: "Cash we need:",
    figure: CASH.worst.needRounded,
    tail: CASH.worst.positiveYear === null ? "and still not positive after three seasons." : "CHECK THE MODEL",
    sentence: `Cash we need: about ${money(CASH.worst.needRounded)}, and still not positive after three seasons.`,
  },
};

export const seasonsSlide = {
  n: 2,
  title: "Three seasons, base and worst",
  ground: "deep",
  headline: "Three pool seasons. Base, and worst.",
  toggle: {
    label: "Scenario",
    options: [
      { id: "base" as ScenarioId, label: "Base" },
      { id: "worst" as ScenarioId, label: "Worst" },
    ],
    key: "W",
  },
  about: "about",
  chart: {
    label: "Revenue, total costs and cumulative cash, by season",
    seasons: RESULTS.base.map((r) => `${r.year} season`),
    legend: { revenue: "Revenue", costs: "Total costs", cash: "Cumulative cash" },
  },
  years: RESULTS.base.map((r) => String(r.year)),
  lists: {
    base: {
      heading: "Base assumptions",
      items: [
        `${base.seasons[0].clarPerStore} clarifier bottles per store per season`,
        `From ${base.seasons[1].year}, ${base.seasons[1].packPerStore} packs per store, then ${base.seasons[2].packPerStore} in ${base.seasons[2].year}`,
        "Stores grow from Fredericton (2027) to other New Brunswick cities (2028) and Atlantic Canada (2029)",
        `PMRA registration in time for the ${base.pmraYear + 1} season`,
      ],
    },
    worst: {
      heading: "What changes in the worst case",
      items: [
        `Stores keep ${UNIT.packWorst.storePct} percent`,
        `Our cost rises ${WORST_COST_RISE_PCT} percent`,
        worst.seasons[0].clarPerStore * 2 === base.seasons[0].clarPerStore ? "Half the bottles per store" : "CHECK THE MODEL",
        `PMRA asks for exposure data and takes a year longer, so the pack starts in ${firstPackYear}`,
      ],
    },
  },
  closing: [
    claim(
      `We plan for the worst case: about ${money(CASH.worst.needRounded)} over three seasons, from founder capital and the non-dilutive grants we are applying for.`,
      "funding",
    ),
  ] as Rich,
  notes: [
    "\"Here are three pool seasons. In the base case we start with 3 stores and only the clarifier, lose about 14,000 dollars in the first season, and turn positive in 2029. In the worst case, stores take 50 percent, costs go up, we sell half as much and PMRA takes a year longer. Then we need about 55,000 dollars and we are still not positive. So we plan for 55,000. Do these numbers look realistic to you?\"",
    "Press W to switch between Base and Worst.",
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
      "Your introduction to Gabriela at Amazon Pools and Spas: 30 minutes, with a live jar test on the counter.",
      "Leave two sample bottles and our price sheet. Ask what would make them say yes.",
      [claim("Offer one case for the 2027 season, with unsold bottles taken back.", "take-back")],
      "Call the City of Fredericton Recreation Department to learn how city pools buy chemicals.",
      [claim("Stores plan their spring stock in winter, so we aim for a yes before March 2027.", "spring-stock")],
    ] as readonly Rich[],
  },
  holding: {
    heading: "What is holding us back?",
    items: [
      {
        lead: "Licences.",
        text: "We are still confirming which approvals the clarifier needs: federal labelling, New Brunswick, and the City of Fredericton.",
      },
      {
        lead: "PMRA for the anti-algae.",
        text: `${money(PMRA_FEE_RANGE.low)} to ${money(PMRA_FEE_RANGE.high)} in application fees, and the time it takes. If the fee is more than 10 percent of expected revenue, PMRA lets us pay 10 percent up front.`,
      },
      { lead: "No customer conversation yet.", text: "Zero so far. Your introduction is our first." },
      { lead: `Thin margin at ${moneyShort(PRICES.packRetail)}.`, text: "We need your advice on price." },
      { lead: "Cash for the worst case.", text: `About ${money(CASH.worst.needRounded)} over three seasons.` },
    ],
  },
  notes: [
    "\"My first customer: your introduction to Gabriela, a jar test on her counter, two free bottles, and one case on her shelf with a take-back promise. What holds us back: licences, PMRA cost and time, no customer conversation yet, a thin margin, and cash for the worst case.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

export const slides = [saleSlide, seasonsSlide, questionsSlide] as const;

export const SLIDE_COUNT = slides.length;

/** The shared DemoTimer reads these; this page has no live demo, so T is off. */
export const liveSlide = { timerNotStarted: "", timerPrint: "", timerCaption: "" };

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
