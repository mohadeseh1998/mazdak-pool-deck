import { sources as rootSources, sourcesChecked as rootChecked } from "../../../content/sources";

// Source register for /financials/ (financials brief, Section 5), key S.
// `shelf` reuses the root deck's six shelf-price sources.
export const sourcesChecked = rootChecked;

export const sources = {
  "store-margin": {
    text: "Aqua Magazine: a pool retailer aims for a 40 percent margin.",
    url: "https://www.aquamagazine.com/retail/article/15118190/keeping-pool-chemical-sales-away-from-big-box-stores",
  },
  "pmra-fees": {
    text: "Pest Control Products Fees and Charges Regulations, Schedule 1 (application fees).",
    url: "https://lois.justice.gc.ca/eng/regulations/SOR-2017-9/page-2.html",
  },
  "pmra-annual": {
    text: "Same regulations, annual charge and fee reduction rule.",
    url: "https://lois.justice.gc.ca/eng/regulations/SOR-2017-9/page-1.html",
  },
  insurance: {
    text: "Zensurance: basic general liability in Canada starts at $450 a year; product liability for a chemical maker is assumed higher.",
    url: "https://www.zensurance.com/liability-insurance",
  },
  "psc-clarifier": rootSources["psc-clarifier"],
  "up-clarita": rootSources["up-clarita"],
  "trevi-aquaclair": rootSources["trevi-aquaclair"],
  "up-algout40": rootSources["up-algout40"],
  "up-algout60": rootSources["up-algout60"],
  "psc-algaefree": rootSources["psc-algaefree"],
  cost: {
    text: "Founders' cost estimate: $6 per 1 L bottle, $12 per pack, 4 November 2026.",
  },
};

export type SourceKey = keyof typeof sources;
