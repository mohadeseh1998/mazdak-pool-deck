import { ask, askRows, dollars, founderRows, prototypeTotal, type BudgetRow } from "../content/budget";
import { askSlide } from "../content/slides";
import { CountUp } from "./CountUp";
import { reveal } from "./reveal";

/**
 * The ask (deck version 2). The rows today's ask pays for, then today's ask set
 * large in pool blue, then what the founders cover, then the whole prototype.
 * Both totals are computed from the rows in budget.ts, never typed.
 */
export function BudgetTable() {
  const t = askSlide.table;
  const row = (r: BudgetRow, beat: number) => (
    <tr key={r.id} data-source={r.source} {...reveal(beat, "row")}>
      <th scope="row">{r.line}</th>
      <td className="budget__buys">{r.buys}</td>
      <td className="budget__amount">{dollars(r.amount)}</td>
      <td className="budget__funded">{r.fundedBy}</td>
    </tr>
  );
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
        {askRows.map((r, i) => row(r, 2.5 + i * 0.5))}
        <tr className="budget__ask" {...reveal(4.6, "row")}>
          <th scope="row" colSpan={2}>
            {t.askLabel}
          </th>
          <td className="budget__amount">
            <CountUp value={ask} format={dollars} />
          </td>
          <td className="budget__empty" />
        </tr>
        {founderRows.map((r, i) => row(r, 5.2 + i * 0.5))}
      </tbody>
      <tfoot>
        <tr className="budget__total" {...reveal(5.8, "row")}>
          <th scope="row" colSpan={2}>
            {t.totalLabel}
          </th>
          <td className="budget__amount">{dollars(prototypeTotal)}</td>
          <td className="budget__empty" />
        </tr>
      </tfoot>
    </table>
  );
}
