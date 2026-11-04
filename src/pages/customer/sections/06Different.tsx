import type { CSSProperties } from "react";
import { reveal, RichText, SlideFrame } from "../../shared/kit";
import { differentSlide as c } from "../content/slides";

/**
 * The page's one new visual moment: a single shelf line. A row of many faint
 * bottle outlines stands on it; as the section arrives they fade away, left to
 * right, until only our two bottles are left on the right. Plain outlines, no
 * illustration. Reduced motion shows the end state at once.
 */

const BASE = 196; // the shelf line, in SVG units
const W = 1280;

interface Shape {
  w: number;
  h: number;
  neck: number;
  cap: number;
}

// A plain variety of bottle and jug proportions, as on any store shelf.
const SHAPES: Shape[] = [
  { w: 44, h: 118, neck: 18, cap: 12 },
  { w: 58, h: 92, neck: 26, cap: 14 },
  { w: 40, h: 132, neck: 16, cap: 10 },
  { w: 64, h: 104, neck: 30, cap: 16 },
  { w: 48, h: 84, neck: 22, cap: 12 },
  { w: 52, h: 124, neck: 20, cap: 14 },
];

const OTHERS = 18;
const GAP = 14;

function Bottle({ x, s, className, style }: { x: number; s: Shape; className: string; style?: CSSProperties }) {
  const top = BASE - s.h;
  const neckH = 12;
  const cx = x + s.w / 2;
  return (
    <g className={className} style={style}>
      <rect x={x} y={top} width={s.w} height={s.h} rx={Math.min(12, s.w / 4)} />
      <rect x={cx - s.neck / 2} y={top - neckH} width={s.neck} height={neckH} rx={2} />
      <rect className="shelf__cap" x={cx - s.neck / 2 - 3} y={top - neckH - s.cap} width={s.neck + 6} height={s.cap} rx={3} />
    </g>
  );
}

function Shelf() {
  let x = 0;
  const others = Array.from({ length: OTHERS }, (_, k) => {
    const s = SHAPES[(k * 5 + 1) % SHAPES.length];
    const el = <Bottle key={k} x={x} s={s} className="shelf__other" style={{ "--k": k } as CSSProperties} />;
    x += s.w + GAP;
    return el;
  });
  // Ours: two one-litre bottles, blue cap and green cap, at the right end.
  const ours: Shape = { w: 60, h: 136, neck: 28, cap: 20 };
  const oursX = W - (ours.w * 2 + 22);
  return (
    <svg className="shelf" viewBox={`0 -8 ${W} ${BASE + 16}`} role="img" aria-label={c.shelfLabel}>
      {others}
      <Bottle x={oursX} s={ours} className="shelf__ours shelf__ours--pool" />
      <Bottle x={oursX + ours.w + 22} s={ours} className="shelf__ours shelf__ours--algae" />
      <line className="shelf__line" x1={0} x2={W} y1={BASE + 1} y2={BASE + 1} />
    </svg>
  );
}

export function DifferentSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="c-different">
      <h2 className="t-headline" {...reveal(1, "clear")}>
        {c.headline}
      </h2>
      <div className="c-different__shelf" {...reveal(2.4)}>
        <Shelf />
      </div>
      <ul className="c-columns">
        {c.columns.map((col, i) => (
          <li key={col.word} {...reveal(5 + i * 0.7)}>
            <p className="c-columns__word">{col.word}</p>
            <p className="c-columns__line">
              <RichText value={col.line} />
            </p>
          </li>
        ))}
      </ul>
    </SlideFrame>
  );
}
