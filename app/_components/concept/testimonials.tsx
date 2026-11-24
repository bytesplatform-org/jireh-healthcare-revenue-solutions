"use client";

import { useRef } from "react";
import { TESTIMONIALS } from "@/lib/content";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { Star, cx } from "../ui/primitives";
import { GRAD } from "./bits";

const REVIEWS = [
  { quote: TESTIMONIALS.featured.quote, name: TESTIMONIALS.featured.name, role: TESTIMONIALS.featured.role, tone: `${GRAD.violet} text-white`, size: "text-[clamp(1.1rem,1.6vw,1.45rem)]" },
  { quote: TESTIMONIALS.more[0].quote, name: TESTIMONIALS.more[0].name, role: "", tone: `${GRAD.sky} text-white`, size: "text-[clamp(1.6rem,2.6vw,2.4rem)]" },
  { quote: TESTIMONIALS.more[1].quote, name: TESTIMONIALS.more[1].name, role: "", tone: "bg-[linear-gradient(165deg,#f4ddf3_0%,#e5b9ec_55%,#d39be6_100%)] text-[#1a1530]", size: "text-[clamp(1.6rem,2.6vw,2.4rem)]" },
];
const LAND = [-4, 3, -1.5];
/** Desktop: timeline units the rise takes before the first card, and the extra pin length (% of viewport) it adds. */
const RISE_TIME = 1.7;
const RISE_SCROLL = 140;
/** Lilac, then sky, then the aqua that stays. */
const RISE_LAYERS = [
  "linear-gradient(180deg,#f3e2f8,#e6c9f0)",
  "linear-gradient(180deg,#e2eefe,#c7ddfb)",
  "linear-gradient(175deg,#eaf9fa 0%,#d3f1f4 55%,#bfe8ef 100%)",
];

/**
 * What agencies say. Desktop + motion: the section pins and the reviews are
 * dealt onto a stack one by one, flying up from below with a spin and landing
 * at a slight angle while the ones beneath sink back. Otherwise: a column.
 */
export function ConceptTestimonials() {
  const ref = useRef<HTMLElement>(null);

  // Arrival on phones/tablets (no pin): each colour layer swells up from the
  // bottom edge as a wide curve, the later ones chasing the earlier, spread over
  // the section's whole approach. On desktop the same rise runs inside the pinned
  // scene below, before the reviews are dealt. Scrubbed both ways.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.mobileMotion, () => {
        const root = ref.current;
        if (!root) return;
        gsap.fromTo(
          root.querySelectorAll("[data-rise]"),
          { clipPath: "ellipse(70% 0% at 50% 100%)" },
          {
            clipPath: "ellipse(140% 150% at 50% 100%)",
            ease: "power1.inOut",
            stagger: 0.18,
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom 70%", scrub: 1 },
          },
        );
      });
    },
    { scope: ref },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktopMotion, () => {
        const root = ref.current;
        const stage = root?.querySelector<HTMLElement>("[data-stage]");
        if (!root || !stage) return;
        const cards = gsap.utils.toArray<HTMLElement>("[data-deal]", root);
        gsap.set(cards, { position: "absolute", top: "60%", left: "50%", xPercent: -50, yPercent: -50 });
        // explicit brightness: tweening `filter` from "none" starts at brightness(0) (a black card)
        gsap.set(cards, { y: () => window.innerHeight, rotate: 18, filter: "brightness(1)" });
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: stage, start: "top top", end: `+=${cards.length * 80 + RISE_SCROLL}%`, pin: true, scrub: 1, invalidateOnRefresh: true },
        });
        // 1. the stage holds while the colour rises slowly, wave chasing wave
        tl.fromTo(
          root.querySelectorAll("[data-rise]"),
          { clipPath: "ellipse(70% 0% at 50% 100%)" },
          { clipPath: "ellipse(140% 150% at 50% 100%)", duration: 1.1, stagger: 0.25, ease: "power1.inOut" },
          0,
        );
        // 2. then the reviews are dealt onto it
        cards.forEach((card, i) => {
          const at = RISE_TIME + i * 1.1;
          tl.to(card, { y: 0, rotate: LAND[i], duration: 1 }, at);
          if (i > 0) tl.to(cards.slice(0, i), { scale: "-=0.05", filter: "brightness(0.9)", duration: 1 }, at);
        });
        tl.to({}, { duration: 0.4 });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="reviews-title" className="bg-white">
      <div data-stage className="relative overflow-hidden px-5 py-24 sm:px-8 lg:h-svh lg:px-10 lg:py-0">
        {/* Pale aqua stage: three colour layers rise from the bottom like liquid filling a glass */}
        <div aria-hidden className="absolute inset-3 overflow-hidden rounded-[30px]">
          {RISE_LAYERS.map((bg, i) => (
            <div key={i} data-rise className="absolute inset-0" style={{ background: bg }} />
          ))}
        </div>
        <div className="relative mx-auto flex max-w-[1440px] items-start justify-between gap-6 lg:absolute lg:inset-x-0 lg:top-24 lg:px-10">
          <div>
            <h2 id="reviews-title" className="max-w-[12ch] text-[clamp(2.2rem,4vw,3.75rem)] leading-[1.04] font-medium tracking-[-0.035em] text-[#1a1530]">
              Trusted by the agencies we serve.
            </h2>
          </div>
          <p className="mt-2 flex gap-1 text-[#f2b53a]" aria-label="Rated 5 out of 5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-5" />
            ))}
          </p>
        </div>

        <div className="relative mt-12 flex flex-col gap-4 lg:mt-0 lg:h-full">
          {REVIEWS.map((r, i) => (
            <figure
              key={r.name}
              data-deal
              className={cx("flex w-full flex-col justify-between rounded-[28px] p-7 shadow-[0_40px_80px_-40px_rgb(40_30_120/0.45)] sm:p-10 lg:min-h-[400px] lg:w-[min(720px,56vw)]", r.tone)}
              style={{ zIndex: i + 1 }}
            >
              <blockquote className={cx("leading-[1.3] font-medium tracking-[-0.015em]", r.size)}>“{r.quote}”</blockquote>
              <figcaption className="mt-8 flex items-center justify-between gap-4">
                <span>
                  <span className="block text-[16px] font-semibold">{r.name}</span>
                  {r.role && <span className="block text-[13px] font-medium opacity-70">{r.role}</span>}
                </span>
                <span className="text-[13px] font-medium opacity-60">0{i + 1} / 0{REVIEWS.length}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
