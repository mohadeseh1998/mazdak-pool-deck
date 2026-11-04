import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DeckContext, type DeckState, type LightboxImage } from "../../components/DeckContext";
import { Lightbox } from "../../components/Lightbox";
import { ProgressRail } from "../../components/ProgressRail";
import { SourcesOverlay } from "../../components/SourcesOverlay";
import { useStageScale } from "../../components/Stage";
import { TopBar } from "../../components/TopBar";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useVerticalDeck } from "../../hooks/useVerticalDeck";
import { PresenterNotes } from "./kit";
import type { PageSlide, PageUi } from "./types";

const CONTROLS_MS = 2500;

/** Wheel distance that counts as an intent to move, and the pause that ends a gesture. */
const WHEEL_STEP = 40;
const WHEEL_QUIET_MS = 180;
const WHEEL_LOCK_MS = 700;

/** Keys a browser would use to scroll the page. Space is left to buttons. */
const PAGE_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"]);

interface Props {
  slides: readonly PageSlide[];
  ui: PageUi;
  /** T starts the demo timer (the customer pitch). */
  timer?: boolean;
  /** A page's own keys, tried first. Return true when the key was used. */
  onKey?: (e: KeyboardEvent) => boolean;
  /** A page's own dialog is open (the video): the page leaves keys and the wheel alone. */
  modalOpen?: boolean;
  children: ReactNode;
}

/**
 * The root deck's frame, for the other pages: one vertical page of full-screen
 * sections with the same keys and the same floating layer. Arrows, Space,
 * Page Up and Down, Home, End; A audit, N notes, S sources, T demo timer.
 * The root page keeps its own App.tsx untouched; this is the same behaviour,
 * fed by a page's own sections.
 */
export function PageShell({ slides, ui, timer = false, onKey: pageKey, modalOpen = false, children }: Props) {
  const count = slides.length;
  const scale = useStageScale();
  const reduced = useReducedMotion();
  const [active, go, base] = useVerticalDeck(count, reduced);
  // All of this lives in memory only: no browser storage.
  const [audit, setAudit] = useState(false);
  const [notes, setNotes] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [timerStart, setTimerStart] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);
  const [controls, setControls] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const controlsTimer = useRef<number>();
  const blocked = !!lightbox || modalOpen;

  const openLightbox = useCallback((image: LightboxImage, el: HTMLElement) => {
    trigger.current = el;
    setLightbox(image);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    const el = trigger.current;
    trigger.current = null;
    window.requestAnimationFrame(() => el?.focus({ preventScroll: true }));
  }, []);

  const stageEl = useCallback(() => document.querySelector<HTMLElement>(".slide.is-active .canvas"), []);

  const deck = useMemo<DeckState>(
    () => ({ active, audit, notes, go, openLightbox, stageEl, scale, timerStart }),
    [active, audit, notes, go, openLightbox, stageEl, scale, timerStart],
  );

  // Page styles can follow the current section (for example, to hide a pill).
  useEffect(() => {
    document.documentElement.dataset.section = String(slides[active].n);
  }, [active, slides]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      if (blocked) return; // the dialog handles its own keys

      const target = e.target as HTMLElement | null;
      if (target?.closest?.("[data-keytrap]")) {
        if (e.key === "Escape") {
          e.preventDefault();
          (document.activeElement as HTMLElement | null)?.blur();
        } else if (PAGE_KEYS.has(e.key) && target.tagName !== "VIDEO") {
          e.preventDefault();
        }
        return;
      }
      const onControl = !!target?.closest?.("button, a, [tabindex]");

      if (pageKey?.(e)) return;

      if (timer && e.code === "KeyT") {
        e.preventDefault();
        setTimerStart(e.shiftKey ? null : Date.now());
        return;
      }

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
          if (onControl) return;
          e.preventDefault();
          go(base() + (e.shiftKey ? -1 : 1));
          break;
        case "Home":
          e.preventDefault();
          go(0);
          break;
        case "End":
          e.preventDefault();
          go(count - 1);
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
  }, [go, base, blocked, pageKey, timer, count]);

  // Mouse wheel and trackpad: one gesture moves exactly one section.
  const wheel = useRef({ acc: 0, lockedUntil: 0, last: 0, quiet: true });
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || blocked) return;
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
  }, [go, base, blocked]);

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
        {children}
      </main>

      <div className="hud">
        <div className="hud__stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <ProgressRail visible={controls} />
          {notes && <PresenterNotes notes={current.notes} n={current.n} total={count} />}
          {sourcesOpen && <SourcesOverlay />}
        </div>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {ui.announce(current.n, count, current.title)}
      </p>
      <Lightbox image={lightbox} onClose={closeLightbox} />
    </DeckContext.Provider>
  );
}
