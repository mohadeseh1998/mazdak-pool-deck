// The pool line financial model (financials brief, Sections 3 and 4). The one
// source for every price, cost and total on /financials/ and for the price
// table on /customer/. Every number here is a planning assumption.
//
// The pages never type a total: they call the functions below. Before every
// build, scripts/check-content.mjs recomputes the totals on its own and fails
// unless they equal the brief's Section 4.
//
// This file imports nothing, so the content check can load it directly.

/* ------------------------------------------------------------------ */
/* Inputs, set exactly as the brief's Section 3                        */
/* ------------------------------------------------------------------ */

export const PRICES = { clarRetail: 16.99, packRetail: 29.99 };

export interface Season {
  year: number;
  stores: number;
  clarPerStore: number;
  packPerStore: number;
  fixed: number;
}

export interface Scenario {
  clarWholesale: number;
  packWholesale: number;
  clarCost: number;
  packCost: number;
  seasons: readonly Season[];
  pmraFee: number;
  pmraYear: number;
}

export const SCENARIOS = {
  base: {
    clarWholesale: 10.2, packWholesale: 18.0, clarCost: 6.0, packCost: 12.0,
    seasons: [
      { year: 2027, stores: 3,  clarPerStore: 200, packPerStore: 0,   fixed: 10000 },
      { year: 2028, stores: 6,  clarPerStore: 200, packPerStore: 300, fixed: 12000 },
      { year: 2029, stores: 15, clarPerStore: 200, packPerStore: 400, fixed: 20000 },
    ],
    pmraFee: 6573, pmraYear: 2027,
  },
  worst: {
    clarWholesale: 8.5, packWholesale: 15.0, clarCost: 7.2, packCost: 14.4,
    seasons: [
      { year: 2027, stores: 2, clarPerStore: 100, packPerStore: 0,   fixed: 12000 },
      { year: 2028, stores: 3, clarPerStore: 100, packPerStore: 0,   fixed: 14000 },
      { year: 2029, stores: 8, clarPerStore: 100, packPerStore: 200, fixed: 20000 },
    ],
    pmraFee: 11787, pmraYear: 2028,
  },
} satisfies Record<string, Scenario>;

export type ScenarioId = keyof typeof SCENARIOS;

/** PMRA annual charge after registration: 4 percent of the previous season's revenue, $100 to $3,600. */
export const PMRA_ANNUAL = { rate: 0.04, min: 100, max: 3600 };

/** PMRA application fees for the anti-algae (Fees and Charges Regulations, Schedule 1). */
export const PMRA_FEES = { productChemistry: 2713, acuteToxicity: 2954, value: 906, exposureData: 5214 };

/** Without exposure data, and with it if PMRA asks. */
export const PMRA_FEE_RANGE = {
  low: PMRA_FEES.productChemistry + PMRA_FEES.acuteToxicity + PMRA_FEES.value,
  high: PMRA_FEES.productChemistry + PMRA_FEES.acuteToxicity + PMRA_FEES.value + PMRA_FEES.exposureData,
};

/** Fixed costs per year before any sale, base case 2027. They add up to the 2027 `fixed` input. */
export const FIXED_COSTS_2027 = [
  { id: "insurance", label: "Product liability insurance", amount: 1500 },
  { id: "space", label: "Production space and utilities", amount: 3000 },
  { id: "labels-sds", label: "Label compliance and safety data sheets", amount: 1500 },
  { id: "marketing", label: "Samples, demos and marketing", amount: 2000 },
  { id: "delivery-cost", label: "Local delivery", amount: 1000 },
  { id: "admin", label: "Admin and software", amount: 1000 },
] as const;

/** The price check (Section 4): the pack at $39.99 retail sells to the store at $24.00. */
export const PRICE_CHECK = { packRetail: 39.99, packWholesale: 24.0 };

/* ------------------------------------------------------------------ */
/* The model                                                           */
/* ------------------------------------------------------------------ */

/** Money is worked in whole cents so no total ever drifts by a fraction. */
const cents = (dollars: number): number => Math.round(dollars * 100);
const toDollars = (c: number): number => Math.round(c) / 100;

export interface SeasonResult {
  year: number;
  stores: number;
  clarBottles: number;
  packs: number;
  revenue: number;
  cogs: number;
  /** Fixed costs, plus the PMRA fee in its year, plus the annual charge after it. */
  fixedAndPmra: number;
  net: number;
  cumulative: number;
}

/**
 * Net = revenue - cost of goods - fixed - PMRA fee (in pmraYear) - annual charge.
 * The annual charge is 0 up to and including pmraYear, then
 * max(100, min(3600, round(0.04 * previous season revenue))).
 */
export function runScenario(s: Scenario): SeasonResult[] {
  let previousRevenue = 0;
  let cumulative = 0;
  return s.seasons.map((season) => {
    const clarBottles = season.stores * season.clarPerStore;
    const packs = season.stores * season.packPerStore;
    const revenue = toDollars(clarBottles * cents(s.clarWholesale) + packs * cents(s.packWholesale));
    const cogs = toDollars(clarBottles * cents(s.clarCost) + packs * cents(s.packCost));
    const fee = season.year === s.pmraYear ? s.pmraFee : 0;
    const annual =
      season.year <= s.pmraYear
        ? 0
        : Math.max(PMRA_ANNUAL.min, Math.min(PMRA_ANNUAL.max, Math.round(PMRA_ANNUAL.rate * previousRevenue)));
    const fixedAndPmra = season.fixed + fee + annual;
    const net = toDollars(cents(revenue) - cents(cogs) - cents(fixedAndPmra));
    cumulative = toDollars(cents(cumulative) + cents(net));
    previousRevenue = revenue;
    return {
      year: season.year,
      stores: season.stores,
      clarBottles,
      packs,
      revenue,
      cogs,
      fixedAndPmra,
      net,
      cumulative,
    };
  });
}

export const RESULTS: Record<ScenarioId, SeasonResult[]> = {
  base: runScenario(SCENARIOS.base),
  worst: runScenario(SCENARIOS.worst),
};

export interface CashSummary {
  /** The lowest cumulative cash across the seasons, as a positive amount we need. */
  need: number;
  /** The same, to the nearest thousand, as the page says it ("about $14,000"). */
  needRounded: number;
  /** The first season whose cumulative cash is zero or more, or null if none. */
  positiveYear: number | null;
}

export function cashSummary(results: readonly SeasonResult[]): CashSummary {
  const lowest = Math.min(0, ...results.map((r) => r.cumulative));
  const need = -lowest;
  const positive = results.find((r) => r.cumulative >= 0);
  return { need, needRounded: Math.round(need / 1000) * 1000, positiveYear: positive ? positive.year : null };
}

/* ------------------------------------------------------------------ */
/* One sale                                                            */
/* ------------------------------------------------------------------ */

export interface UnitEconomics {
  retail: number;
  /** What the store keeps: retail less our price to the store. */
  storeKeeps: number;
  storePct: number;
  wholesale: number;
  cost: number;
  /** What we keep per sale: our price to the store less our cost to make. */
  weKeep: number;
  /** As a share of our price to the store. */
  weKeepPct: number;
}

export function unitEconomics(retail: number, wholesale: number, cost: number): UnitEconomics {
  const storeKeeps = toDollars(cents(retail) - cents(wholesale));
  const weKeep = toDollars(cents(wholesale) - cents(cost));
  return {
    retail,
    storeKeeps,
    storePct: Math.round((storeKeeps / retail) * 100),
    wholesale,
    cost,
    weKeep,
    weKeepPct: Math.round((weKeep / wholesale) * 100),
  };
}

export const UNIT = {
  clarifier: unitEconomics(PRICES.clarRetail, SCENARIOS.base.clarWholesale, SCENARIOS.base.clarCost),
  pack: unitEconomics(PRICES.packRetail, SCENARIOS.base.packWholesale, SCENARIOS.base.packCost),
  /** The pack in the worst case: the store keeps 50 percent and our cost rises 20 percent. */
  packWorst: unitEconomics(PRICES.packRetail, SCENARIOS.worst.packWholesale, SCENARIOS.worst.packCost),
  /** The pack at the price check's $39.99. */
  packAtCheck: unitEconomics(PRICE_CHECK.packRetail, PRICE_CHECK.packWholesale, SCENARIOS.base.packCost),
};

/** How much our cost rises in the worst case, in percent. */
export const WORST_COST_RISE_PCT = Math.round((SCENARIOS.worst.packCost / SCENARIOS.base.packCost - 1) * 100);

/* ------------------------------------------------------------------ */
/* Formatting, as the pages show money                                 */
/* ------------------------------------------------------------------ */

/** The minus sign (U+2212), set in front of the dollar sign: -$14,053 reads as minus $14,053. */
export const MINUS = String.fromCharCode(0x2212);

/** Whole dollars with thousands separators: $6,120, minus $14,053. */
export function money(n: number): string {
  const abs = Math.abs(Math.round(n));
  return `${n < 0 && abs !== 0 ? MINUS : ""}$${abs.toLocaleString("en-CA")}`;
}

/** Dollars and cents: $10.20, $6.79. */
export const money2 = (n: number): string => `$${n.toFixed(2)}`;

/** Dollars, with cents only when there are any: $6, $29.99. */
export const moneyShort = (n: number): string => (Number.isInteger(n) ? `$${n}` : money2(n));

/** Whole counts with thousands separators: 1,200. */
export const count = (n: number): string => Math.round(n).toLocaleString("en-CA");
