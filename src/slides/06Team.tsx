import { assets } from "../content/assets";
import { teamSlide as c } from "../content/slides";
import { reveal } from "../components/reveal";
import { SlideFrame } from "../components/SlideFrame";

const photos: Record<string, string | undefined> = {
  mohadeseh: assets.mohadeseh,
  ali: assets.ali,
};

export function TeamSlide({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index}>
      <div className="team">
        <h2 className="t-headline" {...reveal(0, "clear")}>
          {c.headline}
        </h2>
        <div className="team__people">
          {c.people.map((p, i) => {
            const photo = photos[p.id];
            return (
              <div key={p.id} className="person" {...reveal(2 + i * 1.2)}>
                <div className="person__face">
                  {photo ? <img src={photo} alt={p.name} /> : <span aria-hidden="true">{p.initials}</span>}
                </div>
                <div>
                  <h3 className="person__name">{p.name}</h3>
                  <p className="person__role">{p.role}</p>
                  <p className="t-body person__bio">{p.bio}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="team__shared" {...reveal(5)}>
          {c.shared}
        </p>
      </div>
    </SlideFrame>
  );
}
