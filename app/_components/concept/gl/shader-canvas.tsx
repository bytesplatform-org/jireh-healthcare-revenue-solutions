"use client";

import { useEffect, useRef } from "react";
import { MQ } from "../../motion/gsap";
import { cx } from "../../ui/primitives";
import { createSurface, type Uniforms } from "./engine";

/**
 * A canvas running one of the concept page's shaders (see ./shaders).
 *
 * It fades in once its first frame is drawn, and marks its parent
 * `data-gl="on"` so the CSS version it replaces can step aside — style that
 * with `[[data-gl=on]_&]:…` on the fallback (or `data-[gl=on]:…` on the parent).
 * Without WebGL, or with reduced motion, nothing runs and the CSS stays.
 *
 * Pass module-level constants for `textures` and `uniforms` (they're effect deps).
 */
export function ShaderCanvas({
  frag,
  className,
  resolution,
  maxDpr,
  textures,
  uniforms,
}: {
  frag: string;
  className?: string;
  resolution?: number;
  maxDpr?: number;
  textures?: Record<string, string>;
  uniforms?: Uniforms;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia(MQ.reduce).matches) return;
    const host = canvas.parentElement;
    const off = () => {
      delete canvas.dataset.ready;
      host?.removeAttribute("data-gl");
    };
    let destroy: (() => void) | null = null;
    try {
      destroy = createSurface({
        canvas,
        frag,
        resolution,
        maxDpr,
        textures,
        uniforms,
        onReady: () => {
          canvas.dataset.ready = "";
          host?.setAttribute("data-gl", "on");
        },
        onLost: off,
      });
    } catch {
      destroy = null;
    }
    return () => {
      destroy?.();
      off();
    };
  }, [frag, resolution, maxDpr, textures, uniforms]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cx("pointer-events-none block opacity-0 transition-opacity duration-700 data-[ready]:opacity-100", className)}
    />
  );
}
