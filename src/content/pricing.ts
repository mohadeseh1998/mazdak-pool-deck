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
  /** Our rows: pool blue for the clarifier and the pack, algae green for the anti-algae. */
  tone?: "pool" | "algae";
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
    display: "$25.00",
    min: 25,
    max: 25,
    ours: true,
    tone: "pool",
    claim: "price-clarifier",
    sources: [],
  },
  {
    id: "atlantic-anti-algae",
    label: "Atlantic Anti-Algae",
    display: "$30.00",
    min: 30,
    max: 30,
    ours: true,
    tone: "algae",
    claim: "price-anti-algae",
    sources: [],
  },
  {
    id: "atlantic-pack",
    label: "Atlantic Pool Pack",
    qualifier: "(both, 1 L each)",
    display: "$49.99",
    min: 49.99,
    max: 49.99,
    ours: true,
    tone: "pool",
    claim: "price-pack",
    sources: [],
  },
];

/** Under the table, above the footnote (deck version 2). */
export const priceFlexible = "Our prices are flexible while we learn from stores and pool owners.";

export const priceFootnote =
  "Shelf prices from Canadian online pool retailers, November 2026. Doses differ between brands, so this compares shelf price, not cost per treatment. Sizes planned: 1 L, 4 L, 20 L.";
