import { forwardRef, useEffect, useState, type ReactNode } from "react";

export const STAGE_W = 1600;
export const STAGE_H = 900;

function fit(): number {
  return Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
}

export function useStageScale(): number {
  const [scale, setScale] = useState(fit);
  useEffect(() => {
    const onResize = () => setScale(fit());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return scale;
}

interface StageProps {
  scale: number;
  children: ReactNode;
  onPointerMove?: () => void;
}

/** A fixed 1600 by 900 canvas, transform-scaled into the viewport with letterboxing. */
export const Stage = forwardRef<HTMLDivElement, StageProps>(function Stage({ scale, children, onPointerMove }, ref) {
  return (
    <div className="letterbox" onPointerMove={onPointerMove}>
      <div
        ref={ref}
        className="stage"
        tabIndex={-1}
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
});
