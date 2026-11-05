// Source register (brief Section 13). Shown with key S, never printed on slides.
// Deck version 2: the shelf prices only. The old budget's supplier, bottle,
// label and unit-cost entries went with that budget.
export interface Source {
  text: string;
  url?: string;
}

export const sourcesChecked = "Prices checked 3 November 2026.";

export const sources = {
  "psc-clarifier": {
    text: "Pool Supplies Canada, Super Clarifier 1 L, $17.99 (regular $21.99)",
    url: "https://www.poolsuppliescanada.ca/pool-supplies-canada-super-clarifier-1-l.html",
  },
  "up-clarita": {
    text: "Ultimate Pools, Summer Smiles Clarita 1 L, $17.99",
    url: "https://ultimatepools.ca/products/summer-smiles-clarita-1l-pool-clarifier",
  },
  "trevi-aquaclair": {
    text: "Trevi, Aquaclair spa clarifier 1 L, $19.99",
    url: "https://trevi.com/en/products/aquaclair-1l-35416",
  },
  "up-algout40": {
    text: "Ultimate Pools, Summer Smiles Alg Out 40% 1 L, $26.99",
    url: "https://ultimatepools.ca/products/summer-smiles-alg-out-40-1l",
  },
  "up-algout60": {
    text: "Ultimate Pools, Summer Smiles Alg Out Ultra 60% 1 L, $39.99",
    url: "https://ultimatepools.ca/products/summer-smiles-alg-out-ultra-60-1l-algaecide",
  },
  "psc-algaefree": {
    text: "Pool Supplies Canada, AlgaeFree Pool Drops 1 L (copper 60 g/L), $36.99 (regular $43.99)",
    url: "https://www.poolsuppliescanada.ca/algaefree-pool-drops-liquid-algaecide-1-l.html",
  },
} satisfies Record<string, Source>;

export type SourceKey = keyof typeof sources;
