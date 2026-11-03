// Source register (brief Section 13). Shown with key S, never printed on slides.
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
  "raw-drum": {
    text: "Canadian supplier's current price for one 205 L drum, $540, November 2026. Supplier name and material kept private.",
  },
  "uline-bottle": {
    text: "Uline, natural HDPE cylinder bottle 32 oz with cap, about US$1.03 each in cases of 12",
    url: "https://www.uline.com/Product/Detail/S-26362/Bottles/Natural-Cylinder-Bottles-32-oz-Standard-Cap",
  },
  labels: {
    text: "Niagara Stands Out, waterproof label roll, 100 labels, $89.99 (regular $107.99)",
    url: "https://niagarastandsout.ca/products/waterproof-label-rolls-100ct-v2",
  },
  "unit-cost": {
    text: "Founders' estimate, $6 per bottle, 3 November 2026",
  },
} satisfies Record<string, Source>;

export type SourceKey = keyof typeof sources;
