import { ask, budgetRows, dollars, prototypeTotal } from "./budget";
import { priceHeading, priceRows } from "./pricing";
import type { ClaimId } from "./claims";
import { claims } from "./claims";

// All slide copy, set verbatim. No strings live in JSX.
// Sections 1 and 2 are the approved brief's words; sections 3 to 9 are the
// founder's deck version 2 changes, word for word.
// A `{ text, claim }` node is an [assumption]: the Claim component wraps the
// statement and adds the tag. The literal word in brackets is never printed.
//
// Layout: one vertical page of nine full-screen sections, in the manner of an
// Apple product page.

export type Ground = "deep" | "clear";

export type RichNode = string | { b: string } | { text: Rich; claim: ClaimId; after?: string };
export type Rich = string | readonly RichNode[];

/** One paragraph of presenter notes (key N). */
export type Note = Rich;

interface SlideBase {
  n: number;
  title: string;
  /** The small line above a section headline. */
  eyebrow?: string;
  ground: Ground;
  notes: readonly Note[];
}

/* ------------------------------------------------------------------ */
/* 1. Title                                                            */
/* ------------------------------------------------------------------ */

export const titleSlide = {
  n: 1,
  title: "Title",
  ground: "deep",
  headline: ["Clear pools,", "made in New Brunswick."],
  sub: "Atlantic Clarifier and Atlantic Anti-Algae, sold together as the Atlantic Pool Pack.",
  identity: "Mazdak Atlantic AgriAqua Inc., Fredericton. Summer Institute Funding Committee, 6 November 2026.",
  honesty:
    "What we do not have yet: a pool customer, our selling licences, and PMRA registration for the anti-algae. Every unproven claim in this deck is marked.",
  bottlesAlt:
    "The Atlantic Pool Pack: two white one-litre bottles with bilingual labels, Atlantic Clarifier with a blue cap and Atlantic Anti-Algae with a green cap.",
  notes: [
    "\"Hi, I am Mohi from Mazdak Atlantic AgriAqua. Before I start, I am adding a few drops of our clarifier to this beaker of muddy water. The other beaker gets nothing. Keep an eye on them. At Gate 1 I talked about our fertilizer. Today is our second business: pool water.\"",
    // The deck no longer shows a demo timer (version 2), so "and press T" is gone.
    "Action: stir soil into both beakers first, then add the drops to beaker B.",
  ],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 2. Problem                                                          */
/* ------------------------------------------------------------------ */

export const problemSlide = {
  n: 2,
  title: "Problem",
  eyebrow: "Problem",
  ground: "deep",
  headline: "A cloudy pool is a closed pool.",
  lead: "Pool stores sell 20 or more chemicals. Apart from the disinfectant, most pools only need three things: a clarifier, an anti-algae, and a pH adjuster when needed.",
  blocks: [
    {
      heading: "Cloudy water.",
      body: "Fine particles are too small for a home pool filter to catch, so the water stays cloudy.",
    },
    {
      heading: "Harsh algae control.",
      body: "The usual anti-algae is copper sulfate. It releases a lot of free copper, which can burn plant leaves and can be harmful to swimmers at a high dose.",
    },
  ],
  // The approved focus line, from its second sentence. The first ("We do not
  // make disinfectants...") is spoken in the notes below.
  focus: "We focus on the clarifier and the anti-algae: harder chemistry, smaller volume, much lower capital cost.",
  whoBuys: [
    "First customers: ",
    {
      text: "pool owners in Fredericton, reached through local pool stores and the City of Fredericton's pools.",
      claim: "first-customers",
    },
  ],
  notes: [
    "\"When a pool goes cloudy or green, nobody swims. Stores sell more than 20 chemicals, but apart from the disinfectant a pool really needs a clarifier and an anti-algae. The usual anti-algae is copper sulfate, and it releases too much free copper. We do not make disinfectants, those need huge factories. We focus on these two, where the chemistry is harder but the capital cost is low.\"",
    "Do not name the six local stores on screen. If asked: Amazon Pools and Spas, Beaverdam Pools, Capital Pool & Spa, Mario's Pool & Spa, PoolBoy Inc., SunSplash Pools, and the City of Fredericton Recreation Department.",
  ],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 3. Our answer                                                       */
/* ------------------------------------------------------------------ */

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
      body: "A clarifier made pool-ready through a complementary reaction. Launches first.",
    },
    {
      id: "anti-algae",
      tone: "algae",
      heading: "Atlantic Anti-Algae.",
      body: "A chelated anti-algae, made for pools. Sold after PMRA registration.",
    },
  ],
  oneChemistry: "The same copper chemistry is a micronutrient in our fertilizer line. One chemistry, two businesses.",
  bottlesAlt:
    "Atlantic Clarifier with a blue cap and Atlantic Anti-Algae with a green cap, two white one-litre bottles with labels in English and French.",
  notes: [
    "\"Two bottles that do the work of a shelf. The clarifier is made pool-ready through a complementary reaction and launches first. The anti-algae is chelated and made for pools, and goes on sale after PMRA registration.\"",
  ],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 4. Ali's video                                                      */
/* ------------------------------------------------------------------ */

const YOUTUBE_ID = "rKsXcTqSfsI";

export const videoSlide = {
  n: 4,
  title: "Ali's video",
  eyebrow: "Ali's video",
  ground: "deep",
  headline: "Dr. Ali Kalateh explains both products.",
  video: {
    youtubeId: YOUTUBE_ID,
    watchUrl: `https://youtu.be/${YOUTUBE_ID}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1&playsinline=1`,
    posterUrl: `https://i.ytimg.com/vi/${YOUTUBE_ID}/hqdefault.jpg`,
    title: "Atlantic Clarifier and Anti-Algae",
    caption: "Atlantic Clarifier and Anti-Algae.",
    playLabel: "Play the video: Atlantic Clarifier and Anti-Algae",
    escapeHint: "Press Escape to return to slide controls.",
    iframeHint: "Click outside the video to return to slide controls.",
    fallback: "The video could not load here.",
    fallbackLink: `Watch on YouTube, youtu.be/${YOUTUBE_ID}`,
    posterAlt: "Video poster: the Atlantic Pool Pack bottles.",
  },
  notes: ["\"My co-founder, Dr. Ali Kalateh, explains both products. Click play and stay quiet.\""],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 5. Iron removal                                                     */
/* ------------------------------------------------------------------ */

export const ironSlide = {
  n: 5,
  title: "Iron removal",
  // The eyebrow, set inside the text column so it sits right above the headline.
  kicker: "One more thing",
  ground: "deep",
  headline: "Iron in the pool? Same two bottles.",
  body: [
    "Iron turns pool water brown and stains the walls. It is ",
    { text: "one of the most common problems pool owners face.", claim: "iron-common" },
    " Using these same two products, we have a simple way to take iron out of the pool.",
  ],
  photo: {
    alt: "A glass beaker of clear water with a stirring rod, and a layer of orange-brown iron settled at the bottom.",
    caption: "Our jar test: the iron settles to the bottom and the water clears.",
  },
  notes: [
    "\"Iron is a big problem for pool owners: brown water and stains. With these same two products we have a simple way to take it out. In this jar, the iron has settled to the bottom and the water above is clear.\"",
  ],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 6. Price                                                            */
/* ------------------------------------------------------------------ */

export const priceSlide = {
  n: 6,
  title: "Price",
  eyebrow: priceHeading,
  ground: "deep",
  /** The hero figure is this row of pricing.ts. */
  heroRow: "atlantic-pack",
  heroLine: "A fair price for high quality.",
  notes: [
    "\"A clarifier today costs about $18 to $22 and an algaecide $27 to $44. Ours are $25 and $30, and the pack is $49.99. A fair price for high quality, and flexible while we learn.\"",
  ],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 7. Team                                                             */
/* ------------------------------------------------------------------ */

export const teamSlide = {
  n: 7,
  title: "Team",
  eyebrow: "Team",
  ground: "deep",
  headline: "Chemistry and customers.",
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
  notes: [
    "\"I lead the company: strategy, partnerships, approvals, funding and customers. Ali is our CTO. He leads the science and production.\"",
  ],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 8. The ask                                                          */
/* ------------------------------------------------------------------ */

export const askSlide = {
  n: 8,
  title: "The ask",
  eyebrow: "The ask",
  ground: "deep",
  // Built from budget.ts so the headline can never disagree with the table.
  // Two sentences, set on two lines: the cost, then the ask.
  headline: [`Our first prototype costs ${dollars(prototypeTotal)}.`, `Today we ask for ${dollars(ask)}.`],
  table: {
    columns: ["Line", "What it buys", "Amount", "Funded by"],
    askLabel: "Today's ask",
    totalLabel: "First prototype",
    caption: "Budget for the first prototype",
  },
  does: "What the prototype does: 3 to 4 bottles go to licence testing. The rest of the clarifier goes to local pool owners for honest feedback.",
  footnote: "Prices before HST. Anti-Algae PMRA registration fees are planned separately.",
  notes: [
    "\"Our first prototype, with lab analyses and licences, costs about $2,000. Today we ask for $1,000: raw materials, bottles, labels and the lab analyses. We cover the licences ourselves.\"",
  ],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 9. Live test, the close                                             */
/* ------------------------------------------------------------------ */

export const liveSlide = {
  n: 9,
  title: "Live test",
  eyebrow: "Live test",
  ground: "deep",
  headline: "Now look at the beakers.",
  statement: "Same water. Same soil. One bottle.",
  beakers: [
    { tone: "silt", name: "Beaker A.", text: "Soil and water. Nothing added." },
    { tone: "pool", name: "Beaker B.", text: "Same soil and water, a few drops of Atlantic Clarifier." },
  ],
  steps: [
    "The clarifier makes the fine particles clump together.",
    "The clumps get heavy and sink.",
    "The water clears. In a pool, the filter catches the clumps.",
  ],
  madeBy: "Made by our team.",
  thanks: "Thank you.",
  contact: "agriaqua.ca",
  photo: {
    alt: "A jar test. Left: a tall cylinder of clear water with soil settled at the bottom. Right: a beaker of cloudy brown water, beside a small vial with a dropper.",
    // Confirmed by the client: this photo used our clarifier.
    caption:
      "An earlier jar test with our clarifier. Right: cloudy water. Left: after treatment, the soil has settled and the water is clear.",
  },
  notes: [
    "\"Same water, same soil. Beaker A got nothing. Beaker B got a few drops at the start. The particles clump, sink, and the water clears. In a pool, the filter catches them. Thank you.\"",
  ],
} as const satisfies SlideBase & Record<string, unknown>;

export const slides = [
  titleSlide,
  problemSlide,
  answerSlide,
  videoSlide,
  ironSlide,
  priceSlide,
  teamSlide,
  askSlide,
  liveSlide,
] as const;

export type Slide = (typeof slides)[number];

export const SLIDE_COUNT = slides.length;

/* ------------------------------------------------------------------ */
/* Interface strings                                                   */
/* ------------------------------------------------------------------ */

// The shape of `ui` is shared with /customer/ and /financials/, which type
// their own copy against it, so keys stay even where this deck no longer uses
// them (the timer).
export const ui = {
  deckLabel: "Mazdak Atlantic AgriAqua, pool line funding pitch",
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
  timerLabel: "Time since the clarifier went into beaker B",
  slideOf: (n: number, total: number) => `${n} of ${total}`,
  goTo: (n: number, title: string) => `Go to section ${n}, ${title}`,
  openImage: (caption: string) => `Open image full size: ${caption}`,
  auditCount: (onSlide: number, inDeck: number) =>
    `${onSlide} unproven ${onSlide === 1 ? "claim" : "claims"} on this slide, ${inDeck} in the deck.`,
  announce: (n: number, total: number, title: string) => `Section ${n} of ${total}, ${title}`,
};

/* ------------------------------------------------------------------ */
/* Claim counting for audit mode                                       */
/* ------------------------------------------------------------------ */

/** Walks any content value and collects the ids of every assumption in it. */
export function collectClaims(value: unknown, into: Set<ClaimId> = new Set()): Set<ClaimId> {
  if (Array.isArray(value)) {
    value.forEach((v) => collectClaims(v, into));
  } else if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.claim === "string" && obj.claim in claims) into.add(obj.claim as ClaimId);
    Object.values(obj).forEach((v) => collectClaims(v, into));
  }
  return into;
}

/** Content rendered on a section from another file (price strip, budget table). */
const extraContent: Record<number, unknown> = { [priceSlide.n]: priceRows, [askSlide.n]: budgetRows };

/** What the room sees on each section; the presenter notes are not counted. */
export const claimsPerSlide: number[] = slides.map((s) => {
  const { notes: _notes, ...onScreen } = s;
  void _notes;
  return collectClaims([onScreen, extraContent[s.n]]).size;
});

/** Every claim the founder may make. */
export const claimsInDeck: number = collectClaims([slides, Object.values(extraContent)]).size;
