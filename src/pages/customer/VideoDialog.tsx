import { createContext, useContext, useEffect, useRef } from "react";
import { VideoPanel } from "../shared/kit";
import { ui, video } from "./content/slides";

/** Keys a browser would use to scroll the page. Space is left to the buttons. */
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"]);

/** Opens the video lightbox from section 3, with the element that opened it. */
export const VideoContext = createContext<(trigger: HTMLElement) => void>(() => {});
export const useOpenVideo = () => useContext(VideoContext);

/**
 * The root deck's video panel, in the root deck's lightbox style. It opens on
 * a poster and plays only when clicked; closing it stops the video.
 */
export function VideoDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="lightbox video-dialog"
      aria-label={video.title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        // The page behind holds still. A native video player keeps its arrows.
        if (SCROLL_KEYS.has(e.key) && (e.target as HTMLElement).tagName !== "VIDEO") e.preventDefault();
      }}
    >
      {/* Unmounted when closed, so nothing keeps playing behind the page. */}
      {open && (
        <div className="video-dialog__panel">
          <VideoPanel video={video} active={open} />
          <div className="video-dialog__bar">
            <a href={video.watchUrl} target="_blank" rel="noreferrer">
              {video.watchUrl.replace(/^https:\/\//, "")}
            </a>
            <button type="button" className="button" onClick={onClose} autoFocus>
              {ui.close}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
