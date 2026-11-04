import { useEffect, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useSlideMotion } from "./reveal";

const DELAY_MS = 650;
const DURATION_MS = 1500;

/**
 * A figure that counts up to its value when its slide enters, the way Apple
 * lands a key number. It always settles on the exact value; screen readers,
 * print and reduced motion only ever see the final figure.
 */
export function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const { active, entered } = useSlideMotion();
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (reduced || !active) {
      setShown(value);
      return;
    }
    if (!entered) {
      setShown(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - start - DELAY_MS) / DURATION_MS));
      const eased = 1 - Math.pow(1 - p, 4);
      setShown(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, entered, reduced, value]);

  return (
    <>
      <span aria-hidden="true">{format(shown)}</span>
      <span className="visually-hidden">{format(value)}</span>
    </>
  );
}
