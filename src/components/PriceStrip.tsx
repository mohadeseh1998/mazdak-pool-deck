import { PRICE_SCALE_MAX, priceHeading, priceRows } from "../content/pricing";
import { Claim } from "./Claim";

const pct = (n: number) => `${(n / PRICE_SCALE_MAX) * 100}%`;

/**
 * Slide 3 (brief Section 7.3). A compact vertical list, not a chart. Shelf
 * ranges are a thin silt-tinted bar on a shared $0 to $70 scale; our two
 * prices are a solid pool-blue bar ending at our price. No brand names.
 */
export function PriceStrip() {
  return (
    <section className="prices" aria-label={priceHeading}>
      <h3 className="prices__heading">{priceHeading}</h3>
      <ul className="prices__list">
        {priceRows.map((row) => (
          <li key={row.id} className={`prices__row${row.ours ? " prices__row--ours" : ""}`} data-sources={row.sources.join(" ")}>
            <div className="prices__text">
              <span className="prices__label">
                <span>{row.label}</span>
                {row.qualifier && <span className="prices__qualifier">{row.qualifier}</span>}
              </span>
              <span className="prices__value">
                {row.claim ? <Claim id={row.claim}>{row.display}</Claim> : row.display}
              </span>
            </div>
            <div className="prices__track" aria-hidden="true">
              <span
                className="prices__bar"
                style={
                  row.ours
                    ? { left: 0, width: pct(row.max) }
                    : { left: pct(row.min), width: pct(row.max - row.min) }
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
