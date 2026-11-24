"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { onIntro } from "../motion/intro";
import { cx } from "../ui/primitives";

/**
 * Paper hero for inner pages: small eyebrow, a big title whose lines rise from
 * masks (the last line in the serif italic), an intro, and optional content
 * on the right. Entrance plays on the loader/page-transition reveal; if the
 * page was reached without a cover, it plays on mount.
 */
export function PageHero({
  eyebrow,
  lines,
  accent,
  intro,
  aside,
  children,
  className,
}: {
  eyebrow: string;
  /** Title lines in the main voice. */
  lines: string[];
  /** Final title line in the italic accent. */
  accent?: string;
  intro?: string;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(ref);
        const build = (tl: gsap.core.Timeline, at: number) => {
          tl.fromTo(q("[data-line]"), { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: 0.09, ease: "expo.out" }, at);
          const rise = q("[data-rise]");
          if (rise.length) tl.fromTo(rise, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.08, ease: "expo.out" }, at + 0.3);
          const aside = q("[data-aside]");
          if (aside.length) tl.fromTo(aside, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.4, ease: "expo.out" }, at + 0.2);
        };
        // returned so a remount (React Strict Mode in dev) unregisters the stale entrance
        return onIntro((tl) => build(tl, 0.7));
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={cx("surface-light relative bg-paper", className)}>
      <div className={cx("mx-auto grid max-w-[1360px] items-end gap-12 px-5 pt-36 pb-16 md:px-10 md:pt-44 md:pb-24", !!aside && "lg:grid-cols-[1.15fr_0.85fr] lg:gap-20")}>
        <div>
          <p data-rise className="text-label flex items-center gap-3 text-muted">
            <span aria-hidden className="h-px w-8 bg-current opacity-40" />
            {eyebrow}
          </p>
          <h1 className="font-display mt-8 text-[clamp(2.75rem,5.6vw,5.75rem)] leading-[1.02]">
            <span className="sr-only">{[...lines, accent].filter(Boolean).join(" ")}</span>
            <span aria-hidden className="block">
              {lines.map((l) => (
                <span key={l} className="block overflow-hidden pb-[0.08em]">
                  <span data-line className="block">
                    {l}
                  </span>
                </span>
              ))}
              {accent && (
                <span className="block overflow-hidden pb-[0.14em]">
                  <span data-line className="font-accent block">
                    {accent}
                  </span>
                </span>
              )}
            </span>
          </h1>
          {intro && (
            <p data-rise className="text-lede mt-8 max-w-[38rem] text-muted">
              {intro}
            </p>
          )}
          {children && <div data-rise>{children}</div>}
        </div>
        {aside && <div data-aside>{aside}</div>}
      </div>
    </section>
  );
}
