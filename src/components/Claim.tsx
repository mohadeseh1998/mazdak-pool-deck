import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { claims, type ClaimId } from "../content/claims";
import { ui } from "../content/slides";
import { useDeck } from "./DeckContext";
import { STAGE_H, STAGE_W } from "./Stage";

const CARD_W = 320;
const EDGE = 24;
const FOOTER = 56;

interface Props {
  id: ClaimId;
  children: ReactNode;
  /** Plain text after the tag, for example a note in the presenter script. */
  after?: string;
}

/**
 * An [assumption], reused from the Gate 1 deck (brief Section 6): dashed
 * underline plus a bracketed tag in caution yellow. Hover or keyboard focus
 * opens a 320px card saying how the claim gets proven. Audit mode (A) fills it.
 */
export function Claim({ id, children, after }: Props) {
  const { scale, active } = useDeck();
  const cardId = useId();
  const tagRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number; above: boolean } | null>(null);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  // Close any open card when the slide changes.
  useEffect(() => setOpen(false), [active]);

  useLayoutEffect(() => {
    if (!open) return;
    const tag = tagRef.current;
    const stage = tag?.closest<HTMLElement>(".canvas, .hud__stage");
    if (!stage || !tag) return;
    const s = stage.getBoundingClientRect();
    const r = tag.getBoundingClientRect();
    // The canvas's real scale: its drawn width over its layout width. On a
    // scaled 1600 by 900 canvas this equals the deck scale; on a phone, where
    // the canvas is laid out unscaled, it is 1.
    const k = stage.offsetWidth ? s.width / stage.offsetWidth : scale;
    const w = stage.offsetWidth || STAGE_W;
    const h = stage.offsetHeight || STAGE_H;
    const left = (r.left - s.left) / k;
    const top = (r.top - s.top) / k;
    const bottom = (r.bottom - s.top) / k;
    const x = Math.max(EDGE, Math.min(w - EDGE - Math.min(CARD_W, w - 2 * EDGE), left - 12));
    const below = bottom + 10;
    const above = below + 110 > h - FOOTER;
    setPos({ x, y: above ? top - 10 : below, above });
  }, [open, scale]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const stage = open ? tagRef.current?.closest<HTMLElement>(".canvas, .hud__stage") ?? null : null;
  const card =
    stage && pos
      ? createPortal(
          <div
            id={cardId}
            role="tooltip"
            className={`claim-card${pos.above ? " claim-card--above" : ""}`}
            style={{ left: pos.x, top: pos.y, width: CARD_W, maxWidth: "calc(100% - 48px)" }}
          >
            {/* A claim may carry its own complete line, with no lead. */}
            {!(claims[id] as { ownLead?: boolean }).ownLead && <span className="claim-card__lead">{ui.proofLead} </span>}
            {claims[id].proof}
          </div>,
          stage,
        )
      : null;

  return (
    <span
      className="claim claim--assume"
      tabIndex={0}
      aria-describedby={open ? cardId : undefined}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      data-claim={id}
    >
      <span className="claim__text">{children}</span>{" "}
      <span ref={tagRef} className="claim__tag">
        {ui.assumptionTag}
      </span>
      {after && <> {after}</>}
      {card}
    </span>
  );
}
