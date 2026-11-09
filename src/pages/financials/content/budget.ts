import type { BudgetRow } from "../../../content/budget";

// What each source supports, in the shape the source register (key S) reads.
// This page has no budget; these rows only label the sources.
const used = (id: string, line: string, source: string): BudgetRow =>
  ({ id, line, buys: "", amount: 0, fundedBy: "", source }) as unknown as BudgetRow;

export const budgetRows: readonly BudgetRow[] = [
  used("store", "Even at 40 percent", "store-margin"),
  used("pmra-annual", "PMRA annual charge", "pmra-annual"),
  used("cost", "Our cost to make", "cost"),
  used("startup", "Start-up cash and running costs", "startup"),
];
