import type { ClaimId } from "./claims";
import type { SourceKey } from "./sources";

// The ask (deck version 2), the single source for every figure on it.
// scripts/check-content.mjs fails the build unless the rows funded by today's
// ask add up to exactly $1,000 and all rows to exactly $2,000.

export const ASK_FUNDER = "Today's ask";
export const FOUNDERS = "Founders";

export interface BudgetRow {
  id: string;
  line: string;
  buys: string;
  amount: number;
  /** "Today's ask" or "Founders". */
  fundedBy: string;
  claim?: ClaimId;
  source?: SourceKey;
}

export const budgetRows: readonly BudgetRow[] = [
  {
    id: "raw",
    line: "Raw materials",
    buys: "About 10 kg for each product, 20 kg in total, shipping included",
    amount: 300,
    fundedBy: ASK_FUNDER,
  },
  {
    id: "bottles",
    line: "Bottles",
    buys: "20 bottles, shipping included",
    amount: 150,
    fundedBy: ASK_FUNDER,
  },
  {
    id: "labels",
    line: "Labels",
    buys: "20 bilingual labels, shipping included",
    amount: 150,
    fundedBy: ASK_FUNDER,
  },
  {
    id: "lab",
    line: "Lab analyses",
    buys: "The analyses our licences need",
    amount: 400,
    fundedBy: ASK_FUNDER,
  },
  {
    id: "licences",
    line: "Licences",
    buys: "Licensing work and fees",
    amount: 1000,
    fundedBy: FOUNDERS,
  },
];

const sum = (rows: readonly BudgetRow[]) => rows.reduce((total, row) => total + row.amount, 0);

/** The rows today's ask pays for, and those the founders cover. */
export const askRows = budgetRows.filter((r) => r.fundedBy === ASK_FUNDER);
export const founderRows = budgetRows.filter((r) => r.fundedBy !== ASK_FUNDER);

/** Today's ask, always computed from its rows. */
export const ask: number = sum(askRows);

/** The first prototype, always computed from every row. */
export const prototypeTotal: number = sum(budgetRows);

/** Whole dollars with a thousands comma, as the slide shows them: $1,000. */
export const dollars = (n: number): string => `$${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
