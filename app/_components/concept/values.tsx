"use client";

import { useRef } from "react";
import { MISSION } from "@/lib/content";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { cx } from "../ui/primitives";
import { GRAD, Orb } from "./bits";

const FILLS = [
  "linear-gradient(100deg,#6f63e6,#8b80f2 60%,#b3a8f8)",
  "linear-gradient(100deg,#5fa8f5,#4b8ff0 50%,#4fbfcf)",
  "linear-gradient(100deg,#d39be6,#b3a8f8 50%,#6f63e6)",
];

/**
 * Faith. Integrity. Excellence. Three giant words slide across the screen in
 * opposite directions while a gradient pours into each one, left to right
 * (background-clip text). Then mission and vision as two cards.
 */
export function ConceptValues() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const root = ref.current;
        if (!root) return;
        gsap.utils.toArray<HTMLElement>("[data-value]", root).forEach((el, i) => {
          const dir = i % 2 ? -1 : 1;
          gsap.fromTo(el, { xPercent: -12 * dir }, { xPercent: 8 * dir, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
          gsap.fromTo(
            el,
            { backgroundSize: "0% 100%, 100% 100%" },
            { backgroundSize: "100% 100%, 100% 100%", ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "top 35%", scrub: true } },
          );
        });
        gsap.fromTo(
          root.querySelectorAll("[data-mv]"),
          { y: 100, autoAlpha: 0, rotate: (i: number) => (i ? 3 : -3) },
          { y: 0, autoAlpha: 1, rotate: 0, duration: 1.2, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: root.querySelector("[data-mvs]"), start: "top 85%", once: true } },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="mission" aria-labelledby="values-title" className="overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <h2 id="values-title" className="sr-only">
          Our values: Faith, Integrity, Excellence
        </h2>
      </div>

      <div aria-hidden className="flex flex-col items-center">
        {MISSION.values.map((v, i) => (
          <p
            key={v.word}
            data-value
            className="text-[clamp(4.5rem,17vw,17rem)] leading-[0.92] font-semibold tracking-[-0.06em] whitespace-nowrap text-transparent"
            style={{
              backgroundImage: `${FILLS[i]}, linear-gradient(#efedf6,#efedf6)`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%, 100% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            {v.word}.
          </p>
        ))}
      </div>
      <ul className="sr-only">
        {MISSION.values.map((v) => (
          <li key={v.word}>
            {v.word}: {v.body}
          </li>
        ))}
      </ul>

      <div data-mvs className="mx-auto mt-16 grid max-w-[1440px] gap-3 px-5 sm:gap-4 sm:px-8 md:grid-cols-2 lg:px-10">
        {[
          { label: "our mission", text: MISSION.mission, more: MISSION.missionMore, tone: `${GRAD.dusk} text-white`, orb: "violet" as const },
          { label: "our vision", text: MISSION.vision, more: MISSION.visionMore, tone: "bg-[#f3f2f9] text-[#1a1530]", orb: "lilac" as const },
        ].map((c) => (
          <article key={c.label} data-mv className={cx("relative overflow-hidden rounded-[28px] p-7 sm:p-10", c.tone)}>
            <Orb tint={c.orb} className="absolute -top-[18%] -right-[10%] w-[40%] opacity-80" />
            <div className="relative">
              <p className="max-w-[26ch] text-[clamp(1.5rem,2.3vw,2.15rem)] leading-[1.15] font-medium tracking-[-0.025em]">{c.text}</p>
              <p className="mt-6 max-w-[48ch] text-[14.5px] leading-relaxed font-medium opacity-70">{c.more}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
