import { createContext, useContext, type CSSProperties } from "react";

/**
 * Entrance choreography. Every slide plays the same idea as the product:
 * cloudy to clear. Headlines resolve from a soft blur into focus, then the
 * supporting lines follow in order, a beat apart.
 *
 *   "clear"  headline: blur to sharp, with a slight rise
 *   "text"   supporting copy: fade and rise
 *   "row"    table rows: fade and rise, no blur
 *
 * `i` is the beat in the sequence. The timing lives in slides.css.
 */
export type RevealKind = "clear" | "text" | "row";

export function reveal(i: number, kind: RevealKind = "text") {
  return { "data-reveal": kind, style: { "--i": i } as CSSProperties };
}

export interface SlideMotion {
  /** This slide is the current one. */
  active: boolean;
  /** Its entrance has started. Reset after the slide has left the screen. */
  entered: boolean;
}

export const SlideMotionContext = createContext<SlideMotion>({ active: false, entered: false });

export const useSlideMotion = (): SlideMotion => useContext(SlideMotionContext);
