import { useId } from "react";
import { money, RESULTS, type SeasonResult } from "../../../content/poolModel";
import { reveal, RichText, SlideFrame, Square } from "../../shared/kit";
import { seasonsSlide as c, TABLE_ROWS } from "../content/slides";
import { useTweened } from "../tween";

type Fields = Omit<SeasonResult, "year">;
const FIELDS = TABLE_ROWS.map((r) => r.key);
const total = (s: Fields) => s.cogs + s.startupAndRunning + s.pmra;

/* ------------------------------------------------------------------ */
/* Chart: revenue, total costs and cumulative cash, from the model     */
/* ------------------------------------------------------------------ */

const W = 640;
const H = 268;
const PAD = { left: 64, right: 8, top: 10, bottom: 40 };
const STEP = 20000;

const Y_MAX = Math.ceil(Math.max(...RESULTS.map((r) => Math.max(r.revenue, total(r), r.cumulative))) / STEP) * STEP;
const Y_MIN = Math.floor(Math.min(0, ...RESULTS.map((r) => r.cumulative)) / STEP) * STEP;
const TICKS = [-50000, 0, 50000, 100000, 150000].filter((t) => t >= Y_MIN && t <= Y_MAX);

const y = (v: number) => PAD.top + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * (H - PAD.top - PAD.bottom);
const groupW = (W - PAD.left - PAD.right) / RESULTS.length;
const cx = (i: number) => PAD.left + groupW * (i + 0.5);
const BAR = 46;
const BAR_GAP = 10;

const tick = (v: number) => (v === 0 ? "$0" : `${money(v / 1000)}k`);

function Chart({ seasons }: { seasons: Fields[] }) {
  const gradient = useId();
  const zero = y(0);
  const split = (zero - PAD.top) / (H - PAD.top - PAD.bottom);
  const points = seasons.map((s, i) => [cx(i), y(s.cumulative)] as const);
  const line = points.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
  return (
    <svg className="f-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={c.chart.label}>
      <defs>
        {/* The cash line is paper above zero and silt below it. */}
        <linearGradient id={gradient} gradientUnits="userSpaceOnUse" x1="0" y1={PAD.top} x2="0" y2={H - PAD.bottom}>
          <stop offset={split} stopColor="var(--paper)" />
          <stop offset={split} stopColor="var(--silt)" />
        </linearGradient>
      </defs>
      {TICKS.map((t) => (
        <g key={t} className={`f-chart__tick${t === 0 ? " is-zero" : ""}`}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
          <text x={PAD.left - 12} y={y(t)} dy="0.35em">
            {tick(t)}
          </text>
        </g>
      ))}
      {seasons.map((s, i) => {
        const costs = total(s);
        const left = cx(i) - BAR - BAR_GAP / 2;
        return (
          <g key={i}>
            <rect className="f-chart__rev" x={left} y={y(s.revenue)} width={BAR} height={Math.max(0, zero - y(s.revenue))} rx={4} />
            <rect
              className="f-chart__cost"
              x={left + BAR + BAR_GAP + 0.75}
              y={y(costs) + 0.75}
              width={BAR - 1.5}
              height={Math.max(0, zero - y(costs) - 1.5)}
              rx={4}
            />
            <text className="f-chart__season" x={cx(i)} y={H - 12}>
              {c.chart.seasons[i]}
            </text>
          </g>
        );
      })}
      <path className="f-chart__cash" d={line} stroke={`url(#${gradient})`} />
      {points.map(([px, py], i) => (
        <circle key={i} className={`f-chart__dot${seasons[i].cumulative < 0 ? " is-negative" : ""}`} cx={px} cy={py} r={6} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

/** The three seasons: one big number, the chart, the table, the assumptions. */
export function SeasonsSection({ index }: { index: number }) {
  return (
    <SlideFrame slide={c} index={index} className="f-seasons">
      <SeasonsBody />
    </SlideFrame>
  );
}

/** Inside the frame, so the count-up knows when the section arrives. */
function SeasonsBody() {
  const target = [...RESULTS.flatMap((r) => FIELDS.map((f) => r[f])), c.hero.figure];
  const shown = useTweened(target);
  const seasons: Fields[] = RESULTS.map(
    (_, i) => Object.fromEntries(FIELDS.map((f, j) => [f, shown[i * FIELDS.length + j]])) as unknown as Fields,
  );
  const heroShown = shown[shown.length - 1];

  return (
    <>
      <h2 className="t-headline t-headline--sm" {...reveal(1, "clear")}>
        {c.headline}
      </h2>

      <div className="f-seasons__grid">
        <div className="f-seasons__left">
          <div className="f-hero" {...reveal(2.2, "clear")}>
            <p className="f-hero__figure">
              <span aria-hidden="true">{money(heroShown)}</span>
              <span className="visually-hidden">{money(c.hero.figure)}</span>
            </p>
            <p className="f-hero__lead">{c.hero.label}</p>
            <p className="f-hero__tail">{c.hero.tail}</p>
          </div>
          <div className="f-chart-wrap" {...reveal(3.4)}>
            <Chart seasons={seasons} />
            <ul className="f-legend">
              <li>
                <span className="f-legend__rev" aria-hidden="true" />
                {c.chart.legend.revenue}
              </li>
              <li>
                <span className="f-legend__cost" aria-hidden="true" />
                {c.chart.legend.costs}
              </li>
              <li>
                <span className="f-legend__cash" aria-hidden="true" />
                {c.chart.legend.cash}
              </li>
            </ul>
          </div>
        </div>

        <div className="f-seasons__right">
          <div className="card f-table-card" {...reveal(3)}>
            <table className="c-table f-table">
              <thead>
                <tr>
                  <th scope="col" />
                  {c.years.map((yr) => (
                    <th key={yr} scope="col" className="num">
                      {yr}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row) => (
                  <tr key={row.key} className={`${row.strong ? "is-strong" : ""}${row.rule ? " has-rule" : ""}`}>
                    <th scope="row">{row.label}</th>
                    {seasons.map((s, i) => {
                      const v = s[row.key];
                      return (
                        <td key={i} className={`num${row.money && Math.round(v) < 0 ? " is-negative" : ""}`}>
                          {row.format(v)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="f-assumptions" {...reveal(4.2)}>
            <Square tone="outline" />
            <span>{c.assumptions}</span>
          </p>
        </div>
      </div>

      <p className="f-closing" {...reveal(5.2)}>
        <RichText value={c.closing} />
      </p>
    </>
  );
}
