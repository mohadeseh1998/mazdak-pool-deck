import { Plain, reveal, SlideFrame } from "../../shared/kit";
import { problemSlide as c } from "../content/slides";

/** One headline, two problems in silt, one line that sets up the answer. */
export function ProblemSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="g2-problem">
      <h2 className="g2-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="g2-cards">
        {c.cards.map((card, i) => (
          <div key={card.heading} className="g2-card card--silt" {...reveal(3 + i * 0.8)}>
            <h3 className="g2-card__title">{card.heading}</h3>
            <p className="g2-card__body">
              <Plain text={card.body} />
            </p>
          </div>
        ))}
      </div>
      <p className="g2-line" {...reveal(5.4)}>
        <Plain text={c.bottom} />
      </p>
    </SlideFrame>
  );
}
