import { reveal, RichText, SlideFrame } from "../../shared/kit";
import { askSlide as c } from "../content/slides";

/** The figure, what it is for, and the second ask: introductions. */
export function AskSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="g2-ask">
      <h2 className="g2-ask__title" {...reveal(1, "clear")}>
        <span className="g2-ask__figure">{c.headline.figure}</span>
        {c.headline.rest}
      </h2>
      <p className="g2-ask__sub" {...reveal(3)}>
        <RichText value={c.sub} />
      </p>
      <div className="g2-ask__rule" aria-hidden="true" {...reveal(4.4)} />
      <p className="g2-ask__big" {...reveal(5, "clear")}>
        {c.big}
      </p>
      <ul className="g2-ask__chips">
        {c.chips.map((chip, i) => (
          <li key={chip} className="g2-chip" {...reveal(6.5 + i * 0.6)}>
            {chip}
          </li>
        ))}
      </ul>
    </SlideFrame>
  );
}
