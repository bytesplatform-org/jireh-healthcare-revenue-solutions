"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import team from "@/public/images/team-at-work.webp";

/**
 * The team photo opens from an inset card to the full width of the screen as
 * it scrolls through, with a caption riding over it.
 */
export function WidePhoto() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(ref);
        gsap.fromTo(
          q("[data-frame]"),
          { clipPath: "inset(0% 12% 0% 12% round 18px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 10%", scrub: true } },
        );
        gsap.fromTo(q("[data-frame] img"), { scale: 1.2, yPercent: -6 }, { scale: 1, yPercent: 6, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative bg-paper pb-[calc(var(--arc-depth)+2rem)]">
      <div data-frame className="relative h-[70svh] min-h-[420px] overflow-hidden md:h-[90svh]">
        <Image src={team} alt="The Jireh billing team reviewing claims together" fill sizes="100vw" className="object-cover" />
      </div>
      <p className="font-accent mx-auto mt-6 max-w-[1360px] px-5 text-xl text-muted md:px-10">Medical billing with purpose and integrity.</p>
    </div>
  );
}
