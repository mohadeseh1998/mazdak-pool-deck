import type { ClaimId } from "./claims";
import type { SourceKey } from "./sources";

// Slide 3 price strip (brief Sections 5 and 7.3). Ranges stay ranges, figures
// are never rounded. `display` is the exact wording on the slide; `min` and
// `max` only place the bar on the shared $0 to $70 scale.
export const PRICE_SCALE_MAX = 70;

export interface PriceRow {
  id: string;
  label: string;
  /** Quieter text after the label, for example "(both, 1 L each)". */
  qualifier?: string;
  display: string;
  min: number;
  max: number;
  ours: boolean;
  claim?: ClaimId;
  sources: readonly SourceKey[];
}

export const priceHeading = "Shelf price today, 1 L, Canada";

export const priceRows: readonly PriceRow[] = [
  {
    id: "clarifiers",
    label: "Pool clarifiers",
    display: "$17.99 to $21.99",
    min: 17.99,
    max: 21.99,
    ours: false,
    sources: ["psc-clarifier", "up-clarita", "trevi-aquaclair"],
  },
  {
    id: "algaecides",
    label: "Pool algaecides",
    display: "$26.99 to $43.99",
    min: 26.99,
    max: 43.99,
    ours: false,
    sources: ["up-algout40", "up-algout60", "psc-algaefree"],
  },
  {
    id: "both",
    label: "Buying both",
    display: "about $45 to $66",
    min: 45,
    max: 66,
    ours: false,
    sources: ["psc-clarifier", "up-clarita", "trevi-aquaclair", "up-algout40", "up-algout60", "psc-algaefree"],
  },
  {
    id: "atlantic-clarifier",
    label: "Atlantic Clarifier",
    display: "$16.99",
    min: 16.99,
    max: 16.99,
    ours: true,
    claim: "price-clarifier",
    sources: [],
  },
  {
    id: "atlantic-pack",
    label: "Atlantic Pool Pack",
    qualifier: "(both, 1 L each)",
    display: "$39.99",
    min: 39.99,
    max: 39.99,
    ours: true,
    claim: "price-pack",
    sources: [],
  },
];

export const priceFootnote =
  "Shelf prices from Canadian online pool retailers, November 2026. Doses differ between brands, so this compares shelf price, not cost per treatment. Sizes planned: 1 L, 4 L, 20 L.";
