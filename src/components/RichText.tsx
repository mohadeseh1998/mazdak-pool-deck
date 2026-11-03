import type { Rich } from "../content/slides";
import { Claim } from "./Claim";

// Product names never break at their hyphen, even on fallback fonts.
const UNBREAKABLE = /(anti-algae|Anti-Algae|Anti-algae)/;

/** Plain text with product names held together. */
export function Plain({ text }: { text: string }) {
  const parts = text.split(UNBREAKABLE);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <span key={i} className="nowrap">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Renders the inline rich text shapes used in slides.ts. */
export function RichText({ value }: { value: Rich }) {
  if (typeof value === "string") return <Plain text={value} />;
  return (
    <>
      {value.map((node, i) => {
        if (typeof node === "string") return <Plain key={i} text={node} />;
        if ("b" in node) return <strong key={i}>{node.b}</strong>;
        return (
          <Claim key={i} id={node.claim} after={node.after}>
            <RichText value={node.text} />
          </Claim>
        );
      })}
    </>
  );
}

/** A 10px square: evidence and list markers (brief Section 6). */
export function Square({ tone }: { tone: "pool" | "algae" | "silt" | "outline" }) {
  return <span className={`sq sq--${tone}`} aria-hidden="true" />;
}
