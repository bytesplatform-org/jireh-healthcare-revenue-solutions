"use client";

import Image from "next/image";
import { useRef } from "react";
import { HOME } from "@/lib/content";
import { ArcSurface } from "../motion/arc-surface";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { SplitReveal } from "../motion/reveal";
import { Eyebrow, Icon, cx } from "../ui/primitives";
import approved from "@/public/images/approved-claims.webp";

const CARD_TONES = [
  "bg-white text-indigo ring-1 ring-line",
  "bg-cloud text-indigo",
  "bg-mint text-indigo",
  "bg-indigo text-paper surface-dark",
];

/**
 * Benefits of outsourcing: the heading sticks on the left while four cards
 * stack on the right; each card, once covered by the next, sinks back
 * (scales down and dims) like a deck.
 */
export function Benefits() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", ref.current);
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          // fromTo: tweening `filter` from "none" starts at brightness(0) (black)
          gsap.fromTo(card.firstElementChild, { scale: 1, filter: "brightness(1)" }, {
            scale: 0.93,
            filter: "brightness(0.95)",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top 85%", end: "top 20%", scrub: true },
          });
        });
      });
    },
    { scope: ref },
  );

  const { benefits } = HOME;
  return (
    <section ref={ref} aria-labelledby="benefits-title" className="surface-light arc-next arc-prev relative z-30">
      <ArcSurface tone="paper" />
      <div className="mx-auto grid max-w-[1360px] gap-12 px-5 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <Eyebrow index="04">{benefits.label}</Eyebrow>
          <SplitReveal as="h2" id="benefits-title" className="font-display text-h2 mt-6 text-balance">
            {benefits.title}
          </SplitReveal>
          <div className="relative mt-10 aspect-[645/298] w-full max-w-lg overflow-hidden rounded-[18px] bg-cloud">
            <Image src={approved} alt="An approved-claims checklist beside the scales of justice" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>

        <ol className="flex flex-col gap-6">
          {benefits.items.map((b, i) => (
            <li key={b.title} data-card className="sticky" style={{ top: `calc(7rem + ${i * 1.25}rem)` }}>
              <div className={cx("origin-top rounded-[18px] p-8 md:p-12", CARD_TONES[i])}>
                <div className="flex items-start justify-between gap-6">
                  <span className={cx("grid size-12 place-items-center rounded-full ring-1", i === 3 ? "text-teal ring-paper/25" : "text-teal-deep ring-indigo/20")}>
                    <Icon name={b.icon} className="size-6" />
                  </span>
                  <span className={cx("font-display text-2xl tabular-nums", i === 3 ? "text-paper/50" : "text-indigo/40")}>
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display text-h3 mt-10">{b.title}</h3>
                <p className={cx("mt-4 max-w-[38rem] text-[16px] leading-relaxed", i === 3 ? "text-paper/75" : "text-indigo/70")}>{b.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
