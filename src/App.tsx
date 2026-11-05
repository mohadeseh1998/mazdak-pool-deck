import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DeckContext, type DeckState, type LightboxImage } from "./components/DeckContext";
import { Lightbox } from "./components/Lightbox";
import { PresenterNotes } from "./components/PresenterNotes";
import { ProgressRail } from "./components/ProgressRail";
import { SourcesOverlay } from "./components/SourcesOverlay";
import { useStageScale } from "./components/Stage";
import { TopBar } from "./components/TopBar";
import { slides, SLIDE_COUNT, ui } from "./content/slides";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useVerticalDeck } from "./hooks/useVerticalDeck";
import { TitleSlide } from "./slides/01Title";
import { ProblemSlide } from "./slides/02Problem";
import { AnswerSlide } from "./slides/03Answer";
import { VideoSlide } from "./slides/04Video";
import { IronSlide } from "./slides/05Iron";
import { PriceSlide } from "./slides/06Price";
import { TeamSlide } from "./slides/07Team";
import { AskSlide } from "./slides/08Ask";
import { LiveSlide } from "./slides/09Live";

const CONTROLS_MS = 2500;

/** Wheel distance that counts as an intent to move, and the pause that ends a gesture. */
const WHEEL_STEP = 40;
const WHEEL_QUIET_MS = 180;
const WHEEL_LOCK_MS = 700;

/** Keys a browser would use to scroll the page. Space is left to buttons. */
const PAGE_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"]);

/**
 * One vertical page of nine full-screen sections. Same keys as the Gate 1 deck:
 * arrows, Space, Page Up and Down, Home, End; A audit, N notes, S sources. Notes, sources and the pager sit in a fixed layer on top.
 */
export function App() {
  const scale = useStageScale();
  const reduced = useReducedMotion();
  const [active, go, base] = useVerticalDeck(SLIDE_COUNT, reduced);
  // All of this lives in memory only: no browser storage.
  const [audit, setAudit] = useState(false);
  const [notes, setNotes] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  // Deck version 2 shows no demo timer, so it never starts. The shared top bar
  // still reads this, for the pages that do have a timer.
  const timerStart = null;
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);
  const [controls, setControls] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const controlsTimer = useRef<number>();

  const openLightbox = useCallback((image: LightboxImage, el: HTMLElement) => {
    trigger.current = el;
    setLightbox(image);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    const el = trigger.current;
    trigger.current = null;
    // Return focus to the image that opened it.
    window.requestAnimationFrame(() => el?.focus({ preventScroll: true }));
  }, []);

  const stageEl = useCallback(() => document.querySelector<HTMLElement>(".slide.is-active .canvas"), []);

  const deck = useMemo<DeckState>(
    () => ({ active, audit, notes, go, openLightbox, stageEl, scale, timerStart }),
    [active, audit, notes, go, openLightbox, stageEl, scale, timerStart],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      if (lightbox) return; // the dialog handles its own keys

      const target = e.target as HTMLElement | null;
      // Keys pressed inside the video panel belong to the player, never to the deck.
      if (target?.closest?.("[data-keytrap]")) {
        if (e.key === "Escape") {
          e.preventDefault();
          (document.activeElement as HTMLElement | null)?.blur();
        } else if (PAGE_KEYS.has(e.key) && target.tagName !== "VIDEO") {
          // Nor may they scroll the page natively. The native video player
          // keeps its own arrow keys for seeking and volume.
          e.preventDefault();
        }
        return;
      }
      const onControl = !!target?.closest?.("button, a, [tabindex]");

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          go(base() + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          go(base() - 1);
          break;
        case " ":
          if (onControl) return; // Space activates the focused button instead
          e.preventDefault();
          go(base() + (e.shiftKey ? -1 : 1));
          break;
        case "Home":
          e.preventDefault();
          go(0);
          break;
        case "End":
          e.preventDefault();
          go(SLIDE_COUNT - 1);
          break;
        case "a":
        case "A":
          setAudit((v) => !v);
          break;
        case "n":
        case "N":
          setNotes((v) => !v);
          break;
        case "s":
        case "S":
          setSourcesOpen((v) => !v);
          break;
        case "Escape":
          setSourcesOpen(false);
          setNotes(false);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, base, lightbox]);

  // Mouse wheel and trackpad: one gesture moves exactly one section. A gesture
  // is over once the wheel has been quiet for a moment, so trackpad momentum
  // never skips a section. Overlays that scroll keep their own wheel.
  // The gesture state outlives re-renders, so a section change mid-gesture
  // never resets it.
  const wheel = useRef({ acc: 0, lockedUntil: 0, last: 0, quiet: true });
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || lightbox) return; // pinch zoom, or the image viewer
      if ((e.target as HTMLElement | null)?.closest?.(".sources, .notes")) return;
      e.preventDefault();
      const w = wheel.current;
      const now = performance.now();
      if (now - w.last > WHEEL_QUIET_MS) w.quiet = true;
      w.last = now;
      if (now < w.lockedUntil || !w.quiet) return;
      w.acc += e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
      if (Math.abs(w.acc) < WHEEL_STEP) return;
      go(base() + (w.acc > 0 ? 1 : -1));
      w.acc = 0;
      w.quiet = false;
      w.lockedUntil = now + WHEEL_LOCK_MS;
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [go, base, lightbox]);

  // The pager appears on mouse move and fades after 2.5 seconds.
  useEffect(() => {
    const onMove = () => {
      setControls(true);
      window.clearTimeout(controlsTimer.current);
      controlsTimer.current = window.setTimeout(() => setControls(false), CONTROLS_MS);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const current = slides[active];

  return (
    <DeckContext.Provider value={deck}>
      <TopBar />
      <main className={`deck${audit ? " is-audit" : ""}`} aria-label={ui.deckLabel}>
        <TitleSlide index={0} />
        <ProblemSlide index={1} />
        <AnswerSlide index={2} />
        <VideoSlide index={3} />
        <IronSlide index={4} />
        <PriceSlide index={5} />
        <TeamSlide index={6} />
        <AskSlide index={7} />
        <LiveSlide index={8} />
      </main>

      {/* A fixed layer, scaled like the sections, for what floats above them. */}
      <div className="hud">
        <div className="hud__stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <ProgressRail visible={controls} />
          {notes && <PresenterNotes notes={current.notes} n={current.n} total={SLIDE_COUNT} />}
          {sourcesOpen && <SourcesOverlay />}
        </div>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {ui.announce(current.n, SLIDE_COUNT, current.title)}
      </p>
      <Lightbox image={lightbox} onClose={closeLightbox} />
    </DeckContext.Provider>
  );
}
