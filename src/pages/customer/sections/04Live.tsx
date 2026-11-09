import { assets } from "../../../content/assets";
import { reveal, SlideFrame, Square, ZoomImage } from "../../shared/kit";
import { liveSlide as c } from "../content/slides";

/** Splits before the last sentence, keeping every word and space. */
const splitLast = (text: string): string[] => {
  const at = text.lastIndexOf(". ", text.length - 2);
  return at < 0 ? [text] : [text.slice(0, at + 1), text.slice(at + 2)];
};

/**
 * The cups on the counter, and one statement in the root deck's large style
 * (its live test, version 2): "Same water. Same soil." then "One bottle."
 */
export function LiveSection({ index }: { index: number }) {
  const photo = assets.jarTest;
  return (
    <SlideFrame slide={c} index={index} className={`live c-live${photo ? "" : " live--solo"}`}>
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="live__grid">
        <div className="live__main">
          <p className="live__statement c-live__statement" {...reveal(2.2, "clear")}>
            {splitLast(c.statement).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <ul className="live__beakers">
            {c.cups.map((b, i) => (
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
    </SlideFrame>
  );
}
