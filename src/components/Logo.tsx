import { assets, LOGO_NATIVE_W } from "../content/assets";
import { ui, type Ground } from "../content/slides";

const LOGO_NATIVE_H = 76;

interface Props {
  ground: Ground;
  width: number;
  className?: string;
}

/**
 * The client logo (brief Section 3). Never drawn wider than its native 675px.
 * On dark grounds it sits on a small paper tile so its blue box and green text
 * stay readable. If the file is missing, the name is set in the display font.
 */
export function Logo({ ground, width, className = "" }: Props) {
  if (!assets.logo) {
    return <span className={`logo-text ${className}`}>{ui.companyName}</span>;
  }
  const w = Math.min(width, LOGO_NATIVE_W);
  const h = Math.round((w * LOGO_NATIVE_H) / LOGO_NATIVE_W);
  return (
    <span className={`logo${ground === "deep" ? " logo--tile" : ""} ${className}`}>
      <img src={assets.logo} alt={ui.logoAlt} width={w} height={h} style={{ maxWidth: LOGO_NATIVE_W }} />
    </span>
  );
}
