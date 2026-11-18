import { useDeck } from "../../../components/DeckContext";
import { reveal, SlideFrame, VideoPanel } from "../../shared/kit";
import { video, videoSlide as c, VIDEO_URL } from "../content/slides";

/** Ali's video, large and centred. On paper (PDF) the poster becomes a link to it. */
export function VideoSection({ index }: { index: number }) {
  const { active } = useDeck();
  return (
    <SlideFrame slide={c} index={index} className="g2-video">
      <h2 className="g2-headline g2-headline--sm" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="pop g2-video__wrap">
        <VideoPanel video={video} active={active === index} />
        <a className="g2-video__print" href={VIDEO_URL}>
          <span className="g2-video__print-play" aria-hidden="true">
            <svg width="36" height="40" viewBox="0 0 36 40">
              <path d="M4 2 L34 20 L4 38 Z" />
            </svg>
          </span>
          <span className="g2-video__print-url">{c.watch}</span>
        </a>
      </div>
    </SlideFrame>
  );
}
