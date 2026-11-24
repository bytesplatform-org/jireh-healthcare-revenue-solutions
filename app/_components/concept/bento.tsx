"use client";

import { useRef } from "react";
import { HOME, PROVIDERS, WAIVER, CYCLE } from "@/lib/content";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { Icon, cx } from "../ui/primitives";
import { GRAD } from "./bits";
import { Glass } from "./glass";

const CARD = ["bg-[linear-gradient(150deg,#c9f1f4_0%,#8fdbe4_100%)] text-[#1a1530]", "bg-[linear-gradient(165deg,#f4ddf3_0%,#e5b9ec_100%)] text-[#1a1530]", `${GRAD.sky} text-white`, "bg-[#f3f2f9] text-[#1a1530]"];

const STATS = [
  { value: CYCLE.length, suffix: "", label: "Revenue-cycle stages, handled end to end" },
  { value: PROVIDERS.length, suffix: "", label: "Kinds of providers we bill for" },
  { value: WAIVER.waivers.length, suffix: "", label: "Virginia ID/DD waiver programs" },
  { value: 10, suffix: "+", label: "Years of Medicaid & Medicare experience" },
];

/**
 * Why outsource: a bento of the four benefits around a dark title card, then
 * four counters. Cards flip up from the floor as they enter (3D), tilt toward
 * the pointer, and the numbers count up.
 */
export function ConceptBento() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const root = ref.current;
        if (!root) return;
        const cards = gsap.utils.toArray<HTMLElement>("[data-tile]", root);
        gsap.fromTo(
          cards,
          { y: 140, rotateX: -42, autoAlpha: 0, transformPerspective: 1100, transformOrigin: "50% 100%" },
          { y: 0, rotateX: 0, autoAlpha: 1, duration: 1.3, stagger: 0.09, ease: "expo.out", scrollTrigger: { trigger: root.querySelector("[data-grid]"), start: "top 82%", once: true } },
        );

        // pointer tilt
        const offs: Array<() => void> = [];
        cards.forEach((card) => {
          const rx = gsap.quickTo(card, "rotateX", { duration: 0.6, ease: "power3.out" });
          const ry = gsap.quickTo(card, "rotateY", { duration: 0.6, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const r = card.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 10);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
          };
          const leave = () => (rx(0), ry(0));
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          offs.push(() => (card.removeEventListener("pointermove", move), card.removeEventListener("pointerleave", leave)));
        });

        // counters
        gsap.utils.toArray<HTMLElement>("[data-to]", root).forEach((el) => {
          const n = { v: 0 };
          gsap.to(n, {
            v: Number(el.dataset.to),
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => (el.textContent = String(Math.round(n.v))),
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
        return () => offs.forEach((o) => o());
      });
    },
    { scope: ref },
  );

  const { benefits } = HOME;
  return (
    <section ref={ref} aria-labelledby="bento-title" className="bg-white px-5 py-24 sm:px-8 md:py-32 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div data-grid className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          <div data-tile className={cx("relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[26px] p-7 text-white sm:p-9 md:col-span-2 lg:row-span-2", GRAD.dusk)}>
            <Glass kind="chart" tint="dusk" className="absolute -right-[2%] -bottom-[6%] w-[46%]" />
            <Glass kind="coin" tint="violet" className="absolute top-[10%] right-[8%] w-[15%]" />
            <div className="relative">
              <h2 id="bento-title" className="max-w-[16ch] text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.04] font-medium tracking-[-0.035em]">
                {benefits.title}
              </h2>
            </div>
            <p className="relative mt-10 max-w-[30ch] text-[15px] leading-relaxed font-medium text-white/75">
              Faster payments, fewer denials, and a team that gets to focus on patients again.
            </p>
          </div>

          {benefits.items.map((b, i) => (
            <div key={b.title} data-tile className={cx("flex min-h-[240px] flex-col justify-between rounded-[26px] p-6 will-change-transform sm:p-7", CARD[i])}>
              <span className={cx("grid size-11 place-items-center rounded-full", i === 2 ? "bg-white/25" : "bg-white")}>
                <Icon name={b.icon} className="size-5" />
              </span>
              <div>
                <h3 className="mt-8 text-[1.4rem] leading-[1.1] font-medium tracking-[-0.02em]">{b.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed font-medium opacity-80">{b.body}</p>
              </div>
            </div>
          ))}
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} data-tile className="rounded-[26px] p-6 ring-1 ring-[#1a1530]/10 sm:p-7">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="text-[clamp(3rem,5.5vw,5rem)] leading-none font-light tracking-[-0.05em] text-[#1a1530]">
                  <span data-to={s.value}>{s.value}</span>
                  {s.suffix}
                </span>
                <span aria-hidden className="mt-3 block max-w-[22ch] text-[14px] leading-snug font-medium text-[#1a1530]/60">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
