import { PriceStrip, reveal, RichText, SlideFrame } from "../../shared/kit";
import { priceSlide as c } from "../content/slides";
import { atlanticColumns, atlanticHeading, atlanticRows, priceFootnote, priceHeading } from "../content/pricing";

/** Left, the shelf today (the root deck's price strip). Right, ours, in pool blue. */
export function PriceSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="c-price">
      <h2 className="t-headline t-headline--sm" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="c-price__grid">
        <div className="card c-price__shelf" {...reveal(2.6)}>
          <h3 className="c-price__heading">{priceHeading}</h3>
          <PriceStrip />
        </div>
        <div className="card card--pool c-price__ours" {...reveal(3.6)}>
          <h3 className="c-price__heading tone-pool">{atlanticHeading}</h3>
          <table className="c-table">
            <thead>
              <tr>
                {atlanticColumns.map((col, i) => (
                  <th key={col} scope="col" className={i ? "num" : undefined}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {atlanticRows.map((r, i) => (
                <tr key={r.id} {...reveal(4.4 + i * 0.5, "row")}>
                  <th scope="row">{r.product}</th>
                  <td className="num">{r.retail}</td>
                  <td className="num">{r.cost}</td>
                  <td className="num c-table__keep">
                    {r.keep} <span className="c-table__pct">{r.keepPct}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="c-price__proposal" {...reveal(5.6)}>
            <RichText value={c.proposal} />
          </p>
        </div>
      </div>
      <p className="t-caption c-price__foot" {...reveal(6.5)}>
        {priceFootnote}
      </p>
    </SlideFrame>
  );
}
