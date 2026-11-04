import { useCallback, useEffect, useRef, useState } from "react";

/** Reads "#/3" as section index 2. Anything unreadable falls back to the first. */
function parse(hash: string, count: number): number {
  const n = Number.parseInt(hash.replace(/^#\/?/, ""), 10);
  return Number.isFinite(n) && n >= 1 && n <= count ? n - 1 : 0;
}

const sections = () => Array.from(document.querySelectorAll<HTMLElement>("section.slide"));

/**
 * One tall page of full-screen sections, like an Apple product page. The page
 * scrolls and snaps; the section mostly in view is the current one. Keys and
 * the pager glide to a section. `#/1` to `#/n` deep-link and stay in sync.
 */
export function useVerticalDeck(count: number, reducedMotion: boolean): [number, (index: number) => void, () => number] {
  const [active, setActive] = useState(() => parse(window.location.hash, count));
  const pending = useRef<number | null>(null);

  // Land on the linked section without animating, once the sections exist.
  useEffect(() => {
    sections()[parse(window.location.hash, count)]?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [count]);

  // The section at least 55 percent in view becomes current.
  useEffect(() => {
    const els = sections();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.55) {
            const i = els.indexOf(e.target as HTMLElement);
            if (i >= 0) {
              setActive(i);
              if (pending.current === i) pending.current = null;
            }
          }
        }
      },
      { threshold: [0.55] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [count]);

  // Keep the address in step, without adding history entries.
  useEffect(() => {
    const hash = `#/${active + 1}`;
    if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
  }, [active]);

  const go = useCallback(
    (next: number) => {
      const i = Math.max(0, Math.min(count - 1, next));
      pending.current = i;
      sections()[i]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    },
    [count, reducedMotion],
  );

  // A typed or pasted #/n scrolls to that section.
  useEffect(() => {
    const onHash = () => go(parse(window.location.hash, count));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [count, go]);

  /** Where a key press counts from: the section being glided to, if any. */
  const base = useCallback(() => pending.current ?? active, [active]);

  return [active, go, base];
}
