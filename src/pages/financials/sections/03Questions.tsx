import { reveal, SlideFrame } from "../../shared/kit";
import { questionsSlide as c } from "../content/slides";

/** The mentor's two questions, one card each: a real sequence, and what holds us back. */
export function QuestionsSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="f-questions">
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="f-questions__cards">
        <div className="card card--pool" {...reveal(3)}>
          <h3 className="card__title">{c.first.heading}</h3>
          <ol className="f-steps">
            {c.first.steps.map((s, i) => (
              <li key={i}>
                <span className="f-steps__num" aria-hidden="true">
                  {i + 1}
                </span>
                <span>
                  {s.text}
                  {"small" in s && <small className="f-steps__small">{s.small}</small>}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="card card--silt" {...reveal(3.8)}>
          <h3 className="card__title">{c.holding.heading}</h3>
          <ul className="f-holding">
            {c.holding.items.map((item) => (
              <li key={item.lead}>
                <strong>{item.lead}</strong> {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideFrame>
  );
}
