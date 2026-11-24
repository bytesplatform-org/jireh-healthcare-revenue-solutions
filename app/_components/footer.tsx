"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { CYCLE, NAV_LINKS, ROUTES, SITE } from "@/lib/content";
import { ArcSurface } from "./motion/arc-surface";
import { gsap, useGSAP, MQ } from "./motion/gsap";
import { Magnetic } from "./motion/magnetic";
import { scrollToTarget } from "./motion/smooth-scroll";
import { TransitionLink as Link } from "./ui/transition-link";
import { PillLink } from "./ui/primitives";
import { LogoCard } from "./nav";
import swam from "@/public/brand/swam-certified.webp";
import cbcs from "@/public/brand/cbcs-badge.png";

/**
 * Closing call to action + site footer (every page), on flat indigo. Rises
 * over the previous section on a curved edge; the closing line rises in.
 * The section before it needs `arc-prev` bottom padding.
 */
export function Footer({ title = ["Let's strengthen your", "agency's financial health."] }: { title?: readonly [string, string] }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(ref);
        gsap.from(q("[data-cta-line]"), {
          yPercent: 110,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 70%", end: "top 30%", scrub: 0.6 },
        });
        gsap.from(q("[data-cta-rise]"), {
          y: 24,
          autoAlpha: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 60%", end: "top 25%", scrub: 0.6 },
        });
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="surface-dark arc-next relative z-20 text-paper">
      <ArcSurface tone="indigo" />

      {/* Closing call */}
      <div className="mx-auto max-w-[1360px] px-5 pt-8 md:px-10 md:pt-12">
        <h2 className="font-display text-[clamp(2.5rem,5.6vw,5.5rem)] leading-[1.02]">
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-cta-line className="block">
              {title[0]}
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.14em]">
            <span data-cta-line className="font-accent block text-paper/80">
              {title[1]}
            </span>
          </span>
        </h2>
        <div data-cta-rise className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
          <Magnetic>
            <PillLink href={ROUTES.book} tone="teal" size="lg" icon="up-right">
              Book a free consultation
            </PillLink>
          </Magnetic>
          <a href={SITE.phoneHref} className="font-display text-3xl text-paper transition-colors hover:text-teal md:text-4xl">
            {SITE.phone}
          </a>
        </div>
      </div>

      {/* Footer grid */}
      <div className="mx-auto mt-24 grid max-w-[1360px] gap-12 border-t border-line px-5 pt-14 md:px-10 lg:grid-cols-[1.2fr_0.7fr_1.1fr_1.4fr]">
        <div>
          <Link href={ROUTES.home} aria-label={`${SITE.name} home`} className="inline-block">
            <LogoCard />
          </Link>
          <p className="font-display mt-6 text-2xl">{SITE.tagline}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{SITE.promise}</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="grid h-14 place-items-center rounded-lg bg-white px-3">
              <Image src={swam} alt="SWaM certified: Small, Women and Minority-owned business, Virginia" className="h-9 w-auto" sizes="120px" />
            </span>
            <span className="grid size-14 place-items-center rounded-lg bg-white p-1.5">
              <Image src={cbcs} alt="NHA Certified Billing and Coding Specialist (CBCS)" className="h-full w-auto" sizes="56px" />
            </span>
          </div>
        </div>

        <FooterCol title="Pages">
          {[...NAV_LINKS, { label: "Book a Consultation", href: ROUTES.book }].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-paper/80 transition-colors hover:text-teal">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Services">
          {CYCLE.map((c) => (
            <li key={c.key}>
              <Link href={`${ROUTES.services}#${c.key}`} className="text-paper/80 transition-colors hover:text-teal">
                {c.title}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Contact">
          <li>
            <a href={`mailto:${SITE.email}`} className="text-[14px] break-words text-paper/80 underline decoration-paper/25 underline-offset-4 hover:text-teal">
              {SITE.email}
            </a>
          </li>
          {SITE.hours.map((h) => (
            <li key={h.days} className="flex justify-between gap-4 text-paper/80">
              <span>{h.days}</span>
              <span className="text-paper tabular-nums">{h.time}</span>
            </li>
          ))}
          <li className="pt-1 text-paper/60">{SITE.region}</li>
        </FooterCol>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1360px] flex-col gap-4 border-t border-line px-5 py-6 text-[13px] text-paper/55 md:flex-row md:items-center md:justify-between md:px-10">
        <p>
          © {SITE.year} {SITE.name}. All rights reserved.
        </p>
        <button type="button" onClick={() => scrollToTarget(0)} className="self-start text-paper/70 transition-colors hover:text-teal md:self-auto">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-label mb-5 text-muted">{title}</p>
      <ul className="flex flex-col gap-3 text-[15px]">{children}</ul>
    </div>
  );
}
