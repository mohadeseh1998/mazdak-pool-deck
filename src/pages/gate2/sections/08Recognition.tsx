import { reveal, SlideFrame, ZoomImage } from "../../shared/kit";
import { recognitionSlide as c } from "../content/slides";
import { logoUrl } from "../logos";

type Pic = { file: string; alt: string };
type TextCard = { id: string; text: string; lead?: string };

/** A row of photos at their own shapes, all the same height. Missing files are left out. */
function Row({ pics, caption, className }: { pics: readonly Pic[]; caption: string; className: string }) {
  const found = pics.map((p) => ({ ...p, src: logoUrl(p.file) })).filter((p) => p.src);
  if (!found.length) return null;
  return (
    <div className={className}>
      {found.map((p) => (
        <ZoomImage key={p.file} src={p.src!} alt={p.alt} caption={caption} />
      ))}
    </div>
  );
}

/** A small text card: no photo, never an empty box. */
function Text({ card, beat, className = "" }: { card: TextCard; beat: number; className?: string }) {
  return (
    <div className={`g2-rc g2-rc--text ${className}`} {...reveal(beat)}>
      <p className="g2-rc__text">
        {card.lead && <strong>{card.lead} </strong>}
        {card.text}
      </p>
    </div>
  );
}

/**
 * Recognition, built like the iron fertilizer deck's slide: iCAN 2026 large
 * with all its photos, then BMO Apex, the Gate 1 award, the press, two small
 * text cards, and the supporters' logos, as they are, on one light strip.
 */
export function RecognitionSection({ index }: { index: number }) {
  const ican = c.ican;
  const [bmo, gate1] = c.photoCards;
  const photoCard = (card: (typeof c.photoCards)[number], beat: number) => {
    const src = logoUrl(card.photo);
    if (!src) return <Text card={{ id: card.id, text: card.caption }} beat={beat} className={`g2-rc--${card.id}`} />;
    return (
      <figure className={`g2-rc g2-rc--photo g2-rc--${card.id}`} {...reveal(beat)}>
        <ZoomImage className="g2-rc__img" src={src} alt={card.alt} caption={card.caption} />
        <figcaption className="g2-rc__body">
          <span className="g2-rc__text">{card.caption}</span>
        </figcaption>
      </figure>
    );
  };
  const pressFound = c.press.photos.some((p) => logoUrl(p.file));
  return (
    <SlideFrame slide={c} index={index} className="g2-recog">
      <div className="g2-recog__grid">
        <figure className="g2-rc g2-rc--ican" {...reveal(3)}>
          <Row pics={ican.main} caption={ican.caption} className="g2-ican__main" />
          <Row pics={ican.thumbs} caption={ican.caption} className="g2-ican__thumbs" />
          <figcaption className="g2-rc__body">
            <span className="g2-rc__label">{ican.label}</span>
            <span className="g2-rc__text">{ican.caption}</span>
          </figcaption>
        </figure>
        {photoCard(bmo, 3.8)}
        {photoCard(gate1, 4.4)}
        {pressFound ? (
          <figure className="g2-rc g2-rc--press" {...reveal(5)}>
            <Row pics={c.press.photos} caption={`${c.press.label} ${c.press.text}`} className="g2-press__photos" />
            <figcaption className="g2-rc__body">
              <span className="g2-rc__text">
                <strong>{c.press.label}</strong> {c.press.text}
              </span>
            </figcaption>
          </figure>
        ) : (
          <Text card={{ id: "press", lead: c.press.label, text: c.press.text }} beat={5} className="g2-rc--press" />
        )}
        {c.textCards.map((t, i) => (
          <Text key={t.id} card={t} beat={5.6 + i * 0.6} className={`g2-rc--${t.id}`} />
        ))}
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
