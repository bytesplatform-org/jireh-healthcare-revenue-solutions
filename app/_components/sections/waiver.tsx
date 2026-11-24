"use client";

import Image from "next/image";
import { useRef } from "react";
import { WAIVER } from "@/lib/content";
import { ArcSurface } from "../motion/arc-surface";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { Parallax } from "../motion/parallax";
import { SplitReveal } from "../motion/reveal";
import { Check, Eyebrow } from "../ui/primitives";
import independence from "@/public/images/building-independence.webp";

/**
 * Virginia ID/DD Waiver billing (home + services). Waiver codes count in as
 * big tiles; the systems we navigate sit on a line that draws itself across,
 * each stop popping in as the line reaches it.
 */
export function Waiver({ index = "05", arcPrev = true }: { index?: string; arcPrev?: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(ref);
        gsap.from(q("[data-tile]"), {
          y: 80,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: q("[data-tiles]")[0], start: "top 85%", once: true },
        });
        const line = q("[data-sys-line]")[0];
        const stops = q("[data-sys-stop]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-systems]")[0], start: "top 80%", end: "top 35%", scrub: 0.6 } });
        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 });
        stops.forEach((s, i) => {
          tl.from(s, { y: 30, autoAlpha: 0, duration: 0.25, ease: "power3.out" }, (i / Math.max(1, stops.length - 1)) * 0.85);
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="waiver" aria-labelledby="waiver-title" className={`surface-dark arc-next relative z-40 ${arcPrev ? "arc-prev" : "pb-28"}`}>
      <ArcSurface tone="indigo" />

      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <Eyebrow index={index}>{WAIVER.label}</Eyebrow>
            <SplitReveal as="h2" id="waiver-title" className="font-display text-h2 mt-6 max-w-[14ch]">
              {WAIVER.title}
            </SplitReveal>
            <p className="font-accent mt-8 max-w-[32ch] text-[clamp(1.4rem,2.2vw,2rem)] leading-snug text-paper/85">{WAIVER.intro}</p>
            <p className="mt-8 max-w-[40rem] text-[16px] leading-relaxed text-paper/70">{WAIVER.body}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {WAIVER.outcomes.map((o) => (
                <li key={o} className="flex items-center gap-3 text-[15px] text-paper/85">
                  <span className="grid size-6 place-items-center text-teal">
                    <Check className="size-3.5" />
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <Parallax amount={14} className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-indigo-2 lg:mt-10">
            <Image src={independence} alt="A young man cooking a healthy meal in his kitchen" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </Parallax>
        </div>

        {/* Waiver tiles */}
        <div data-tiles className="mt-20 grid gap-4 md:grid-cols-3">
          {WAIVER.waivers.map((w) => (
            <div key={w.code} data-tile className="group relative overflow-hidden rounded-[18px] bg-indigo-2 p-8 transition-colors duration-500 hover:bg-teal">
              <p className="font-display text-[clamp(4rem,7vw,6.5rem)] leading-none text-teal transition-colors duration-500 group-hover:text-indigo">{w.code}</p>
              <p className="mt-6 text-lg font-semibold transition-colors duration-500 group-hover:text-indigo">{w.name}</p>
              <p className="text-label mt-1 text-paper/45 transition-colors duration-500 group-hover:text-indigo/60">Waiver</p>
            </div>
          ))}
        </div>

        {/* Systems */}
        <div data-systems className="mt-20">
          <p className="max-w-[46rem] text-[16px] leading-relaxed text-paper/70">{WAIVER.systems}</p>
          <div className="relative mt-12">
            <span data-sys-line aria-hidden className="absolute top-[22px] right-0 left-0 hidden h-px origin-left bg-teal/70 md:block" />
            <ul className="relative grid gap-8 md:grid-cols-4">
              {WAIVER.tools.map((t) => (
                <li key={t.code} data-sys-stop>
                  <span className="grid size-11 place-items-center rounded-full bg-indigo ring-2 ring-teal">
                    <span className="size-2.5 rounded-full bg-teal" />
                  </span>
                  <p className="font-display mt-5 text-3xl">{t.code}</p>
                  <p className="mt-1 text-sm text-paper/60">{t.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
