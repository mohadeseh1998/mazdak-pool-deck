import type { BudgetRow } from "../../../content/budget";

// What each source supports, in the shape the source register (key S) reads.
// This page has no budget; these rows only label the sources.
const used = (id: string, line: string, source: string): BudgetRow =>
  ({ id, line, buys: "", amount: 0, fundedBy: "", source }) as unknown as BudgetRow;

export const budgetRows: readonly BudgetRow[] = [
  used("store", "Store keeps 40%", "store-margin"),
  used("pmra-fees", "PMRA application fees", "pmra-fees"),
  used("pmra-annual", "Annual PMRA charge", "pmra-annual"),
  used("insurance", "Product liability insurance", "insurance"),
  used("cost", "Our cost to make", "cost"),
];
