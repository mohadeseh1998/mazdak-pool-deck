import { useCallback, useEffect, useRef, useState } from "react";
import { assets } from "../content/assets";
import type { videoSlide } from "../content/slides";

type Mode = "poster" | "loading" | "playing" | "local" | "unavailable";

const LOAD_TIMEOUT_MS = 4000;

interface Props {
  video: (typeof videoSlide)["video"];
  active: boolean;
}

/** Resolves true if an image from the YouTube hosts loads within the timeout. */
function probe(url: string, timeout: number): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = window.setTimeout(() => resolve(false), timeout);
    img.onload = () => {
      window.clearTimeout(timer);
      resolve(true);
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      resolve(false);
    };
    img.src = url;
  });
}

/**
 * Slide 4 video, reused from the Gate 1 deck (brief Section 7.2). Lazy: a
 * poster with a play control until clicked. Fallback order: YouTube; if it has
 * not loaded within 4 seconds, assets/pool-video.mp4 if present; otherwise the
 * poster with a visible link. Keys pressed inside never change slides.
 */
export function VideoPanel({ video, active }: Props) {
  const local = assets.video;
  const [mode, setMode] = useState<Mode>("poster");
  const [thumbOk, setThumbOk] = useState<boolean | null>(null);
  const [focusWithin, setFocusWithin] = useState(false);
  const [iframeFocused, setIframeFocused] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timer = useRef<number>();

  const fallback: Mode = local ? "local" : "unavailable";
  // The YouTube thumbnail, falling back to the bottles under a 40 percent scrim.
  const posterSrc = thumbOk ? video.posterUrl : assets.bottles;
  const scrim = !thumbOk;

  // Leaving the slide stops playback and returns to the poster, so audio never
  // runs behind another slide.
  useEffect(() => {
    if (active) return;
    window.clearTimeout(timer.current);
    setMode((m) => (m === "unavailable" || m === "local" ? m : "poster"));
    videoRef.current?.pause();
  }, [active]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // A cross-origin iframe swallows every keystroke; the window only sees a blur.
  useEffect(() => {
    const onBlur = () => {
      window.setTimeout(() => {
        const el = document.activeElement;
        setIframeFocused(!!el && el.tagName === "IFRAME" && !!panelRef.current?.contains(el));
      }, 0);
    };
    const onFocus = () => setIframeFocused(false);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const play = useCallback(async () => {
    if (!navigator.onLine) {
      setMode(fallback);
      return;
    }
    setMode("loading");
    // A browser shows its own error page inside an iframe that cannot connect,
    // and still fires `load`, so check the YouTube hosts are reachable first.
    const reachable =
      thumbOk === true || (await probe(`https://www.youtube-nocookie.com/favicon.ico?${Date.now()}`, LOAD_TIMEOUT_MS));
    if (!reachable) {
      setMode(fallback);
      return;
    }
    setMode("playing");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMode(fallback), LOAD_TIMEOUT_MS);
  }, [thumbOk, fallback]);

  const onIframeLoad = () => window.clearTimeout(timer.current);

  const showHint = focusWithin || iframeFocused;

  return (
    <div className="video">
      <div
        ref={panelRef}
        className="video__frame"
        data-keytrap
        onFocus={() => setFocusWithin(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
        }}
      >
        {mode === "playing" ? (
          <iframe
            className="video__iframe"
            src={`${video.embedUrl}&autoplay=1`}
            title={video.title}
            allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={onIframeLoad}
          />
        ) : mode === "local" && local ? (
          <video
            ref={videoRef}
            className="video__native"
            src={local}
            poster={assets.bottles}
            controls
            playsInline
            preload="metadata"
            aria-label={video.title}
          />
        ) : (
          <div className={`video__poster${scrim ? " video__poster--bottles" : ""}`}>
            {posterSrc && <img className="video__poster-img" src={posterSrc} alt={video.posterAlt} />}
            {/* Probe the thumbnail quietly; the bottles stay up if it never arrives. */}
            {thumbOk === null && (
              <img
                className="visually-hidden"
                src={video.posterUrl}
                alt=""
                onLoad={(e) => setThumbOk((e.currentTarget as HTMLImageElement).naturalWidth > 120)}
                onError={() => setThumbOk(false)}
              />
            )}
            {scrim && <div className="video__scrim" aria-hidden="true" />}
            {mode === "unavailable" ? (
              <div className="video__unavailable">
                <p>{video.fallback}</p>
                <a href={video.watchUrl} target="_blank" rel="noreferrer">
                  {video.fallbackLink}
                </a>
              </div>
            ) : (
              <button
                type="button"
                className="video__play"
                onClick={play}
                aria-label={video.playLabel}
                aria-busy={mode === "loading"}
              >
                <svg width="36" height="40" viewBox="0 0 36 40" aria-hidden="true">
                  <path d="M4 2 L34 20 L4 38 Z" />
                </svg>
              </button>
            )}
          </div>
        )}
        {showHint && (
          <p className="video__hint" role="status">
            {iframeFocused ? video.iframeHint : video.escapeHint}
          </p>
        )}
      </div>

      <p className="video__caption">{video.caption}</p>
      {/* Print replaces the player with the poster and the address as text. */}
      <p className="video__print-url">{video.watchUrl}</p>
    </div>
  );
}
