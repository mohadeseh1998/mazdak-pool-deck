import { ask, budgetRows, dollars, fundedBy, runTotal } from "../content/budget";
import { askSlide } from "../content/slides";
import { Claim } from "./Claim";
import { CountUp } from "./CountUp";
import { reveal } from "./reveal";

/**
 * Slide 8 (brief Section 7.4). Rows come from budget.ts; the run total is
 * computed from them, never typed. Amounts right-aligned in tabular figures.
 */
export function BudgetTable() {
  const t = askSlide.table;
  return (
    <table className="budget">
      <caption className="visually-hidden">{t.caption}</caption>
      <colgroup>
        <col className="budget__col-line" />
        <col className="budget__col-buys" />
        <col className="budget__col-amount" />
        <col className="budget__col-funded" />
      </colgroup>
      <thead>
        <tr {...reveal(2, "row")}>
          <th scope="col">{t.columns[0]}</th>
          <th scope="col">{t.columns[1]}</th>
          <th scope="col" className="budget__amount">
            {t.columns[2]}
          </th>
          <th scope="col">{t.columns[3]}</th>
        </tr>
      </thead>
      <tbody>
        {budgetRows.map((row, i) => (
          <tr key={row.id} data-source={row.source} {...reveal(2.5 + i * 0.5, "row")}>
            <th scope="row">{row.line}</th>
            <td>{row.buys}</td>
            <td className="budget__amount">
              {row.claim ? <Claim id={row.claim}>{dollars(row.amount)}</Claim> : dollars(row.amount)}
            </td>
            <td className="budget__funded">{fundedBy(row)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="budget__total" {...reveal(5, "row")}>
          <th scope="row" colSpan={2}>
            {t.totalLabel}
          </th>
          <td className="budget__amount">{dollars(runTotal)}</td>
          <td />
        </tr>
        <tr className="budget__ask" {...reveal(5.6, "row")}>
          <th scope="row" colSpan={2}>
            {t.askLabel}
          </th>
          <td className="budget__amount">
            <CountUp value={ask} format={dollars} />
          </td>
          <td />
        </tr>
      </tfoot>
    </table>
  );
}
