"use client";

import Image from "next/image";
import { useRef } from "react";
import { CEO } from "@/lib/content";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { GRAD, Orb, Tag } from "./bits";
import portrait from "@/public/images/ceo-tammy.webp";

/**
 * Leadership. The portrait card opens from a narrow strip to full as it
 * scrolls in (the photo settling from a zoom), the headline flips up word by
 * word in 3D, and the credentials pop in.
 */
export function ConceptCeo() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const root = ref.current;
        if (!root) return;
        const q = gsap.utils.selector(root);
        const card = q("[data-portrait]")[0];
        gsap.fromTo(card, { clipPath: "inset(12% 38% 12% 38% round 200px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "none", scrollTrigger: { trigger: card, start: "top 90%", end: "top 25%", scrub: 0.8 } });
        gsap.fromTo(q("[data-portrait] img"), { scale: 1.45 }, { scale: 1, ease: "none", scrollTrigger: { trigger: card, start: "top 90%", end: "bottom 30%", scrub: 0.8 } });
        gsap.fromTo(
          q("[data-word]"),
          { yPercent: 100, rotateX: -80, autoAlpha: 0, transformPerspective: 700, transformOrigin: "50% 100%" },
          { yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 1, stagger: 0.04, ease: "expo.out", scrollTrigger: { trigger: q("h2")[0], start: "top 80%", once: true } },
        );
        gsap.fromTo(q("[data-pop]"), { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: "back.out(2.2)", scrollTrigger: { trigger: q("[data-pops]")[0], start: "top 88%", once: true } });
        gsap.fromTo(q("[data-fade]"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: q("[data-fade]")[0], start: "top 88%", once: true } });
      });
    },
    { scope: ref },
  );

  const headline = CEO.headline.join(" ");
  return (
    <section ref={ref} id="ceo" aria-labelledby="ceo-title" className="bg-white px-5 py-24 sm:px-8 md:py-32 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div data-portrait className={`relative aspect-[4/5] overflow-hidden rounded-[28px] ${GRAD.lilac}`}>
          <Image src={portrait} alt={`${CEO.name}, ${CEO.role}`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-top" />
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-[20px] bg-white/85 p-4 backdrop-blur-md">
            <span>
              <span className="block text-lg font-semibold text-[#1a1530]">{CEO.name}</span>
              <span className="block text-[13px] font-medium text-[#1a1530]/60">{CEO.role}</span>
            </span>
            <span className="rounded-full bg-[#1a1530] px-3 py-1.5 text-[12px] font-medium text-white">CBCS</span>
          </div>
        </div>

        <div className="relative">
          <Orb tint="sky" className="absolute -top-16 right-[4%] w-24 max-lg:hidden" />
          <Tag>meet our ceo</Tag>
          <h2 id="ceo-title" className="mt-6 text-[clamp(2.2rem,4.2vw,4rem)] leading-[1.05] font-medium tracking-[-0.035em] text-[#1a1530]">
            <span className="sr-only">{headline}</span>
            <span aria-hidden>
              {headline.split(" ").map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span data-word className="inline-block">
                    {w}&nbsp;
                  </span>
                </span>
              ))}
            </span>
          </h2>
          <p data-fade className="mt-6 max-w-[40rem] text-[16px] leading-relaxed font-medium text-[#1a1530]/70">
            {CEO.bio[0]}
          </p>
          <ul data-pops className="mt-8 flex flex-wrap gap-2">
            {CEO.credentials.map((c, i) => (
              <li
                key={c.label}
                data-pop
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-medium ${["bg-[#efeaff] text-[#4a3fc0]", "bg-[#e3f6f8] text-[#0a6f7b]", "bg-[#f8e9f6] text-[#9a3f8f]", "bg-[#e7f0ff] text-[#2f68c8]"][i % 4]}`}
              >
                <span className="font-semibold">{c.value}</span>
                <span className="opacity-80">{c.label}</span>
              </li>
            ))}
          </ul>
          <p data-fade className="mt-8 max-w-[40rem] text-[15px] leading-relaxed font-medium text-[#1a1530]/60">
            Award-winning author of <em>Circles: Breaking the Chains of Generational Curses</em>, and founder of Bridging the Gaps For Queens, honored
            with the Mentorship Excellence Award in 2025.
          </p>
        </div>
      </div>
    </section>
  );
}
