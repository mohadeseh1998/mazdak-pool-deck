import type { ComponentType, ReactNode } from "react";
import { Claim as SharedClaim } from "../../components/Claim";
import { PresenterNotes as SharedNotes } from "../../components/PresenterNotes";
import { RichText as SharedRichText } from "../../components/RichText";
import { SlideFrame as SharedSlideFrame } from "../../components/SlideFrame";
import { VideoPanel as SharedVideoPanel } from "../../components/VideoPanel";
import type { PageSlide, Rich } from "./types";

// The root deck's own components, reused as they are. The type checker reads
// them against the root deck's content; at build time each page answers their
// content imports with its own files (vite.config.ts, pageContent). These
// re-exports only restate their props in terms of the page's content types.
// scripts/check-content.mjs checks that every claim id a page uses exists in
// that page's registry.

export { CountUp } from "../../components/CountUp";
export { DemoTimer } from "../../components/DemoTimer";
export { ZoomImage } from "../../components/Lightbox";
export { Logo } from "../../components/Logo";
export { PriceStrip } from "../../components/PriceStrip";
export { reveal, useSlideMotion } from "../../components/reveal";
export { Plain, Square } from "../../components/RichText";

export const Claim = SharedClaim as unknown as ComponentType<{ id: string; children: ReactNode; after?: string }>;

export const RichText = SharedRichText as unknown as ComponentType<{ value: Rich }>;

export const SlideFrame = SharedSlideFrame as unknown as ComponentType<{
  slide: PageSlide;
  index: number;
  className?: string;
  children: ReactNode;
}>;

export const PresenterNotes = SharedNotes as unknown as ComponentType<{ notes: readonly Rich[]; n: number; total: number }>;

export interface VideoInfo {
  youtubeId: string;
  watchUrl: string;
  embedUrl: string;
  posterUrl: string;
  title: string;
  caption: string;
  playLabel: string;
  escapeHint: string;
  iframeHint: string;
  fallback: string;
  fallbackLink: string;
  posterAlt: string;
}

export const VideoPanel = SharedVideoPanel as unknown as ComponentType<{ video: VideoInfo; active: boolean }>;
