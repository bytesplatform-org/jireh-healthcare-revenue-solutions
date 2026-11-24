"use client";

import { Fragment, useRef } from "react";
import { HOME } from "@/lib/content";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { TEXT_GRAD } from "./bits";
import { Glass } from "./glass";

const bare = (w: string) => w.replace(/[.,;:!?—]+$/, "");

/**
 * The challenge, as one big paragraph that reads itself in: a reading head
 * sweeps the words from faint to full (the key phrases in gradient), while
 * glass orbs drift past at three parallax depths.
 */
export function ConceptStatement() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const root = ref.current;
        if (!root) return;
        const words = gsap.utils.toArray<HTMLElement>("[data-w]", root);
        const n = words.length;
        const edge = 5;
        const state = { p: 0 };
        const paint = () => {
          const head = state.p * (n + edge);
          words.forEach((w, i) => {
            const on = gsap.utils.clamp(0, 1, (head - i) / edge);
            w.style.opacity = String(0.12 + 0.88 * on);
            w.style.transform = `translateY(${(1 - on) * 0.18}em)`;
          });
        };
        paint();
        gsap.to(state, {
          p: 1,
          ease: "none",
          onUpdate: paint,
          scrollTrigger: { trigger: root.querySelector("[data-para]"), start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        });
        gsap.utils.toArray<HTMLElement>("[data-depth]", root).forEach((el) => {
          const d = Number(el.dataset.depth);
          gsap.fromTo(el, { y: d * 4, rotate: -d / 2 }, { y: -d * 4, rotate: d / 2, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.fromTo(root.querySelectorAll("[data-answer]"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: root.querySelector("[data-answer]"), start: "top 85%", once: true } });
        return () => words.forEach((w) => ((w.style.opacity = ""), (w.style.transform = "")));
      });
    },
    { scope: ref },
  );

  const { challenge } = HOME;
  const words = challenge.text.split(/\s+/);
  const lit = new Set<number>();
  for (const phrase of challenge.lit) {
    const run = phrase.split(/\s+/).map(bare);
    for (let i = 0; i + run.length <= words.length; i++) if (run.every((w, k) => bare(words[i + k]) === w)) run.forEach((_, k) => lit.add(i + k));
  }

  return (
    <section ref={ref} aria-labelledby="challenge-title" className="relative overflow-hidden bg-white px-5 py-24 sm:px-8 md:py-36 lg:px-10">
      <Glass kind="claim" data-depth="30" tint="violet" className="absolute top-[6%] right-[6%] w-[clamp(100px,13vw,200px)]" />
      <Glass kind="shield" data-depth="-18" tint="sky" className="absolute bottom-[18%] left-[3%] w-[clamp(64px,7.5vw,128px)]" />
      <Glass kind="coin" data-depth="45" tint="lilac" className="absolute right-[24%] bottom-[6%] w-[clamp(50px,5vw,90px)]" />

      <div className="relative mx-auto max-w-[1440px]">
        <h2 id="challenge-title" className="sr-only">
          {challenge.label}
        </h2>
        <p data-para className="max-w-[22ch] text-[clamp(2.1rem,4.6vw,4.6rem)] leading-[1.08] font-medium tracking-[-0.035em] text-[#1a1530]">
          {words.map((w, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span data-w className={`inline-block ${lit.has(i) ? TEXT_GRAD : ""}`}>
                {w}
              </span>
            </Fragment>
          ))}
        </p>
        <div className="mt-14 grid gap-6 md:ml-auto md:max-w-[46rem] md:grid-cols-[auto_1fr] md:items-center">
          <span data-answer className="text-[13px] font-semibold tracking-[0.14em] text-[#1a1530]/45 uppercase">
            The answer
          </span>
          <p data-answer className="text-[clamp(1.15rem,1.6vw,1.45rem)] leading-snug font-medium text-[#1a1530]/80">
            {challenge.answer}
          </p>
        </div>
      </div>
    </section>
  );
}
