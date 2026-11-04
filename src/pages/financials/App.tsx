import { useCallback, useMemo, useState } from "react";
import type { ScenarioId } from "../../content/poolModel";
import { PageShell } from "../shared/PageShell";
import { slides, ui } from "./content/slides";
import { ScenarioContext } from "./scenario";
import { SaleSection } from "./sections/01Sale";
import { SeasonsSection } from "./sections/02Seasons";
import { QuestionsSection } from "./sections/03Questions";

/** The pool line financials for the mentor: one sale, three seasons, her two questions. */
export function App() {
  // In memory only: every visit opens on Base.
  const [scenario, setScenario] = useState<ScenarioId>("base");
  const value = useMemo(() => ({ scenario, set: setScenario }), [scenario]);

  // W switches Base and Worst from anywhere on the page.
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.code !== "KeyW" || e.shiftKey) return false;
    e.preventDefault();
    setScenario((s) => (s === "base" ? "worst" : "base"));
    return true;
  }, []);

  return (
    <ScenarioContext.Provider value={value}>
      <PageShell slides={slides} ui={ui} onKey={onKey}>
        <SaleSection index={0} />
        <SeasonsSection index={1} />
        <QuestionsSection index={2} />
      </PageShell>
    </ScenarioContext.Provider>
  );
}
