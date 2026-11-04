import { PRICE_SCALE_MAX as ROOT_SCALE, priceRows as rootRows } from "../../../content/pricing";
import { money2, UNIT } from "../../../content/poolModel";

// Section 7 (customer brief). Left: the shelf today, the root deck's own rows
// and sources, no brand names. Right: our suggested retail, from poolModel.ts.

export const PRICE_SCALE_MAX = ROOT_SCALE;

export const priceHeading = "Shelf today, 1 L";

/** The shelf rows only. Our own prices sit in the table on the right. */
export const priceRows = rootRows.filter((r) => !r.ours);

export const priceFootnote =
  "Shelf prices from Canadian online pool retailers, November 2026. Doses differ between brands, so this compares shelf price, not cost per treatment.";

export const atlanticHeading = "Atlantic, suggested retail";

export const atlanticColumns = ["Product", "Suggested retail", "Your cost", "You keep"] as const;

/** Every figure computed from the model; the content check holds them to the brief. */
export const atlanticRows = [
  { id: "clarifier", product: "Atlantic Clarifier, 1 L", unit: UNIT.clarifier },
  { id: "pack", product: "Atlantic Pool Pack, 2 x 1 L", unit: UNIT.pack },
].map(({ id, product, unit }) => ({
  id,
  product,
  retail: money2(unit.retail),
  cost: money2(unit.wholesale),
  keep: money2(unit.storeKeeps),
  keepPct: `(${unit.storePct}%)`,
}));
