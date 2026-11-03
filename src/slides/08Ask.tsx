import { askSlide as c } from "../content/slides";
import { BudgetTable } from "../components/BudgetTable";
import { RichText, Square } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

export function AskSlide({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index}>
      <div className="ask">
        <h2 className="t-headline ask__headline">
          {c.headline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <div className="ask__cols">
          <div className="ask__table">
            <BudgetTable />
            <p className="t-caption ask__footnote">
              <RichText value={c.footnote} />
            </p>
          </div>
          <section className="ask__run" aria-label={c.runDoesLabel}>
            <ul className="checklist checklist--run">
              {c.runDoes.map((line) => (
                <li key={line}>
                  <Square tone="pool" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="ask__foot">
          <p className="ask__other">{c.otherAsks}</p>
          <p className="ask__contact">{c.contact}</p>
        </div>
      </div>
    </SlideFrame>
  );
}
