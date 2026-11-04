import { reveal, RichText, SlideFrame, Square } from "../../shared/kit";
import { problemSlide as c } from "../content/slides";

/** Three short lines, each marked silt: silt is cloudy water, the problem. */
export function ProblemSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="c-problem">
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <ul className="c-lines">
        {c.lines.map((l, i) => (
          <li key={l.lead} {...reveal(3 + i * 0.8)}>
            <Square tone="silt" />
            <p>
              <strong>{l.lead}</strong> <RichText value={l.text} />
            </p>
          </li>
        ))}
      </ul>
      <p className="c-small" {...reveal(6)}>
        <RichText value={c.market} />
      </p>
    </SlideFrame>
  );
}
