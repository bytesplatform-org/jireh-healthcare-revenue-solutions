"use client";

import { useRef } from "react";
import { CYCLE } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP, MQ } from "../motion/gsap";
import { Eyebrow, Icon } from "../ui/primitives";

/**
 * Services, one row per stage of the cycle. On desktop a sticky panel on the
 * left shows the number and icon of the row in view (they roll over as rows
 * pass); each row's rule draws in and its text rises as it enters.
 */
export function ServiceRows() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(ref);
        const rows = q("[data-row]");
        const digits = q("[data-digit-track]")[0] as HTMLElement | undefined;
        const icons = q("[data-sticky-icon]");
        const title = q("[data-sticky-title]")[0] as HTMLElement | undefined;
        const fill = q("[data-sticky-fill]")[0] as HTMLElement | undefined;

        const setActive = (i: number) => {
          if (digits) gsap.to(digits, { yPercent: (-100 / CYCLE.length) * i, duration: 0.8, ease: "expo.out", overwrite: true });
          icons.forEach((el, k) => gsap.to(el, { autoAlpha: k === i ? 1 : 0, scale: k === i ? 1 : 0.6, rotate: k === i ? 0 : -30, duration: 0.6, ease: "expo.out", overwrite: true }));
          if (title) title.textContent = CYCLE[i].title;
        };

        rows.forEach((row, i) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          });
          const rule = row.querySelector("[data-rule]");
          if (rule) gsap.from(rule, { scaleX: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: row, start: "top 85%", end: "top 45%", scrub: 0.6 } });
          gsap.from(row.querySelectorAll("[data-up]"), { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: row, start: "top 80%", end: "top 40%", scrub: 0.6 } });
        });
        if (fill) {
          gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: q("[data-rows]")[0], start: "top 55%", end: "bottom 55%", scrub: true } });
        }
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="services-title" className="surface-light border-t border-line pt-20 md:pt-28 arc-prev relative z-10">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <Eyebrow index="01">What we do</Eyebrow>
        <h2 id="services-title" className="font-display text-h2 mt-6 max-w-[20ch]">
          Every step of your revenue cycle, handled with care.
        </h2>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          {/* Sticky index (desktop) */}
          <div aria-hidden className="hidden lg:block">
            <div className="sticky top-32 flex gap-8">
              <div className="relative w-px bg-line">
                <span data-sticky-fill className="absolute inset-x-0 top-0 h-full origin-top bg-teal" />
              </div>
              <div>
                <div className="h-[clamp(7rem,12vw,11rem)] overflow-hidden">
                  <div data-digit-track>
                    {CYCLE.map((_, i) => (
                      <p key={i} className="font-display h-[clamp(7rem,12vw,11rem)] text-[clamp(7rem,12vw,11rem)] leading-none text-indigo tabular-nums">
                        0{i + 1}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="relative mt-6 size-20">
                  {CYCLE.map((s, i) => (
                    <span key={s.key} data-sticky-icon className="absolute inset-0 grid place-items-center rounded-full text-teal-deep ring-1 ring-line" style={{ opacity: i === 0 ? 1 : 0 }}>
                      <Icon name={s.icon} className="size-9" />
                    </span>
                  ))}
                </div>
                <p data-sticky-title className="text-label mt-6 max-w-[16rem] text-muted">
                  {CYCLE[0].title}
                </p>
              </div>
            </div>
          </div>

          <ol data-rows className="flex flex-col">
            {CYCLE.map((s, i) => (
              <li key={s.key} id={s.key} data-row className="relative scroll-mt-28 py-12 first:pt-0">
                {i > 0 && <span data-rule aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-line" />}
                <div className="flex items-center gap-4 lg:hidden">
                  <span className="grid size-11 place-items-center rounded-full text-teal-deep ring-1 ring-line">
                    <Icon name={s.icon} />
                  </span>
                  <span className="font-mono text-sm text-muted">0{i + 1}</span>
                </div>
                <h3 data-up className="font-display text-h3 mt-5 lg:mt-0">
                  {s.title}
                </h3>
                <p data-up className="font-accent mt-2 text-xl text-muted md:text-2xl">
                  {s.lead}
                </p>
                <p data-up className="mt-5 max-w-[42rem] text-[16px] leading-relaxed text-muted">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
