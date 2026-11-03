import { ui, type Note } from "../content/slides";
import { RichText } from "./RichText";

interface Props {
  notes: readonly Note[];
  n: number;
  total: number;
}

/** Key N: the speaking script for the current slide, over the lower third. */
export function PresenterNotes({ notes, n, total }: Props) {
  return (
    <aside className="notes" aria-label={ui.notesHeading}>
      <p className="notes__heading">
        {ui.notesHeading}, slide {ui.slideOf(n, total)}
      </p>
      {notes.map((note, i) => (
        <p key={i} className="notes__text">
          <RichText value={note} />
        </p>
      ))}
    </aside>
  );
}
