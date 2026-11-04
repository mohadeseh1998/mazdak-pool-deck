import { progressSlide as c } from "../content/slides";
import { reveal } from "../components/reveal";
import { RichText, Square } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

export function ProgressSlide({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="progress-slide">
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="cards cards--2">
        <section className="card" aria-label={c.done.heading} {...reveal(3)}>
          <h3 className="card__title">{c.done.heading}</h3>
          <ul className="checklist">
            {c.done.items.map((item, i) => (
              <li key={item} {...reveal(3.6 + i * 0.35)}>
                <Square tone="pool" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="card" aria-label={c.next.heading} {...reveal(3.6)}>
          <h3 className="card__title">{c.next.heading}</h3>
          <ul className="checklist">
            {c.next.items.map((item, i) => (
              <li key={i} {...reveal(4.2 + i * 0.35)}>
                <Square tone="outline" />
                <span>
                  <RichText value={item} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SlideFrame>
  );
}
