// Assumption registry for /customer/ (customer brief, Section 4, with the
// version 2 changes). Every [assumption] on the page points at one of these
// ids. The hover card reads `proof` from here.
//
// market-stores: the brief's proof line named the first store. At the
// founder's request it is left out, so the page can be shown to any store.
// prices: the suggested retail prices, with the root deck's own proof line.
// Version 2 removed the store-margin claim (wholesale) and the demo kit
// (support).
export const claims = {
  "market-stores": {
    claim: "Pool owners reached through local stores",
    proof: "First store conversations",
  },
  "season-2027": {
    claim: "Clarifier available for the 2027 season",
    proof: "Licences confirmed and first production run",
  },
  pmra: {
    claim: "Anti-algae after PMRA registration",
    proof: "PMRA application and decision",
  },
  gentler: {
    claim: "A gentler choice than copper salts or aluminum sulfate",
    proof: "Side-by-side lab tests against copper salts and aluminum sulfate, then PMRA data",
  },
  local: {
    claim: "Short restock times, bilingual labels",
    proof: "First season of deliveries",
  },
  prices: {
    claim: "Suggested retail $25.00, $30.00 and $49.99",
    proof: "Pool store buyers' feedback on price",
  },
  sizes: {
    claim: "4 L and 20 L next",
    proof: "Store and city pool feedback",
  },
  "case-12": {
    claim: "Order by the case of 12",
    proof: "Store feedback",
  },
  delivery: {
    claim: "We deliver ourselves",
    proof: "First season of deliveries",
  },
  "take-back": {
    claim: "Taken back if the store is not satisfied",
    proof: "Founder decision, confirm before using with a real store",
  },
} as const;

export type ClaimId = keyof typeof claims;
