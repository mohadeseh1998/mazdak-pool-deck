import { useEffect, useState } from "react";
import { assets } from "../../../content/assets";
import { useDeck } from "../../../components/DeckContext";
import { Logo, Plain, reveal, SlideFrame, ZoomImage } from "../../shared/kit";
import { openingSlide as c } from "../content/slides";

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

/** The name, one large line, and the product itself rising into place under it. */
export function OpeningSection({ index }: { index: number }) {
  const thumb = assets.bottlesCutout ?? assets.bottles;
  return (
    <SlideFrame slide={c} index={index} className="c-hero">
      <div className="hero__logo" {...reveal(0)}>
        <Logo ground={c.ground} width={200} />
      </div>
      <h1 className="t-hero c-hero__title" {...reveal(1, "clear")}>
        {c.headline.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>
      <p className="hero__sub c-hero__sub" {...reveal(3)}>
        <Plain text={c.sub} />
      </p>
      {thumb && assets.bottles && (
        <div className={`c-hero__product${assets.bottlesCutout ? " is-floating" : ""}`}>
          <ZoomImage src={assets.bottles} thumb={thumb} alt={c.bottlesAlt} caption={c.sub} className="rise" />
        </div>
      )}
      <DemoHint />
    </SlideFrame>
  );
}
