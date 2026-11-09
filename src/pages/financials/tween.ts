import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useSlideMotion } from "../shared/kit";

// The same timing and curve as the shared CountUp, so the page lands its
// figures the way the root deck does.
const ENTER_DELAY_MS = 650;
const ENTER_MS = 1500;
const ease = (p: number) => 1 - Math.pow(1 - p, 4);

/**
 * Every figure on the seasons section moves together: as the section arrives,
 * the bars grow, the cash line rises into place and the digits count up from
 * zero, like the shared CountUp. They always settle on the exact values;
 * reduced motion shows the values at once. Call it inside SlideFrame.
 */
export function useTweened(target: readonly number[]): number[] {
  const { active, entered } = useSlideMotion();
  const reduced = useReducedMotion();
  const [shown, setShown] = useState<number[]>(() => [...target]);
  // `key` stands for `target`: a new array with the same values is no change.
  const key = target.join(",");
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    const t = targetRef.current;
    if (reduced || !active) {
      setShown([...t]);
      return;
    }
    if (!entered) {
      setShown(t.map(() => 0));
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start - ENTER_DELAY_MS) / ENTER_MS));
      setShown(p >= 1 ? [...t] : t.map((v) => v * ease(p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, entered, reduced, key]);

  return shown;
}
