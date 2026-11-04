import { assets } from "../content/assets";
import { liveSlide as c } from "../content/slides";
import { DemoTimer } from "../components/DemoTimer";
import { ZoomImage } from "../components/Lightbox";
import { reveal } from "../components/reveal";
import { Square } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

/** The signature section: the timer is the hero, the beakers are on the table. */
export function LiveTestSlide({ index }: { index: number }) {
  const photo = assets.jarTest;
  return (
    <SlideFrame slide={c} index={index} className={`live${photo ? "" : " live--solo"}`}>
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="live__grid">
        <div className="live__main">
          <div {...reveal(2.2, "clear")}>
            <DemoTimer variant="hero" />
          </div>
          <ul className="live__beakers">
            {c.beakers.map((b, i) => (
              <li key={b.name} {...reveal(4 + i * 0.6)}>
                <Square tone={b.tone} />
                <span>
                  <strong>{b.name}</strong> {b.text}
                </span>
              </li>
            ))}
          </ul>
          <ol className="live__steps">
            {c.steps.map((s, i) => (
              <li key={s} {...reveal(5.4 + i * 0.6)}>
                <span className="live__num" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
        {photo && (
          <figure className="live__photo">
            <ZoomImage className="live__img pop" src={photo} alt={c.photo.alt} caption={c.photo.caption} />
            <figcaption className="t-caption" {...reveal(5)}>
              {c.photo.caption}
            </figcaption>
          </figure>
        )}
      </div>
      <p className="live__unb" {...reveal(7.5)}>
        {c.unb}
      </p>
    </SlideFrame>
  );
}
