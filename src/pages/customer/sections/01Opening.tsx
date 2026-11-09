import { assets } from "../../../content/assets";
import { Logo, Plain, reveal, SlideFrame, ZoomImage } from "../../shared/kit";
import { openingSlide as c } from "../content/slides";

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
    </SlideFrame>
  );
}
