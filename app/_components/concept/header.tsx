"use client";

import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS, ROUTES, SITE } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP, MQ } from "../motion/gsap";
import { onIntro } from "../motion/intro";
import { cx } from "../ui/primitives";
import { TransitionLink as Link } from "../ui/transition-link";
import mark from "@/public/brand/jireh-mark-clear.png";
import wordmark from "@/public/brand/jireh-wordmark-clear.png";

/** Scroll distance (px) after which the bar turns into the floating glass pill. */
const THRESHOLD = 80;
/** Widest the pill gets. */
const PILL_MAX = 1080;
/** The site's pages (as on the current live site). */
const LINKS = [...NAV_LINKS, { label: "Book a Free Consultation", href: ROUTES.book }] as const;
/** This concept is the future home page, so it lights "Home". */
const HOME_ALIASES = new Set(["/", "/hero-concept"]);

/**
 * Concept page header, fixed to the top.
 *
 * At the top of the page it sits flat, exactly where the hero expects it. Past
 * THRESHOLD it morphs into a floating glass pill: it drops in with a springy
 * overshoot while squeezing from full width (elastic), the frosted glass fades
 * up, the logo mark spins once and the links flip in like a slot machine.
 * Scrolling back to the top morphs it back.
 *
 * The links go to the site's pages. The current page is underlined on the flat
 * bar and gets a gradient capsule in the pill; fast scrolling makes the pill
 * lean into the motion. Below lg the links move into a dropdown menu.
 */
export function ConceptHeader() {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();
  const active = LINKS.findIndex((l) => (l.href === ROUTES.home ? HOME_ALIASES.has(pathname) : pathname === l.href));

  // the menu closes on Escape and when the viewport grows past it
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const wide = window.matchMedia("(min-width: 1024px)");
    const grow = () => wide.matches && setOpen(false);
    window.addEventListener("keydown", key);
    wide.addEventListener("change", grow);
    return () => {
      window.removeEventListener("keydown", key);
      wide.removeEventListener("change", grow);
    };
  }, [open]);

  // Gradient capsule follows the active section's link.
  useLayoutEffect(() => {
    const list = listRef.current;
    const ind = indRef.current;
    if (!list || !ind) return;
    const place = () => {
      const a = active < 0 ? undefined : list.querySelectorAll<HTMLElement>("a")[active];
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

        // entrance with the loader
        const off = onIntro((tl) => {
          tl.fromTo(shell, { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out" }, 0.55);
        });

        return () => {
          off();
          st.kill();
          page.kill();
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

          <ul ref={listRef} className="relative hidden items-center gap-7 text-[14px] font-medium lg:flex xl:gap-9 xl:text-[15px]">
            <span
              ref={indRef}
              aria-hidden
              className="absolute top-1/2 left-0 h-10 -translate-y-1/2 rounded-full bg-[linear-gradient(135deg,#6f63e6,#8b80f2_55%,#5fa8f5)] opacity-0 shadow-[0_8px_20px_-8px_rgb(111_99_230/0.7)] transition-[transform,width,opacity] duration-500 ease-out-expo"
            />
            {LINKS.map((l, i) => (
              <li key={l.href} className="relative">
                <Link
                  data-link
                  href={l.href}
                  aria-current={active === i ? "page" : undefined}
                  className={cx("group/l relative inline-block whitespace-nowrap transition-colors duration-300", compact && active === i && "text-white")}
                >
                  {l.label}
                  {/* underline: the current page on the flat bar, and on hover */}
                  <span
                    aria-hidden
                    className={cx(
                      "absolute inset-x-0 -bottom-1.5 h-[1.5px] origin-left rounded-full bg-current transition-[scale] duration-500 ease-out-expo",
                      !compact && active === i ? "scale-x-100" : "scale-x-0 group-hover/l:scale-x-100",
                      compact && active === i && "hidden",
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <a href={SITE.phoneHref} className="rounded-full bg-[#c7ecf1] px-5 py-2.5 text-[15px] font-medium whitespace-nowrap text-[#0a6f7b] transition-colors hover:bg-[#ade3ea]">
              Call us
            </a>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="grid size-10 place-items-center rounded-full bg-[#1a1530] text-white lg:hidden"
            >
              <span aria-hidden className="relative block h-3 w-4">
                <span className={cx("absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300", open ? "top-1/2 rotate-45" : "top-0")} />
                <span className={cx("absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300", open ? "top-1/2 -rotate-45" : "bottom-0")} />
              </span>
            </button>
          </div>
        </nav>

        {/* Below lg: the pages in a glass dropdown */}
        <div
          id={menuId}
          hidden={!open}
          className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-[28px] bg-white/85 p-3 shadow-[0_24px_60px_-20px_rgb(60_50_140/0.45)] ring-1 ring-white/70 backdrop-blur-2xl lg:hidden"
        >
          <ul className="grid">
            {LINKS.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === i ? "page" : undefined}
                  className={cx(
                    "flex items-center justify-between rounded-[20px] px-4 py-3.5 text-[19px] font-medium tracking-[-0.01em] transition-colors",
                    active === i ? "bg-[linear-gradient(135deg,#6f63e6,#8b80f2_55%,#5fa8f5)] text-white" : "hover:bg-[#f1eff8]",
                  )}
                >
                  {l.label}
                  <span aria-hidden className="text-[15px] opacity-60">
                    0{i + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
