import { useCallback, useRef, useState } from "react";
import { PageShell } from "../shared/PageShell";
import { slides, ui } from "./content/slides";
import { VideoContext, VideoDialog } from "./VideoDialog";
import { OpeningSection } from "./sections/01Opening";
import { ProblemSection } from "./sections/02Problem";
import { AnswerSection } from "./sections/03Answer";
import { LiveSection } from "./sections/04Live";
import { TeamSection } from "./sections/05Team";
import { DifferentSection } from "./sections/06Different";
import { PriceSection } from "./sections/07Price";
import { SellSection } from "./sections/08Sell";
import { WorkSection } from "./sections/09Work";

/** The customer pitch for a pool store: nine sections, five minutes. */
export function App() {
  const [videoOpen, setVideoOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const openVideo = useCallback((el: HTMLElement) => {
    opener.current = el;
    setVideoOpen(true);
  }, []);
  const closeVideo = useCallback(() => {
    setVideoOpen(false);
    const el = opener.current;
    window.requestAnimationFrame(() => el?.focus({ preventScroll: true }));
  }, []);

  return (
    <VideoContext.Provider value={openVideo}>
      <PageShell slides={slides} ui={ui} timer modalOpen={videoOpen}>
        <OpeningSection index={0} />
        <ProblemSection index={1} />
        <AnswerSection index={2} />
        <LiveSection index={3} />
        <TeamSection index={4} />
        <DifferentSection index={5} />
        <PriceSection index={6} />
        <SellSection index={7} />
        <WorkSection index={8} />
      </PageShell>
      <VideoDialog open={videoOpen} onClose={closeVideo} />
    </VideoContext.Provider>
  );
}
