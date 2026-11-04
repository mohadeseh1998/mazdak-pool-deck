import { assets } from "../content/assets";
import { priceFootnote } from "../content/pricing";
import { answerSlide as c } from "../content/slides";
import { ZoomImage } from "../components/Lightbox";
import { PriceStrip } from "../components/PriceStrip";
import { reveal } from "../components/reveal";
import { RichText } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

export function AnswerSlide({ index }: { index: number }) {
  const photo = assets.bottles;
  return (
    <SlideFrame slide={c} index={index}>
      <div className={`answer${photo ? "" : " answer--solo"}`}>
        <h2 className="t-headline" {...reveal(0, "clear")}>
          {c.headline}
        </h2>
        <div className="answer__cols">
          <div className="answer__products">
            {c.products.map((p, i) => (
              <div key={p.id} className="answer__product" {...reveal(2.5 + i)}>
                <h3 className={`answer__name answer__name--${p.tone}`}>{p.heading}</h3>
                <p className="t-body">
                  <RichText value={p.body} />
                </p>
              </div>
            ))}
            <p className="answer__one" {...reveal(4.5)}>
              {c.oneChemistry}
            </p>
          </div>
          {photo && (
            <ZoomImage className="answer__photo" src={photo} alt={c.bottlesAlt} caption={c.headline} />
          )}
          <PriceStrip />
        </div>
        <p className="t-caption answer__foot" {...reveal(9)}>
          {priceFootnote}
        </p>
      </div>
    </SlideFrame>
  );
}
