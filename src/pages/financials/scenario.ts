import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ScenarioId } from "../../content/poolModel";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useSlideMotion } from "../shared/kit";

/** Base or Worst, switched by the pill or key W. Base is the default. */
export const ScenarioContext = createContext<{ scenario: ScenarioId; set: (s: ScenarioId) => void }>({
  scenario: "base",
  set: () => {},
});
export const useScenario = () => useContext(ScenarioContext);

// The same timing and curve as the shared CountUp, so the page lands its
// figures the way the root deck does.
const ENTER_DELAY_MS = 650;
const ENTER_MS = 1500;
const SWITCH_MS = 1100;
const ease = (p: number) => 1 - Math.pow(1 - p, 4);

/**
 * Every figure on the seasons section moves together. As the section arrives,
 * all of them count up from zero, like the shared CountUp. When the scenario
 * switches, they travel from what is on screen now to the new values: the
 * bars grow or shrink, the cash line bends, the digits count. They always
 * settle on the exact values; reduced motion shows the values at once.
 */
export function useTweened(target: readonly number[]): number[] {
  const { active, entered } = useSlideMotion();
  const reduced = useReducedMotion();
  const [shown, setShown] = useState<number[]>(() => [...target]);
  const shownRef = useRef(shown);
  shownRef.current = shown;
  const landed = useRef(false);
  // `key` stands for `target`: a new array with the same values is no change.
  const key = target.join(",");

  useEffect(() => {
    if (reduced || !active) {
      landed.current = false;
      setShown([...target]);
      return;
    }
    if (!entered) {
      landed.current = false;
      setShown(target.map(() => 0));
      return;
    }
    const entrance = !landed.current;
    landed.current = true;
    const from = entrance ? target.map(() => 0) : shownRef.current;
    const delay = entrance ? ENTER_DELAY_MS : 0;
    const duration = entrance ? ENTER_MS : SWITCH_MS;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - start - delay) / duration));
      const e = ease(p);
      setShown(p >= 1 ? [...target] : from.map((f, i) => f + (target[i] - f) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, entered, reduced, key]); // eslint-disable-line react-hooks/exhaustive-deps

  return shown;
}
