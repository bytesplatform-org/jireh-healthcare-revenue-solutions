/**
 * The concept page's shaders. Each one replaces (or lights up) something the
 * page already has, in its own palette — nothing is layered on top for show:
 *
 *   BLOB      hero violet card: the liquid-glass blob, now real — the card's own
 *             gradient refracts through it, liquid swirls inside, and a droplet
 *             follows the pointer and merges into it.
 *   PILL      the headline's striped pill: the stripes flow like liquid and bend
 *             toward the pointer, with a glint passing over.
 *   CURTAIN   "How we work": the dark stripe columns as lit fabric — the pointer
 *             brushes them aside, scrolling sets them rippling, a soft light
 *             follows the pointer and an aurora drifts low.
 *   CAUSTICS  testimonials: pool-light caustics on the aqua that rises like
 *             water; the pointer sends ripples through them.
 *   SILK      footer: the dusk panel as slow-flowing silk that catches the
 *             pointer's light.
 *
 * All are fragment bodies for engine.ts (HEADER supplies the inputs + noise).
 */

/* ------------------------------------------------------------------ */
export const BLOB = `
const vec3 INDIGO = vec3(0.235, 0.18, 0.62);
const vec3 AQUA = vec3(0.37, 0.88, 0.93);

vec2 c0, c1, c2, c3, d0, d1, d2, pm;
float rm;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float sdf(vec2 p) {
  float k = 0.11;
  float s = length(p - c0) - 0.27;
  s = smin(s, length(p - c1) - 0.13, k);
  s = smin(s, length(p - c2) - 0.10, k);
  s = smin(s, length(p - c3) - 0.065, k);
  s = smin(s, length(p - d0) - 0.034, 0.06);
  s = smin(s, length(p - d1) - 0.026, 0.06);
  s = smin(s, length(p - d2) - 0.042, 0.06);
  if (rm > 0.004) s = smin(s, length(p - pm) - rm, 0.13);
  return s;
}

// the card's own background (CSS: linear-gradient(135deg, #6f63e6, #8b80f2 55%, #b3a8f8))
vec3 cardBg(vec2 q) {
  vec2 dir = vec2(0.70710678);
  float len = (uRes.x + uRes.y) * 0.70710678;
  float t = clamp(dot(q - uRes * 0.5, dir) / len + 0.5, 0.0, 1.0);
  vec3 a = vec3(0.435, 0.388, 0.902), b = vec3(0.545, 0.502, 0.949), c = vec3(0.702, 0.659, 0.973);
  return t < 0.55 ? mix(a, b, t / 0.55) : mix(b, c, (t - 0.55) / 0.45);
}

void main() {
  float s = uRes.y;
  vec2 px = vUv * uRes;
  vec2 p = px / s;
  float W = uRes.x / s;
  float t = uTime;
  vec2 m = uMouse / s;
  // the blob leans toward the pointer while it's over the card
  vec2 lean = clamp(m - vec2(W - 0.42, 0.5), vec2(-1.0), vec2(1.0)) * 0.05 * uHover;

  c0 = vec2(W - 0.40, 0.50) + 0.035 * vec2(sin(t * 0.6), cos(t * 0.5)) + lean;
  c1 = vec2(W - 0.16, 0.24) + 0.05 * vec2(cos(t * 0.7), sin(t * 0.9)) + lean * 1.6;
  c2 = vec2(W - 0.62, 0.80) + 0.05 * vec2(sin(t * 0.8 + 1.0), cos(t * 0.6)) + lean * 1.3;
  c3 = vec2(W - 0.20, 0.82) + 0.06 * vec2(cos(t * 0.5 + 2.0), sin(t * 0.7)) + lean * 1.2;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float a = t * (0.22 + 0.05 * fi) + fi * 2.1;
    vec2 o = vec2(cos(a), sin(a) * 0.85) * (0.43 + 0.04 * sin(t * 0.9 + fi));
    if (i == 0) d0 = c0 + o; else if (i == 1) d1 = c0 + o; else d2 = c0 + o;
  }
  pm = m;
  rm = 0.095 * uHover;

  float sd = sdf(p);
  float e = 1.5 / s;
  vec2 g = vec2(sdf(p + vec2(e, 0.0)) - sd, sdf(p + vec2(0.0, e)) - sd) / e;
  g = length(g) > 0.0001 ? normalize(g) : vec2(0.0);

  // rounded bevel: flat-ish top, curving down to the rim
  float depth = -sd;
  float bev = clamp(depth / 0.14, 0.0, 1.0);
  float ang = bev * 1.5707963;
  vec3 n = normalize(vec3(g * cos(ang), sin(ang)));

  // refraction: the card's gradient, bent by the glass
  vec3 col = cardBg(px - n.xy * s * 0.22) * 1.06 + 0.07;
  // liquid moving inside
  float swirl = noise(p * 3.2 + vec2(t * 0.25, -t * 0.2)) * 0.5 + 0.5;
  col = mix(col, AQUA, smoothstep(0.02, 0.28, depth) * smoothstep(0.45, 0.85, swirl) * 0.45);
  // shaded underside (bottom-right of every drop), aqua light caught low on the rim
  col = mix(col, INDIGO, clamp(dot(n.xy, vec2(0.6, 0.75)), 0.0, 1.0) * 0.45);
  col += AQUA * pow(max(dot(n, normalize(vec3(0.6, 0.75, 0.3))), 0.0), 6.0) * 0.45;
  // highlights: specular from the top-left, a white fresnel rim
  vec3 L = normalize(vec3(-0.55, -0.7, 0.6));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  col += pow(max(dot(n, H), 0.0), 48.0) * 0.95;
  col += pow(1.0 - n.z, 3.0) * 0.35;

  float mask = clamp(0.5 - sd * s, 0.0, 1.0);
  // soft shadow on the card below-right
  float sdS = sdf(p - vec2(0.025, 0.06));
  float sh = (1.0 - smoothstep(-0.04, 0.14, sdS)) * 0.26 * (1.0 - mask);
  vec4 shadow = vec4(vec3(0.16, 0.11, 0.45) * sh, sh);
  gl_FragColor = vec4(clamp(col, 0.0, 1.0) * mask, mask) + shadow * (1.0 - mask);
}`;

/* ------------------------------------------------------------------ */
export const PILL = `
const vec3 A = vec3(0.624, 0.890, 0.925); // #9fe3ec
const vec3 L = vec3(0.788, 0.722, 0.961); // #c9b8f5
const vec3 P = vec3(0.906, 0.839, 0.984); // #e7d6fb

void main() {
  vec2 px = vUv * uRes;
  float h = uRes.y;
  // capsule
  vec2 c = uRes * 0.5;
  vec2 q = abs(px - c) - vec2(c.x - c.y, 0.0);
  float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - c.y;
  float mask = clamp(0.5 - sd, 0.0, 1.0);

  // the pointer's pull (it doesn't have to be on the pill: it reaches a little way out)
  vec2 d = px - uMouse;
  float near = exp(-dot(d, d) / (h * h * 2.2)) * max(uHover, uActive * 0.7);
  // liquid stripes: waves running through them, pulled toward the pointer
  float wave = sin(vUv.y * 6.0 + uTime * 2.2) * 0.06 * h + sin(vUv.y * 11.0 - uTime * 3.1) * 0.025 * h;
  float bend = clamp(uMouse.x - px.x, -h, h) * near * 0.45 + clamp(uVel.x, -20.0, 20.0) * near * 0.6;
  float period = h * 0.389;
  float x = px.x + wave + bend - uTime * h * 0.16;
  float s = fract(x / period);
  float e = 0.8 / period;
  vec3 col = mix(A, L, smoothstep(0.3214 - e, 0.3214 + e, s));
  col = mix(col, P, smoothstep(0.7143 - e, 0.7143 + e, s));
  col = mix(col, A, smoothstep(1.0 - e, 1.0, s));

  // a rounded, glassy capsule: light on top, a touch of shade below
  col = mix(col, vec3(1.0), smoothstep(0.5, 0.05, vUv.y) * 0.28);
  col *= 1.0 - smoothstep(0.6, 1.0, vUv.y) * 0.08;
  // a glint passing over every few seconds, and one riding with the pointer
  float sweep = fract(uTime * 0.16) * 2.2 - 0.6;
  float glint = exp(-pow((vUv.x + vUv.y * 0.25 - sweep) * 7.0, 2.0)) * 0.45;
  glint += exp(-pow((px.x - uMouse.x) / (h * 0.5), 2.0)) * smoothstep(0.55, 0.1, vUv.y) * near * 0.5;
  col = mix(col, vec3(1.0), clamp(glint, 0.0, 1.0));

  gl_FragColor = vec4(col * mask, mask);
}`;

/* ------------------------------------------------------------------ */
export const CURTAIN = `
const vec3 S0 = vec3(0.110, 0.086, 0.267); // #1c1644
const vec3 S1 = vec3(0.133, 0.106, 0.310); // #221b4f
const vec3 S2 = vec3(0.122, 0.094, 0.286); // #1f1849
const vec3 VIOLET = vec3(0.435, 0.388, 0.902);
const vec3 SKY = vec3(0.373, 0.659, 0.961);
const vec3 LILAC = vec3(0.827, 0.608, 0.902);

void main() {
  vec2 px = vUv * uRes;
  float colW = uRes.x / 14.0;

  // the pointer brushes the columns aside (strongest where it is, fading down
  // and up the fabric); scrolling sets them rippling
  vec2 d = px - uMouse;
  float near = exp(-dot(d * vec2(1.0, 0.45), d * vec2(1.0, 0.45)) / (220.0 * 220.0));
  float push = clamp(uVel.x, -40.0, 40.0) * near * 2.2 * (0.4 + 0.6 * uHover);
  float sway = sin(px.y * 0.007 - uTime * 1.6) * clamp(uScroll, -60.0, 60.0) * 0.35;
  sway += sin(px.y * 0.004 + uTime * 0.6) * 3.0;
  float xw = px.x - push + sway;

  float ci = floor(xw / colW);
  float f = fract(xw / colW);
  float k = mod(ci, 3.0);
  vec3 col = k < 0.5 ? S0 : (k < 1.5 ? S1 : S2);
  // each column is a soft fold, catching a slow light that travels across them
  float fold = sin(f * 3.14159);
  float travel = 0.5 + 0.5 * sin(ci * 0.75 - uTime * 0.7 + px.y * 0.0025);
  col *= 0.9 + 0.12 * fold + 0.08 * travel * fold;

  // aurora low in the stage
  float a = fbm(vec2(px.x * 0.0018 + uTime * 0.025, px.y * 0.0022 - uTime * 0.018));
  float glow = smoothstep(-0.05, 0.5, a) * smoothstep(0.15, 1.0, vUv.y);
  vec3 tint = mix(VIOLET, SKY, smoothstep(-0.3, 0.4, fbm(px * 0.0012 + 3.0 + uTime * 0.02)));
  col += tint * glow * 0.2 * (0.8 + 0.2 * fold);

  // the pointer's light
  float spot = exp(-dot(d, d) / (300.0 * 300.0));
  col += mix(VIOLET, LILAC, vUv.x) * spot * (0.05 + 0.2 * uHover) * (0.75 + 0.35 * fold);

  // grain
  col += (hash(px + fract(uTime) * 100.0) - 0.5) * 0.02;
  gl_FragColor = vec4(col, 1.0);
}`;

/* ------------------------------------------------------------------ */
export const CAUSTICS = `
// distance between the two nearest moving cell points: ~0 on the cell edges,
// which is where pool light gathers
float edge(vec2 p, float t) {
  vec2 i = floor(p), f = fract(p);
  float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++)
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = hash2(i + g);
      o = 0.5 + 0.42 * sin(t + 6.2831 * o);
      vec2 r = g + o - f;
      float dd = dot(r, r);
      if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) { d2 = dd; }
    }
  return sqrt(d2) - sqrt(d1);
}

void main() {
  vec2 px = vUv * uRes;
  // ripples from the pointer
  vec2 d = px - uMouse;
  float dist = length(d);
  float rip = sin(dist * 0.045 - uTime * 5.0) * exp(-dist * 0.0055) * (0.35 * uActive + 0.65 * uHover * uActive);
  vec2 rp = px + (dist > 0.001 ? d / dist : vec2(0.0)) * rip * 26.0;

  vec2 p = rp / 150.0;
  p += 0.28 * vec2(noise(p * 0.7 + uTime * 0.12), noise(p * 0.7 - uTime * 0.1 + 5.0));
  float c1 = 1.0 - smoothstep(0.0, 0.11, edge(p, uTime * 0.9));
  float c2 = 1.0 - smoothstep(0.0, 0.09, edge(p * 1.7 + 3.1, uTime * 1.2 + 2.0));
  float c = c1 * 0.75 + c2 * 0.4 + c1 * c2 * 0.6;

  // brighter toward the surface (top), soft shafts slanting down
  float depth = mix(0.62, 0.28, vUv.y);
  float shaft = smoothstep(0.05, 0.45, fbm(vec2((px.x + px.y * 0.35) * 0.004, uTime * 0.06))) * (1.0 - vUv.y) * 0.22;
  float ring = max(rip, 0.0) * 0.12;
  float a = clamp(c * depth + shaft + ring, 0.0, 0.85);
  vec3 col = mix(vec3(1.0), vec3(0.85, 1.0, 1.0), 0.5);
  gl_FragColor = vec4(col * a, a);
}`;

/* ------------------------------------------------------------------ */
export const SILK = `
const vec3 VIOLET = vec3(0.435, 0.388, 0.902);
const vec3 SKY = vec3(0.373, 0.659, 0.961);
const vec3 LILAC = vec3(0.827, 0.608, 0.902);

void main() {
  vec2 px = vUv * uRes;
  // the panel's own gradient (CSS: 150deg, #3b2f8f → #2a2160 55% → #1a1530)
  float gpos = clamp(dot(vUv - 0.5, normalize(vec2(0.5 * uRes.x / uRes.y, 0.866))) * 1.1 + 0.5, 0.0, 1.0);
  vec3 base = gpos < 0.55
    ? mix(vec3(0.231, 0.184, 0.561), vec3(0.165, 0.129, 0.376), gpos / 0.55)
    : mix(vec3(0.165, 0.129, 0.376), vec3(0.102, 0.082, 0.188), (gpos - 0.55) / 0.45);

  // the pointer presses into the silk
  vec2 d = px - uMouse;
  float near = exp(-dot(d, d) / (420.0 * 420.0));
  vec2 p = px / 560.0 - d / 560.0 * near * 0.35 * uHover;
  float t = uTime * 0.05;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 2.6 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p + 2.6 * q + vec2(8.3, 2.8) - t));
  float v = fbm(p + 2.6 * r);

  vec3 col = base;
  col += VIOLET * pow(clamp(v * 1.5 + 0.35, 0.0, 1.0), 3.0) * 0.42;
  col += SKY * pow(clamp(r.x * 1.6 + 0.2, 0.0, 1.0), 4.0) * 0.22;
  col += LILAC * pow(clamp(q.y * 1.8 + 0.1, 0.0, 1.0), 5.0) * 0.16;
  // fades toward the bottom, where the wordmark sits
  col = mix(col, base, smoothstep(0.55, 1.0, vUv.y) * 0.5);
  // the pointer's light on the folds
  col += vec3(0.62, 0.56, 1.0) * near * (0.05 + 0.16 * uHover) * (0.7 + v);
  col += (hash(px + fract(uTime) * 100.0) - 0.5) * 0.018;
  gl_FragColor = vec4(col, 1.0);
}`;
