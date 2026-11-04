import { assets } from "../../../content/assets";
import { reveal, SlideFrame } from "../../shared/kit";
import { teamSlide as c } from "../content/slides";

const photos: Record<string, string | undefined> = {
  mohadeseh: assets.mohadeseh,
  ali: assets.ali,
};

/** The root deck's team cards, then the one line a store cares about. */
export function TeamSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="team c-team">
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="cards cards--2">
        {c.people.map((p, i) => {
          const photo = photos[p.id];
          return (
            <div key={p.id} className="card person" {...reveal(3 + i * 0.9)}>
              <div className="person__face">
                {photo ? <img src={photo} alt={p.name} /> : <span aria-hidden="true">{p.initials}</span>}
              </div>
              <h3 className="person__name">{p.name}</h3>
              <p className="person__role">{p.role}</p>
              <p className="card__body person__bio">{p.bio}</p>
            </div>
          );
        })}
      </div>
      <p className="team__shared c-team__local" {...reveal(5.5)}>
        {c.local}
      </p>
    </SlideFrame>
  );
}
