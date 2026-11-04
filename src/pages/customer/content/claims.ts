// Assumption registry for /customer/ (customer brief, Section 4). Every
// [assumption] on the page points at one of these ids. The hover card reads
// `proof` from here.
//
// market-stores: the brief's proof line named the first store. At the
// founder's request it is left out, so the page can be shown to any store.
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
    claim: "Less free copper in the water",
    proof: "Side-by-side lab tests against copper sulfate, then PMRA data",
  },
  local: {
    claim: "Short restock, no cross-border shipping",
    proof: "First season of deliveries",
  },
  wholesale: {
    claim: "$10.20 and $18.00 wholesale, 40 percent store margin",
    proof: "Store buyers' feedback",
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
  support: {
    claim: "Free demo kit and training",
    proof: "First store partner",
  },
  "take-back": {
    claim: "Unsold case taken back",
    proof: "Founder decision, confirm before using with a real store",
  },
} as const;

export type ClaimId = keyof typeof claims;
