import { Plain, reveal, SlideFrame } from "../../shared/kit";
import { recognitionSlide as c } from "../content/slides";
import { logoUrl } from "../logos";

/**
 * Awards in two calm columns; the supporters' logos, as they are, on one light
 * panel so they stay readable on the dark page. JHSC first and largest.
 */
export function RecognitionSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="g2-recog">
      <h2 className="g2-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <ul className="g2-recog__awards">
        {c.awards.map((a, i) => (
          <li key={a} {...reveal(3 + i * 0.5)}>
            <span className="g2-recog__mark" aria-hidden="true" />
            <span>
              <Plain text={a} />
            </span>
          </li>
        ))}
      </ul>
      <div className="g2-recog__support" {...reveal(6.6)}>
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
