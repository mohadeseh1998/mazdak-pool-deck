import { askSlide as c } from "../content/slides";
import { BudgetTable } from "../components/BudgetTable";
import { reveal } from "../components/reveal";
import { SlideFrame } from "../components/SlideFrame";

export function AskSlide({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="ask">
      <h2 className="t-headline">
        {c.headline.map((line, i) => (
          <span key={line} className="ask__line" {...reveal(1 + i * 1.4, "clear")}>
            {line}
          </span>
        ))}
      </h2>
      <div className="card card--wide ask__card" {...reveal(3.5)}>
        <BudgetTable />
      </div>
      <p className="ask__does" {...reveal(6.6)}>
        {c.does}
      </p>
      <p className="t-caption ask__footnote" {...reveal(7.2)}>
        {c.footnote}
      </p>
    </SlideFrame>
  );
}
