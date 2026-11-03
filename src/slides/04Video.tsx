import { videoSlide as c } from "../content/slides";
import { useDeck } from "../components/DeckContext";
import { SlideFrame } from "../components/SlideFrame";
import { VideoPanel } from "../components/VideoPanel";

export function VideoSlide({ index }: { index: number }) {
  const { active } = useDeck();
  return (
    <SlideFrame slide={c} index={index}>
      <div className="vid">
        <h2 className="vid__headline">{c.headline}</h2>
        <VideoPanel video={c.video} active={active === index} />
      </div>
    </SlideFrame>
  );
}
