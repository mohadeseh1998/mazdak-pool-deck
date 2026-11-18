import { Plain, reveal, RichText, SlideFrame } from "../../shared/kit";
import { roadmapSlide as c } from "../content/slides";

/**
 * The most important slide: five numbered points on one rail, left to right
 * (top to bottom on a phone). The whole timeline carries one assumption tag,
 * set at the end of the rail.
 */
export function RoadmapSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="g2-road">
      <h2 className="g2-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="g2-road__track">
        <div className="g2-road__rail" aria-hidden="true" />
        <span className="g2-road__tag" {...reveal(3)}>
          <RichText value={c.plan} />
        </span>
        <ol className="g2-road__steps">
          {c.steps.map((s, i) => (
            <li key={s.when} className="g2-road__step" {...reveal(3 + i * 0.9)}>
              <span className="g2-road__num" aria-hidden="true">
                {i + 1}
              </span>
              <p className="g2-road__when">{s.when}</p>
              <p className="g2-road__what">
                <Plain text={s.what} />
              </p>
            </li>
          ))}
        </ol>
      </div>
      <p className="g2-line g2-road__then" {...reveal(8.2)}>
        {c.then}
      </p>
    </SlideFrame>
  );
}
