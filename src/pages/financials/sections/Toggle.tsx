import type { KeyboardEvent } from "react";
import { seasonsSlide as c } from "../content/slides";
import { useScenario } from "../scenario";

/**
 * The signature element: a Base / Worst pill. Click either side, or press W
 * anywhere on the page. A radio group, so arrow keys move between the two.
 */
export function ScenarioToggle() {
  const { scenario, set } = useScenario();
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      // Arrows move within the group here, not between sections.
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      set(scenario === "base" ? "worst" : "base");
    }
  };
  return (
    <div className="f-toggle-wrap">
      <div className={`f-toggle is-${scenario}`} role="radiogroup" aria-label={c.toggle.label} onKeyDown={onKeyDown}>
        <span className="f-toggle__thumb" aria-hidden="true" />
        {c.toggle.options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={scenario === o.id}
            tabIndex={scenario === o.id ? 0 : -1}
            className={`f-toggle__opt f-toggle__opt--${o.id}`}
            onClick={() => set(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <kbd className="key f-toggle__key" aria-hidden="true">
        {c.toggle.key}
      </kbd>
    </div>
  );
}
