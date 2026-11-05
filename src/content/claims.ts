// Assumption registry (brief Section 6, deck version 2). Every [assumption]
// in the root deck points at one of these ids. The hover card reads `proof`
// from here, after the lead "How this gets proven:" unless `ownLead` is set,
// in which case the line stands on its own.
export const claims = {
  "first-customers": {
    claim: "Pool owners reached through stores and city pools",
    proof: "Customer conversations starting the week of 9 November",
  },
  "iron-common": {
    claim: "Iron is one of the most common problems pool owners face",
    proof: "From our talks with pool owners. Not yet measured.",
    ownLead: true,
  },
  "price-pack": {
    claim: "Atlantic Pool Pack at $49.99",
    proof: "Pool store buyers' feedback, after PMRA registration",
  },
  "price-clarifier": {
    claim: "Atlantic Clarifier at $25.00",
    proof: "Pool store buyers' feedback on price and margin",
  },
  "price-anti-algae": {
    claim: "Atlantic Anti-Algae at $30.00",
    proof: "Pool store buyers' feedback, after PMRA registration",
  },
} as const;

export type ClaimId = keyof typeof claims;
