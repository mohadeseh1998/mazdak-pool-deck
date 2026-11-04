import { reveal, RichText, SlideFrame, Square } from "../../shared/kit";
import { sellSlide as c } from "../content/slides";

/** Four short rows, each with a pool-blue square. */
export function SellSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="c-sell">
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <ul className="c-rows">
        {c.rows.map((r, i) => (
          <li key={r.lead} {...reveal(3 + i * 0.6)}>
            <Square tone="pool" />
            <span className="c-rows__lead">{r.lead}</span>
            <span className="c-rows__text">
              <RichText value={r.text} />
            </span>
          </li>
        ))}
      </ul>
    </SlideFrame>
  );
}
