import { PRICE_SCALE_MAX as ROOT_SCALE, priceRows as rootRows } from "../../../content/pricing";

// Section 7 (customer brief, with the version 2 changes). Left: the shelf
// today, the root deck's own rows and sources, no brand names. Right: our
// suggested retail prices, read from the root deck's price rows, which are
// the source of truth for prices. No store margin and no wholesale price.

export const PRICE_SCALE_MAX = ROOT_SCALE;

export const priceHeading = "Shelf today, 1 L";

/** The shelf rows only. Our own prices sit in the table on the right. */
export const priceRows = rootRows.filter((r) => !r.ours);

export const priceFootnote =
  "Shelf prices from Canadian online pool retailers, November 2026. Doses differ between brands, so this compares shelf price, not cost per treatment.";

export const atlanticHeading = "Atlantic, suggested retail";

export const atlanticColumns = ["Product", "Suggested retail"] as const;

const ours = (id: string) => {
  const row = rootRows.find((r) => r.id === id);
  if (!row) throw new Error(`The root deck has no price row "${id}"`);
  return row;
};

/** The product names as the version 2 file sets them; the prices from the root deck. */
export const atlanticRows = [
  { id: "atlantic-clarifier", product: "Atlantic Clarifier, 1 L" },
  { id: "atlantic-anti-algae", product: "Atlantic Anti-Algae, 1 L" },
  { id: "atlantic-pack", product: "Atlantic Pool Pack, 2 x 1 L" },
].map(({ id, product }) => {
  const row = ours(id);
  return { id, product, retail: row.display, value: row.max, tone: row.tone ?? "pool" };
});
