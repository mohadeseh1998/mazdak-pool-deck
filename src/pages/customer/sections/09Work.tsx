import { reveal, RichText, SlideFrame } from "../../shared/kit";
import { workSlide as c } from "../content/slides";

/** The offer, set large; three quieter questions; who to call. */
export function WorkSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="c-work">
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <p className="c-work__offer" {...reveal(2.6)}>
        <RichText value={c.offer} />
      </p>
      <div className="c-work__help" {...reveal(4.4)}>
        <h3 className="c-work__heading">{c.helpHeading}</h3>
        <ul className="c-work__questions">
          {c.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>
      <p className="c-work__contact" {...reveal(6)}>
        <span className="tone-pool">{c.site}</span>
        <span className="c-work__founder">{c.founder}</span>
      </p>
    </SlideFrame>
  );
}
