import type { ui as rootUi } from "../../content/slides";

// The content shapes every page provides. They mirror the root deck's own
// (src/content/slides.ts), so the shared components read a page's content
// exactly as they read the root deck's.

export type Ground = "deep" | "clear";

/** A `{ text, claim }` node is an [assumption]: Claim wraps it and adds the tag. */
export type RichNode = string | { b: string } | { text: Rich; claim: string; after?: string };
export type Rich = string | readonly RichNode[];

export interface PageSlide {
  n: number;
  title: string;
  /** The small line above a section headline. */
  eyebrow?: string;
  ground: Ground;
  /** Presenter notes (key N). */
  notes: readonly Rich[];
}

export interface ClaimEntry {
  claim: string;
  proof: string;
}

/** Interface strings: the same keys as the root deck's `ui`. */
export type PageUi = typeof rootUi;

/** Walks any content value and collects the ids of every assumption in it. */
export function collectClaims(value: unknown, registry: Record<string, ClaimEntry>, into = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    value.forEach((v) => collectClaims(v, registry, into));
  } else if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.claim === "string" && obj.claim in registry) into.add(obj.claim);
    Object.values(obj).forEach((v) => collectClaims(v, registry, into));
  }
  return into;
}

/** Claims the room sees on each section (presenter notes are not counted), and in the page. */
export function countClaims(
  slides: readonly PageSlide[],
  registry: Record<string, ClaimEntry>,
  extra: Record<number, unknown> = {},
): { perSlide: number[]; inDeck: number } {
  const perSlide = slides.map((s) => {
    const { notes: _notes, ...onScreen } = s;
    void _notes;
    return collectClaims([onScreen, extra[s.n]], registry).size;
  });
  return { perSlide, inDeck: collectClaims([slides, Object.values(extra)], registry).size };
}
