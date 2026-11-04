import { assets } from "../../../content/assets";
import { reveal, RichText, SlideFrame } from "../../shared/kit";
import { answerSlide as c } from "../content/slides";
import { useOpenVideo } from "../VideoDialog";

/** Each card holds its own bottle: the left or right half of the pack photo. */
export function AnswerSection({ index }: { index: number }) {
  const openVideo = useOpenVideo();
  const photo = assets.bottlesCutout;
  return (
    <SlideFrame slide={c} index={index} className="c-answer">
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="cards cards--2 c-answer__cards">
        {c.products.map((p, i) => (
          <div key={p.id} className={`card card--${p.tone} c-product${photo ? "" : " c-product--solo"}`} {...reveal(3 + i * 0.8)}>
            {photo && (
              <div className={`c-product__bottle c-product__bottle--${i === 0 ? "left" : "right"}`} aria-hidden="true">
                <img src={photo} alt="" draggable={false} />
              </div>
            )}
            <div>
              <h3 className={`card__title tone-${p.tone}`}>{p.heading}</h3>
              <p className="card__body">
                <RichText value={p.body} />
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="c-answer__together" {...reveal(5)}>
        {c.together}
      </p>
      <button type="button" className="link-card" onClick={(e) => openVideo(e.currentTarget)} {...reveal(5.8)}>
        <span className="link-card__play" aria-hidden="true">
          <svg width="14" height="16" viewBox="0 0 14 16">
            <path d="M1 1 L13 8 L1 15 Z" />
          </svg>
        </span>
        <span>{c.videoLink}</span>
      </button>
    </SlideFrame>
  );
}
