import { assets } from "../content/assets";
import { liveSlide as c } from "../content/slides";
import { ZoomImage } from "../components/Lightbox";
import { reveal } from "../components/reveal";
import { Square } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

/** Splits before the last sentence, keeping every word and space. */
const splitLast = (text: string): string[] => {
  const at = text.lastIndexOf(". ", text.length - 2);
  return at < 0 ? [text] : [text.slice(0, at + 1), text.slice(at + 2)];
};

/** The close: the beakers on the table, one statement, and thank you. */
export function LiveSlide({ index }: { index: number }) {
  const photo = assets.jarTest;
  return (
    <SlideFrame slide={c} index={index} className={`live${photo ? "" : " live--solo"}`}>
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="live__grid">
        <div className="live__main">
          {/* Two lines: "Same water. Same soil." then "One bottle." */}
          <p className="live__statement" {...reveal(2.2, "clear")}>
            {splitLast(c.statement).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
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
          <p className="live__made" {...reveal(7.4)}>
            {c.madeBy}
          </p>
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
      <p className="live__thanks" {...reveal(8.4)}>
        {c.thanks} <span className="live__contact">{c.contact}</span>
      </p>
    </SlideFrame>
  );
}
