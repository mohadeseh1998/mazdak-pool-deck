import { useId } from "react";
import { money, RESULTS, type SeasonResult } from "../../../content/poolModel";
import { reveal, RichText, SlideFrame, Square } from "../../shared/kit";
import { hero, seasonsSlide as c, TABLE_ROWS } from "../content/slides";
import { useScenario, useTweened } from "../scenario";
import { ScenarioToggle } from "./Toggle";

type Fields = Omit<SeasonResult, "year">;
const FIELDS = TABLE_ROWS.map((r) => r.key);

/* ------------------------------------------------------------------ */
/* Chart                                                               */
/* ------------------------------------------------------------------ */

const W = 640;
const H = 244;
const PAD = { left: 64, right: 8, top: 10, bottom: 40 };
const STEP = 20000;

// One scale for both cases, so switching shows the real difference in size.
const all = [...RESULTS.base, ...RESULTS.worst];
const Y_MAX = Math.ceil(Math.max(...all.map((r) => Math.max(r.revenue, r.cogs + r.fixedAndPmra))) / STEP) * STEP;
const Y_MIN = Math.floor(Math.min(0, ...all.map((r) => r.cumulative)) / STEP) * STEP;
const TICKS = [-50000, 0, 50000, 100000].filter((t) => t >= Y_MIN && t <= Y_MAX);

const y = (v: number) => PAD.top + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * (H - PAD.top - PAD.bottom);
const groupW = (W - PAD.left - PAD.right) / 3;
const cx = (i: number) => PAD.left + groupW * (i + 0.5);
const BAR = 46;
const BAR_GAP = 10;

const tick = (v: number) => (v === 0 ? "$0" : `${money(v / 1000)}k`);

function Chart({ seasons }: { seasons: Fields[] }) {
  const gradient = useId();
  const zero = y(0);
  const points = seasons.map((s, i) => [cx(i), y(s.cumulative)] as const);
  const line = points.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
  return (
    <svg className="f-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={c.chart.label}>
      <defs>
        {/* The cash line is paper above zero and silt below it. */}
        <linearGradient id={gradient} gradientUnits="userSpaceOnUse" x1="0" y1={PAD.top} x2="0" y2={H - PAD.bottom}>
          <stop offset={(zero - PAD.top) / (H - PAD.top - PAD.bottom)} stopColor="var(--paper)" />
          <stop offset={(zero - PAD.top) / (H - PAD.top - PAD.bottom)} stopColor="var(--silt)" />
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
        const costs = s.cogs + s.fixedAndPmra;
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

/**
 * The seasons, Base and Worst. Everything on screen is the model's output; the
 * pill (or W) switches the case and every figure travels to its new value.
 */
export function SeasonsSection({ index }: { index: number }) {
  const { scenario } = useScenario();
  return (
    <SlideFrame slide={c} index={index} className={`f-seasons is-${scenario}`}>
      <SeasonsBody />
    </SlideFrame>
  );
}

/** Inside the frame, so the tween knows when the section arrives. */
function SeasonsBody() {
  const { scenario } = useScenario();
  const results = RESULTS[scenario];
  const h = hero[scenario];

  // One tween for every figure: 3 seasons by 8 fields, then the hero.
  const target = [...results.flatMap((r) => FIELDS.map((f) => r[f])), h.figure];
  const shown = useTweened(target);
  const seasons: Fields[] = results.map((_, i) =>
    Object.fromEntries(FIELDS.map((f, j) => [f, shown[i * FIELDS.length + j]])) as unknown as Fields,
  );
  const heroShown = shown[shown.length - 1];
  const list = c.lists[scenario];

  return (
    <>
      <h2 className="t-headline t-headline--sm" {...reveal(1, "clear")}>
        {c.headline}
      </h2>

      <div className="f-seasons__grid">
        <div className="f-seasons__left">
          <div {...reveal(2)}>
            <ScenarioToggle />
          </div>
          <div className="f-hero" {...reveal(2.6, "clear")}>
            <p className="f-hero__lead" aria-hidden="true">
              {h.lead}
            </p>
            <p className="f-hero__figure" aria-hidden="true">
              <span className="f-hero__about">{c.about}</span> {money(heroShown)}
            </p>
            <p className="f-hero__tail" aria-hidden="true">
              {h.tail}
            </p>
            <p className="visually-hidden" aria-live="polite">
              {h.sentence}
            </p>
          </div>
          <div className="f-chart-wrap" {...reveal(3.6)}>
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
                  <th scope="col">
                    <span className="visually-hidden">{c.toggle.options.find((o) => o.id === scenario)!.label}</span>
                  </th>
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

          <div className="f-list" {...reveal(4.4)}>
            <h3 className="f-list__heading">{list.heading}</h3>
            <ul key={scenario} className="f-list__items">
              {list.items.map((item) => (
                <li key={item}>
                  {/* Caution squares for the worst case: it is the unproven case. */}
                  <Square tone="outline" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="f-closing" {...reveal(5.4)}>
        <RichText value={c.closing} />
      </p>
    </>
  );
}
