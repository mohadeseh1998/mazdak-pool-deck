import { SLIDE_COUNT, slides, ui } from "../content/slides";
import { useDeck } from "./DeckContext";

/**
 * The pager: a frosted pill of dots, the current one stretched into a pool-blue
 * bar, beside round previous and next buttons, as on Apple's highlight reels.
 * It appears when the mouse moves and fades after 2.5 seconds.
 */
export function ProgressRail({ visible }: { visible: boolean }) {
  const { go, active } = useDeck();
  return (
    <div className={`pager${visible ? " is-visible" : ""}`}>
      <nav className="pager__dots" aria-label="Sections">
        {slides.map((s, i) => (
          <button
            key={s.n}
            type="button"
            className={`pager__dot${i === active ? " is-current" : ""}`}
            aria-label={ui.goTo(s.n, s.title)}
            aria-current={i === active ? "step" : undefined}
            onClick={() => go(i)}
          />
        ))}
      </nav>
      <button type="button" className="pager__btn" aria-label={ui.prev} disabled={active === 0} onClick={() => go(active - 1)}>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M3 11.5 L9 5.5 L15 11.5" />
        </svg>
      </button>
      <button
        type="button"
        className="pager__btn"
        aria-label={ui.next}
        disabled={active === SLIDE_COUNT - 1}
        onClick={() => go(active + 1)}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M3 6.5 L9 12.5 L15 6.5" />
        </svg>
      </button>
    </div>
  );
}
