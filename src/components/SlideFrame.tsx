import { useEffect, useRef, type ReactNode } from "react";
import { SLIDE_COUNT, claimsInDeck, claimsPerSlide, ui, type Slide } from "../content/slides";
import { useDeck } from "./DeckContext";
import { DemoTimer } from "./DemoTimer";
import { Logo } from "./Logo";
import { ProgressRail } from "./ProgressRail";

interface Props {
  slide: Slide;
  index: number;
  children: ReactNode;
}

/** One 1600 by 900 slide: a landmark region with its own 56px footer rail. */
export function SlideFrame({ slide, index, children }: Props) {
  const { active, audit } = useDeck();
  const isActive = active === index;
  const ref = useRef<HTMLElement>(null);

  // Inactive slides leave the tab order and the accessibility tree.
  useEffect(() => {
    if (ref.current) ref.current.inert = !isActive;
  }, [isActive]);

  const isTitle = slide.n === 1;
  const isLive = slide.n === 5;

  return (
    <section
      ref={ref}
      className={`slide ground-${slide.ground} slide--${slide.n}`}
      aria-label={slide.title}
      aria-hidden={!isActive}
      data-slide={slide.n}
    >
      <div className="slide__body">{children}</div>
      <footer className="rail">
        <div className="rail__start">
          {/* Slide 1 carries the large logo on the slide itself. */}
          {!isTitle && <Logo ground={slide.ground} width={150} className="rail__logo" />}
          {!isTitle && <span className="rail__title">{slide.title}</span>}
        </div>
        <div className="rail__end">
          {audit && <span className="rail__audit">{ui.auditCount(claimsPerSlide[index], claimsInDeck)}</span>}
          {!isLive && <DemoTimer variant="footer" />}
          <ProgressRail current={index} />
          <span className="rail__count">{ui.slideOf(slide.n, SLIDE_COUNT)}</span>
        </div>
      </footer>
    </section>
  );
}
