import type { PageSlide, PageUi, Rich } from "../../shared/types";
import { countClaims } from "../../shared/types";
import type { VideoInfo } from "../../shared/kit";
import { claims, type ClaimId } from "./claims";
import { atlanticRows, priceRows } from "./pricing";

// All copy for /customer/ (customer brief, Section 3, with the version 2
// changes), set word for word. No strings live in JSX. A `{ text, claim }` node
// is an [assumption]: the Claim component wraps the statement and adds the tag.
//
// Nine sections, five minutes, in the order the mentor asked for: market and
// problem, our answer, the proof, the team, why it is different, price, how we
// sell, and how we work together.
//
// Presenter notes: where version 2 changed a section's words or numbers, its
// notes follow the new screen copy (and, for price and team, the root deck's
// own approved notes), so nothing spoken contradicts the screen.

type C = { text: Rich; claim: ClaimId };
const claim = (text: Rich, id: ClaimId): C => ({ text, claim: id });

/* 1. Opening (20 s) ------------------------------------------------ */

export const openingSlide = {
  n: 1,
  title: "Opening",
  ground: "deep",
  headline: ["Clear pools,", "made in New Brunswick."],
  sub: "Atlantic Clarifier and Atlantic Anti-Algae, sold together as the Atlantic Pool Pack.",
  bottlesAlt:
    "The Atlantic Pool Pack: two white one-litre bottles with bilingual labels, Atlantic Clarifier with a blue cap and Atlantic Anti-Algae with a green cap.",
  notes: [
    "\"Thank you for your time. Before I start, I'm adding a few drops of our clarifier to this cup of muddy water. This other one gets nothing. We'll look at them in two minutes.\" (Add drops.)",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/* 2. Your customers' problem (40 s) -------------------------------- */

export const problemSlide = {
  n: 2,
  title: "Your customers' problem",
  eyebrow: "Your customers' problem",
  ground: "deep",
  headline: "Your customers come in with cloudy water and a long list.",
  lines: [
    { lead: "Cloudy water:", text: "particles too small for a home filter to catch." },
    {
      lead: "Algae in the water:",
      text: "the usual copper algaecide releases a lot of free copper, which can burn plant leaves and can be harmful to swimmers at a high dose.",
    },
    {
      lead: "Too many bottles:",
      text: "stores carry 20 or more chemicals, but apart from the disinfectant, most pools need a clarifier, an anti-algae, and a pH adjuster when needed.",
    },
  ],
  market: [
    "Our market: ",
    claim("pool owners in the Fredericton area, reached through local pool stores like yours.", "market-stores"),
  ],
  notes: [
    "\"When a pool goes cloudy or green, the owner comes to you. They want it fixed fast, and they don't want to buy ten products. And many algaecides are harsh, with too much free copper.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/* 3. Our answer (40 s) --------------------------------------------- */

/** The root deck's video (version 2). */
const YOUTUBE_ID = "rKsXcTqSfsI";

export const answerSlide = {
  n: 3,
  title: "Our answer",
  eyebrow: "Our answer",
  ground: "deep",
  headline: "Two bottles that do the work of a shelf.",
  products: [
    {
      id: "clarifier",
      tone: "pool",
      heading: "Atlantic Clarifier.",
      body: [
        "A clarifier made pool-ready through a complementary reaction. ",
        claim("Available first, for the 2027 season.", "season-2027"),
      ],
    },
    {
      id: "anti-algae",
      tone: "algae",
      heading: "Atlantic Anti-Algae.",
      body: ["A chelated anti-algae, made for pools. ", claim("Available after PMRA registration.", "pmra")],
    },
  ],
  together: "Together: the Atlantic Pool Pack. English and French labels.",
  videoLink: "Watch the video",
  notes: [
    "\"Our first product is the clarifier. It makes cloudy water clear. The second is a gentler copper anti-algae, which we will sell once it is registered with PMRA. Together they are the Atlantic Pool Pack.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/** The root deck's video and its wording. Opened from section 3 in a lightbox; never autoplays. */
export const video: VideoInfo = {
  youtubeId: YOUTUBE_ID,
  watchUrl: `https://youtu.be/${YOUTUBE_ID}`,
  embedUrl: `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1&playsinline=1`,
  posterUrl: `https://i.ytimg.com/vi/${YOUTUBE_ID}/hqdefault.jpg`,
  title: "Atlantic Clarifier and Anti-Algae",
  caption: "Atlantic Clarifier and Anti-Algae.",
  playLabel: "Play the video: Atlantic Clarifier and Anti-Algae",
  escapeHint: "Press Escape to close the video.",
  iframeHint: "Click outside the video, then press Escape to close it.",
  fallback: "The video could not load here.",
  fallbackLink: `Watch on YouTube, youtu.be/${YOUTUBE_ID}`,
  posterAlt: "Video poster: the Atlantic Pool Pack bottles.",
};

/* 4. See it work (40 s) -------------------------------------------- */

export const liveSlide = {
  n: 4,
  title: "See it work",
  eyebrow: "See it work",
  ground: "deep",
  headline: "Now look at the cups.",
  statement: "Same water. Same soil. One bottle.",
  cups: [
    { tone: "silt", name: "Cup A:", text: "water and soil, nothing added." },
    { tone: "pool", name: "Cup B:", text: "same, plus a few drops of Atlantic Clarifier." },
  ],
  steps: [
    "The fine particles settle to the bottom.",
    "They are removed with a pool vacuum, or caught by the filter.",
    "The water turns clear.",
  ],
  photo: {
    alt: "A jar test. Left: a tall cylinder of clear water with soil settled at the bottom. Right: a beaker of cloudy brown water, beside a small vial with a dropper.",
    caption: "An earlier jar test with our clarifier.",
  },
  notes: [
    "\"Same water, same soil. This one got nothing. This one got a few drops. The fine particles settle to the bottom and the water turns clear. In a pool, they are removed with a pool vacuum, or caught by the filter. Your staff can show this on the counter in two minutes.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/* 5. Who we are (30 s) --------------------------------------------- */

export const teamSlide = {
  n: 5,
  title: "Who we are",
  eyebrow: "Who we are",
  ground: "deep",
  headline: "A local team you can call.",
  people: [
    {
      id: "mohadeseh",
      name: "Mohadeseh Zamani",
      role: "Co-founder and CEO",
      initials: "MZ",
      bio: "Leads the company: strategy, partnerships, regulatory approvals, funding and customers. Graduate studies in Electrical Engineering at UNB.",
    },
    {
      id: "ali",
      name: "Dr. Ali Kalateh",
      role: "Co-founder and CTO",
      initials: "AK",
      bio: "Inorganic chemist with years of hands-on experience developing and producing pool-care and water-treatment products. Leads science, formulation and production.",
    },
  ],
  local: "Local, so when a customer has a question, you call us and we come in.",
  notes: [
    "\"I lead the company: strategy, partnerships, approvals, funding and customers. Ali is our CTO. He leads the science and production. Because we're local, if a customer has a problem, you call me and I come to the store.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/* 6. Why it is different (30 s) ------------------------------------ */

export const differentSlide = {
  n: 6,
  title: "Why it is different",
  eyebrow: "Why it is different",
  ground: "deep",
  headline: "Fewer bottles. Gentler copper. Made here.",
  shelfLabel: "A shelf of many bottles fades away, leaving our two.",
  columns: [
    { word: "Simple.", line: "Two products cover what most pools need after the disinfectant." as Rich },
    {
      word: "Gentler.",
      line: [claim("A gentler choice than copper salts or aluminum sulfate.", "gentler")] as Rich,
    },
    {
      word: "Local.",
      line: ["Made in New Brunswick. ", claim("Short restock times, bilingual labels.", "local")] as Rich,
    },
  ],
  notes: [
    "\"Three things make it different. It's simple, two products instead of a shelf. It's gentler than copper salts or aluminum sulfate. And it's local, made in New Brunswick, so restocking is fast.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/* 7. Price: your customer and you (40 s) --------------------------- */

export const priceSlide = {
  n: 7,
  title: "Price: your customer and you",
  eyebrow: "Price: your customer and you",
  ground: "deep",
  headline: "A fair price for high quality.",
  // The suggested retail prices are unproven: one tag, on the table's heading.
  pricesTag: { claim: "prices" as ClaimId },
  flexible: "Our prices are flexible while we learn from stores and pool owners.",
  notes: [
    // The root deck's own price note (version 2).
    "\"A clarifier today costs about $18 to $22 and an algaecide $27 to $44. Ours are $25 and $30, and the pack is $49.99. A fair price for high quality, and flexible while we learn.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/* 8. How we sell (30 s) -------------------------------------------- */

export const sellSlide = {
  n: 8,
  title: "How we sell",
  eyebrow: "How we sell",
  ground: "deep",
  headline: "Easy to stock.",
  rows: [
    { lead: "Sizes:", text: ["1 L now. ", claim("4 L and 20 L next, for bigger pools and commercial pools.", "sizes")] as Rich },
    { lead: "Ordering:", text: [claim("by the case of 12 bottles.", "case-12")] as Rich },
    { lead: "Delivery:", text: [claim("we deliver ourselves in the Fredericton area.", "delivery")] as Rich },
  ],
  notes: [
    "\"We start with one-litre bottles, then 4 and 20 litres. You order by the case, and we deliver ourselves in Fredericton.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/* 9. Work with us (30 s) ------------------------------------------- */

export const workSlide = {
  n: 9,
  title: "Work with us",
  eyebrow: "Work with us",
  ground: "deep",
  headline: "Start with us this spring.",
  offer: ["We begin with 500 litres this spring. ", claim("If you are not satisfied, we take it back.", "take-back")] as Rich,
  helpHeading: "Your customers' feedback on quality",
  questions: [
    "How clear is the water after one dose?",
    "How fast does it work for your customers?",
    "What would make it even better?",
  ],
  site: "agriaqua.ca",
  founder: "Mohadeseh Zamani, Co-founder and CEO",
  notes: [
    "\"Here is what I'd like: we begin with 500 litres this spring. If you are not satisfied, we take it back. And I'd love your customers' feedback on quality: how clear the water is after one dose, how fast it works, and what would make it even better. Thank you.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

export const slides = [
  openingSlide,
  problemSlide,
  answerSlide,
  liveSlide,
  teamSlide,
  differentSlide,
  priceSlide,
  sellSlide,
  workSlide,
] as const;

export const SLIDE_COUNT = slides.length;

/* Interface strings ------------------------------------------------ */

export const ui: PageUi = {
  deckLabel: "Atlantic Clarifier, a pitch for pool stores",
  companyName: "Mazdak Atlantic AgriAqua",
  logoAlt: "Mazdak Atlantic AgriAqua",
  assumptionTag: "assumption",
  proofLead: "How this gets proven:",
  notesHeading: "Presenter note",
  sourcesHeading: "Source register",
  sourcesHint: "Press S or Escape to close.",
  close: "Close",
  prev: "Previous section",
  next: "Next section",
  // Version 2 has no demo timer, so these never show.
  timerFooter: "",
  timerLabel: "",
  slideOf: (n: number, total: number) => `${n} of ${total}`,
  goTo: (n: number, title: string) => `Go to section ${n}, ${title}`,
  openImage: (caption: string) => `Open image full size: ${caption}`,
  auditCount: (onSlide: number, inDeck: number) =>
    `${onSlide} unproven ${onSlide === 1 ? "claim" : "claims"} on this section, ${inDeck} on the page.`,
  announce: (n: number, total: number, title: string) => `Section ${n} of ${total}, ${title}`,
};

/* Claim counting for audit mode ------------------------------------ */

const counted = countClaims(slides, claims, { 7: [priceRows, atlanticRows] });
export const claimsPerSlide = counted.perSlide;
export const claimsInDeck = counted.inDeck;
