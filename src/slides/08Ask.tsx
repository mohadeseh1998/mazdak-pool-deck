import { askSlide as c } from "../content/slides";
import { BudgetTable } from "../components/BudgetTable";
import { reveal } from "../components/reveal";
import { RichText, Square } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

export function AskSlide({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index}>
      <div className="ask">
        <h2 className="t-headline ask__headline">
          {c.headline.map((line, i) => (
            <span key={line} {...reveal(i * 1.4, "clear")}>
              {line}
            </span>
          ))}
        </h2>
        <div className="ask__cols">
          <div className="ask__table">
            <BudgetTable />
            <p className="t-caption ask__footnote" {...reveal(8.5)}>
              <RichText value={c.footnote} />
            </p>
          </div>
          <section className="ask__run" aria-label={c.runDoesLabel}>
            <ul className="checklist checklist--run">
              {c.runDoes.map((line, i) => (
                <li key={line} {...reveal(4 + i * 0.6)}>
                  <Square tone="pool" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="ask__foot" {...reveal(9.5)}>
          <p className="ask__other">{c.otherAsks}</p>
          <p className="ask__contact">{c.contact}</p>
        </div>
      </div>
    </SlideFrame>
  );
}
