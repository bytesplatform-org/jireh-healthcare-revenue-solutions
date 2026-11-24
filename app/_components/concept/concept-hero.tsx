"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { SITE } from "@/lib/content";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { onIntro } from "../motion/intro";
import { cx } from "../ui/primitives";
import { Arrow, ArrowButton, Chip } from "./bits";
import { Glass } from "./glass";
import ceo from "@/public/images/ceo-tammy.webp";
import swam from "@/public/brand/swam-certified.webp";
import cbcs from "@/public/brand/cbcs-badge.png";

/**
 * Hero concept (bento layout), full-bleed on white.
 * Left, the headline with an inline gradient pill and a "How we work" button,
 * two calls to action, then a short blurb and credentials. Right, three
 * gradient cards with CSS "glass" forms in the brand colours (indigo/violet,
 * teal-blue, lilac).
 *
 * Motion: lines rise and cards lift in as the loader clears, the 10+ counts
 * up, the glass forms float and lean toward the pointer.
 */
export function ConceptHero() {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(ref);
        const count = q("[data-count]")[0] as HTMLElement | undefined;

        const off = onIntro((tl) => {
          tl.fromTo(q("[data-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.08, ease: "expo.out" }, 0.7)
            .fromTo(q("[data-rise]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08, ease: "expo.out" }, 1.05)
            .fromTo(q("[data-card]"), { y: 60, scale: 0.94, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 1.2, stagger: 0.12, ease: "expo.out" }, 0.8);
          if (count) {
            const n = { v: 0 };
            tl.to(n, { v: 10, duration: 1.6, ease: "power2.out", onUpdate: () => (count.textContent = String(Math.round(n.v))) }, 1.3);
          }
        });

        // Glass forms drift on their own…
        q("[data-float]").forEach((el, i) => {
          gsap.to(el, { y: i % 2 ? 14 : -14, rotate: i % 2 ? -4 : 4, duration: 4 + i, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });

        // …and lean toward the pointer inside their card.
        const cleanups: Array<() => void> = [];
        (q("[data-card]") as HTMLElement[]).forEach((card) => {
          const forms = card.querySelectorAll<HTMLElement>("[data-lean]");
          if (!forms.length) return;
          const movers = [...forms].map((f) => ({
            x: gsap.quickTo(f, "x", { duration: 0.9, ease: "power3.out" }),
            y: gsap.quickTo(f, "y", { duration: 0.9, ease: "power3.out" }),
            depth: Number(f.dataset.lean) || 20,
          }));
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const dx = (e.clientX - r.left) / r.width - 0.5;
            const dy = (e.clientY - r.top) / r.height - 0.5;
            movers.forEach((m) => {
              m.x(dx * m.depth);
              m.y(dy * m.depth);
            });
          };
          const leave = () => movers.forEach((m) => (m.x(0), m.y(0)));
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          });
        });
        return () => {
          off();
          cleanups.forEach((c) => c());
        };
      });
    },
    { scope: ref },
  );

  // Hand-off to the next section: the hero stays pinned while the next section
  // slides up over it like a sheet; underneath, the hero settles into a rounded
  // card on a pale backdrop and dims.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const stage = stageRef.current;
        const panel = ref.current;
        if (!stage || !panel) return;
        // one timeline owns the pin and the motion, so they share a single trigger
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: stage, start: "top top", end: "bottom top", pin: true, pinSpacing: false, scrub: true, invalidateOnRefresh: true },
          })
          .fromTo(panel, { scale: 1, borderRadius: 0 }, { scale: 0.84, borderRadius: 48, ease: "power2.out" }, 0)
          .fromTo(panel.querySelector("[data-hero-body]"), { autoAlpha: 1, y: 0 }, { autoAlpha: 0.25, y: () => -window.innerHeight * 0.04 }, 0);
      });
    },
    { dependencies: [] },
  );

  return (
    <div ref={stageRef} className="bg-[#e9e6f5]">
    <div ref={ref} id="top" className="relative flex min-h-svh origin-[50%_35%] flex-col overflow-hidden bg-white text-[#1a1530] will-change-transform">
      <div data-hero-body className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-7">
        {/* room for the fixed ConceptHeader, which sits here at the top of the page */}
        <div aria-hidden className="h-11 shrink-0" />

        <div className="mt-10 grid gap-10 lg:mt-8 lg:min-h-[560px] lg:flex-1 lg:grid-cols-[1fr_1.02fr] lg:gap-12">
          {/* Left */}
          <div className="flex flex-col">
            <h1 className="text-[clamp(2.5rem,4.9vw,4.9rem)] leading-[1.04] font-medium tracking-[-0.035em] 2xl:text-[5.1rem] lg:[&_[data-line]]:whitespace-nowrap">
              <Line>
                <span aria-hidden className="mb-[0.04em] mr-[0.22em] inline-block h-[0.72em] w-[1.55em] translate-y-[0.06em] rounded-full bg-[repeating-linear-gradient(90deg,#9fe3ec_0_0.09em,#c9b8f5_0.09em_0.2em,#e7d6fb_0.2em_0.28em)]" />
                Billing experts
              </Line>
              <Line>that protect</Line>
              {/* the button sits on the word's line, centred on its height */}
              <Line className="flex flex-wrap items-center gap-x-[0.28em]">
                <span>revenue</span>
                <HowButton />
              </Line>
              <Line>for home health</Line>
            </h1>

            <div data-rise className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#9fdbe4] px-7 py-3.5 text-[15px] font-medium text-[#08535c] transition-colors hover:bg-[#86d0db]"
              >
                Book a free consultation
                <Arrow className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href={SITE.phoneHref} className="text-[15px] font-medium underline underline-offset-4 transition-opacity hover:opacity-60">
                Call {SITE.phone}
              </a>
            </div>

            <div data-rise className="mt-14 lg:mt-auto">
              <p className="max-w-[30rem] text-[15px] leading-relaxed font-medium">
                Jireh partners with home and community-based care providers to protect revenue and keep Medicare and Medicaid billing accurate and
                compliant.
              </p>
              <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] font-semibold">
                <li className="flex items-center gap-2">
                  <Image src={swam} alt="" className="h-6 w-auto" sizes="70px" />
                  SWaM certified
                </li>
                <li className="flex items-center gap-2">
                  <Image src={cbcs} alt="" className="size-7" sizes="30px" />
                  CBCS
                </li>
                <li className="flex items-center gap-2">
                  <Dot className="bg-[#11b7c9]" />
                  Medicare & Medicaid
                </li>
                <li className="flex items-center gap-2">
                  <Dot className="bg-[#8b7cf0]" />
                  VA ID/DD Waivers
                </li>
              </ul>
            </div>
          </div>

          {/* Right: bento */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-rows-[1.12fr_1fr]">
            {/* Big card */}
            <Card href="#contact" className="col-span-2 min-h-[280px] bg-[linear-gradient(135deg,#6f63e6_0%,#8b80f2_55%,#b3a8f8_100%)] sm:min-h-[320px] lg:min-h-0">
              <GlassBlob />
              <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
                <p className="max-w-[14ch] text-[clamp(1.6rem,2.5vw,2.3rem)] leading-[1.08] font-normal tracking-[-0.02em] text-white">
                  Ready to take billing off your plate? Let&apos;s talk.
                </p>
                <div className="mt-8 flex items-end justify-between gap-6">
                  <p className="max-w-[24ch] text-[13px] leading-snug font-medium text-white/85">
                    Our goal is to protect your revenue, reduce leakage and keep your agency financially strong.
                  </p>
                  <ArrowButton large />
                </div>
              </div>
            </Card>

            {/* Services card */}
            <Card href="#how-we-work" className="aspect-[4/4.4] bg-[linear-gradient(160deg,#9fd3fb_0%,#5fa8f5_55%,#4b8ff0_100%)] sm:aspect-[4/4.2] lg:aspect-auto">
              <GlassSphere />
              <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <Chip>services</Chip>
                  <ArrowButton />
                </div>
                <div>
                  <p className="text-[clamp(1.2rem,1.9vw,1.75rem)] leading-[1.08] tracking-[-0.02em] text-white">End-to-end revenue cycle</p>
                  <p className="mt-2 hidden text-[12.5px] leading-snug font-medium text-white/85 sm:block">
                    Eligibility, claims, posting, A/R, denials and reporting — handled.
                  </p>
                </div>
              </div>
            </Card>

            {/* Experience card */}
            <Card href="#ceo" className="aspect-[4/4.4] bg-[linear-gradient(165deg,#f4ddf3_0%,#e5b9ec_55%,#d39be6_100%)] sm:aspect-[4/4.2] lg:aspect-auto">
              <GlassRibs />
              <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <Chip>experience</Chip>
                  <span className="relative size-9 overflow-hidden rounded-full ring-2 ring-white">
                    <Image src={ceo} alt="Tammy Flowers-Hollis, CEO" fill sizes="40px" className="object-cover object-top" />
                  </span>
                </div>
                <div>
                  <p className="text-[clamp(2.6rem,4.6vw,4.4rem)] leading-none font-light tracking-[-0.04em] text-white">
                    <span data-count>10</span>+
                  </p>
                  <p className="mt-2 text-[12.5px] leading-snug font-medium text-white/90">Years of Medicaid & Medicare experience leading every account.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

    </div>
    </div>
  );
}


/* ------------------------------------------------------------------ */

function Line({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <span data-line className={className ?? "block"}>
        {children}
      </span>
    </span>
  );
}

function HowButton() {
  return (
    <a
      href="#how-we-work"
      // sized in em of the headline: ~0.2em text, ~0.6em tall, so it scales with it
      className="group/how mt-[0.7rem] inline-flex shrink-0 items-center gap-[0.6em] rounded-full border-2 border-[#1a1530] px-[1.25em] py-[0.72em] text-[max(14px,0.2em)] leading-none font-semibold tracking-normal whitespace-nowrap transition-colors duration-300 hover:bg-[#1a1530] hover:text-white"
    >
      <svg viewBox="0 0 16 16" aria-hidden className="size-[0.95em] transition-transform duration-300 group-hover/how:translate-x-0.5">
        <path d="M4.5 3.2v9.6L12.5 8 4.5 3.2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      How we work
    </a>
  );
}

function Card({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <a data-card href={href} className={cx("group relative block overflow-hidden rounded-[22px] sm:rounded-[26px]", className)}>
      {children}
    </a>
  );
}




function Dot({ className }: { className?: string }) {
  return <span aria-hidden className={cx("size-2.5 rounded-full", className)} />;
}

/* Glass forms (pure CSS) ------------------------------------------- */

/** Big card: a liquid-glass blob with a few droplets. */
function GlassBlob() {
  return (
    <div aria-hidden className="pointer-events-none absolute -top-[14%] right-[-10%] h-[118%] w-[52%] max-sm:w-[58%]">
      <div data-lean="26" className="absolute inset-0">
        <div
          data-float
          className="absolute inset-[6%] rounded-[46%_54%_42%_58%/55%_45%_55%_45%] bg-[radial-gradient(circle_at_30%_25%,rgb(255_255_255/0.95),rgb(255_255_255/0.25)_18%,transparent_34%),radial-gradient(circle_at_70%_75%,rgb(94_224_236/0.75),transparent_45%),radial-gradient(circle_at_40%_60%,rgb(70_55_190/0.55),transparent_60%),linear-gradient(150deg,rgb(255_255_255/0.45),rgb(160_150_250/0.25))] shadow-[inset_-18px_-22px_40px_rgb(40_30_140/0.35),inset_14px_16px_30px_rgb(255_255_255/0.55),0_30px_60px_-20px_rgb(40_30_140/0.45)] backdrop-blur-[2px]"
        />
        {[
          ["32%", "40%", "4%"],
          ["48%", "62%", "2.6%"],
          ["58%", "34%", "3.2%"],
          ["68%", "55%", "2%"],
          ["40%", "70%", "1.6%"],
        ].map(([top, left, size], i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,rgb(255_255_255/0.2)_55%,rgb(255_255_255/0.05))] shadow-[0_2px_6px_rgb(40_30_140/0.3)]"
            style={{ top, left, width: size, aspectRatio: "1" }}
          />
        ))}
      </div>
    </div>
  );
}

/** Services card: the revenue cycle, as glass arrows chasing each other round. */
function GlassSphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div data-lean="22" className="absolute top-[6%] left-[22%] w-[56%]">
        <div data-float>
          <Glass kind="cycle" tint="sky" />
        </div>
      </div>
    </div>
  );
}

/** Experience card: fluted glass ribs over a soft bloom. */
function GlassRibs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div data-lean="16" className="absolute top-[18%] left-[-10%] w-[80%]">
        <div data-float className="aspect-square rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.85),rgb(255_220_250/0.3)_45%,transparent_70%)]" />
      </div>
      <div className="absolute inset-y-0 right-0 w-[58%] bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0.0)_0_10px,rgb(255_255_255/0.35)_10px_14px,rgb(255_255_255/0.08)_14px_24px)] [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_80%,transparent)]" />
    </div>
  );
}
