import { assets } from "../../../content/assets";
import { Logo, Plain, reveal, SlideFrame, ZoomImage } from "../../shared/kit";
import { titleSlide as c } from "../content/slides";

/** The name, one very large line, and the product itself, large, on the right. */
export function TitleSection({ index }: { index: number }) {
  const thumb = assets.bottlesCutout ?? assets.bottles;
  return (
    <SlideFrame slide={c} index={index} className="g2-hero">
      <div className="g2-hero__text">
        <div className="g2-hero__logo" {...reveal(0)}>
          <Logo ground={c.ground} width={230} />
        </div>
        <h1 className="g2-hero__title" {...reveal(1, "clear")}>
          {c.headline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="g2-hero__sub" {...reveal(3)}>
          <Plain text={c.sub} />
        </p>
        <p className="g2-hero__founders" {...reveal(4)}>
          {c.founders.map((f, i) => (
            <span key={f}>
              {i > 0 && <span className="g2-dot" aria-hidden="true"> · </span>}
              <span className="nowrap">{f}</span>
            </span>
          ))}
        </p>
      </div>
      {thumb && assets.bottles && (
        <div className={`g2-hero__product${assets.bottlesCutout ? " is-floating" : ""}`}>
          <ZoomImage src={assets.bottles} thumb={thumb} alt={c.bottlesAlt} caption={c.sub} className="rise" />
        </div>
      )}
      <p className="g2-foot g2-hero__foot" {...reveal(6)}>
        {c.footer.map((f, i) => (
          <span key={f}>
            {i > 0 && <span className="g2-dot" aria-hidden="true"> · </span>}
            <span className="nowrap">{f}</span>
          </span>
        ))}
      </p>
    </SlideFrame>
  );
}
