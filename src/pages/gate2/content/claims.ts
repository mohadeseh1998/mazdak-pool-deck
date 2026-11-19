// Assumption registry for /gate2/ (Gate 2 brief, Section 7). Every
// [assumption] on the page points at one of these ids. Each proof line is the
// brief's own hover text and stands on its own, with no lead.
export const claims = {
  price: {
    claim: "$49.99 suggested retail",
    proof: "Planning price. We will test it with stores.",
    ownLead: true,
  },
  iron: {
    claim: "Help take iron out of pool water",
    proof: "Seen in our jar tests.",
    ownLead: true,
  },
  "oil-sands": {
    claim: "Industrial water: oil sands tailings",
    proof: "A suggestion we will test. Not a customer yet.",
    ownLead: true,
  },
  roadmap: {
    claim: "Every date on the roadmap",
    proof: "Our plan. Dates can move.",
    ownLead: true,
  },
} as const;

export type ClaimId = keyof typeof claims;
