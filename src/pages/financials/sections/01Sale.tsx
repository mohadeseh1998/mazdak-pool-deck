import { Claim, CountUp, reveal, RichText, SlideFrame } from "../../shared/kit";
import { saleSlide as c } from "../content/slides";

const cents = (n: number) => `$${(n / 100).toFixed(2)}`;

/** One sale, left; the year's fixed costs, right; the honest part, under both. */
export function SaleSection({ index }: { index: number }) {
  const u = c.unit;
  return (
    <SlideFrame slide={c} index={index} className="f-sale">
      <h2 className="t-headline t-headline--sm" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <p className="caution-rule f-honesty" {...reveal(2)}>
        {c.honesty}
      </p>

      <div className="f-sale__grid">
        <div className="card f-unit" {...reveal(3)}>
          <table className="c-table f-unit__table">
            <thead>
              <tr>
                <th scope="col" className="f-unit__tag">
                  <Claim id={u.claim}>{""}</Claim>
                </th>
                {u.columns.map((col) => (
                  <th key={col} scope="col" className="num">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {u.rows.map((r, i) => (
                <tr key={r.label} {...reveal(3.6 + i * 0.4, "row")}>
                  <th scope="row">{r.label}</th>
                  {r.values.map((v, j) => (
                    <td key={j} className="num">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="f-unit__keep" {...reveal(5.4, "row")}>
                <th scope="row">{u.keep.label}</th>
                {u.keep.cents.map((v, j) => (
                  <td key={j} className="num">
                    <span className="f-unit__figure">
                      <CountUp value={v} format={cents} />
                    </span>{" "}
                    <span className="f-unit__pct">{u.keep.pct[j]}</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="f-fixed" {...reveal(4)}>
          <h3 className="f-fixed__heading">{c.fixed.heading}</h3>
          <ul className="f-fixed__cards">
            {c.fixed.items.map((f) => (
              <li key={f.label} className="f-cost">
                <span className="f-cost__amount">
                  <RichText value={[f.amount]} />
                </span>
                <span className="f-cost__label">{f.label}</span>
              </li>
            ))}
          </ul>
          <div className="f-fixed__totals">
            <p className="f-total">
              <span className="f-total__label">{c.fixed.total.label}</span>
              <span className="f-total__amount">{c.fixed.total.amount}</span>
            </p>
            <p className="f-total f-total--once">
              <span className="f-total__label">{c.fixed.oneTime.label}</span>
              <span className="f-total__amount">{c.fixed.oneTime.amount}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="f-warnings">
        {c.warnings.map((w, i) => (
          <p key={i} className="caution-rule f-warning" {...reveal(6.5 + i * 0.5)}>
            {w}
          </p>
        ))}
      </div>
      <p className="t-caption f-foot" {...reveal(7.5)}>
        {c.footnote}
      </p>
    </SlideFrame>
  );
}
