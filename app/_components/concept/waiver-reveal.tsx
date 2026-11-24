"use client";

import { useRef } from "react";
import { WAIVER } from "@/lib/content";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { Orb, Tag } from "./bits";

/**
 * Virginia ID/DD Waiver billing. Desktop + motion: the section pins, a small
 * gradient circle in the middle of the white page swells until it floods the
 * screen, then the content cascades in. Otherwise: a plain gradient panel.
 */
export function ConceptWaiver() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktopMotion, () => {
        const root = ref.current;
        const stage = root?.querySelector<HTMLElement>("[data-stage]");
        if (!root || !stage) return;
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: stage, start: "top top", end: "+=160%", pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });
        tl.fromTo(q("[data-flood]"), { clipPath: "circle(9% at 50% 50%)" }, { clipPath: "circle(80% at 50% 50%)", duration: 1, ease: "power2.inOut" })
          .fromTo(q("[data-teaser]"), { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 0.7, duration: 0.3 }, 0.05)
          .fromTo(q("[data-in]"), { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.06, ease: "power3.out" }, 0.62)
          .fromTo(q("[data-flood-orb]"), { scale: 0.4, rotate: -60 }, { scale: 1, rotate: 0, duration: 1, ease: "power2.out" }, 0)
          .to({}, { duration: 0.25 });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="waiver" aria-labelledby="waiver-title" className="bg-white">
      <div data-stage className="relative px-3 py-3 lg:h-svh">
        <div
          data-flood
          className="relative h-full overflow-hidden rounded-[30px] bg-[radial-gradient(120%_120%_at_20%_10%,#8b80f2_0%,#6f63e6_35%,#3b2f8f_75%,#2a2160_100%)] text-white"
        >
          <Orb data-flood-orb="" tint="sky" className="absolute -top-[14%] -right-[8%] w-[38vw] max-w-[560px] opacity-80" />
          <Orb tint="lilac" className="absolute bottom-[8%] left-[38%] w-[7vw] max-w-[110px] opacity-80" />

          <p data-teaser aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-1/2 text-center text-[clamp(1rem,1.4vw,1.25rem)] leading-tight font-medium lg:block">
            Virginia
            <br />
            ID/DD Waivers
          </p>

          <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-center gap-10 px-5 py-16 sm:px-8 lg:px-10 lg:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div data-in>
                  <Tag light>{WAIVER.label.toLowerCase()}</Tag>
                </div>
                <h2 data-in id="waiver-title" className="mt-6 max-w-[14ch] text-[clamp(2.4rem,5vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.035em]">
                  {WAIVER.title}
                </h2>
              </div>
              <p data-in className="max-w-[44ch] text-[15px] leading-relaxed font-medium text-white/80">
                {WAIVER.intro} {WAIVER.systems}
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-3">
              {WAIVER.waivers.map((w) => (
                <li key={w.code} data-in className="rounded-[22px] bg-white/12 p-6 ring-1 ring-white/20 backdrop-blur-md">
                  <p className="text-[clamp(2.75rem,4.5vw,4rem)] leading-none font-light tracking-[-0.04em]">{w.code}</p>
                  <p className="mt-3 text-[15px] font-medium text-white/85">{w.name} Waiver</p>
                </li>
              ))}
            </ul>

            <ul data-in className="flex flex-wrap gap-2">
              {WAIVER.tools.map((t) => (
                <li key={t.code} className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#1a1530]">
                  <span className="font-semibold">{t.code}</span>
                  <span className="text-[#1a1530]/55"> · {t.name}</span>
                </li>
              ))}
              {WAIVER.outcomes.map((o) => (
                <li key={o} className="rounded-full px-4 py-2 text-[13px] font-medium text-white ring-1 ring-white/35">
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
