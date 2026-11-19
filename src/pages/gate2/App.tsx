import { useCallback } from "react";
import { PageShell } from "../shared/PageShell";
import { slides, ui } from "./content/slides";
import { TitleSection } from "./sections/01Title";
import { ProblemSection } from "./sections/02Problem";
import { AnswerSection } from "./sections/03Answer";
import { VideoSection } from "./sections/04Video";
import { ProgressSection } from "./sections/05Progress";
import { RoadmapSection } from "./sections/06Roadmap";
import { FundSection } from "./sections/07Fund";
import { RecognitionSection } from "./sections/08Recognition";
import { ResultsSection } from "./sections/09Results";

/** Presenter notes (key N) open with the slide's target time. */
const withTimes = slides.map((s) => ({ ...s, notes: [`Target time ${s.time}.`, ...s.notes] }));

/**
 * The JHSC Ventures Gate 2 final pitch: nine slides, about 4:30. Same keys as
 * the other decks: arrows, Space, Page Up and Down, Home, End; N notes,
 * A audit. This page has no source register, so S does nothing.
 */
export function App() {
  const onKey = useCallback((e: KeyboardEvent) => e.key === "s" || e.key === "S", []);
  return (
    <PageShell slides={withTimes} ui={ui} onKey={onKey}>
      <TitleSection index={0} />
      <ProblemSection index={1} />
      <AnswerSection index={2} />
      <VideoSection index={3} />
      <ProgressSection index={4} />
      <RoadmapSection index={5} />
      <FundSection index={6} />
      <RecognitionSection index={7} />
      <ResultsSection index={8} />
    </PageShell>
  );
}
