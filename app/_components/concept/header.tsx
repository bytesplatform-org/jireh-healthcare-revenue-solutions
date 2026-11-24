"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { SITE } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP, MQ } from "../motion/gsap";
import { onIntro } from "../motion/intro";
import { cx } from "../ui/primitives";
import { CONCEPT_LINKS } from "./footer";
import mark from "@/public/brand/jireh-mark-clear.png";
import wordmark from "@/public/brand/jireh-wordmark-clear.png";

/** Scroll distance (px) after which the bar turns into the floating glass pill. */
const THRESHOLD = 80;
/** Widest the pill gets. */
const PILL_MAX = 1080;
const LINKS = CONCEPT_LINKS.slice(0, 3);

/**
 * Concept page header, fixed to the top.
 *
 * At the top of the page it sits flat, exactly where the hero expects it. Past
 * THRESHOLD it morphs into a floating glass pill: it drops in with a springy
 * overshoot while squeezing from full width (elastic), the frosted glass fades
 * up, the logo mark spins once and the links flip in like a slot machine.
 * Scrolling back to the top morphs it back.
 *
 * While pinned: a gradient capsule slides behind the link of the section in
 * view, and fast scrolling makes the pill lean into the motion.
 */
export function ConceptHeader() {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(-1);
  const [compact, setCompact] = useState(false);

  // Gradient capsule follows the active section's link.
  useLayoutEffect(() => {
    const list = listRef.current;
    const ind = indRef.current;
    if (!list || !ind) return;
    const place = () => {
      const a = list.querySelectorAll<HTMLElement>("a")[active];
      if (!a || !compact) {
        ind.style.opacity = "0";
        return;
      }
      ind.style.opacity = "1";
      ind.style.width = `${a.offsetWidth + 28}px`;
      ind.style.transform = `translateX(${a.getBoundingClientRect().left - list.getBoundingClientRect().left - 14}px)`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active, compact]);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const shell = q("[data-shell]")[0] as HTMLElement;
      const glass = q("[data-glass]")[0] as HTMLElement;
      const markEl = q("[data-mark]")[0] as HTMLElement;
      const links = q("[data-link]") as HTMLElement[];
      const mm = gsap.matchMedia();

      mm.add({ motion: MQ.motion, reduce: MQ.reduce }, (ctx) => {
        const { reduce } = ctx.conditions as { motion: boolean; reduce: boolean };
        const k = reduce ? 0 : 1;
        let isCompact = false;
        /** The flat bar's own (class-driven, responsive) spacing, read before morphing. */
        let flat: Record<string, string> = {};

        const toPill = () => {
          if (isCompact) return;
          isCompact = true;
          setCompact(true);
          const cs = getComputedStyle(shell);
          flat = { marginTop: cs.marginTop, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight };
          const width = Math.min(PILL_MAX, root.clientWidth - 24);
          gsap.killTweensOf([shell, glass, markEl, ...links]);
          gsap.fromTo(shell, { y: -34 * k }, { y: 0, duration: 0.9 * k, ease: "back.out(2.6)" });
          gsap.to(shell, { maxWidth: width, duration: 1.3 * k, ease: "elastic.out(1, 0.5)" });
          gsap.to(shell, { marginTop: 12, paddingTop: 10, paddingBottom: 10, paddingLeft: 18, paddingRight: 10, borderRadius: 999, duration: 0.6 * k, ease: "power3.out" });
          gsap.to(glass, { autoAlpha: 1, duration: 0.45 * k, ease: "power2.out" });
          gsap.fromTo(markEl, { rotate: 0 }, { rotate: 360, duration: 1 * k, ease: "back.out(1.6)" });
          gsap.fromTo(links, { yPercent: 110, rotateX: -90, autoAlpha: 0 }, { yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 0.7 * k, stagger: 0.06, ease: "back.out(2)", transformPerspective: 400 });
        };

        const toBar = () => {
          if (!isCompact) return;
          isCompact = false;
          setCompact(false);
          gsap.killTweensOf([shell, glass, markEl, ...links]);
          gsap.to(glass, { autoAlpha: 0, duration: 0.3 * k });
          gsap.to(shell, {
            maxWidth: 1440,
            borderRadius: 0,
            y: 0,
            skewX: 0,
            ...flat,
            duration: 0.55 * k,
            ease: "power3.inOut",
            // hand spacing back to the classes so the flat bar stays responsive
            onComplete: () => gsap.set(shell, { clearProps: "marginTop,paddingTop,paddingBottom,paddingLeft,paddingRight" }),
          });
          gsap.fromTo(links, { yPercent: -60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5 * k, stagger: 0.04, ease: "power3.out" });
        };

        const skewTo = gsap.quickTo(shell, "skewX", { duration: 0.4, ease: "power3.out" });
        const upright = gsap.delayedCall(0.15, () => skewTo(0)).pause();

        const st = ScrollTrigger.create({
          start: THRESHOLD,
          // past the end of any page: reaching the very bottom must not count as leaving
          end: "+=1000000",
          onToggle: (self) => (self.isActive ? toPill() : toBar()),
        });
        const page = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            if (!isCompact || reduce) return;
            skewTo(gsap.utils.clamp(-5, 5, -self.getVelocity() / 600));
            upright.restart(true);
          },
        });
        if (window.scrollY > THRESHOLD) toPill();

        // which section is in view (positions settle once every pin exists)
        const spies = LINKS.map((l, i) => {
          const target = document.querySelector(l.href);
          return target
            ? ScrollTrigger.create({
                trigger: target,
                start: "top 55%",
                end: "bottom 55%",
                // measured after the pinned sections (created later) have added their scroll length
                refreshPriority: -1,
                // light this link while its section is in view; clear it on leaving (e.g. into Contact)
                onToggle: (self) => setActive((cur) => (self.isActive ? i : cur === i ? -1 : cur)),
              })
            : null;
        });

        // entrance with the loader
        const off = onIntro((tl) => {
          tl.fromTo(shell, { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out" }, 0.55);
        });

        return () => {
          off();
          st.kill();
          page.kill();
          spies.forEach((s) => s?.kill());
          upright.kill();
        };
      });
    },
    { scope: ref },
  );

  return (
    <header ref={ref} className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 text-[#1a1530]">
      <div
        data-shell
        className="pointer-events-auto relative mx-auto mt-5 px-2 sm:mt-6 sm:px-5 lg:mt-7 lg:px-7"
        style={{ maxWidth: 1440 }}
      >
        {/* Glass: frosted white, a bright rim, a soft lift */}
        <div
          data-glass
          aria-hidden
          className="invisible absolute inset-0 overflow-hidden rounded-[inherit] bg-[linear-gradient(180deg,rgb(255_255_255/0.72),rgb(255_255_255/0.42))] opacity-0 shadow-[0_18px_50px_-18px_rgb(60_50_140/0.45),inset_0_1px_0_rgb(255_255_255/0.9)] ring-1 ring-white/70 backdrop-blur-2xl backdrop-saturate-150"
        />

        <nav aria-label="Primary" className="relative flex h-11 items-center justify-between gap-6">
          <a href="#top" aria-label={`${SITE.name}, back to top`} className="flex shrink-0 items-center gap-2">
            <span data-mark className="inline-block">
              <Image src={mark} alt="" className="h-8 w-auto" priority sizes="56px" />
            </span>
            <Image src={wordmark} alt="Jireh Healthcare Revenue Solutions" className="h-6 w-auto max-[360px]:hidden" priority sizes="80px" />
          </a>

          <ul ref={listRef} className="relative hidden items-center gap-9 text-[15px] font-medium lg:flex">
            <span
              ref={indRef}
              aria-hidden
              className="absolute top-1/2 left-0 h-10 -translate-y-1/2 rounded-full bg-[linear-gradient(135deg,#6f63e6,#8b80f2_55%,#5fa8f5)] opacity-0 shadow-[0_8px_20px_-8px_rgb(111_99_230/0.7)] transition-[transform,width,opacity] duration-500 ease-out-expo"
            />
            {LINKS.map((l, i) => (
              <li key={l.href} className="relative">
                <a
                  data-link
                  href={l.href}
                  aria-current={compact && active === i ? "true" : undefined}
                  className={cx("inline-block transition-colors duration-300", compact && active === i ? "text-white" : "hover:opacity-60")}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-5">
            <a href={SITE.phoneHref} className="hidden text-[15px] font-medium transition-opacity hover:opacity-60 sm:block">
              Call us
            </a>
            <a href="#contact" className="rounded-full bg-[#c7ecf1] px-5 py-2.5 text-[15px] font-medium text-[#0a6f7b] transition-colors hover:bg-[#ade3ea]">
              Book a call
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
