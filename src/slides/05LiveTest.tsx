import { assets } from "../content/assets";
import { liveSlide as c } from "../content/slides";
import { DemoTimer } from "../components/DemoTimer";
import { ZoomImage } from "../components/Lightbox";
import { reveal } from "../components/reveal";
import { Square } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

/** The signature slide: the timer is the hero, the beakers are on the table. */
export function LiveTestSlide({ index }: { index: number }) {
  const photo = assets.jarTest;
  return (
    <SlideFrame slide={c} index={index}>
      <div className={`live${photo ? "" : " live--solo"}`}>
        <div className="live__main">
          <h2 className="t-headline" {...reveal(0, "clear")}>
            {c.headline}
          </h2>
          <div {...reveal(1.5, "clear")}>
            <DemoTimer variant="hero" />
          </div>
          <ul className="live__beakers">
            {c.beakers.map((b, i) => (
              <li key={b.name} {...reveal(3.5 + i * 0.6)}>
                <Square tone={b.tone} />
                <span>
                  <strong>{b.name}</strong> {b.text}
                </span>
              </li>
            ))}
          </ul>
          <ol className="live__steps">
            {c.steps.map((s, i) => (
              <li key={s} {...reveal(5 + i * 0.6)}>
                <span className="live__num" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <p className="live__unb" {...reveal(7.5)}>
            {c.unb}
          </p>
        </div>
        {photo && (
          <figure className="live__photo">
            <ZoomImage className="live__img" src={photo} alt={c.photo.alt} caption={c.photo.caption} />
            <figcaption className="t-caption" {...reveal(5)}>
              {c.photo.caption}
            </figcaption>
          </figure>
        )}
      </div>
    </SlideFrame>
  );
}
