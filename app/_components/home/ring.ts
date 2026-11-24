/** Shared geometry for the revenue-cycle rings (pinned cycle scene). */

export const RING = { size: 400, c: 200, r: 150 } as const;

/** Server (Node) and browser Math.cos/sin can differ in the last digits: round so hydration matches. */
const r3 = (v: number) => Math.round(v * 1000) / 1000;

/** Angle (deg) of node i of n, starting at 12 o'clock, clockwise. */
export const nodeAngle = (i: number, n: number) => -90 + (360 / n) * i;

/** Point on a circle of radius r around the ring centre, as % of the box (for HTML overlays). */
export function polarPct(angleDeg: number, r: number) {
  const a = (angleDeg * Math.PI) / 180;
  return {
    left: r3(((RING.c + r * Math.cos(a)) / RING.size) * 100),
    top: r3(((RING.c + r * Math.sin(a)) / RING.size) * 100),
  };
}

/** Same point in SVG user units. */
export function polar(angleDeg: number, r: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: r3(RING.c + r * Math.cos(a)), y: r3(RING.c + r * Math.sin(a)) };
}
