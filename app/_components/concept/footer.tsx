"use client";

import Image from "next/image";
import { useRef } from "react";
import { SITE } from "@/lib/content";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { scrollToTarget } from "../motion/smooth-scroll";
import { TEXT_GRAD } from "./bits";
import swam from "@/public/brand/swam-certified.webp";
import cbcs from "@/public/brand/cbcs-badge.png";

export const CONCEPT_LINKS = [
  { label: "Services", href: "#how-we-work" },
  { label: "About the CEO", href: "#ceo" },
  { label: "Mission & Vision", href: "#mission" },
  { label: "Contact", href: "#contact" },
] as const;

/** Footer: links and details, then a giant gradient JIREH that rises letter by letter. */
export function ConceptFooter() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(ref);
        gsap.fromTo(
          q("[data-letter]"),
          { yPercent: 110, rotate: (i: number) => (i % 2 ? 12 : -12) },
          { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: q("[data-giant]")[0], start: "top bottom", end: "bottom bottom", scrub: 0.6 } },
        );
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="overflow-hidden bg-white px-5 pt-10 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-10 border-t border-[#1a1530]/10 pt-12 text-[#1a1530] md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="max-w-[26ch] text-[clamp(1.4rem,2vw,1.75rem)] leading-tight font-medium tracking-[-0.02em]">{SITE.promise}</p>
          <div className="mt-6 flex items-center gap-3">
            <Image src={swam} alt="SWaM certified" className="h-9 w-auto" sizes="110px" />
            <Image src={cbcs} alt="NHA Certified Billing and Coding Specialist (CBCS)" className="size-11" sizes="48px" />
          </div>
        </div>
        <ul className="grid content-start gap-2 text-[15px] font-medium">
          {CONCEPT_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-opacity hover:opacity-60">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="grid content-start gap-2 text-[15px] font-medium">
          <a href={SITE.phoneHref} className="hover:opacity-60">
            {SITE.phone}
          </a>
          <a href={`mailto:${SITE.email}`} className="break-words hover:opacity-60">
            {SITE.email}
          </a>
          <p className="text-[#1a1530]/55">{SITE.region}</p>
        </div>
      </div>

      <p data-giant aria-hidden className="mx-auto mt-14 flex max-w-[1440px] justify-between overflow-hidden text-[27vw] leading-[0.8] font-semibold tracking-[-0.06em] select-none 2xl:text-[24rem]">
        {"JIREH".split("").map((l, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.04em]">
            <span data-letter className={`inline-block ${TEXT_GRAD}`}>
              {l}
            </span>
          </span>
        ))}
      </p>

      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 py-6 text-[13px] font-medium text-[#1a1530]/55">
        <p>
          © {SITE.year} {SITE.name}
        </p>
        <button type="button" onClick={() => scrollToTarget(0)} className="hover:text-[#1a1530]">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
