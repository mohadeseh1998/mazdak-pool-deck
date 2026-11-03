import { useCallback, useEffect, useState } from "react";

/** Reads "#/3" as slide index 2. Anything unreadable falls back to the first slide. */
function parse(hash: string, count: number): number {
  const n = Number.parseInt(hash.replace(/^#\/?/, ""), 10);
  return Number.isFinite(n) && n >= 1 && n <= count ? n - 1 : 0;
}

export function useHash(count: number): [number, (index: number) => void] {
  const [index, setIndex] = useState(() => parse(window.location.hash, count));

  useEffect(() => {
    const onHash = () => setIndex(parse(window.location.hash, count));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [count]);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(count - 1, next));
      setIndex(clamped);
      const hash = `#/${clamped + 1}`;
      if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
    },
    [count],
  );

  return [index, go];
}
