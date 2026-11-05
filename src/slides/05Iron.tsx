import { assets } from "../content/assets";
import { ironSlide as c } from "../content/slides";
import { ZoomImage } from "../components/Lightbox";
import { reveal } from "../components/reveal";
import { RichText } from "../components/RichText";
import { SlideFrame } from "../components/SlideFrame";

/**
 * "One more thing": the same two bottles take iron out of a pool. Words on the
 * left, the jar test large on the right. Pool blue only; no algae green here.
 * The photo is assets.ironRemoval, set by IRON_PHOTO in content/assets.ts.
 */
export function IronSlide({ index }: { index: number }) {
  const photo = assets.ironRemoval;
  return (
    <SlideFrame slide={c} index={index} className={`iron${photo ? "" : " iron--solo"}`}>
      <div className="iron__text">
        <p className="iron__eyebrow" {...reveal(0)}>
          {c.kicker}
        </p>
        <h2 className="t-headline iron__headline" {...reveal(1, "clear")}>
          {c.headline}
        </h2>
        <p className="iron__body" {...reveal(2.6)}>
          <RichText value={c.body} />
        </p>
      </div>
      {photo && (
        <figure className="iron__photo">
          <ZoomImage className="iron__img pop" src={photo} alt={c.photo.alt} caption={c.photo.caption} />
          <figcaption className="t-caption" {...reveal(4)}>
            {c.photo.caption}
          </figcaption>
        </figure>
      )}
    </SlideFrame>
  );
}
