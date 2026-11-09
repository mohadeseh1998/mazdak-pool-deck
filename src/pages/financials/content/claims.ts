// Assumption registry for /financials/ (version 2). Every [assumption] on the
// page points at one of these ids. The version 2 file tags the claims but
// gives no proof lines, so these were drafted from its own words, as with
// version 1, for the founder's review.
export const claims = {
  "unit-economics": {
    claim: "Package price, store share and our cost per package",
    proof: "A store quote on our price, and cost measured on a full production batch",
  },
  startup: {
    claim: "$60,000 start-up cash, one-time, 2027",
    proof: "Quotes for set-up, licences and PMRA registration, then the first season's receipts",
  },
  running: {
    claim: "Running costs of $12,000 in 2028 and $20,000 in 2029",
    proof: "Receipts from the 2028 and 2029 seasons",
  },
  conservative: {
    claim: "These numbers are conservative",
    proof: "First orders and feedback from local pool stores",
  },
} as const;

export type ClaimId = keyof typeof claims;
