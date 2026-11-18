import { PRICE_SCALE_MAX as ROOT_SCALE, type PriceRow } from "../../../content/pricing";

// The shared source register reads this module. /gate2/ shows no shelf
// prices, so there are no rows.
export const PRICE_SCALE_MAX = ROOT_SCALE;
export const priceHeading = "";
export const priceRows: readonly PriceRow[] = [];
