import { reveal, SlideFrame, ZoomImage } from "../../shared/kit";
import { recognitionSlide as c } from "../content/slides";
import { logoUrl } from "../logos";

type PhotoCard = (typeof c.photoCards)[number];
type TextCard = { id: string; text: string; lead?: string };

/** A small text card: no photo, never an empty box. */
function Text({ card, beat }: { card: TextCard; beat: number }) {
  return (
    <div className="g2-rc g2-rc--text" {...reveal(beat)}>
      <p className="g2-rc__text">
        {card.lead && <strong>{card.lead} </strong>}
        {card.text}
      </p>
    </div>
  );
}

/** A photo card, or, if its photo file is missing, a text card with the same words. */
function Photo({ card, beat }: { card: PhotoCard; beat: number }) {
  const src = logoUrl(card.photo);
  if (!src) return <Text card={{ id: card.id, lead: card.label ? `${card.label}.` : undefined, text: card.caption }} beat={beat} />;
  return (
    <figure className={`g2-rc g2-rc--photo g2-rc--${card.id}`} {...reveal(beat)}>
      <ZoomImage className="g2-rc__img" src={src} alt={card.alt} caption={card.caption} />
      <figcaption className="g2-rc__body">
        {card.label && <span className="g2-rc__label">{card.label}</span>}
        <span className="g2-rc__text">{card.caption}</span>
      </figcaption>
    </figure>
  );
}

/**
 * Recognition as photo cards: iCAN 2026 large, the Gate 1 award beside it,
 * three small text cards under them, and the supporters' logos, as they are,
 * on one light strip at the bottom.
 */
export function RecognitionSection({ index }: { index: number }) {
  const [ican, gate1] = c.photoCards;
  return (
    <SlideFrame slide={c} index={index} className="g2-recog">
      <h2 className="g2-headline g2-headline--sm" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="g2-recog__grid">
        <Photo card={ican} beat={3} />
        <Photo card={gate1} beat={3.8} />
        <div className="g2-recog__texts">
          {c.textCards.map((t, i) => (
            <Text key={t.id} card={t} beat={4.6 + i * 0.6} />
          ))}
        </div>
      </div>
      <div className="g2-recog__support" {...reveal(6.8)}>
        <p className="g2-recog__label">{c.supportedBy}</p>
        <ul className="g2-logos">
          {c.logos.map((l) => {
            const url = logoUrl(l.file);
            const lead = "lead" in l && l.lead;
            return (
              <li key={l.file} className={`g2-logos__item${lead ? " is-lead" : ""}`}>
                {url ? <img src={url} alt={l.name} draggable={false} /> : <span className="g2-logos__name">{l.name}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </SlideFrame>
  );
}
