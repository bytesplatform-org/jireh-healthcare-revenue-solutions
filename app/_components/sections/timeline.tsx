"use client";

import { useRef } from "react";
import { CEO } from "@/lib/content";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { cx } from "../ui/primitives";

/**
 * The CEO's journey: a centre line draws down with scroll; each milestone's dot
 * fills as the line reaches it and its card slides in from its side.
 */
export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(ref);
        gsap.fromTo(q("[data-tl-line]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 60%", end: "bottom 60%", scrub: true } });
        q("[data-tl-item]").forEach((item, i) => {
          const card = item.querySelector("[data-tl-card]");
          const dot = item.querySelector("[data-tl-dot]");
          gsap.from(card, { x: i % 2 ? 60 : -60, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: item, start: "top 75%", once: true } });
          if (dot)
            gsap.fromTo(
              dot,
              { backgroundColor: "rgb(236 238 246)", scale: 0.6 },
              { backgroundColor: "#11b7c9", scale: 1, duration: 0.5, ease: "back.out(3)", scrollTrigger: { trigger: item, start: "top 60%", toggleActions: "play none none reverse" } },
            );
        });
      });
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className="relative mx-auto max-w-5xl">
      <span aria-hidden className="absolute top-0 bottom-0 left-5 w-px bg-line md:left-1/2">
        <span data-tl-line className="absolute inset-0 origin-top bg-teal" />
      </span>
      {CEO.timeline.map((t, i) => (
        <li key={t.title} data-tl-item className={cx("relative grid py-8 pl-14 md:grid-cols-2 md:pl-0", i % 2 === 1 && "md:[&>div]:col-start-2")}>
          <span data-tl-dot aria-hidden className="absolute top-12 left-5 size-4 -translate-x-1/2 rounded-full bg-teal ring-4 ring-paper md:left-1/2" />
          <div data-tl-card className={cx("md:px-12", i % 2 ? "" : "md:text-right")}>
            <p className="font-mono text-sm text-teal-deep">{t.year}</p>
            <h3 className="font-display mt-2 text-2xl md:text-3xl">{t.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{t.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
