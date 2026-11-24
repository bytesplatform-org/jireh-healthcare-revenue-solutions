"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { HOME, ROUTES } from "@/lib/content";
import { gsap, SplitText, useGSAP, MQ } from "../motion/gsap";
import { onIntro } from "../motion/intro";
import { PillLink, TextLink } from "../ui/primitives";
import family from "@/public/images/family.webp";
import typing from "@/public/images/hands-typing.webp";
import swam from "@/public/brand/swam-certified.webp";
import cbcs from "@/public/brand/cbcs-badge.png";

/**
 * Home hero. Paper, a serif headline, two photographs: the people the care is
 * for, and the billing work behind it. Under it a plain strip of what the
 * client is actually certified for.
 *
 * Motion: as the loader lifts, the headline rises line by line, the photos
 * open from the bottom edge, the rest fades up. On scroll the photos drift at
 * different speeds.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const root = ref.current;
        if (!root) return;
        const q = gsap.utils.selector(root);
        const split = SplitText.create(q("h1")[0], {
          type: "lines",
          mask: "lines",
          onSplit: (self) => {
            gsap.set(self.masks, { paddingBottom: "0.12em", marginBottom: "-0.12em" });
          },
        });

        const off = onIntro((tl) => {
          tl.fromTo(split.lines, { yPercent: 110 }, { yPercent: 0, duration: 1.25, stagger: 0.08, ease: "expo.out" }, 0.7)
            .fromTo(q("[data-rise]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.07, ease: "expo.out" }, 1.0)
            .fromTo(
              q("[data-photo]"),
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, stagger: 0.15, ease: "expo.inOut" },
              0.6,
            )
            .fromTo(q("[data-photo] img"), { scale: 1.2 }, { scale: 1, duration: 1.8, stagger: 0.15, ease: "expo.out" }, 0.8);
        });

        gsap.to(q("[data-drift='slow']"), { yPercent: -6, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(q("[data-drift='fast']"), { yPercent: -28, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });

        return () => {
          off();
          split.revert();
        };
      });
    },
    { scope: ref },
  );

  const { hero } = HOME;
  return (
    <section ref={ref} id="top" className="surface-light relative bg-paper">
      <div className="mx-auto grid max-w-[1360px] gap-14 px-5 pt-32 pb-16 md:px-10 md:pt-40 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20 lg:pb-24">
        <div>
          <p data-rise className="text-label flex items-center gap-3 text-muted">
            <span aria-hidden className="h-px w-8 bg-current opacity-40" />
            {hero.eyebrow}
          </p>
          <h1 className="font-display text-hero mt-8 max-w-[15ch]">
            We handle the revenue cycle, so you can <span className="font-accent">care for your patients.</span>
          </h1>
          <p data-rise className="text-lede mt-8 max-w-[34rem] text-muted">
            {hero.body}
          </p>
          <div data-rise className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <PillLink href={ROUTES.book} tone="indigo" size="lg" icon="up-right">
              Book a free consultation
            </PillLink>
            <TextLink href={ROUTES.services}>Our services</TextLink>
          </div>
        </div>

        {/* Photographs */}
        <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <div data-drift="slow" className="relative ml-auto w-[86%]">
            <div data-photo className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-cloud">
              <Image src={family} alt="A family embracing outdoors" fill priority sizes="(min-width: 1024px) 36vw, 86vw" className="object-cover object-[45%_center]" />
            </div>
          </div>
          <div data-drift="fast" className="absolute bottom-[-8%] left-0 w-[46%]">
            <div data-photo className="relative aspect-square overflow-hidden rounded-[14px] bg-cloud ring-8 ring-paper">
              <Image src={typing} alt="Hands typing on a keyboard" fill sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* What the client is certified for */}
      <div className="mx-auto max-w-[1360px] px-5 pb-20 md:px-10">
        <ul data-rise className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
          <Fact title="Medicare & Medicaid" body="Eligibility, claims and follow-up" />
          <Fact title="Virginia ID/DD Waivers" body="CL, FIS and BI providers" />
          <Fact title="SWaM certified" body="Small, women & minority-owned" image={<Image src={swam} alt="" className="h-8 w-auto" sizes="90px" />} />
          <Fact title="CBCS certified" body="Certified Billing & Coding Specialist" image={<Image src={cbcs} alt="" className="size-9" sizes="40px" />} />
        </ul>
      </div>
    </section>
  );
}

function Fact({ title, body, image }: { title: string; body: string; image?: ReactNode }) {
  return (
    <li className="flex flex-col items-start gap-3 border-line py-6 pr-5 odd:border-r sm:flex-row sm:gap-4 lg:border-r lg:last:border-r-0 lg:[&:not(:first-child)]:pl-6 max-lg:[&:nth-child(even)]:pl-5">
      {image && <span className="shrink-0 pt-0.5">{image}</span>}
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="mt-1 block text-sm text-muted">{body}</span>
      </span>
    </li>
  );
}
