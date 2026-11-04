import { SLIDE_COUNT, claimsInDeck, claimsPerSlide, slides, ui } from "../content/slides";
import { useDeck } from "./DeckContext";
import { DemoTimer } from "./DemoTimer";
import { Logo } from "./Logo";

const BAR_H = 56;

/**
 * The frosted bar across the top, like the product bar on an Apple page:
 * the company on the left; on the right the demo timer as a pool-blue pill
 * (the one call to action colour), the audit count and the section number.
 */
export function TopBar() {
  const { active, audit, scale } = useDeck();
  const current = slides[active];
  return (
    <header className="topbar" style={{ height: BAR_H * scale }}>
      <div className="topbar__inner" style={{ transform: `translateX(-50%) scale(${scale})` }}>
        <div className="topbar__start">
          <Logo ground="deep" width={132} className="topbar__logo" />
          {/* The hero carries the name itself. */}
          {current.n !== 1 && <span className="topbar__title">{current.title}</span>}
        </div>
        <div className="topbar__end">
          {audit && <span className="topbar__audit">{ui.auditCount(claimsPerSlide[active], claimsInDeck)}</span>}
          {/* On the live test the timer is the hero, so the pill steps aside. */}
          {current.n !== 6 && <DemoTimer variant="footer" />}
          <span className="topbar__count">{ui.slideOf(current.n, SLIDE_COUNT)}</span>
        </div>
      </div>
    </header>
  );
}
