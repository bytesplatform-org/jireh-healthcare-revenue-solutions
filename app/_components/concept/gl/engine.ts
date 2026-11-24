import { gsap } from "../../motion/gsap";

/**
 * A tiny WebGL1 runner for the concept page's shader surfaces (no library).
 *
 * Each surface is one <canvas> drawing one full-screen fragment shader. They
 * share a single pointer/scroll tracker and GSAP's ticker, and only draw while
 * on screen. Every shader gets the same inputs (declared in HEADER):
 *
 *   vUv      0..1, top-left origin        uRes     size in CSS px
 *   uTime    seconds                      uMouse   pointer, CSS px in the surface (eased)
 *   uVel     pointer velocity (px/frame)  uHover   0..1, eased: pointer over the surface
 *   uActive  0..1, the pointer moved recently (anywhere)
 *   uScroll  page scroll velocity (px/frame, signed, smoothed)
 *
 * plus noise helpers (noise, fbm, hash). Output is premultiplied alpha.
 */

export type UniformValue = number | readonly [number, number] | readonly [number, number, number] | readonly [number, number, number, number];
export type Uniforms = (canvas: HTMLCanvasElement) => Record<string, UniformValue>;

export type SurfaceOptions = {
  canvas: HTMLCanvasElement;
  /** Fragment shader body (HEADER is prepended). */
  frag: string;
  /** Render scale on top of the (capped) device pixel ratio: 0.5 for soft backgrounds. */
  resolution?: number;
  maxDpr?: number;
  /** Sampler uniform name → image URL. The surface is "ready" once all have loaded. */
  textures?: Record<string, string>;
  /** Extra uniforms, read every frame. */
  uniforms?: Uniforms;
  onReady?: () => void;
  onLost?: () => void;
};

const VERT = `attribute vec2 aPos; varying vec2 vUv;
void main(){ vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5); gl_Position = vec4(aPos, 0.0, 1.0); }`;

export const HEADER = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform float uHover;
uniform float uActive;
uniform float uScroll;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}
// gradient noise, -1..1
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  vec2 a = hash2(i) * 2.0 - 1.0, b = hash2(i + vec2(1.0, 0.0)) * 2.0 - 1.0;
  vec2 c = hash2(i + vec2(0.0, 1.0)) * 2.0 - 1.0, d = hash2(i + vec2(1.0, 1.0)) * 2.0 - 1.0;
  return mix(mix(dot(a, f), dot(b, f - vec2(1.0, 0.0)), u.x), mix(dot(c, f - vec2(0.0, 1.0)), dot(d, f - vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * noise(p); p = p * 2.03 + vec2(17.1, 9.4); a *= 0.5; }
  return s;
}
`;

/* ---------------- shared pointer + scroll state ---------------- */

const shared = {
  users: 0,
  x: 0,
  y: 0,
  known: false,
  inside: false,
  lastMove: -1e9,
  scrollY: 0,
  scrollVel: 0,
};
let detachShared: (() => void) | null = null;

function attachShared() {
  if (shared.users++ > 0) return;
  shared.scrollY = window.scrollY;
  const move = (e: PointerEvent) => {
    shared.x = e.clientX;
    shared.y = e.clientY;
    shared.known = true;
    shared.inside = true;
    shared.lastMove = performance.now();
  };
  const leave = () => (shared.inside = false);
  const tick = () => {
    const y = window.scrollY;
    shared.scrollVel += (y - shared.scrollY - shared.scrollVel) * 0.12;
    shared.scrollY = y;
  };
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("pointerdown", move, { passive: true });
  document.documentElement.addEventListener("pointerleave", leave);
  gsap.ticker.add(tick);
  detachShared = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerdown", move);
    document.documentElement.removeEventListener("pointerleave", leave);
    gsap.ticker.remove(tick);
  };
}
function detach() {
  if (--shared.users > 0) return;
  detachShared?.();
  detachShared = null;
}

/* ---------------- a surface ---------------- */

/** Returns a destroy function, or null when WebGL (or the shader) isn't available. */
export function createSurface(o: SurfaceOptions): (() => void) | null {
  const { canvas } = o;
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: "low-power" });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      if (process.env.NODE_ENV !== "production") console.warn("[shader]", gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, HEADER + o.frag);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const locs = new Map<string, WebGLUniformLocation | null>();
  const set = (name: string, v: UniformValue) => {
    let loc = locs.get(name);
    if (loc === undefined) {
      loc = gl.getUniformLocation(prog, name);
      locs.set(name, loc);
    }
    if (!loc) return;
    if (typeof v === "number") gl.uniform1f(loc, v);
    else if (v.length === 2) gl.uniform2f(loc, v[0], v[1]);
    else if (v.length === 3) gl.uniform3f(loc, v[0], v[1], v[2]);
    else gl.uniform4f(loc, v[0], v[1], v[2], v[3]);
  };

  // textures
  const texNames = Object.keys(o.textures ?? {});
  let pending = texNames.length;
  const textures: WebGLTexture[] = [];
  const images: HTMLImageElement[] = [];
  texNames.forEach((name, unit) => {
    const tex = gl.createTexture()!;
    textures.push(tex);
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(prog, name), unit);
    const img = new Image();
    images.push(img);
    img.decoding = "async";
    img.onload = () => {
      if (gl.isContextLost()) return;
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      pending--;
    };
    img.src = o.textures![name];
  });

  // size
  let w = 0;
  let h = 0;
  const resize = () => {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    const scale = Math.min(window.devicePixelRatio || 1, o.maxDpr ?? 1.5) * (o.resolution ?? 1);
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // visibility
  let visible = false;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "80px" });
  io.observe(canvas);

  let lost = false;
  const onLost = () => {
    lost = true;
    o.onLost?.();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  attachShared();
  const t0 = performance.now();
  const m = { x: -1e4, y: -1e4, vx: 0, vy: 0, hover: 0, known: false };
  let ready = false;

  const tick = () => {
    if (lost || !visible || pending > 0 || w === 0 || h === 0) return;
    const now = performance.now();

    // pointer, in the surface's own CSS px (allowing for transforms on ancestors)
    const r = canvas.getBoundingClientRect();
    if (shared.known && r.width > 0 && r.height > 0) {
      const tx = ((shared.x - r.left) * w) / r.width;
      const ty = ((shared.y - r.top) * h) / r.height;
      if (!m.known) {
        m.x = tx;
        m.y = ty;
        m.known = true;
      }
      const nx = m.x + (tx - m.x) * 0.2;
      const ny = m.y + (ty - m.y) * 0.2;
      m.vx += (nx - m.x - m.vx) * 0.25;
      m.vy += (ny - m.y - m.vy) * 0.25;
      m.x = nx;
      m.y = ny;
      const over = shared.inside && tx >= 0 && ty >= 0 && tx <= w && ty <= h;
      m.hover += ((over ? 1 : 0) - m.hover) * 0.08;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    set("uRes", [w, h]);
    set("uTime", (now - t0) / 1000);
    set("uMouse", [m.x, m.y]);
    set("uVel", [m.vx, m.vy]);
    set("uHover", m.hover);
    set("uActive", Math.exp(-(now - shared.lastMove) / 900));
    set("uScroll", shared.scrollVel);
    if (o.uniforms) {
      const extra = o.uniforms(canvas);
      for (const k in extra) set(k, extra[k]);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (!ready) {
      ready = true;
      o.onReady?.();
    }
  };
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    detach();
    ro.disconnect();
    io.disconnect();
    canvas.removeEventListener("webglcontextlost", onLost);
    images.forEach((img) => (img.onload = null));
    textures.forEach((t) => gl.deleteTexture(t));
    gl.deleteBuffer(buf);
    gl.deleteProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    // (no loseContext: a remount — e.g. React Strict Mode — gets this same context back)
  };
}
