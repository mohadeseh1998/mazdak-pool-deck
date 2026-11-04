import { PRICE_SCALE_MAX as ROOT_SCALE, priceRows as rootRows } from "../../../content/pricing";

// The shelf prices behind the price check ($45 to $66 today). The source
// register (key S) reads these rows to show what each shelf source supports.
export const PRICE_SCALE_MAX = ROOT_SCALE;
export const priceHeading = "Shelf today, 1 L";
export const priceRows = rootRows.filter((r) => !r.ours);

/** "about $45 to $66": the root deck's "Buying both" row. */
export const buyingBoth = rootRows.find((r) => r.id === "both")!;
