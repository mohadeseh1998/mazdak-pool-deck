import { assets } from "../../../content/assets";
import { reveal, SlideFrame, Square, ZoomImage } from "../../shared/kit";
import { liveSlide as c } from "../content/slides";

/** Splits before the last sentence, keeping every word. */
const splitLast = (text: string): string[] => {
  const at = text.lastIndexOf(". ", text.length - 2);
  return at < 0 ? [text] : [text.slice(0, at + 1), text.slice(at + 2)];
};

/** The close: the beakers on the table, one statement, three numbered lines, thank you. */
export function LiveSection({ index }: { index: number }) {
  const photo = assets.jarTest;
  return (
    <SlideFrame slide={c} index={index} className="g2-live">
      <div className={`g2-live__grid${photo ? "" : " is-solo"}`}>
        <div className="g2-live__main">
          <h2 className="g2-headline g2-live__title" {...reveal(1, "clear")}>
            {c.headline}
          </h2>
          <p className="g2-live__statement" {...reveal(2.4, "clear")}>
            {splitLast(c.statement).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <ul className="g2-live__beakers">
            {c.beakers.map((b, i) => (
              <li key={b.name} {...reveal(4 + i * 0.6)}>
                <Square tone={b.tone} />
                <span>
                  <strong>{b.name}</strong> {b.text}
                </span>
              </li>
            ))}
          </ul>
          <ol className="g2-live__steps">
            {c.steps.map((s, i) => (
              <li key={s} {...reveal(5.6 + i * 0.6)}>
                <span className="g2-live__num">{i + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
        {photo && (
          <figure className="g2-live__photo">
            <ZoomImage className="g2-live__img pop" src={photo} alt={c.photo.alt} caption={c.photo.caption} />
            <figcaption className="g2-foot" {...reveal(5)}>
              {c.photo.caption}
            </figcaption>
          </figure>
        )}
      </div>
      <p className="g2-live__thanks" {...reveal(8)}>
        {c.thanks} <span className="g2-live__contact">{c.contact}</span>
      </p>
    </SlideFrame>
  );
}
