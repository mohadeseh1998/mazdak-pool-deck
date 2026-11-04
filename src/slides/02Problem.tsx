import { problemSlide as c } from "../content/slides";
import { reveal } from "../components/reveal";
import { Plain, RichText } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

export function ProblemSlide({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index}>
      {/* The only visual: one silt band for cloudy water. It settles in from the top. */}
      <div className="problem__band" aria-hidden="true" />
      <div className="problem">
        <h2 className="t-headline" {...reveal(0, "clear")}>
          {c.headline}
        </h2>
        <p className="t-lead problem__lead" {...reveal(2)}>
          <Plain text={c.lead} />
        </p>
        <div className="problem__blocks">
          {c.blocks.map((b, i) => (
            <div key={b.heading} className="problem__block" {...reveal(3.5 + i)}>
              <h3 className="problem__heading">{b.heading}</h3>
              <p className="t-body">
                <Plain text={b.body} />
              </p>
            </div>
          ))}
        </div>
        <div className="problem__foot">
          <p className="problem__focus" {...reveal(6)}>
            <Plain text={c.focus} />
          </p>
          <p className="problem__who" {...reveal(7)}>
            <RichText value={c.whoBuys} />
          </p>
        </div>
      </div>
    </SlideFrame>
  );
}
