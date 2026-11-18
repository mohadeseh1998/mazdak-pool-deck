import { assets } from "../../../content/assets";
import { Plain, reveal, RichText, SlideFrame, ZoomImage } from "../../shared/kit";
import { answerSlide as c } from "../content/slides";

/** The product between its two descriptions, each in its cap colour; then the pack and its price. */
export function AnswerSection({ index }: { index: number }) {
  const thumb = assets.bottlesCutout ?? assets.bottles;
  const [clarifier, antiAlgae] = c.products;
  const card = (p: typeof clarifier | typeof antiAlgae, beat: number) => (
    <div className={`g2-card card--${p.tone}`} {...reveal(beat)}>
      <h3 className={`g2-card__title tone-${p.tone}`}>
        <Plain text={p.heading} />
      </h3>
      <p className="g2-card__body">
        <Plain text={p.body} />
      </p>
    </div>
  );
  return (
    <SlideFrame slide={c} index={index} className="g2-answer">
      <h2 className="g2-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className={`g2-answer__stage${thumb ? "" : " is-solo"}`}>
        {card(clarifier, 3.5)}
        {thumb && assets.bottles && (
          <div className={`g2-answer__product${assets.bottlesCutout ? " is-floating" : ""}`}>
            <ZoomImage src={assets.bottles} thumb={thumb} alt={c.bottlesAlt} caption={c.headline} className="pop" />
          </div>
        )}
        {card(antiAlgae, 4.3)}
      </div>
      <p className="g2-answer__price" {...reveal(6)}>
        <RichText value={c.price} />
      </p>
      <p className="g2-small g2-answer__bonus" {...reveal(7)}>
        <RichText value={c.bonus} />
      </p>
    </SlideFrame>
  );
}
