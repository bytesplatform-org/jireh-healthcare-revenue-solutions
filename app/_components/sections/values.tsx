"use client";

import { useRef, useState } from "react";
import { MISSION } from "@/lib/content";
import { ArcSurface } from "../motion/arc-surface";
import { gsap, ScrollTrigger, useGSAP, MQ } from "../motion/gsap";
import { cx } from "../ui/primitives";

const PIN_VH = 2.4;
const DIM = "rgb(245 242 236 / 0.16)";

/**
 * FAITH. INTEGRITY. EXCELLENCE. (FernGrid's triad, re-cut): the screen pins on
 * the three words stacked large; scrolling lights them one at a time, each
 * with its line of meaning beneath. Static list without motion.
 */
export function Values() {
  const ref = useRef<HTMLElement>(null);
  const [story, setStory] = useState(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      setStory(true);
      return () => setStory(false);
    });
  });

  useGSAP(
    () => {
      const root = ref.current;
      const stage = root?.querySelector<HTMLElement>("[data-stage]");
      if (!story || !root || !stage) return;
      const q = gsap.utils.selector(root);
      const words = q("[data-vw]");
      const notes = q("[data-vn]");
      gsap.set(words, { color: DIM });
      gsap.set(notes, { autoAlpha: 0, y: 20 });
      gsap.set(q("[data-vw-dot]"), { scale: 0 });

      const pin = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => `+=${window.innerHeight * PIN_VH}`,
        pin: true,
        invalidateOnRefresh: true,
      });
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: stage, start: "top top", end: () => `+=${window.innerHeight * PIN_VH}`, scrub: 0.6, invalidateOnRefresh: true },
      });
      words.forEach((w, i) => {
        tl.to(w, { color: "#f5f2ec", duration: 0.3 }, i)
          .to(q("[data-vw-dot]")[i], { scale: 1, autoAlpha: 1, duration: 0.3 }, i)
          .to(notes[i], { autoAlpha: 1, y: 0, duration: 0.3 }, i);
        if (i < words.length - 1) {
          tl.to(w, { color: DIM, duration: 0.3 }, i + 0.8).to(notes[i], { autoAlpha: 0, y: -20, duration: 0.3 }, i + 0.8);
        }
      });
      tl.to(words, { color: "#f5f2ec", duration: 0.3 }, words.length - 0.2).to({}, { duration: 0.4 });

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      return () => {
        pin.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: ref, dependencies: [story], revertOnUpdate: true },
  );

  return (
    <section ref={ref} aria-labelledby="values-title" className="surface-dark arc-next arc-prev relative z-20">
      <ArcSurface tone="night" />
      <h2 id="values-title" className="sr-only">
        Our values: Faith, Integrity, Excellence
      </h2>
      <div data-stage className={cx("relative flex flex-col items-center justify-center overflow-hidden bg-night px-5", story ? "pin-screen" : "py-16")}>
        <ul className="relative text-center">
          {MISSION.values.map((v) => (
            <li key={v.word} className="relative">
              <p className="font-display flex items-center justify-center gap-[0.18em] text-[clamp(3.5rem,min(13vw,22svh),12rem)] leading-[1]">
                <span data-vw-dot aria-hidden className={cx("size-[0.12em] shrink-0 rounded-full bg-teal", story && "invisible")} />
                <span data-vw>{v.word}</span>
                <span aria-hidden className="size-[0.12em] shrink-0" />
              </p>
              {!story && <p className="mx-auto mt-2 mb-8 max-w-md text-paper/65">{v.body}</p>}
            </li>
          ))}
        </ul>
        {story && (
          <div className="relative mt-10 h-14 w-full max-w-lg text-center">
            {MISSION.values.map((v) => (
              <p key={v.word} data-vn className="absolute inset-0 text-lg text-paper/70">
                {v.body}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
