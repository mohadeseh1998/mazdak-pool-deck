import type { PageSlide, PageUi, Rich } from "../../shared/types";
import { countClaims } from "../../shared/types";
import type { VideoInfo } from "../../shared/kit";
import { claims, type ClaimId } from "./claims";

// All copy for /gate2/, the JHSC Ventures Gate 2 final pitch (Gate 2 brief,
// Section 4), set word for word. No strings live in JSX. A `{ text, claim }`
// node is an [assumption]: the Claim component wraps it and adds the tag.
//
// Nine slides, one idea each, about 4:30 with Ali's video. Presenter notes
// (key N, and the PowerPoint notes) are the brief's Section 5 script.

type C = { text: Rich; claim: ClaimId };
const claim = (text: Rich, id: ClaimId): C => ({ text, claim: id });

/** The one place the video link lives. Change it here and every copy follows. */
export const VIDEO_URL = "https://youtu.be/wk7ismudn6U";

/** The YouTube id inside VIDEO_URL (youtu.be/ID or youtube.com/watch?v=ID). */
export const VIDEO_ID = (VIDEO_URL.match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/) ?? [])[1] ?? "";

/* 1. Title (0:10) ---------------------------------------------------- */

export const titleSlide = {
  n: 1,
  title: "Title",
  ground: "deep",
  headline: ["Clear pools,", "made in New Brunswick."],
  sub: "Atlantic Clarifier and Atlantic Anti-Algae, sold together as the Atlantic Pool Pack.",
  founders: ["Mohadeseh Zamani, Co-founder and CEO", "Dr. Ali Kalateh, Co-founder and CTO"],
  footer: [
    "Mazdak Atlantic AgriAqua Inc., Fredericton",
    "JHSC Ventures Summer Institute, Gate 2",
    "20 November 2026",
  ],
  bottlesAlt:
    "The Atlantic Pool Pack: two white one-litre bottles with bilingual labels, Atlantic Clarifier with a blue cap and Atlantic Anti-Algae with a green cap.",
  notes: ["\"Hi everyone, I'm Mohi, co-founder and CEO of Mazdak Atlantic AgriAqua.\""],
  time: "0:10",
} as const satisfies PageSlide & Record<string, unknown>;

/* 2. Problem (0:25) -------------------------------------------------- */

export const problemSlide = {
  n: 2,
  title: "Problem",
  eyebrow: "Problem",
  ground: "deep",
  headline: "A cloudy pool is a closed pool.",
  cards: [
    {
      heading: "Cloudy water.",
      body: "Fine particles are too small for a home filter to catch, so the water stays cloudy.",
    },
    {
      heading: "Harsh algae control.",
      body: "The usual anti-algae, copper sulfate, puts a lot of free copper into the water.",
    },
  ],
  bottom: "Apart from the disinfectant, most pools need just two more things: a clarifier and an anti-algae.",
  notes: [
    "\"A cloudy pool is a closed pool. Pool stores sell more than twenty chemicals, but after the disinfectant, most pools only need a clarifier and an anti-algae. And both have a problem. Fine particles slip through home filters, so the water stays cloudy. And the usual anti-algae, copper sulfate, puts a lot of free copper in the water.\"",
  ],
  time: "0:25",
} as const satisfies PageSlide & Record<string, unknown>;

/* 3. Our answer (0:20) ----------------------------------------------- */

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
      body: "Makes fine particles settle, so the water clears. Launches first.",
    },
    {
      id: "anti-algae",
      tone: "algae",
      heading: "Atlantic Anti-Algae.",
      body: "A chelated anti-algae, made for pools. Coming after the clarifier.",
      /** A short pointer to slide 4. */
      note: "Dr. Ali Kalateh explains it in the video.",
    },
  ],
  price: [claim([{ b: "Atlantic Pool Pack: $49.99" }, " suggested retail."], "price")] as Rich,
  bonus: ["Bonus: the same two bottles ", claim("help take iron out of pool water.", "iron")] as Rich,
  bottlesAlt:
    "Atlantic Clarifier with a blue cap and Atlantic Anti-Algae with a green cap, two white one-litre bottles with labels in English and French.",
  notes: [
    "\"Our answer is two bottles that do the work of a shelf. Atlantic Clarifier launches first. Atlantic Anti-Algae, a chelated anti-algae made for pools, comes after the clarifier. Together they're the Atlantic Pool Pack, at forty-nine ninety-nine, made here in New Brunswick.\"",
  ],
  time: "0:20",
} as const satisfies PageSlide & Record<string, unknown>;

/* 4. Ali's video (1:00) ---------------------------------------------- */

export const video: VideoInfo = {
  youtubeId: VIDEO_ID,
  watchUrl: VIDEO_URL,
  embedUrl: `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`,
  posterUrl: `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`,
  title: "Atlantic Anti-Algae",
  caption: "Atlantic Anti-Algae.",
  playLabel: "Play the video: Atlantic Anti-Algae",
  escapeHint: "Press Escape to return to slide controls.",
  iframeHint: "Click outside the video to return to slide controls.",
  fallback: "The video could not load here.",
  fallbackLink: `Watch on YouTube, ${VIDEO_URL.replace(/^https?:\/\//, "")}`,
  posterAlt: "Poster for the video by Dr. Ali Kalateh.",
};

export const videoSlide = {
  n: 4,
  title: "Ali's video",
  eyebrow: "Our CTO",
  ground: "deep",
  headline: "Dr. Ali Kalateh explains the Atlantic Anti-Algae.",
  /** The link to the video, under the player (and over the poster on paper). */
  watch: `Watch the video: ${VIDEO_URL.replace(/^https?:\/\//, "")}`,
  notes: ["\"Our CTO, Dr. Ali Kalateh, explains our Atlantic Anti-Algae.\"", "Play the video and stay quiet."],
  time: "1:10",
} as const satisfies PageSlide & Record<string, unknown>;

/* 5. Progress since Gate 1 (0:37) ------------------------------------ */

export const progressSlide = {
  n: 5,
  title: "Progress since Gate 1",
  eyebrow: "Progress since Gate 1",
  ground: "deep",
  headline: "From idea to product.",
  done: [
    "Raw materials received from Canadian suppliers.",
    "Atlantic Clarifier made and tested many times.",
    "Live demo to the JHSC Funding Committee: $1,000 prototype funding approved.",
    "Bottle and label suppliers chosen. First prototype batch under way.",
    "Reached out to the market: an Atlantic Canada chemical distributor and a Fredericton pool and spa retailer.",
  ],
  lead: {
    heading: "New lead.",
    body: [
      "A judge pointed us to ",
      claim("industrial water: clarifying oil sands tailings water so it can be reused.", "oil-sands"),
    ] as Rich,
  },
  footer: "Made by our team.",
  notes: [
    "\"Since Gate 1, we've moved from idea to product. Our raw materials arrived from Canadian suppliers. We made our clarifier and tested it many times. We demonstrated it live to the Funding Committee and won one thousand dollars in prototype funding. We've chosen our bottle and label suppliers, and we've reached out to the market: an Atlantic Canada chemical distributor and a Fredericton pool and spa retailer. And a judge pointed us to a new use: clarifying industrial water, like oil sands tailings.\"",
  ],
  time: "0:37",
} as const satisfies PageSlide & Record<string, unknown>;

/* 6. Roadmap (0:33), the most important slide ------------------------ */

export const roadmapSlide = {
  n: 6,
  title: "Roadmap",
  eyebrow: "Where we're going",
  ground: "deep",
  headline: "Five steps to the 2027 pool season.",
  /** One assumption tag for the whole timeline. Its words are read by screen readers only. */
  plan: [claim("Every date on this timeline", "roadmap")] as Rich,
  steps: [
    { when: "Dec 2026.", what: "First prototype batch and the lab analyses our licences need." },
    {
      when: "Winter 2027.",
      what: "Clarifier samples to pool owners and stores for feedback.",
    },
    { when: "By March 2027.", what: "First store orders. Stores plan their spring stock in winter." },
    { when: "Spring 2027.", what: "Launch Atlantic Clarifier in Fredericton: 500 litres for the first season." },
    { when: "2028.", what: "Atlantic Pool Pack and growth across Atlantic Canada." },
  ],
  then: "Then: our iron fertilizer, already a Gold Medal winner.",
  notes: [
    "\"Here's where we're going. In December, our first prototype batch and the lab analyses for our licences. This winter, samples to pool owners and stores. By March, our first store orders, because stores plan spring stock in winter. In spring 2027, we launch Atlantic Clarifier in Fredericton with five hundred litres. Then the Pool Pack, and in 2028, Atlantic Canada.\"",
  ],
  time: "0:33",
} as const satisfies PageSlide & Record<string, unknown>;

/* 7. How we fund it (0:18) ----------------------------------------- */

export const fundSlide = {
  n: 7,
  title: "How we fund it",
  eyebrow: "How we fund it",
  ground: "deep",
  headline: "Founder-funded from day one.",
  figure: "$100,000",
  figureLabel: "Our own capital, already working.",
  /** "$150,000" is drawn large. */
  more: ["Plus $50,000 more from the founders by the middle of 2027: ", { b: "$150,000" }, " in total."] as Rich,
  mentor: "Our mentor's advice: plan for twice what you think you need. So we did.",
  big: "What would help us most: your introductions.",
  chips: ["Pool stores", "City pools", "Industrial water users"],
  notes: [
    "\"We're funding this ourselves. We started with one hundred thousand dollars of our own capital, and we'll add fifty thousand more by the middle of next year. Our mentor told us to plan for twice what we think we need, so we did. What would help us most is your introductions: to pool stores, city pools, and anyone working with industrial water.\"",
  ],
  time: "0:18",
} as const satisfies PageSlide & Record<string, unknown>;

/* 8. Recognition (0:18) ---------------------------------------------- */

export const recognitionSlide = {
  n: 8,
  title: "Recognition",
  eyebrow: "Recognition",
  ground: "deep",
  /** The large card, built like the iron fertilizer deck's: two photos, four smaller ones, then the words. */
  ican: {
    label: "iCAN 2026",
    caption:
      "Gold Medal, WIIPA Special Award, Romanian Inventors Forum Special Award and a Certificate of Excellence, iCAN 2026, Toronto, for our iron fertilizer.",
    main: [
      {
        file: "ican-awards.jpg",
        alt: "Mohadeseh Zamani holding the iCAN 2026 Certificate of Excellence, with the Gold Medal, the WIIPA and Romanian Inventors Forum special awards and their certificates on the table.",
      },
      { file: "ican-gold-medal-1.jpg", alt: "The iCAN 2026 Gold Medal certificate with the medal." },
    ],
    thumbs: [
      { file: "ican-gold-medal-2.jpg", alt: "The Gold Medal certificate with the medal on its ribbon." },
      { file: "ican-certificate-of-excellence.jpg", alt: "The iCAN 2026 Certificate of Excellence." },
      { file: "ican-wiipa-special-award.jpg", alt: "The WIIPA Special Award certificate with its medal." },
      { file: "ican-fir-special-award.jpg", alt: "The Romanian Inventors Forum diploma and special award." },
    ],
  },
  /** Photo cards. A card whose photo file is missing becomes a text card. */
  photoCards: [
    {
      id: "bmo",
      photo: "bmo-apex-team.jpg",
      alt: "Five people holding certificates at the BMO Apex Startup Challenge 2025 at UNB.",
      caption: "3rd place, Elevator Pitch Competition, BMO Apex Startup Challenge 2025, UNB.",
    },
    {
      id: "gate1",
      photo: "gate1-award.jpg",
      alt: "Mohadeseh Zamani and three others holding the JHSC Ventures Shadow Institute Gate 1 award cheque.",
      caption: "JHSC Ventures Shadow Institute: Gate 1 award, October 2026.",
    },
  ],
  press: {
    label: "Press.",
    text: "Featured by AllNewBrunswick.",
    photos: [
      { file: "press-ali-kalateh.jpg", alt: "Dr. Ali Kalateh's photo in the AllNewBrunswick article." },
      { file: "press-mohadeseh-zamani.jpg", alt: "Mohadeseh Zamani's photo in the AllNewBrunswick article." },
    ],
  },
  /** Small text cards: no photo. */
  textCards: [
    { id: "jhsc-funding", text: "Summer Institute funding approved by the JHSC Funding Committee." },
    { id: "letters", lead: "Planet Hatch and Ignite Fredericton.", text: "Support letters from both." },
  ],
  supportedBy: "Supported by",
  /** In this order. A logo whose file is missing shows its name instead. */
  logos: [
    { file: "jhsc-logo.png", name: "J Herbert Smith Centre", lead: true },
    { file: "ican-logo.png", name: "iCAN" },
    { file: "planet-hatch-logo.png", name: "Planet Hatch" },
    { file: "ignite-fredericton-logo.png", name: "Ignite Fredericton" },
  ],
  notes: [
    "\"We're grateful for the recognition so far: a Gold Medal and special awards at iCAN 2026, our Gate 1 award from JHSC, third place at BMO Apex, and support from JHSC, Planet Hatch and Ignite Fredericton.\"",
  ],
  time: "0:18",
} as const satisfies PageSlide & Record<string, unknown>;

/* 9. Results, thank you (0:24) --------------------------------------- */

export const resultsSlide = {
  n: 9,
  title: "Results",
  eyebrow: "Results",
  ground: "deep",
  /** Set on two lines; the last sentence in pool blue. */
  headline: "Same water. Same soil. One bottle.",
  jars: [
    { tone: "silt", name: "Untreated.", text: "Soil and water. Nothing added." },
    { tone: "pool", name: "Treated.", text: "Same soil and water, a few drops of Atlantic Clarifier." },
  ],
  steps: ["The fine particles settle.", "A pool filter or vacuum removes them.", "The water turns clear."],
  thanks: "Thank you.",
  contact: "agriaqua.ca",
  photo: {
    alt: "Our jar test. Left: a tall cylinder of clear water with soil settled at the bottom. Right: a jar of cloudy brown water, beside a small vial with a dropper.",
    caption: "Our jar test with Atlantic Clarifier.",
  },
  notes: [
    "\"Here's the result. Same water, same soil. The untreated jar stays cloudy. With just a few drops of our clarifier, the fine particles settle and the water turns clear. In a pool, the filter or a vacuum takes them out. Clear pools, made in New Brunswick. Thank you.\"",
  ],
  time: "0:24",
} as const satisfies PageSlide & Record<string, unknown>;

/** The shared top bar's timer reads a slide named liveSlide; this deck has no timer. */
export const liveSlide = resultsSlide;

export const slides = [
  titleSlide,
  problemSlide,
  answerSlide,
  videoSlide,
  progressSlide,
  roadmapSlide,
  fundSlide,
  recognitionSlide,
  resultsSlide,
] as const;

export const SLIDE_COUNT = slides.length;

/* Interface strings ------------------------------------------------ */

export const ui: PageUi = {
  deckLabel: "Mazdak Atlantic AgriAqua, JHSC Ventures Gate 2 final pitch",
  companyName: "Mazdak Atlantic AgriAqua",
  logoAlt: "Mazdak Atlantic AgriAqua",
  assumptionTag: "assumption",
  proofLead: "",
  notesHeading: "Presenter note",
  sourcesHeading: "",
  sourcesHint: "",
  close: "Close",
  prev: "Previous slide",
  next: "Next slide",
  // No demo timer on this page (Gate 2 brief, Section 2).
  timerFooter: "",
  timerLabel: "",
  slideOf: (n: number, total: number) => `${n} of ${total}`,
  goTo: (n: number, title: string) => `Go to slide ${n}, ${title}`,
  openImage: (caption: string) => `Open image full size: ${caption}`,
  auditCount: (onSlide: number, inDeck: number) =>
    `${onSlide} unproven ${onSlide === 1 ? "claim" : "claims"} on this slide, ${inDeck} in the deck.`,
  announce: (n: number, total: number, title: string) => `Slide ${n} of ${total}, ${title}`,
};

/* Claim counting for audit mode ------------------------------------ */

const counted = countClaims(slides, claims);
export const claimsPerSlide = counted.perSlide;
export const claimsInDeck = counted.inDeck;
