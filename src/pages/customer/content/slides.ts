import type { PageSlide, PageUi, Rich } from "../../shared/types";
import { countClaims } from "../../shared/types";
import type { VideoInfo } from "../../shared/kit";
import { claims, type ClaimId } from "./claims";
import { atlanticRows, priceRows } from "./pricing";

// All copy for /customer/ (customer brief, Section 3), set word for word. No
// strings live in JSX. A `{ text, claim }` node is an [assumption]: the Claim
// component wraps the statement and adds the tag.
//
// Nine sections, five minutes, in the order the mentor asked for: market and
// problem, our answer, the proof, the team, why it is different, price, how we
// sell, and how we work together.

type C = { text: Rich; claim: ClaimId };
const claim = (text: Rich, id: ClaimId): C => ({ text, claim: id });

/* 1. Opening (20 s) ------------------------------------------------ */

export const openingSlide = {
  n: 1,
  title: "Opening",
  ground: "deep",
  headline: ["Clear water,", "from a bottle made in Fredericton."],
  sub: "Atlantic Clarifier. A pool product from Mazdak Atlantic AgriAqua.",
  demoHint: { before: "Press", key: "T", after: "when the clarifier goes in the cup." },
  bottlesAlt:
    "The Atlantic Pool Pack: two white one-litre bottles with bilingual labels, Atlantic Clarifier with a blue cap and Atlantic Anti-Algae with a green cap.",
  notes: [
    "\"Thank you for your time. Before I start, I'm adding a few drops of our clarifier to this cup of muddy water. This other one gets nothing. We'll look at them in two minutes.\" (Add drops, press T.)",
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
      lead: "Green water:",
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

const YOUTUBE_ID = "tuRgEGqjRyk";

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
        "Clumps the fine particles so the filter can catch them. Cloudy water turns clear. ",
        claim("Available first, for the 2027 season.", "season-2027"),
      ],
    },
    {
      id: "anti-algae",
      tone: "algae",
      heading: "Atlantic Anti-Algae.",
      body: [
        "Chelated copper tuned to a medium stability: enough copper to stop algae, without the flood of free copper. ",
        claim("Available after PMRA registration.", "pmra"),
      ],
    },
  ],
  together: "Together: the Atlantic Pool Pack. English and French labels.",
  videoLink: "Watch the 75-second video",
  notes: [
    "\"Our first product is the clarifier. It makes cloudy water clear. The second is a gentler copper anti-algae, which we will sell once it is registered with PMRA. Together they are the Atlantic Pool Pack.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/** The same video as the root deck. Opened from section 3 in a lightbox; never autoplays. */
export const video: VideoInfo = {
  youtubeId: YOUTUBE_ID,
  watchUrl: `https://youtu.be/${YOUTUBE_ID}`,
  embedUrl: `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1&playsinline=1`,
  posterUrl: `https://i.ytimg.com/vi/${YOUTUBE_ID}/hqdefault.jpg`,
  title: "Atlantic Clarifier and Anti-Algae",
  caption: "Atlantic Clarifier and Anti-Algae. 1 min 15 s.",
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
  timerCaption: "since the clarifier went in",
  timerNotStarted: "a few minutes",
  timerPrint: "Live demo",
  cups: [
    { tone: "silt", name: "Cup A:", text: "water and soil, nothing added." },
    { tone: "pool", name: "Cup B:", text: "same, plus a few drops of Atlantic Clarifier." },
  ],
  steps: [
    "Fine particles clump together.",
    "The clumps sink.",
    "The water clears; in a pool, the filter catches the clumps.",
  ],
  photo: {
    alt: "A jar test. Left: a tall cylinder of clear water with soil settled at the bottom. Right: a beaker of cloudy brown water, beside a small vial with a dropper.",
    caption: "An earlier jar test with our clarifier.",
  },
  notes: [
    "\"Same water, same soil. This one got nothing. This one got a few drops. The particles clump, sink, and the water clears. In a pool, the filter does the rest. Your staff can show this on the counter in two minutes.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/* 5. Who we are (30 s) --------------------------------------------- */

export const teamSlide = {
  n: 5,
  title: "Who we are",
  eyebrow: "Who we are",
  ground: "deep",
  headline: "Chemists who answer the phone.",
  people: [
    {
      id: "ali",
      name: "Dr. Ali Kalateh",
      role: "Co-founder and CEO",
      initials: "AK",
      bio: "Inorganic chemist with years of hands-on experience developing and producing pool-care and water-treatment products.",
    },
    {
      id: "mohadeseh",
      name: "Mohadeseh Zamani",
      role: "Co-founder and CMO",
      initials: "MZ",
      bio: "Graduate student in Electrical Engineering at UNB. Runs the company in Fredericton: production, supply, customers and licensing.",
    },
  ],
  local: "Local, so when a customer has a question, you call us and we come in.",
  notes: [
    "\"Ali is our chemist, with years of experience making pool and water-treatment products. I run the company here in Fredericton. Because we're local, if a customer has a problem, you call me and I come to the store.\"",
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
      line: [claim("Our copper is held at a medium stability, so less free copper goes into the water.", "gentler")] as Rich,
    },
    {
      word: "Local.",
      line: ["Made in New Brunswick. ", claim("Short restock times, no cross-border shipping, bilingual labels.", "local")] as Rich,
    },
  ],
  notes: [
    "\"Three things make it different. It's simple, two products instead of a shelf. It's gentler, less free copper. And it's local, made in New Brunswick, so restocking is fast.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/* 7. Price: your customer and you (40 s) --------------------------- */

export const priceSlide = {
  n: 7,
  title: "Price: your customer and you",
  eyebrow: "Price: your customer and you",
  ground: "deep",
  headline: "A better price for your customer. A fair margin for you.",
  proposal: [claim("Wholesale prices are our proposal. We want your view.", "wholesale")],
  notes: [
    "\"Today, buying a clarifier and an algaecide costs your customer about 45 to 66 dollars. Our pack would sell for 29.99. You would buy it for 18 dollars and keep 12, about 40 percent. The clarifier alone sells for 16.99, and you keep 6.79. Are these numbers right for your store?\"",
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
    { lead: "Support:", text: [claim("a counter demo kit and a short staff training at no cost.", "support")] as Rich },
  ],
  notes: [
    "\"We start with one-litre bottles, then 4 and 20 litres. You order by the case, we deliver ourselves in Fredericton, and we give you a counter demo kit and train your staff.\"",
  ],
} as const satisfies PageSlide & Record<string, unknown>;

/* 9. Work with us (30 s) ------------------------------------------- */

export const workSlide = {
  n: 9,
  title: "Work with us",
  eyebrow: "Work with us",
  ground: "deep",
  headline: "Try one case this spring.",
  offer: [
    "One case of Atlantic Clarifier on your shelf for the 2027 season. ",
    claim("If it does not sell, we take it back.", "take-back"),
  ] as Rich,
  helpHeading: "Help us get it right",
  questions: [
    "Is the price right for your customers?",
    "Which size sells best in your store?",
    "What do your customers ask for that nobody makes?",
  ],
  site: "agriaqua.ca",
  founder: "Mohadeseh Zamani, Co-founder and CMO",
  notes: [
    "\"Here is what I'd like: put one case on your shelf for the 2027 season. If it doesn't sell, we take it back. And I'd love your honest feedback: is the price right, which size do you need, and what do your customers ask for? Thank you.\"",
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
  timerFooter: "Clarifier in:",
  timerLabel: "Time since the clarifier went into cup B",
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
