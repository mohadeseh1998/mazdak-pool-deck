import { progressSlide as c } from "../content/slides";
import { RichText, Square } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

export function ProgressSlide({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index}>
      <div className="progress-slide">
        <h2 className="t-headline">{c.headline}</h2>
        <div className="progress-slide__cols">
          <section aria-label={c.done.heading}>
            <h3 className="progress-slide__heading">{c.done.heading}</h3>
            <ul className="checklist">
              {c.done.items.map((item) => (
                <li key={item}>
                  <Square tone="pool" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-label={c.next.heading}>
            <h3 className="progress-slide__heading">{c.next.heading}</h3>
            <ul className="checklist">
              {c.next.items.map((item, i) => (
                <li key={i}>
                  <Square tone="outline" />
                  <span>
                    <RichText value={item} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </SlideFrame>
  );
}
