import { slides, ui } from "../content/slides";
import { useDeck } from "./DeckContext";

/** Eight clickable segments; the current slide is filled pool blue. */
export function ProgressRail({ current }: { current: number }) {
  const { go } = useDeck();
  return (
    <nav className="progress" aria-label="Slides">
      {slides.map((s, i) => (
        <button
          key={s.n}
          type="button"
          className={`progress__seg${i === current ? " is-current" : ""}`}
          aria-label={ui.goTo(s.n, s.title)}
          aria-current={i === current ? "step" : undefined}
          onClick={() => go(i)}
        />
      ))}
    </nav>
  );
}
