import { PageShell } from "../shared/PageShell";
import { slides, ui } from "./content/slides";
import { SaleSection } from "./sections/01Sale";
import { SeasonsSection } from "./sections/02Seasons";
import { QuestionsSection } from "./sections/03Questions";

/** The pool line financials for the mentor: one package, three seasons, her two questions. */
export function App() {
  return (
    <PageShell slides={slides} ui={ui}>
      <SaleSection index={0} />
      <SeasonsSection index={1} />
      <QuestionsSection index={2} />
    </PageShell>
  );
}
