import { assets } from "../content/assets";
import { answerSlide as c } from "../content/slides";
import { ZoomImage } from "../components/Lightbox";
import { reveal } from "../components/reveal";
import { RichText } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

/** Product on a pedestal between its two descriptions, each in its cap colour. */
export function AnswerSlide({ index }: { index: number }) {
  const thumb = assets.bottlesCutout ?? assets.bottles;
  const [clarifier, antiAlgae] = c.products;
  const card = (p: typeof clarifier | typeof antiAlgae, beat: number) => (
    <div className={`card card--${p.tone}`} {...reveal(beat)}>
      <h3 className={`card__title tone-${p.tone}`}>{p.heading}</h3>
      <p className="card__body">
        <RichText value={p.body} />
      </p>
    </div>
  );
  return (
    <SlideFrame slide={c} index={index} className={`answer${thumb ? "" : " answer--solo"}`}>
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="answer__stage">
        {card(clarifier, 3.5)}
        {thumb && assets.bottles && (
          <div className={`answer__product${assets.bottlesCutout ? " is-floating" : ""}`}>
            <ZoomImage src={assets.bottles} thumb={thumb} alt={c.bottlesAlt} caption={c.headline} className="pop" />
          </div>
        )}
        {card(antiAlgae, 4.3)}
      </div>
      <p className="answer__one" {...reveal(6)}>
        {c.oneChemistry}
      </p>
    </SlideFrame>
  );
}
