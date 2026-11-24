"use client";

import Image from "next/image";
import { Suspense, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, MQ } from "./motion/gsap";
import { armIntro, playIntro } from "./motion/intro";
import {
  RESUME_KEY,
  routeCommitted,
  setTransitionHandler,
  waitForRoute,
} from "./motion/page-transition";
import { Orb } from "./concept/bits";
import markClear from "@/public/brand/jireh-mark-clear.png";
import {
  getLenis,
  scrollToTarget,
  setScrollLocked,
} from "./motion/smooth-scroll";

/** First load: never faster than this (s)… */
const MIN_TIME = 1.8;
/** …and never waits longer than this, whatever is still loading (s). */
const MAX_TIME = 6;
/** Page transitions: the charge takes at least this long (s)… */
const NAV_MIN_TIME = 0.45;
/** …and gives up waiting for the next page after this (s). */
const NAV_MAX_TIME = 8;

const nextFrame = () =>
  new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * Full-screen loader: first load AND page transitions (adapted from FernGrid).
 *
 * First load (concept theme): white, the logo mark, the headline's striped
 * pill filling with the charge, a big light counter running to 100 and glass
 * orbs, driven by real progress (webfonts, page load) with a minimum and
 * maximum duration. Then the content lifts off and the screen, built as three
 * columns, rises away column by column, each trailing a rounded gradient tail
 * (violet, sky, lilac) across the page, while every entrance registered through
 * `onIntro` (hero, header, buttons) plays on the same timeline.
 *
 * Page transitions: the three columns rise in from below (gradient tails
 * leading) to cover the page, the route changes behind them while the pill
 * charges, then they lift away the same way to reveal the new page.
 *
 * Scrolling is locked whenever the panel covers the page. Rendered on the server
 * so it covers the page from the first paint (only when JS is available:
 * `html.js`); a CSS failsafe fades it out if scripts never run.
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const html = document.documentElement;
    const q = gsap.utils.selector(root);
    const fill = q("[data-fill]")[0] as HTMLElement;
    const digits = q("[data-digit]") as HTMLElement[];
    const cols = q("[data-col]") as HTMLElement[];
    const content = q("[data-content]")[0] as HTMLElement;
    /** Height of a column's gradient tail (they hang above/below each column). */
    const tail = () => (q("[data-tail]")[0] as HTMLElement).offsetHeight;
    const reduced = window.matchMedia(MQ.reduce).matches;
    let disposed = false;
    let busy = true; // covering the page (first load or a transition)
    let tick: (() => void) | null = null;

    // During a page transition the charge is persisted, so a full reload
    // mid-transition (unbuilt routes) picks it up instead of restarting at 0.
    let persist = false;
    let lastSaved = 0;
    const render = (p: number) => {
      const s = String(Math.round(p * 100)).padStart(3, "0");
      digits.forEach((d, i) => (d.textContent = s[i]));
      fill.style.clipPath = `inset(0 ${(100 - p * 100).toFixed(2)}% 0 0 round 999px)`;
      if (persist && performance.now() - lastSaved > 80) {
        lastSaved = performance.now();
        try {
          sessionStorage.setItem(
            RESUME_KEY,
            JSON.stringify({ at: Date.now(), p }),
          );
        } catch {}
      }
    };

    /** Charge to 100: `readiness()` (0–1) is real progress, clamped by min/max time. */
    const charge = (
      minTime: number,
      maxTime: number,
      readiness: () => number,
      rate = 0.06,
      from = 0,
    ) =>
      new Promise<void>((resolve) => {
        const t0 = performance.now();
        let p = from;
        tick = () => {
          const elapsed = (performance.now() - t0) / 1000;
          const real = readiness();
          // time keeps it moving (never past 92% until things have actually loaded)
          const timeFloor = Math.min(0.92, elapsed / minTime);
          let goal = Math.max(
            p,
            Math.min(Math.max(real, timeFloor * 0.6), timeFloor + 0.08, 1),
          );
          if (real >= 0.99 && elapsed >= minTime) goal = 1;
          if (elapsed >= maxTime) goal = 1;
          p += (goal - p) * (goal === 1 ? rate * 2 : rate);
          if (goal === 1 && p > 0.995) p = 1;
          render(p);
          if (p === 1) {
            gsap.ticker.remove(tick!);
            tick = null;
            resolve();
          }
        };
        render(p);
        gsap.ticker.add(tick);
      });

    const unlock = () => {
      html.classList.remove("is-loading");
      setScrollLocked(false);
    };

    /** Lift the panel away and play every registered entrance on the same clock. */
    const reveal = (fast = false) =>
      new Promise<void>((resolve) => {
        // page transitions lift sooner and a little quicker than the first load
        const lift = fast ? 0.25 : 0.45;
        const dur = fast ? 0.95 : 1.15;
        const tl = gsap.timeline({
          onComplete: () => {
            unlock();
            gsap.set(root, { autoAlpha: 0 });
            busy = false;
            resolve();
          },
        });
        if (reduced) {
          tl.to(root, { autoAlpha: 0, duration: 0.4, ease: "power1.out" }).call(
            unlock,
          );
          playIntro(tl);
          return;
        }
        // the content lifts off, then the three columns rise away one after
        // another, their gradient tails sweeping up across the page
        tl.to(q("[data-lockup]"), { yPercent: -30, autoAlpha: 0, duration: 0.6, ease: "power3.in" }, 0.1)
          .to(digits, { yPercent: -110, duration: 0.5, stagger: 0.05, ease: "power3.in" }, 0.1)
          .to(q("[data-meta]"), { autoAlpha: 0, duration: 0.3 }, 0.1)
          .to(q("[data-orb]"), { y: -80, autoAlpha: 0, duration: 0.6, stagger: 0.05, ease: "power3.in" }, 0.1)
          .set(content, { autoAlpha: 0 }, lift)
          .fromTo(cols, { y: 0 }, { y: () => -(root.offsetHeight + tail() + 4), duration: dur, stagger: 0.09, ease: "expo.inOut" }, lift)
          // scrolling comes back as soon as the last column has cleared the screen
          .call(unlock, undefined, lift + dur + 0.18);
        playIntro(tl);
      });

    /** Bring the panel up from the bottom to cover the current page. */
    const cover = () =>
      new Promise<void>((resolve) => {
        gsap.set(q("[data-lockup]"), { yPercent: 0, autoAlpha: 1 });
        gsap.set(digits, { yPercent: 0 });
        gsap.set([q("[data-meta]"), q("[data-orb]")], { autoAlpha: 1, y: 0 });
        render(0);
        if (reduced) {
          gsap.set(cols, { y: 0 });
          gsap.set(content, { autoAlpha: 1 });
          gsap.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, onComplete: resolve });
          return;
        }
        gsap.set(root, { autoAlpha: 1 });
        gsap.set(content, { autoAlpha: 0 });
        gsap
          .timeline({ onComplete: resolve })
          // the columns rise in from below, gradient tails leading
          .fromTo(cols, { y: () => root.offsetHeight + tail() + 4 }, { y: 0, duration: 0.85, stagger: 0.07, ease: "expo.inOut" })
          .set(content, { autoAlpha: 1 }, 0.7)
          .fromTo(q("[data-lockup]"), { yPercent: 30, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, 0.7);
      });

    /** Page transitions show the lockup charge without the counter. */
    const hideCount = () => gsap.set(q("[data-count]"), { autoAlpha: 0 });

    /** Cover → navigate behind the panel → wait for the new route to render → reveal. */
    const navigate = async (url: URL) => {
      busy = true;
      root.classList.remove("loader-failsafe");
      const href = url.pathname + url.search + url.hash;
      routerRef.current.prefetch(href);
      setScrollLocked(true);
      hideCount();
      await cover();
      if (disposed) return;
      setScrollLocked(true); // (closing the mobile menu may have released it)
      armIntro(); // the next page's entrances play on the reveal

      let ready = false;
      waitForRoute(url.pathname, NAV_MAX_TIME * 1000).then(
        () => (ready = true),
      );
      // Back to the top *before* the new page mounts (the cover hides the jump):
      // its scroll-driven scenes are built at mount, and built at the old page's
      // scroll position they'd render as already scrolled through (e.g. the NERC
      // hero showing its end state at the top of the page).
      window.scrollTo(0, 0);
      getLenis()?.scrollTo(0, { immediate: true, force: true });
      persist = true;
      routerRef.current.push(href, { scroll: false });
      await charge(NAV_MIN_TIME, NAV_MAX_TIME, () => (ready ? 1 : 0.35), 0.14);
      persist = false;
      try {
        sessionStorage.removeItem(RESUME_KEY);
      } catch {}
      if (disposed) return;
      await settleAndReveal(url.hash);
    };

    /** New page is in: start at its top (or #hash), let pins re-measure, reveal. */
    const settleAndReveal = async (hash: string) => {
      await nextFrame();
      await nextFrame();
      window.scrollTo(0, 0);
      getLenis()?.scrollTo(0, { immediate: true, force: true });
      ScrollTrigger.refresh();
      const target = hash
        ? document.getElementById(decodeURIComponent(hash.slice(1)))
        : null;
      if (target) scrollToTarget(target, { immediate: true });
      await reveal(true);
    };

    // Links (TransitionLink → onNavigate) hand their navigation over here.
    const releaseHandler = setTransitionHandler((url) => {
      if (url.origin !== window.location.origin) return false;
      if (busy) return true; // already covering: swallow extra clicks
      if (url.pathname === window.location.pathname) return false; // same page (#section)
      navigate(url);
      return true;
    });

    // --- first load: weighted milestones ----------------------------------------
    setScrollLocked(true);
    window.scrollTo(0, 0);
    const milestones = { fonts: false, load: false };
    const weights = { fonts: 0.45, load: 0.5 };
    const done = (k: keyof typeof milestones) => () => {
      milestones[k] = true;
    };
    if (document.fonts) document.fonts.ready.then(done("fonts"));
    else milestones.fonts = true;
    if (document.readyState === "complete") milestones.load = true;
    else window.addEventListener("load", done("load"), { once: true });
    const loaded = () =>
      (Object.keys(milestones) as (keyof typeof milestones)[]).reduce(
        (sum, k) => sum + (milestones[k] ? weights[k] : 0),
        0.04,
      );
    // A transition that ended in a full reload: carry on from where it was.
    let resume: number | null = null;
    try {
      const saved = JSON.parse(
        sessionStorage.getItem(RESUME_KEY) ?? "null",
      ) as { at: number; p: number } | null;
      if (saved && Date.now() - saved.at < 8000) resume = saved.p;
      sessionStorage.removeItem(RESUME_KEY);
    } catch {}
    const firstLoad = async () => {
      if (resume !== null) {
        hideCount();
        await charge(NAV_MIN_TIME, MAX_TIME, loaded, 0.14, resume);
        html.classList.remove("jh-resume");
        if (disposed) return;
        await settleAndReveal(window.location.hash);
      } else {
        await charge(MIN_TIME, MAX_TIME, loaded);
        if (disposed) return;
        await reveal();
      }
      root.classList.remove("loader-failsafe");
    };
    firstLoad();

    return () => {
      disposed = true;
      if (tick) gsap.ticker.remove(tick);
      releaseHandler();
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <RouteWatcher />
      </Suspense>
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className="loader-failsafe fixed inset-0 z-[100] hidden text-[#1a1530] [.js_&]:block"
        style={{ fontFamily: "var(--font-urbanist), ui-sans-serif, system-ui, sans-serif" }}
      >
        <span className="sr-only">Loading Jireh Healthcare Revenue Solutions</span>

        {/* Three white columns; each carries a rounded gradient tail above and below it */}
        <div aria-hidden className="absolute inset-0 flex">
          {COLUMN_TAILS.map((g, i) => (
            <div key={i} data-col className="relative h-full flex-1 bg-white">
              <div data-tail className={`absolute inset-x-0 bottom-full h-[16vh] rounded-t-[48px] ${g}`} />
              <div className={`absolute inset-x-0 top-full h-[16vh] rounded-b-[48px] ${g}`} />
              {/* hairline seam so the columns read as three panels as they part */}
              {i > 0 && <span className="absolute inset-y-0 left-0 w-px bg-[#1a1530]/[0.04]" />}
            </div>
          ))}
        </div>

        <div data-content aria-hidden className="absolute inset-0 flex flex-col">
          <Orb data-orb="" tint="violet" className="absolute top-[9%] right-[9%] w-[clamp(80px,11vw,170px)]" />
          <Orb data-orb="" tint="sky" className="absolute bottom-[22%] left-[7%] w-[clamp(54px,6vw,100px)]" />
          <Orb data-orb="" tint="lilac" className="absolute top-[30%] left-[22%] w-[clamp(28px,3vw,50px)]" />

          <div className="relative flex flex-1 items-center justify-center px-5">
            <div data-lockup className="flex flex-col items-center text-center">
              <Image src={markClear} alt="" priority className="h-14 w-auto sm:h-16" sizes="100px" />
              {/* the striped pill from the headline, filling with the charge */}
              <div className="relative mt-8 h-[clamp(44px,7vw,72px)] w-[clamp(220px,34vw,420px)] rounded-full bg-[#f1eff8]">
                <div data-fill className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(90deg,#9fe3ec_0_10px,#c9b8f5_10px_22px,#e7d6fb_22px_30px)] [clip-path:inset(0_100%_0_0_round_999px)]" />
              </div>
              <p className="mt-6 text-[clamp(1.25rem,2vw,1.6rem)] font-medium tracking-[-0.02em]">Jireh Healthcare Revenue Solutions</p>
            </div>
          </div>

          <div className="relative flex items-end justify-between gap-6 px-5 pb-6 sm:px-8 md:px-10 md:pb-9">
            <p data-meta className="text-[14px] font-medium text-[#1a1530]/55">
              Faith. Integrity. Excellence.
            </p>
            <p data-count className="flex overflow-hidden text-[clamp(3.5rem,9vw,8rem)] leading-[0.85] font-light tracking-[-0.05em] tabular-nums">
              {[0, 1, 2].map((i) => (
                <span key={i} data-digit className="inline-block">
                  0
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const COLUMN_TAILS = [
  "bg-[linear-gradient(135deg,#6f63e6_0%,#8b80f2_55%,#b3a8f8_100%)]",
  "bg-[linear-gradient(160deg,#9fd3fb_0%,#5fa8f5_55%,#4b8ff0_100%)]",
  "bg-[linear-gradient(165deg,#f4ddf3_0%,#e5b9ec_55%,#d39be6_100%)]",
];

/** Reports each committed route to the page transition (after React renders it). */
function RouteWatcher() {
  const pathname = usePathname();
  useEffect(() => {
    routeCommitted(pathname);
  }, [pathname]);
  return null;
}
