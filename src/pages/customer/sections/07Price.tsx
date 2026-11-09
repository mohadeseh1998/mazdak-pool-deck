import { Claim, PriceStrip, reveal, SlideFrame } from "../../shared/kit";
import { priceSlide as c } from "../content/slides";
import { atlanticColumns, atlanticHeading, atlanticRows, priceFootnote, priceHeading } from "../content/pricing";

/**
 * Left, the shelf today (the root deck's price strip). Right, our suggested
 * retail prices, large, each in its product's colour: pool blue, and algae
 * green for the anti-algae, as in the root deck.
 */
export function PriceSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="c-price">
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="c-price__grid">
        <div className="card c-price__shelf" {...reveal(2.6)}>
          <h3 className="c-price__heading">{priceHeading}</h3>
          <PriceStrip />
        </div>
        <div className="card card--pool c-price__ours" {...reveal(3.6)}>
          <h3 className="c-price__heading tone-pool">
            <Claim id={c.pricesTag.claim}>{atlanticHeading}</Claim>
          </h3>
          <table className="c-table c-table--retail">
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
                <tr key={r.id} {...reveal(4.4 + i * 0.4, "row")}>
                  <th scope="row">{r.product}</th>
                  <td className={`num c-table__retail tone-${r.tone}`}>{r.retail}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="c-price__proposal" {...reveal(5.8)}>
            {c.flexible}
          </p>
        </div>
      </div>
      <p className="t-caption c-price__foot" {...reveal(6.5)}>
        {priceFootnote}
      </p>
    </SlideFrame>
  );
}
