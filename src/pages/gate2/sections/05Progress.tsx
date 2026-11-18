import { Plain, reveal, RichText, SlideFrame } from "../../shared/kit";
import { progressSlide as c } from "../content/slides";

/** A pool-blue check for what is done. */
function Check() {
  return (
    <span className="g2-check" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 20 20">
        <path d="M4.5 10.5 L8.5 14.5 L15.5 6" />
      </svg>
    </span>
  );
}

/** Five things done since Gate 1, one by one; one new lead, marked as unproven. */
export function ProgressSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="g2-progress">
      <h2 className="g2-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="g2-progress__grid">
        <ul className="g2-progress__done" aria-label="Done since Gate 1">
          {c.done.map((line, i) => (
            <li key={line} {...reveal(3 + i * 1.2)}>
              <Check />
              <span>
                <Plain text={line} />
              </span>
            </li>
          ))}
        </ul>
        <aside className="g2-lead" {...reveal(9.6)}>
          <h3 className="g2-lead__title">{c.lead.heading}</h3>
          <p className="g2-lead__body">
            <RichText value={c.lead.body} />
          </p>
        </aside>
      </div>
      <p className="g2-foot g2-progress__foot" {...reveal(10.6)}>
        {c.footer}
      </p>
    </SlideFrame>
  );
}
