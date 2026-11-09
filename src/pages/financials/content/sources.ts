import { sourcesChecked as rootChecked } from "../../../content/sources";

// Source register for /financials/ (version 2), key S. Only what this page
// still shows: the store share it tests against, the PMRA annual charge, and
// the founders' own estimates. The PMRA application fees, the insurance tile
// and the shelf prices left the page in version 2, and their sources with them.
export const sourcesChecked = rootChecked;

export const sources = {
  "store-margin": {
    text: "Aqua Magazine: a pool retailer aims for a 40 percent margin.",
    url: "https://www.aquamagazine.com/retail/article/15118190/keeping-pool-chemical-sales-away-from-big-box-stores",
  },
  "pmra-annual": {
    text: "Pest Control Products Fees and Charges Regulations: annual charge after registration.",
    url: "https://lois.justice.gc.ca/eng/regulations/SOR-2017-9/page-1.html",
  },
  cost: {
    text: "Founders' cost estimate: $8.00 per package (2 bottles, labels, contents).",
  },
  startup: {
    text: "Founders' estimate: $60,000 start-up cash, one-time, 2027; running costs $12,000 in 2028 and $20,000 in 2029.",
  },
};

export type SourceKey = keyof typeof sources;
