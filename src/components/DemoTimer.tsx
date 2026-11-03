import { useEffect, useState } from "react";
import { liveSlide, ui } from "../content/slides";
import { useDeck } from "./DeckContext";

/** "m:ss", for example 4:12. */
export function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Whole seconds since `start`, ticking once per second on the second. Each
 * display owns its own tick, so the rest of the deck never re-renders.
 */
function useElapsed(start: number | null): number | null {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (start === null) return;
    setNow(Date.now());
    let timer: number;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      timer = window.setTimeout(tick, 1000 - ((t - start) % 1000) + 5);
    };
    timer = window.setTimeout(tick, 1000 - ((Date.now() - start) % 1000) + 5);
    return () => window.clearTimeout(timer);
  }, [start]);
  if (start === null) return null;
  return Math.max(0, Math.floor((now - start) / 1000));
}

/**
 * The signature interaction (brief Section 7.1). T starts it, T again restarts
 * it, Shift+T stops and hides it. State lives in memory only. Nothing moves but
 * the digits, so reduced motion needs no special case.
 */
export function DemoTimer({ variant }: { variant: "hero" | "footer" }) {
  const { timerStart } = useDeck();
  const elapsed = useElapsed(timerStart);

  if (variant === "footer") {
    if (elapsed === null) return null;
    return (
      <span className="timer-footer">
        {ui.timerFooter} <span className="timer-footer__digits">{formatElapsed(elapsed)}</span>
      </span>
    );
  }

  return (
    <div className="timer" role="timer" aria-label={ui.timerLabel}>
      {elapsed === null ? (
        <p className="timer__figure timer__figure--words">{liveSlide.timerNotStarted}</p>
      ) : (
        <p className="timer__figure">{formatElapsed(elapsed)}</p>
      )}
      <p className="timer__print">{liveSlide.timerPrint}</p>
      <p className="timer__caption">{liveSlide.timerCaption}</p>
    </div>
  );
}
