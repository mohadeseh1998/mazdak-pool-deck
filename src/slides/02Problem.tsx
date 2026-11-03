import { problemSlide as c } from "../content/slides";
import { Plain, RichText } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

export function ProblemSlide({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index}>
      {/* The only visual: one silt band for cloudy water. Restraint. */}
      <div className="problem__band" aria-hidden="true" />
      <div className="problem">
        <h2 className="t-headline">{c.headline}</h2>
        <p className="t-lead problem__lead">
          <Plain text={c.lead} />
        </p>
        <div className="problem__blocks">
          {c.blocks.map((b) => (
            <div key={b.heading} className="problem__block">
              <h3 className="problem__heading">{b.heading}</h3>
              <p className="t-body">
                <Plain text={b.body} />
              </p>
            </div>
          ))}
        </div>
        <div className="problem__foot">
          <p className="problem__focus">
            <Plain text={c.focus} />
          </p>
          <p className="problem__who">
            <RichText value={c.whoBuys} />
          </p>
        </div>
      </div>
    </SlideFrame>
  );
}
