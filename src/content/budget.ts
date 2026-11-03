import type { ClaimId } from "./claims";
import type { SourceKey } from "./sources";

// Slide 8 budget (brief Sections 5 and 7.4), the single source for every figure
// in the ask. scripts/check-content.mjs fails the build unless the run total
// computed from these rows is exactly 800, and the ask is exactly 500 in core
// mode and 800 in full mode.

/** Switch the ask here. "full" asks for the whole $800 run. */
export const ASK_MODE = "core" as "core" | "full";

export const CORE_ASK = 500;

export interface BudgetRow {
  id: string;
  line: string;
  buys: string;
  amount: number;
  /** Who pays in core mode. Full mode reads "Today's ask" on every row. */
  fundedBy: string;
  claim?: ClaimId;
  source?: SourceKey;
}

export const budgetRows: readonly BudgetRow[] = [
  {
    id: "raw",
    line: "Raw material",
    buys: "One 205 L drum of our main raw material, at our Canadian supplier's current price",
    amount: 540,
    fundedBy: "Today's ask ($500) plus founders ($40)",
    source: "raw-drum",
  },
  {
    id: "bottles",
    line: "Bottles",
    buys: "60 one-litre HDPE bottles with caps",
    amount: 100,
    fundedBy: "Nov 19 prototyping fund or founders",
    source: "uline-bottle",
  },
  {
    id: "labels",
    line: "Labels",
    buys: "100 waterproof bilingual labels",
    amount: 100,
    fundedBy: "Nov 19 prototyping fund or founders",
    source: "labels",
  },
  {
    id: "demo-kits",
    line: "Demo kits",
    buys: "Clear jars, droppers, gloves and goggles for store demos",
    amount: 60,
    fundedBy: "Nov 19 prototyping fund or founders",
    claim: "demo-kits",
  },
];

/** The first production run, always computed from the rows. */
export const runTotal: number = budgetRows.reduce((sum, row) => sum + row.amount, 0);

export function askFor(mode: "core" | "full"): number {
  return mode === "core" ? CORE_ASK : runTotal;
}

export const ask: number = askFor(ASK_MODE);

export const fundedByFull = "Today's ask";

export const fundedBy = (row: BudgetRow): string => (ASK_MODE === "full" ? fundedByFull : row.fundedBy);

/** Whole dollars, as the slide shows them: $800, $540. */
export const dollars = (n: number): string => `$${n}`;
