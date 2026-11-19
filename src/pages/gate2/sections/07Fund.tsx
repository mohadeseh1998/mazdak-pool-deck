import { reveal, RichText, SlideFrame } from "../../shared/kit";
import { fundSlide as c } from "../content/slides";

/** Founder-funded: the capital already in, the total by early 2027, then the one thing we ask for. */
export function FundSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="g2-fund">
      <h2 className="g2-headline g2-headline--sm" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <p className="g2-fund__figure" {...reveal(2.6, "clear")}>
        {c.figure}
      </p>
      <p className="g2-fund__label" {...reveal(3.4)}>
        {c.figureLabel}
      </p>
      <p className="g2-fund__more" {...reveal(4.4)}>
        <RichText value={c.more} />
      </p>
      <p className="g2-fund__mentor" {...reveal(5.2)}>
        {c.mentor}
      </p>
      <div className="g2-fund__rule" aria-hidden="true" {...reveal(6)} />
      <p className="g2-fund__big" {...reveal(6.6, "clear")}>
        {c.big}
      </p>
      <ul className="g2-fund__chips">
        {c.chips.map((chip, i) => (
          <li key={chip} className="g2-chip" {...reveal(7.8 + i * 0.6)}>
            {chip}
          </li>
        ))}
      </ul>
    </SlideFrame>
  );
}
