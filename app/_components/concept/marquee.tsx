"use client";

import { useRef } from "react";
import { PROVIDERS } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP, MQ } from "../motion/gsap";
import { cx } from "../ui/primitives";

const PILLS = [
  "bg-[repeating-linear-gradient(90deg,#9fe3ec_0_0.09em,#c9b8f5_0.09em_0.2em,#e7d6fb_0.2em_0.28em)]",
  "bg-[linear-gradient(135deg,#6f63e6,#b3a8f8)]",
  "bg-[linear-gradient(160deg,#9fd3fb,#4b8ff0)]",
  "bg-[linear-gradient(165deg,#f4ddf3,#d39be6)]",
];

/**
 * Who we serve, as two endless rows running opposite ways. Scrolling speeds
 * them up (with the scroll direction) and leans them into the motion; they
 * ease back when the page stops.
 */
export function ConceptMarquee() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-mq-track]", ref.current);
        const loops = rows.map((row, i) =>
          gsap.fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 38 + i * 6, ease: "none", repeat: -1 }),
        );
        const skewTo = gsap.quickTo(rows, "skewX", { duration: 0.5, ease: "power3.out" });
        // one reusable timer: lean back upright once the scrolling stops
        const upright = gsap.delayedCall(0.18, () => skewTo(0)).pause();
        let settle: gsap.core.Tween | null = null;
        const st = ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            loops.forEach((l) => l.timeScale(1 + Math.min(8, Math.abs(v) / 180)));
            skewTo(gsap.utils.clamp(-12, 12, -v / 120));
            upright.restart(true);
            settle?.kill();
            settle = gsap.to(loops, { timeScale: 1, duration: 1.2, ease: "power2.out", delay: 0.1 });
          },
        });
        return () => st.kill();
      });
    },
    { scope: ref },
  );

  const half = Math.ceil(PROVIDERS.length / 2);
  const rows = [PROVIDERS.slice(0, half), PROVIDERS.slice(half)];

  return (
    <section ref={ref} aria-label="Who we serve" className="relative z-10 overflow-hidden rounded-t-[40px] bg-white py-16 shadow-[0_-40px_80px_-40px_rgb(40_30_120/0.35)] md:py-24">
      <ul className="sr-only">
        {PROVIDERS.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div aria-hidden className="flex flex-col gap-3 md:gap-5">
        {rows.map((row, r) => (
          <div key={r} className="flex">
            <div data-mq-track className="flex shrink-0 items-center will-change-transform">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center">
                  {row.map((p, i) => (
                    <span key={`${copy}-${p}`} className="flex shrink-0 items-center text-[clamp(2.25rem,5.6vw,5.5rem)] leading-[1.1] font-medium tracking-[-0.035em] whitespace-nowrap text-[#1a1530]">
                      <span className={cx("mx-[0.35em] inline-block h-[0.62em] w-[1.3em] rounded-full", PILLS[(i + r) % PILLS.length])} />
                      <span className={(i + r) % 2 ? "text-[#1a1530]/35" : ""}>{p}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
