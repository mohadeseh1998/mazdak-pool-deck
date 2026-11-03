import { budgetRows } from "../content/budget";
import { priceRows } from "../content/pricing";
import { ui } from "../content/slides";
import { sources, sourcesChecked, type SourceKey } from "../content/sources";

/** Which slide rows each source supports, so every price can be traced. */
function usedFor(key: SourceKey): string {
  const rows = [
    ...priceRows.filter((r) => r.sources.includes(key)).map((r) => r.label),
    ...budgetRows.filter((r) => r.source === key).map((r) => r.line),
  ];
  return rows.join(", ");
}

/** Key S: the source register, so "where is that from" has an instant answer. */
export function SourcesOverlay() {
  return (
    <aside className="sources" aria-label={ui.sourcesHeading}>
      <h2 className="sources__heading">{ui.sourcesHeading}</h2>
      <p className="sources__checked">{sourcesChecked}</p>
      <dl className="sources__list">
        {(Object.keys(sources) as SourceKey[]).map((key) => {
          const s: { text: string; url?: string } = sources[key];
          const used = usedFor(key);
          return (
            <div key={key} className="sources__row">
              <dt>{key}</dt>
              <dd>
                <span>{s.text}</span>
                {used && <span className="sources__used">{used}</span>}
                {s.url && (
                  <a className="sources__url" href={s.url} target="_blank" rel="noreferrer">
                    {s.url.replace(/^https:\/\//, "")}
                  </a>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="sources__hint">{ui.sourcesHint}</p>
    </aside>
  );
}
