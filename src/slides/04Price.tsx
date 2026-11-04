import { priceFootnote, priceRows } from "../content/pricing";
import { priceSlide as c } from "../content/slides";
import { Claim } from "../components/Claim";
import { PriceStrip } from "../components/PriceStrip";
import { reveal } from "../components/reveal";
import { SlideFrame } from "../components/SlideFrame";

/**
 * One number, set very large, the way Apple lands a price; the comparison
 * that earns it sits underneath in a single card.
 */
export function PriceSlide({ index }: { index: number }) {
  const hero = priceRows.find((r) => r.id === c.heroRow)!;
  return (
    <SlideFrame slide={c} index={index} className="price">
      <p className="price__label" {...reveal(1)}>
        {hero.label} <span className="price__qualifier">{hero.qualifier}</span>
      </p>
      <p className="price__figure" {...reveal(1.6, "clear")}>
        {hero.claim ? <Claim id={hero.claim}>{hero.display}</Claim> : hero.display}
      </p>
      <div className="card card--wide price__card" {...reveal(2.6)}>
        <PriceStrip exclude={hero.id} />
      </div>
      <p className="t-caption price__foot" {...reveal(6)}>
        {priceFootnote}
      </p>
    </SlideFrame>
  );
}
