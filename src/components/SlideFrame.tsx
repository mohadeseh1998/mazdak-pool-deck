import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Slide } from "../content/slides";
import { useDeck } from "./DeckContext";
import { reveal, SlideMotionContext } from "./reveal";

/** How long a section that has left keeps its entered state, so it never blanks while still in view. */
const LEAVE_MS = 900;

interface Props {
  slide: Slide;
  index: number;
  className?: string;
  children: ReactNode;
}

/**
 * One full-screen section of the page. Its ground runs edge to edge; inside, a
 * fixed 1600 by 900 canvas is scaled to fit, so the room sees the same layout
 * on any projector. The small eyebrow above each headline is the section title.
 */
export function SlideFrame({ slide, index, className = "", children }: Props) {
  const { active, scale } = useDeck();
  const isActive = active === index;
  const ref = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  // Start the entrance one frame after the section becomes current, so the
  // browser has painted the starting state. Reset only once it is out of view.
  useEffect(() => {
    if (isActive) {
      let second = 0;
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => setEntered(true));
      });
      return () => {
        cancelAnimationFrame(first);
        cancelAnimationFrame(second);
      };
    }
    const t = window.setTimeout(() => setEntered(false), LEAVE_MS);
    return () => window.clearTimeout(t);
  }, [isActive]);

  const motion = useMemo(() => ({ active: isActive, entered }), [isActive, entered]);
  const eyebrow = "eyebrow" in slide ? slide.eyebrow : undefined;

  return (
    <SlideMotionContext.Provider value={motion}>
      <section
        ref={ref}
        className={`slide ground-${slide.ground} slide--${slide.n}${entered ? " is-entered" : ""}${isActive ? " is-active" : ""}`}
        aria-label={slide.title}
        data-slide={slide.n}
      >
        <div className="canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          {eyebrow && (
            <p className="eyebrow" {...reveal(0)}>
              {eyebrow}
            </p>
          )}
          <div className={`frame ${className}`}>{children}</div>
        </div>
      </section>
    </SlideMotionContext.Provider>
  );
}
