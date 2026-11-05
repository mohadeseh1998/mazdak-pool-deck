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

  // The current section is the one filling most of the screen: at least 55
  // percent of itself, or, for a section taller than the screen (a phone
  // layout), at least half of the screen.
  useEffect(() => {
    const els = sections();
    const visible = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target, e.isIntersecting ? e.intersectionRect.height : 0);
        let best = -1;
        let bestPx = 0;
        els.forEach((el, i) => {
          const px = visible.get(el) ?? 0;
          if (px > bestPx) {
            best = i;
            bestPx = px;
          }
        });
        if (best < 0) return;
        const el = els[best];
        const filled = bestPx / Math.max(1, el.getBoundingClientRect().height) >= 0.55 || bestPx >= window.innerHeight * 0.5;
        if (!filled) return;
        setActive(best);
        if (pending.current === best) pending.current = null;
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.55, 0.6, 0.7, 0.8, 0.9, 1] },
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
