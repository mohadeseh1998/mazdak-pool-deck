import { PRICE_SCALE_MAX, priceHeading, priceRows } from "../content/pricing";
import { Claim } from "./Claim";
import { reveal } from "./reveal";

const pct = (n: number) => `${(n / PRICE_SCALE_MAX) * 100}%`;

/**
 * The price comparison (brief Section 7.3). A compact list, not a chart. Shelf
 * ranges are a silt-tinted bar on a shared $0 to $70 scale; our prices are a
 * solid pool-blue bar ending at our price. No brand names. The row shown as
 * the section's hero figure is left out here so no price appears twice.
 */
export function PriceStrip({ exclude }: { exclude?: string }) {
  const rows = priceRows.filter((r) => r.id !== exclude);
  return (
    <section className="prices" aria-label={priceHeading}>
      <ul className="prices__list">
        {rows.map((row, i) => (
          <li
            key={row.id}
            className={`prices__row${row.ours ? " prices__row--ours" : ""}${row.tone === "algae" ? " prices__row--algae" : ""}`}
            data-sources={row.sources.join(" ")}
            {...reveal(3 + i * 0.5)}
          >
            <span className="prices__label">
              {row.label}
              {row.qualifier && <span className="prices__qualifier"> {row.qualifier}</span>}
            </span>
            <span className="prices__track" aria-hidden="true">
              <span
                className="prices__bar"
                style={
                  row.ours
                    ? { left: 0, width: pct(row.max) }
                    : { left: pct(row.min), width: pct(row.max - row.min) }
                }
              />
            </span>
            <span className="prices__value">
              {row.claim ? <Claim id={row.claim}>{row.display}</Claim> : row.display}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
