import { assets } from "../../../content/assets";
import { reveal, SlideFrame, Square, ZoomImage } from "../../shared/kit";
import { resultsSlide as c } from "../content/slides";

/** Splits before the last sentence, keeping every word. */
const splitLast = (text: string): string[] => {
  const at = text.lastIndexOf(". ", text.length - 2);
  return at < 0 ? [text] : [text.slice(0, at + 1), text.slice(at + 2)];
};

/** The close: the result we already showed, the jar test photo large, thank you. */
export function ResultsSection({ index }: { index: number }) {
  const photo = assets.jarTest;
  const [first, last] = splitLast(c.headline);
  return (
    <SlideFrame slide={c} index={index} className="g2-results">
      <div className={`g2-results__grid${photo ? "" : " is-solo"}`}>
        <div className="g2-results__main">
          <h2 className="g2-headline g2-results__title" {...reveal(1, "clear")}>
            <span>{first}</span>
            {last && <span className="g2-results__last">{last}</span>}
          </h2>
          <ul className="g2-results__jars">
            {c.jars.map((b, i) => (
              <li key={b.name} {...reveal(3.4 + i * 0.6)}>
                <Square tone={b.tone} />
                <span>
                  <strong>{b.name}</strong> {b.text}
                </span>
              </li>
            ))}
          </ul>
          <ol className="g2-results__steps">
            {c.steps.map((s, i) => (
              <li key={s} {...reveal(5 + i * 0.6)}>
                <span className="g2-results__num">{i + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
        {photo && (
          <figure className="g2-results__photo">
            <ZoomImage className="g2-results__img pop" src={photo} alt={c.photo.alt} caption={c.photo.caption} />
            <figcaption className="g2-foot" {...reveal(5)}>
              {c.photo.caption}
            </figcaption>
          </figure>
        )}
      </div>
      <p className="g2-results__thanks" {...reveal(7.4)}>
        {c.thanks} <span className="g2-results__contact">{c.contact}</span>
      </p>
    </SlideFrame>
  );
}
