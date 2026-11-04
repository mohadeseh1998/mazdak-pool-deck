import { useEffect, useRef } from "react";
import { ui } from "../content/slides";
import { useDeck, type LightboxImage } from "./DeckContext";

interface Props {
  image: LightboxImage | null;
  onClose: () => void;
}

/** Full-size image viewer. Escape closes it and focus returns to the trigger. */
export function Lightbox({ image, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (image && !dialog.open) dialog.showModal();
    if (!image && dialog.open) dialog.close();
  }, [image]);

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={image?.caption}
      onClose={onClose}
      onClick={(e) => {
        // A click on the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {image && (
        <figure className="lightbox__panel">
          <img className="lightbox__img" src={image.src} alt={image.alt} />
          <figcaption className="lightbox__caption">
            <span>{image.caption}</span>
            <button type="button" className="button" onClick={onClose} autoFocus>
              {ui.close}
            </button>
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}

/** A slide image that opens the lightbox at full size. */
export function ZoomImage({
  src,
  alt,
  caption,
  className = "",
  thumb,
}: LightboxImage & { className?: string; /** What the slide shows, if not the full image. */ thumb?: string }) {
  const { openLightbox } = useDeck();
  return (
    <button
      type="button"
      className={`zoom ${className}`}
      aria-label={ui.openImage(caption)}
      onClick={(e) => openLightbox({ src, alt, caption }, e.currentTarget)}
    >
      <img src={thumb ?? src} alt={alt} draggable={false} />
    </button>
  );
}
