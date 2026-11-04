import { ASK_MODE, ask, budgetRows, dollars, runTotal } from "./budget";
import { priceHeading, priceRows } from "./pricing";
import type { ClaimId } from "./claims";
import { claims } from "./claims";

// All slide copy (brief Section 5), set verbatim. No strings live in JSX.
// A `{ text, claim }` node is an [assumption]: the Claim component wraps the
// statement and adds the tag. The literal word in brackets is never printed.
//
// Layout: one vertical page of ten full-screen sections, in the manner of an
// Apple product page. The brief's slides 3 and 8 are each split in two so no
// screen carries too much. Lines taken off a screen were cut, never reworded,
// and every one of them is still spoken in the presenter notes.

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
  demoHint: { before: "Press", key: "T", after: "when the clarifier goes in the beaker." },
  bottlesAlt:
    "The Atlantic Pool Pack: two white one-litre bottles with bilingual labels, Atlantic Clarifier with a blue cap and Atlantic Anti-Algae with a green cap.",
  notes: [
    "\"Hi, I am Mohi from Mazdak Atlantic AgriAqua. Before I start, I am adding a few drops of our clarifier to this beaker of muddy water. The other beaker gets nothing. Keep an eye on them. At Gate 1 I talked about our fertilizer. Today is our second business: pool water.\"",
    "Action: stir soil into both beakers first, then add the drops to beaker B and press T.",
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
      // Label claim is clarifying only (brief Section 11, item 6).
      body: "Clumps the fine particles so the pool filter can catch them. Cloudy water turns clear. Launches first.",
    },
    {
      id: "anti-algae",
      tone: "algae",
      heading: "Atlantic Anti-Algae.",
      body: [
        "Chelated copper tuned to a medium stability: enough copper to stop algae, without the flood of free copper. ",
        { text: "Built to protect longer, including against black algae.", claim: "black-algae" },
        " Sold after PMRA registration.",
      ],
    },
  ],
  oneChemistry: "The same copper chemistry is a micronutrient in our fertilizer line. One chemistry, two businesses.",
  bottlesAlt:
    "Atlantic Clarifier with a blue cap and Atlantic Anti-Algae with a green cap, two white one-litre bottles with labels in English and French.",
  notes: [
    "\"Here are our two products. The clarifier makes cloudy water clear, and it launches first. The anti-algae uses chelated copper. If the copper is held too tightly, nothing works. If it is too loose, you get too much free copper. We tuned it to a medium stability.\"",
  ],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 4. Price (the brief's slide 3, right column)                         */
/* ------------------------------------------------------------------ */

export const priceSlide = {
  n: 4,
  title: "Price",
  eyebrow: priceHeading,
  ground: "deep",
  /** The hero figure is this row of pricing.ts. */
  heroRow: "atlantic-pack",
  notes: [
    "\"On price: buying a clarifier and an algaecide today costs about 45 to 66 dollars. Our pack will be 39.99, and our clarifier alone 16.99.\"",
    [
      "If asked about cost: ",
      {
        text: "about $12 to make one pack, $6 per bottle.",
        claim: "unit-cost",
        after: "Not yet measured on a production run.",
      },
    ],
  ],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 5. Ali's video                                                      */
/* ------------------------------------------------------------------ */

const YOUTUBE_ID = "tuRgEGqjRyk";

export const videoSlide = {
  n: 5,
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
    caption: "Atlantic Clarifier and Anti-Algae. 1 min 15 s.",
    playLabel: "Play the video: Atlantic Clarifier and Anti-Algae",
    escapeHint: "Press Escape to return to slide controls.",
    iframeHint: "Click outside the video to return to slide controls.",
    fallback: "The video could not load here.",
    fallbackLink: `Watch on YouTube, youtu.be/${YOUTUBE_ID}`,
    posterAlt: "Video poster: the Atlantic Pool Pack bottles.",
  },
  notes: ["Click play. Do not talk over the video. During the video, glance at beaker B."],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 6. Live test                                                        */
/* ------------------------------------------------------------------ */

export const liveSlide = {
  n: 6,
  title: "Live test",
  eyebrow: "Live test",
  ground: "deep",
  headline: "Now look at the beakers.",
  timerCaption: "since the clarifier went into beaker B",
  timerNotStarted: "about 5 minutes",
  timerPrint: "Live demo",
  beakers: [
    { tone: "silt", name: "Beaker A.", text: "Soil and water. Nothing added." },
    { tone: "pool", name: "Beaker B.", text: "Same soil and water, a few drops of Atlantic Clarifier." },
  ],
  steps: [
    "The clarifier makes the fine particles clump together.",
    "The clumps get heavy and sink.",
    "The water clears. In a pool, the filter catches the clumps.",
  ],
  unb: "Made by our team in a lab at UNB. UNB does not test or endorse our products.",
  photo: {
    alt: "A jar test. Left: a tall cylinder of clear water with soil settled at the bottom. Right: a beaker of cloudy brown water, beside a small vial with a dropper.",
    // Confirmed by the client: this photo used our clarifier.
    caption:
      "An earlier jar test with our clarifier. Right: cloudy water. Left: after treatment, the soil has settled and the water is clear.",
  },
  notes: [
    "Hold up beaker A and beaker B side by side. \"Same water, same soil, five minutes ago. This one got nothing. This one got a few drops of our clarifier. You can see the particles clumping and sinking, and the water clearing. In a real pool, the filter catches those clumps. No big equipment, just the bottle.\"",
    "If beaker B is slow: \"Clarifiers keep working for hours. Here is the same test with our clarifier, run earlier,\" and click the photo.",
    "Equipment on the table: two 150 mL beakers, one 10 to 20 mL beaker with clarifier, a glass stirring rod, a dropper, soft soil, water, paper towels, gloves.",
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
      role: "Co-founder and CMO",
      initials: "MZ",
      bio: "Graduate student in Electrical Engineering at UNB. Runs the company in Canada: incorporated in New Brunswick, GST and HST registered, UNB lab access, Canadian suppliers, customers and licensing.",
    },
    {
      id: "ali",
      name: "Dr. Ali Kalateh",
      role: "Co-founder and CEO",
      initials: "AK",
      bio: "Inorganic chemist. Years of hands-on experience developing and producing pool-care and water-treatment products. Leads formulation and production.",
    },
  ],
  shared: "We own the company 50/50, and the formulations belong to the company.",
  notes: [
    "\"Ali is our chemist, with years of hands-on experience in pool and water-treatment products. I run the company here: the lab, suppliers, customers and licences.\"",
  ],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 8. Progress and next steps                                          */
/* ------------------------------------------------------------------ */

export const progressSlide = {
  n: 8,
  title: "Progress and next steps",
  eyebrow: "Progress and next steps",
  ground: "deep",
  headline: "Done, and next.",
  done: {
    heading: "Done",
    items: [
      "Incorporated in New Brunswick, GST and HST registered",
      "Raw materials received from a Canadian supplier",
      "First Atlantic Clarifier samples made, the ones on this table",
      "Bilingual label design ready (English and French)",
      "Mentor: Jill Green, JHSC Summer Institute",
      "Gate 1 award: $500, one of 3 of 9 teams",
      "Our iron fertilizer: iCAN 2026 Gold Medal, two special awards and a Certificate of Excellence",
      "Preparing a patent application for our iron fertilizer first, then the pool products",
    ],
  },
  next: {
    heading: "Next three weeks",
    items: [
      "Week of 9 November: start licensing for the clarifier (federal, New Brunswick, City of Fredericton)",
      "First two customer conversations: a local pool store through our mentor, and the City of Fredericton Recreation Department",
      "Call PMRA about registering the anti-algae",
      "20 November, Gate 2: live demo plus what customers told us",
      [{ text: "Launch target: the 2027 pool season", claim: "launch" }],
    ] as readonly Rich[],
  },
  notes: [
    "\"We are incorporated, our raw materials are here, and these samples are our first Canadian batch. Next week I start the licensing work and our first customer conversations, so at Gate 2 I can show you real feedback.\"",
  ],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 9. The ask (the brief's slide 8: headline and budget)               */
/* ------------------------------------------------------------------ */

export const askSlide = {
  n: 9,
  title: "The ask",
  eyebrow: "The ask",
  ground: "deep",
  // Built from budget.ts so the headline can never disagree with the table.
  // Two sentences, set on two lines: the cost, then the ask.
  headline: [
    `Our first production run costs ${dollars(runTotal)}.`,
    ASK_MODE === "full" ? "Today we ask for all of it." : `Today we ask for ${dollars(ask)}.`,
  ],
  table: {
    columns: ["Line", "What it buys", "Amount", "Funded by"],
    totalLabel: "First production run",
    askLabel: "Today's ask",
    caption: "Budget for the first production run",
  },
  footnote: [
    "Prices before HST. We are GST/HST registered and recover it. ",
    { text: "Freight for the drum not included.", claim: "freight" },
  ],
  notes: [
    // BRIEF-QUESTION: these notes speak the core ask ($500). In full mode the
    // founder should say "all 800 dollars" instead; the brief gives no script.
    "\"Our first production run costs 800 dollars. Today we ask for 500, and it goes to the most important part: one drum of our main raw material. We cover the bottles, labels and demo kits ourselves or through the November 19 prototyping fund.\"",
    "If asked \"what is the raw material?\": \"That is part of our formula, so we keep it private. I am happy to show the receipt to the committee.\"",
  ],
} as const satisfies SlideBase & Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* 10. What the run does, and the close (the brief's slide 8)          */
/* ------------------------------------------------------------------ */

export const closeSlide = {
  n: 10,
  title: "What the run does",
  eyebrow: "What the run does",
  ground: "deep",
  // Each approved line, with its leading number set large. Read together,
  // figure and text are the brief's words exactly.
  runDoes: [
    { figure: 7, text: "sample bottles for local buyers: six pool stores and the City of Fredericton" },
    { figure: 10, text: "bottles for tests and live demos" },
    { figure: 43, text: "bottles ready to sell as soon as our licences are in place" },
  ],
  otherAsks:
    "One introduction: anyone in Fredericton who buys pool chemicals. And your honest feedback on the pack and the price.",
  contact: "agriaqua.ca",
  notes: [
    "\"That gives us 60 bottles: samples for seven local buyers, bottles for testing, and our first bottles to sell. We would also love one introduction and your honest feedback. Thank you.\"",
    "If asked about scale: \"The next size up from our supplier is cheaper per litre, so cost goes down as we grow.\"",
  ],
} as const satisfies SlideBase & Record<string, unknown>;

export const slides = [
  titleSlide,
  problemSlide,
  answerSlide,
  priceSlide,
  videoSlide,
  liveSlide,
  teamSlide,
  progressSlide,
  askSlide,
  closeSlide,
] as const;

export type Slide = (typeof slides)[number];

export const SLIDE_COUNT = slides.length;

/* ------------------------------------------------------------------ */
/* Interface strings                                                   */
/* ------------------------------------------------------------------ */

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
const extraContent: Record<number, unknown> = { 4: priceRows, 9: budgetRows };

/** What the room sees on each section; the presenter notes are not counted. */
export const claimsPerSlide: number[] = slides.map((s) => {
  const { notes: _notes, ...onScreen } = s;
  void _notes;
  return collectClaims([onScreen, extraContent[s.n]]).size;
});

/** Every claim the founder may make, including the cost answer in the notes. */
export const claimsInDeck: number = collectClaims([slides, Object.values(extraContent)]).size;
