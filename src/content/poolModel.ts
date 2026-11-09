// The pool line financial model (version 2 changes, Part B). The one source
// for every figure on /financials/. Every number here is a planning
// assumption. One package is the Atlantic Pool Pack: 1 L Atlantic Clarifier
// plus 1 L Atlantic Anti-Algae.
//
// The page never types a total: it calls the functions below. Before every
// build, scripts/check-content.mjs recomputes the totals on its own and fails
// unless they equal the version 2 season table.
//
// This file imports nothing, so the content check can load it directly.

/* ------------------------------------------------------------------ */
/* Inputs, set exactly as the version 2 file                           */
/* ------------------------------------------------------------------ */

export const PACKAGE = {
  retail: 49.99,
  storeShare: 0.25, // negotiable
  wholesale: 37.49, // retail x 0.75
  costPerPackage: 8.0, // whole package (2 bottles, labels, contents); one constant, easy to change
};

/** One-time, 2027, founders' estimate. Includes the 2027 running costs. */
export const STARTUP_CASH = 60000;

export interface Season {
  year: number;
  packages: number;
  litresEach: number;
  runningCosts: number;
}

export const SEASONS: readonly Season[] = [
  { year: 2027, packages: 500, litresEach: 500, runningCosts: 0 }, // 2027 running costs are inside STARTUP_CASH
  { year: 2028, packages: 2000, litresEach: 2000, runningCosts: 12000 },
  { year: 2029, packages: 4000, litresEach: 4000, runningCosts: 20000 },
];

/** PMRA annual charge: 4 percent of the previous year's revenue, up to $4,509.90. */
export const PMRA_ANNUAL = { rate: 0.04, max: 4509.9 };

/** "Even at 40 percent": the store share the page tests the margin against. */
export const STORE_SHARE_TEST = 0.4;

/* ------------------------------------------------------------------ */
/* The model                                                           */
/* ------------------------------------------------------------------ */

/** Money is worked in whole cents so no total ever drifts by a fraction. */
const cents = (dollars: number): number => Math.round(dollars * 100);
const toDollars = (c: number): number => Math.round(c) / 100;

export interface SeasonResult {
  year: number;
  packages: number;
  litresEach: number;
  revenue: number;
  cogs: number;
  /** The start-up cash in the first season, the running costs after it. */
  startupAndRunning: number;
  pmra: number;
  net: number;
  cumulative: number;
}

/**
 * Net = revenue - cost of goods - start-up and running costs - PMRA annual charge.
 * The annual charge is round(0.04 x the previous season's revenue), at most $4,509.90.
 */
export function runSeasons(seasons: readonly Season[] = SEASONS): SeasonResult[] {
  let previousRevenue = 0;
  let cumulative = 0;
  return seasons.map((s, i) => {
    const revenue = toDollars(s.packages * cents(PACKAGE.wholesale));
    const cogs = toDollars(s.packages * cents(PACKAGE.costPerPackage));
    const startupAndRunning = (i === 0 ? STARTUP_CASH : 0) + s.runningCosts;
    const pmra = Math.min(PMRA_ANNUAL.max, Math.round(PMRA_ANNUAL.rate * previousRevenue));
    const net = toDollars(cents(revenue) - cents(cogs) - cents(startupAndRunning) - cents(pmra));
    cumulative = toDollars(cents(cumulative) + cents(net));
    previousRevenue = revenue;
    return {
      year: s.year,
      packages: s.packages,
      litresEach: s.litresEach,
      revenue,
      cogs,
      startupAndRunning,
      pmra,
      net,
      cumulative,
    };
  });
}

export const RESULTS: SeasonResult[] = runSeasons();

/** The first season that is profitable and has paid the start-up cash back, or null. */
export const PAYBACK_YEAR: number | null = RESULTS.find((r) => r.net > 0 && r.cumulative >= 0)?.year ?? null;

/* ------------------------------------------------------------------ */
/* One package                                                         */
/* ------------------------------------------------------------------ */

export interface UnitEconomics {
  retail: number;
  /** What the store keeps: retail less our price to the store. */
  storeKeeps: number;
  storePct: number;
  wholesale: number;
  cost: number;
  /** What we keep per package: our price to the store less our cost to make. */
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

/** Our price to the store when the store keeps `share`, to the cent below. */
export const wholesaleAt = (share: number): number => Math.floor(cents(PACKAGE.retail) * (1 - share)) / 100;

export const UNIT = {
  /** The package at the 25 percent store share. */
  pack: unitEconomics(PACKAGE.retail, PACKAGE.wholesale, PACKAGE.costPerPackage),
  /** The package if a store keeps 40 percent. */
  packAtTest: unitEconomics(PACKAGE.retail, wholesaleAt(STORE_SHARE_TEST), PACKAGE.costPerPackage),
};

/* ------------------------------------------------------------------ */
/* Formatting, as the pages show money                                 */
/* ------------------------------------------------------------------ */

/** The minus sign (U+2212), set in front of the dollar sign: minus $45,255. */
export const MINUS = String.fromCharCode(0x2212);

/** Whole dollars with thousands separators: $18,745, minus $45,255. */
export function money(n: number): string {
  const abs = Math.abs(Math.round(n));
  return `${n < 0 && abs !== 0 ? MINUS : ""}$${abs.toLocaleString("en-CA")}`;
}

/** Dollars and cents: $37.49, $4,509.90. */
export const money2 = (n: number): string =>
  `$${n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Whole counts with thousands separators: 2,000. */
export const count = (n: number): string => Math.round(n).toLocaleString("en-CA");
