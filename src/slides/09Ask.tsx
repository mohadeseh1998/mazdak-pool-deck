import { askSlide as c } from "../content/slides";
import { BudgetTable } from "../components/BudgetTable";
import { reveal } from "../components/reveal";
import { RichText } from "../components/RichText";
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
        <p className="t-caption ask__footnote" {...reveal(8.5)}>
          <RichText value={c.footnote} />
        </p>
      </div>
    </SlideFrame>
  );
}
