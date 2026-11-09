import { money } from "../../../content/poolModel";
import { Claim, CountUp, reveal, RichText, SlideFrame } from "../../shared/kit";
import { saleSlide as c } from "../content/slides";

const cents = (n: number) => `$${(n / 100).toFixed(2)}`;

/** One package, left; the one-time start-up cash, right, set large. */
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
        <div className="f-sale__left" {...reveal(3)}>
          <div className="card f-unit">
            <table className="c-table f-unit__table">
              <thead>
                <tr>
                  <th scope="col" className="f-unit__tag">
                    <Claim id={u.claim}>{""}</Claim>
                  </th>
                  <th scope="col" className="num">
                    {u.column}
                  </th>
                </tr>
              </thead>
              <tbody>
                {u.rows.map((r, i) => (
                  <tr key={r.label} {...reveal(3.6 + i * 0.4, "row")}>
                    <th scope="row">{r.label}</th>
                    <td className="num">{r.value}</td>
                  </tr>
                ))}
                <tr className="f-unit__keep" {...reveal(5.4, "row")}>
                  <th scope="row">{u.keep.label}</th>
                  <td className="num">
                    <span className="f-unit__figure">
                      <CountUp value={u.keep.cents} format={cents} />
                    </span>{" "}
                    <span className="f-unit__pct">{u.keep.pct}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="f-negotiable" {...reveal(6)}>
            {c.negotiable}
          </p>
        </div>

        <div className="f-startup" {...reveal(4)}>
          <p className="f-startup__figure">
            <CountUp value={c.startup.figure} format={money} />
          </p>
          <p className="f-startup__label">{c.startup.label}</p>
          <p className="f-startup__text">
            <RichText value={c.startup.covers} />
          </p>
          <p className="f-startup__running">
            <RichText value={c.startup.running} />
          </p>
        </div>
      </div>

      <p className="t-caption f-foot" {...reveal(7)}>
        {c.footnote}
      </p>
    </SlideFrame>
  );
}
