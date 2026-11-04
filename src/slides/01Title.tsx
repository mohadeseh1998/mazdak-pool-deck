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
    <p className="hero__hint" role="status">
      {c.demoHint.before} <kbd className="key">{c.demoHint.key}</kbd> {c.demoHint.after}
    </p>
  );
}

/**
 * The hero, composed like the top of an Apple product page: name, a very large
 * headline, one line, then the product itself, floating on the dark ground.
 * The honesty line sits over the product's base in a frosted pill.
 */
export function TitleSlide({ index }: { index: number }) {
  // The cut-out floats on the page; the original studio photo is the fallback
  // and is what opens full size.
  const thumb = assets.bottlesCutout ?? assets.bottles;
  const floating = !!assets.bottlesCutout;
  return (
    <SlideFrame slide={c} index={index} className={`hero${thumb ? "" : " hero--solo"}`}>
      <div className="hero__logo" {...reveal(0)}>
        <Logo ground={c.ground} width={220} />
      </div>
      <h1 className="t-hero" {...reveal(1, "clear")}>
        {c.headline.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>
      <p className="hero__sub" {...reveal(3)}>
        <Plain text={c.sub} />
      </p>
      <p className="hero__identity" {...reveal(3.8)}>
        {c.identity}
      </p>
      {thumb && assets.bottles && (
        <div className={`hero__product${floating ? " is-floating" : ""}`}>
          <ZoomImage src={assets.bottles} thumb={thumb} alt={c.bottlesAlt} caption={c.sub} className="pop" />
        </div>
      )}
      <p className="hero__honesty" {...reveal(6)}>
        <Plain text={c.honesty} />
      </p>
      <DemoHint />
    </SlideFrame>
  );
}
