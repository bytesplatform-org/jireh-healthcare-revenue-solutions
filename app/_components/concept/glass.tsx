import { useId, type ReactNode } from "react";
import { cx } from "../ui/primitives";

export type GlassKind = "shield" | "claim" | "coin" | "cycle" | "seal" | "chart" | "heart";
type Tint = "violet" | "sky" | "lilac" | "aqua" | "dusk";

/** light → mid for the glass body, deep for the inset details, glow for the shadow. */
const TINTS: Record<Tint, { light: string; mid: string; deep: string; glow: string }> = {
  violet: { light: "#ece9ff", mid: "#b7affa", deep: "#6f63e6", glow: "rgb(111 99 230 / 0.38)" },
  sky: { light: "#e8f3ff", mid: "#a9d0fb", deep: "#4b8ff0", glow: "rgb(75 143 240 / 0.36)" },
  lilac: { light: "#fbefff", mid: "#e6c2f0", deep: "#b46fd0", glow: "rgb(180 111 208 / 0.32)" },
  aqua: { light: "#e9fbfc", mid: "#a8e6ee", deep: "#2aa9bb", glow: "rgb(42 169 187 / 0.32)" },
  dusk: { light: "#e6e2ff", mid: "#9d93f0", deep: "#3b2f8f", glow: "rgb(10 5 40 / 0.5)" },
};

/** Twelve-point scalloped seal outline (approval stamp). */
const SEAL = Array.from({ length: 24 }, (_, k) => {
  const a = (k * 15 * Math.PI) / 180;
  const r = k % 2 ? 64 : 74;
  return `${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`;
}).join(" ");

/**
 * The concept page's glass objects, each standing for something Jireh does —
 * drawn from the logo (shield + cross, coins, the swoosh) and the services:
 *
 *   shield  coverage, authorization, compliance     coin   payments, reimbursement
 *   claim   claims, documentation (+ approval tick)  cycle  follow-up, the revenue cycle
 *   seal    denials resolved, credentials            chart  reporting, growth
 *   heart   care, the people behind every claim
 *
 * All share the page's soft-glass lighting: white highlight top-left, a tinted
 * body shading to the bottom-right, a white rim, inset details in the deep tint
 * and a coloured glow beneath. Size with className (width); data-* attributes
 * pass through for the scroll/pointer motion hooks.
 */
export function Glass({
  kind,
  tint = "violet",
  className,
  ...data
}: { kind: GlassKind; tint?: Tint; className?: string } & Record<`data-${string}`, string | number | boolean>) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const t = TINTS[tint];
  const body = `url(#${id}b)`;
  const shade = `url(#${id}s)`;
  const shine = `url(#${id}h)`;
  const detail = `url(#${id}d)`;
  const rim = { stroke: "rgb(255 255 255 / 0.9)", strokeWidth: 1.5 };

  /** body fill + shading + highlight, stacked on the same outline */
  const layered = (shape: (fill: string, extra?: object) => ReactNode) => (
    <>
      {shape(body, rim)}
      {shape(shade)}
      {shape(shine)}
    </>
  );

  return (
    <div aria-hidden {...data} className={cx("pointer-events-none", className)}>
      <svg viewBox="0 0 200 200" className="block h-auto w-full overflow-visible" style={{ filter: `drop-shadow(0 18px 22px ${t.glow})` }}>
        <defs>
          <linearGradient id={`${id}b`} x1="0.15" y1="0.05" x2="0.85" y2="0.95">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.45" stopColor={t.light} />
            <stop offset="1" stopColor={t.mid} />
          </linearGradient>
          <radialGradient id={`${id}s`} cx="0.78" cy="0.84" r="0.7">
            <stop offset="0" stopColor={t.deep} stopOpacity="0.42" />
            <stop offset="1" stopColor={t.deep} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}h`} cx="0.3" cy="0.22" r="0.42">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}d`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={t.mid} />
            <stop offset="1" stopColor={t.deep} />
          </linearGradient>
        </defs>

        {kind === "shield" && (
          <>
            {layered((fill, extra) => (
              <path d="M100 18C122 30 144 36 164 38V92C164 136 136 166 100 182C64 166 36 136 36 92V38C56 36 78 30 100 18Z" fill={fill} {...extra} />
            ))}
            <rect x="88" y="60" width="24" height="76" rx="9" fill={detail} />
            <rect x="62" y="86" width="76" height="24" rx="9" fill={detail} />
            <rect x="91" y="63" width="6" height="30" rx="3" fill="#fff" opacity="0.45" />
          </>
        )}

        {kind === "claim" && (
          <>
            <g transform="rotate(-9 106 96)" opacity="0.7">
              {layered((fill, extra) => <rect x="62" y="26" width="96" height="128" rx="16" fill={fill} {...extra} />)}
            </g>
            {layered((fill, extra) => <rect x="42" y="38" width="98" height="130" rx="16" fill={fill} {...extra} />)}
            {[64, 82, 100, 118].map((y, i) => (
              <rect key={y} x="60" y={y} width={[62, 50, 56, 36][i]} height="8" rx="4" fill={detail} opacity="0.55" />
            ))}
            <circle cx="140" cy="152" r="27" fill={detail} />
            <circle cx="140" cy="152" r="27" fill={shine} opacity="0.5" />
            <path d="M127 153l9 9 17-19" fill="none" stroke="#fff" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {kind === "coin" && (
          <>
            <circle cx="100" cy="114" r="66" fill={detail} />
            {layered((fill, extra) => <circle cx="100" cy="100" r="66" fill={fill} {...extra} />)}
            <circle cx="100" cy="100" r="50" fill="none" stroke={detail} strokeWidth="3" opacity="0.45" />
            <text x="100" y="125" textAnchor="middle" fontSize="72" fontWeight="600" fill={detail} style={{ fontFamily: "var(--font-urbanist), ui-sans-serif, sans-serif" }}>
              $
            </text>
          </>
        )}

        {kind === "cycle" && (
          <>
            <path d="M45.5 80.2A58 58 0 0 1 154.5 80.2" fill="none" stroke={body} strokeWidth="24" strokeLinecap="round" />
            <path d="M45.5 80.2A58 58 0 0 1 154.5 80.2" fill="none" stroke={shade} strokeWidth="24" strokeLinecap="round" />
            <path d="M160.7 101 172 73 139 84Z" fill={body} stroke={body} strokeWidth="6" strokeLinejoin="round" />
            <path d="M154.5 119.8A58 58 0 0 1 45.5 119.8" fill="none" stroke={detail} strokeWidth="24" strokeLinecap="round" />
            <path d="M39.3 99 28 127 61 116Z" fill={detail} stroke={detail} strokeWidth="6" strokeLinejoin="round" />
            <path d="M52 70A52 52 0 0 1 120 46" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          </>
        )}

        {kind === "seal" && (
          <>
            {layered((fill, extra) => (
              <polygon points={SEAL} fill={fill} stroke={fill} strokeWidth="10" strokeLinejoin="round" {...extra} />
            ))}
            <circle cx="100" cy="100" r="46" fill={detail} />
            <circle cx="100" cy="100" r="46" fill={shine} opacity="0.45" />
            <path d="M80 101l13 13 28-30" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {kind === "chart" && (
          <>
            {[
              { x: 34, y: 112, h: 58 },
              { x: 80, y: 82, h: 88 },
            ].map((b) => (
              <g key={b.x}>{layered((fill, extra) => <rect x={b.x} y={b.y} width="36" height={b.h} rx="12" fill={fill} {...extra} />)}</g>
            ))}
            <rect x="126" y="46" width="36" height="124" rx="12" fill={detail} />
            <rect x="126" y="46" width="36" height="124" rx="12" fill={shine} opacity="0.55" />
            <path d="M40 92 92 58l28 12 42-42" fill="none" stroke={detail} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
            <path d="M146 26h18v18" fill="none" stroke={detail} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          </>
        )}

        {kind === "heart" && (
          <>
            {layered((fill, extra) => (
              <path d="M100 172C42 132 22 100 30 70 38 42 74 32 100 60 126 32 162 42 170 70 178 100 158 132 100 172Z" fill={fill} {...extra} />
            ))}
            <path d="M52 66C58 54 72 50 82 56" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
          </>
        )}
      </svg>
    </div>
  );
}
