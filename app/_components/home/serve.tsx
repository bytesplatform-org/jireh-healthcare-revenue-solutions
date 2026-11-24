"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, type CSSProperties } from "react";
import { HOME, PROVIDERS } from "@/lib/content";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { SplitReveal } from "../motion/reveal";
import { Eyebrow, cx } from "../ui/primitives";
import groupDay from "@/public/images/group-day-support.webp";
import independence from "@/public/images/building-independence.webp";
import careTeam from "@/public/images/care-team.webp";

const PHOTOS: { src: StaticImageData; alt: string; caption: string }[] = [
  { src: groupDay, alt: "Staff and participants painting together at an adult day support program", caption: "Adult day support" },
  { src: independence, alt: "A young man cooking a healthy meal in his own kitchen", caption: "Building independence" },
  { src: careTeam, alt: "A smiling team of care professionals", caption: "Care teams" },
];

/**
 * Who we serve: two marquee rows of provider types running in opposite
 * directions (scroll speeds them up a little), then three photos that open
 * from a sliver as they enter.
 */
export function Serve() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(ref);
        // rows drift sideways with scroll, on top of their CSS loop
        q("[data-row]").forEach((row, i) => {
          gsap.fromTo(row, { xPercent: i ? -6 : 6 }, { xPercent: i ? 6 : -6, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
        });
        q("[data-photo]").forEach((el, i) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(18% 12% 18% 12% round 18px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 18px)",
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 95%", end: "top 45%", scrub: 0.6 },
            },
          );
          const img = el.querySelector("img");
          if (img) gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
          gsap.from(el, { y: 60 + i * 50, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 40%", scrub: true } });
        });
      });
    },
    { scope: ref },
  );

  const half = Math.ceil(PROVIDERS.length / 2);
  const rows = [PROVIDERS.slice(0, half), PROVIDERS.slice(half)];

  return (
    <section ref={ref} aria-labelledby="serve-title" className="surface-light arc-prev relative overflow-hidden bg-paper">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <Eyebrow index="02">{HOME.serve.label}</Eyebrow>
        <SplitReveal as="h2" id="serve-title" className="font-display text-h2 mt-6 max-w-[20ch]">
          {HOME.serve.title}
        </SplitReveal>
      </div>

      <ul className="sr-only">
        {PROVIDERS.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div aria-hidden className="mt-14 flex flex-col gap-6 border-y border-line py-8 md:mt-20">
        {rows.map((row, i) => (
          <div key={i} data-row>
            <div className="marquee flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
              <div
                className="marquee-track flex shrink-0 gap-10 pr-10"
                style={{ "--marquee-dir": i ? "reverse" : "normal", "--marquee-speed": `${46 + i * 8}s` } as CSSProperties}
              >
                {[...row, ...row, ...row, ...row].map((p, k) => (
                  <span key={k} className="font-display flex shrink-0 items-center gap-10 text-[clamp(1.75rem,3.4vw,3.25rem)] leading-none whitespace-nowrap text-indigo">
                    {p}
                    <span className="size-2 rounded-full bg-teal" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-20 grid max-w-[1360px] gap-5 px-5 md:mt-28 md:grid-cols-3 md:px-10">
        {PHOTOS.map((p, i) => (
          <figure key={p.caption} className={cx(i === 1 && "md:mt-16", i === 2 && "md:mt-32")}>
            <div data-photo className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-cloud">
              <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="text-label mt-4 flex items-center justify-between text-muted">
              <span>{p.caption}</span>
              <span className="tabular-nums">0{i + 1}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
