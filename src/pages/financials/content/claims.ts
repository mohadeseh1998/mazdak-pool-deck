// Assumption registry for /financials/. Every [assumption] on the page points
// at one of these ids. The financials brief tags the claims but gives no proof
// lines, so these were drafted from the briefs' own words, with the founder's
// agreement, for her review.
export const claims = {
  "unit-economics": {
    claim: "Store price, store margin and our cost per bottle",
    proof: "A store quote on our price, and cost measured on a full production batch",
  },
  insurance: {
    claim: "$1,500 a year for product liability insurance",
    proof: "An insurance quote for product liability",
  },
  space: {
    claim: "$3,000 a year for production space and utilities",
    proof: "A quote for production space and utilities",
  },
  "labels-sds": {
    claim: "$1,500 for label compliance and safety data sheets",
    proof: "Quotes for label compliance and safety data sheets",
  },
  marketing: {
    claim: "$2,000 for samples, demos and marketing",
    proof: "Receipts from the first season",
  },
  "delivery-cost": {
    claim: "$1,000 for local delivery",
    proof: "Receipts from the first season of deliveries",
  },
  admin: {
    claim: "$1,000 for admin and software",
    proof: "Receipts from the first season",
  },
  funding: {
    claim: "Worst case funded by founder capital and non-dilutive grants",
    proof: "Founder capital committed, and grant decisions",
  },
  "take-back": {
    claim: "Unsold bottles taken back",
    proof: "Founder decision, confirm before using with a real store",
  },
  "spring-stock": {
    claim: "Stores plan spring stock in winter",
    proof: "Store buyers' feedback on when they plan spring stock",
  },
} as const;

export type ClaimId = keyof typeof claims;
