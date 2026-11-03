import { assets } from "../content/assets";
import { teamSlide as c } from "../content/slides";
import { SlideFrame } from "../components/SlideFrame";

const photos: Record<string, string | undefined> = {
  mohadeseh: assets.mohadeseh,
  ali: assets.ali,
};

export function TeamSlide({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index}>
      <div className="team">
        <h2 className="t-headline">{c.headline}</h2>
        <div className="team__people">
          {c.people.map((p) => {
            const photo = photos[p.id];
            return (
              <div key={p.id} className="person">
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
        <p className="team__shared">{c.shared}</p>
      </div>
    </SlideFrame>
  );
}
