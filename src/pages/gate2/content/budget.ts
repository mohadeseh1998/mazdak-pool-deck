import type { BudgetRow } from "../../../content/budget";

// The source register (key S) reads this module. /gate2/ has no budget table
// and no source register, so there are no rows.
export const budgetRows: readonly BudgetRow[] = [];
