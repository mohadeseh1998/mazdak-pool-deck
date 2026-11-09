import { PRICE_SCALE_MAX as ROOT_SCALE, type PriceRow } from "../../../content/pricing";

// The shared price strip and source register read this module. Version 2
// shows no shelf prices on this page, so there are no rows.
export const PRICE_SCALE_MAX = ROOT_SCALE;
export const priceHeading = "";
export const priceRows: readonly PriceRow[] = [];
