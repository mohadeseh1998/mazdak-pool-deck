import { useEffect, useState } from "react";
import { assets } from "../content/assets";
import { titleSlide as c } from "../content/slides";
import { useDeck } from "../components/DeckContext";
import { ZoomImage } from "../components/Lightbox";
import { Logo } from "../components/Logo";
import { reveal } from "../components/reveal";
import { Plain } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

const HINT_MS = 6000;

/** The demo hint shows for six seconds after load, then only in presenter mode (N). */
function DemoHint() {
  const { notes } = useDeck();
  const [fresh, setFresh] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setFresh(false), HINT_MS);
    return () => window.clearTimeout(t);
  }, []);
  if (!fresh && !notes) return null;
  return (
    <p className="title__hint" role="status">
      {c.demoHint.before} <kbd className="key">{c.demoHint.key}</kbd> {c.demoHint.after}
    </p>
  );
}

export function TitleSlide({ index }: { index: number }) {
  const photo = assets.bottles;
  return (
    <SlideFrame slide={c} index={index}>
      <div className={`title${photo ? "" : " title--solo"}`}>
        <div className="title__text">
          <div className="title__logo-wrap" {...reveal(0)}>
            <Logo ground={c.ground} width={300} className="title__logo" />
          </div>
          <div className="title__main">
            <h1 className="t-deck-headline" {...reveal(1, "clear")}>
              {c.headline}
            </h1>
            <p className="title__sub" {...reveal(3)}>
              <Plain text={c.sub} />
            </p>
            <p className="title__identity" {...reveal(4)}>
              {c.identity}
            </p>
          </div>
          <p className="title__honesty" {...reveal(5.5)}>
            <Plain text={c.honesty} />
          </p>
          <DemoHint />
        </div>
        {/* Bottles: kept on their own studio ground, which runs edge to edge in this
            panel. The panel colour is sampled from the image edge so a crop never
            shows a seam. Background removal was not used: on the light slide 3
            ground white bottles would lose their outline. On entry the photo
            settles from a slow push-in. */}
        {photo && <ZoomImage className="title__photo" src={photo} alt={c.bottlesAlt} caption={c.sub} />}
      </div>
    </SlideFrame>
  );
}
