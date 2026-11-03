// Assumption registry (brief Section 6). Every [assumption] in the deck points
// at one of these ids. The hover card reads `proof` from here.
export const claims = {
  "first-customers": {
    claim: "Pool owners reached through stores and city pools",
    proof: "Customer conversations starting the week of 9 November",
  },
  "black-algae": {
    claim: "Anti-algae protects longer, including against black algae",
    proof: "Side-by-side tests against copper sulfate in the UNB lab, then PMRA data",
  },
  "price-clarifier": {
    claim: "Atlantic Clarifier at $16.99",
    proof: "Pool store buyers' feedback on price and margin",
  },
  "price-pack": {
    claim: "Atlantic Pool Pack at $39.99",
    proof: "Pool store buyers' feedback, after PMRA registration",
  },
  "unit-cost": {
    claim: "About $12 to make one pack",
    proof: "Cost measured on the first production run",
  },
  freight: {
    claim: "Drum freight not included",
    proof: "Freight quote from the supplier, or pickup",
  },
  "demo-kits": {
    claim: "$60 for store demo kits",
    proof: "Receipts",
  },
  launch: {
    claim: "Launch for the 2027 pool season",
    proof: "Licences in place and a first store order",
  },
} as const;

export type ClaimId = keyof typeof claims;
