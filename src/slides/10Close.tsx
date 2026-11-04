import { closeSlide as c } from "../content/slides";
import { CountUp } from "../components/CountUp";
import { reveal } from "../components/reveal";
import { SlideFrame } from "../components/SlideFrame";

const whole = (n: number) => String(n);

/** Three numbers, set large, then the close: one introduction and honest feedback. */
export function CloseSlide({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="close">
      <ul className="stats">
        {c.runDoes.map((r, i) => (
          <li key={r.figure} className="stat" {...reveal(1.5 + i * 0.8)}>
            <span className="stat__figure">
              <CountUp value={r.figure} format={whole} />
            </span>
            <span className="stat__text">{r.text}</span>
          </li>
        ))}
      </ul>
      <p className="close__asks" {...reveal(5, "clear")}>
        {c.otherAsks}
      </p>
      <p className="close__contact" {...reveal(6.5)}>
        {c.contact}
      </p>
    </SlideFrame>
  );
}
