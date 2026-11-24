"use client";

import Image from "next/image";
import { useRef } from "react";
import { CEO, HOME, ROUTES } from "@/lib/content";
import { ArcSurface } from "../motion/arc-surface";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { FadeUp, SplitReveal } from "../motion/reveal";
import { Eyebrow, PillLink } from "../ui/primitives";
import portrait from "@/public/images/ceo-tammy.webp";

/** Leadership teaser: the portrait opens from an arch as it enters; credentials rise in. */
export function CeoTeaser() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(ref);
        const frame = q("[data-arch]")[0];
        gsap.fromTo(
          frame,
          { clipPath: "inset(100% 0% 0% 0% round 999px 999px 18px 18px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 999px 999px 18px 18px)",
            duration: 1.6,
            ease: "expo.inOut",
            scrollTrigger: { trigger: frame, start: "top 80%", end: "top 40%", scrub: 0.6 },
          },
        );
        gsap.fromTo(q("[data-arch] img"), { scale: 1.3 }, { scale: 1, duration: 2, ease: "expo.out", scrollTrigger: { trigger: frame, start: "top 80%", end: "top 40%", scrub: 0.6 } });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="ceo-title" className="surface-light arc-next relative z-50 pb-24 md:pb-32">
      <ArcSurface tone="paper" />
      <div className="mx-auto grid max-w-[1360px] items-center gap-14 px-5 md:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div className="relative mx-auto w-full max-w-[460px]">
          <div data-arch className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[18px] bg-cloud">
            <Image src={portrait} alt={`${CEO.name}, ${CEO.role}`} fill sizes="(min-width: 1024px) 34vw, 90vw" className="object-cover object-top" />
            <div className="absolute inset-x-0 bottom-0 bg-indigo/80 p-5 text-paper">
              <p className="font-display text-2xl">{CEO.name}</p>
              <p className="mt-1 text-sm text-paper/70">{CEO.role}</p>
            </div>
          </div>
        </div>

        <div>
          <Eyebrow index="06">{HOME.ceo.label}</Eyebrow>
          <SplitReveal as="h2" id="ceo-title" className="font-display text-h2 mt-6 max-w-[18ch]">
            {HOME.ceo.quote}
          </SplitReveal>
          <p className="text-lede mt-6 max-w-[36rem] text-muted">{HOME.ceo.body}</p>
          <FadeUp className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {CEO.credentials.map((c) => (
              <div key={c.label} data-stagger className="border-t border-line pt-4">
                <p className="font-display text-3xl">{c.value}</p>
                <p className="mt-2 text-[13px] leading-snug text-muted">{c.label}</p>
              </div>
            ))}
          </FadeUp>
          <div className="mt-10">
            <PillLink href={ROUTES.ceo} tone="indigo" size="lg">
              Meet our CEO
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}
