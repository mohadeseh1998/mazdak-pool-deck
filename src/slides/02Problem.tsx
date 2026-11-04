import { problemSlide as c } from "../content/slides";
import { reveal } from "../components/reveal";
import { Plain, RichText } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

export function ProblemSlide({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="problem">
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <p className="t-lead" {...reveal(2.5)}>
        <Plain text={c.lead} />
      </p>
      {/* Two cards, each with a silt rule: silt means cloudy water, the problem. */}
      <div className="cards cards--2">
        {c.blocks.map((b, i) => (
          <div key={b.heading} className="card card--silt" {...reveal(4 + i * 0.8)}>
            <h3 className="card__title">{b.heading}</h3>
            <p className="card__body">
              <Plain text={b.body} />
            </p>
          </div>
        ))}
      </div>
      <p className="problem__focus" {...reveal(6.5)}>
        <Plain text={c.focus} />
      </p>
      <p className="problem__who" {...reveal(7.3)}>
        <RichText value={c.whoBuys} />
      </p>
    </SlideFrame>
  );
}
