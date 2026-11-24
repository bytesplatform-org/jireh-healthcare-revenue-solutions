"use client";

import Image from "next/image";
import { Suspense, useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS, ROUTES, SITE } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP, MQ } from "./motion/gsap";
import { onIntro } from "./motion/intro";
import { setScrollLocked } from "./motion/smooth-scroll";
import { TransitionLink as Link } from "./ui/transition-link";
import { PillLink, cx } from "./ui/primitives";
import markClear from "@/public/brand/jireh-mark-clear.png";
import wordmarkClear from "@/public/brand/jireh-wordmark-clear.png";
import mark from "@/public/brand/jireh-mark.png";
import wordmark from "@/public/brand/jireh-wordmark.png";

export function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** The client's logo with its white ground knocked out, for paper. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx("flex items-center gap-2.5", className)}>
      <Image src={markClear} alt="" className="h-9 w-auto" priority sizes="64px" />
      <Image src={wordmarkClear} alt="Jireh Healthcare Revenue Solutions" className="h-[26px] w-auto max-[360px]:hidden" priority sizes="90px" />
    </span>
  );
}

/** The original artwork on its white card, for dark surfaces. */
export function LogoCard({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5 rounded-xl bg-white px-4 py-3", className)}>
      <Image src={mark} alt="" className="h-9 w-auto" sizes="64px" />
      <Image src={wordmark} alt="Jireh Healthcare Revenue Solutions" className="h-[26px] w-auto" sizes="90px" />
    </span>
  );
}

function LinkList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="hidden items-center gap-9 lg:flex">
      {NAV_LINKS.map((l) => {
        const active = isActivePath(pathname, l.href);
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={cx(
                "relative py-2 text-[15px] font-medium transition-colors duration-300",
                "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-500 after:ease-out-expo",
                active ? "text-indigo after:scale-x-100" : "text-indigo/70 after:scale-x-0 hover:text-indigo hover:after:scale-x-100",
              )}
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActiveLinkList() {
  return <LinkList pathname={usePathname()} />;
}

function BigMenu({ onNavigate, pathname }: { onNavigate: () => void; pathname: string | null }) {
  const links = [...NAV_LINKS, { label: "Book a Consultation", href: ROUTES.book }];
  return (
    <ul className="border-t border-line">
      {links.map((l) => {
        const active = isActivePath(pathname, l.href);
        return (
          <li key={l.href} className="border-b border-line">
            <Link href={l.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className="flex items-center justify-between py-5">
              <span className={cx("font-display text-[clamp(2rem,9vw,3rem)] leading-none", active ? "text-teal-deep" : "text-indigo")}>{l.label}</span>
              <span aria-hidden className="text-xl text-indigo/40">→</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActiveBigMenu({ onNavigate }: { onNavigate: () => void }) {
  return <BigMenu onNavigate={onNavigate} pathname={usePathname()} />;
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block h-2.5 w-4">
      <span className={cx("absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300", open ? "top-1/2 rotate-45" : "top-0")} />
      <span className={cx("absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300", open ? "top-1/2 -rotate-45" : "bottom-0")} />
    </span>
  );
}

/**
 * Plain paper bar: logo left, text links centre (the current page underlined),
 * one call to action right. It tucks away while you scroll down and returns
 * when you scroll up; a hairline appears once the page has moved. Below 1024px
 * the links move into a full-screen menu.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const header = headerRef.current;
    if (!header) return;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const off = onIntro((tl) => {
        tl.fromTo(header.querySelectorAll("[data-nav-part]"), { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.06, ease: "expo.out", clearProps: "transform,opacity,visibility" }, 1.0);
      });
      // hide on the way down, show on the way up
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          setScrolled(y > 8);
          const hide = self.direction === 1 && y > 240;
          gsap.to(header, { yPercent: hide ? -110 : 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
        },
      });
      return () => {
        off();
        st.kill();
      };
    });
    mm.add(MQ.reduce, () => {
      const onScroll = () => setScrolled(window.scrollY > 8);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    });
  });

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    const overlay = overlayRef.current;
    overlay?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key === "Tab" && overlay) {
        const f = overlay.querySelectorAll<HTMLElement>("a[href],button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const toggle = toggleRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      setScrollLocked(false);
      toggle?.focus();
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={cx(
          "surface-light fixed inset-x-0 top-0 z-50 bg-paper transition-[border-color] duration-300",
          scrolled ? "border-b border-line" : "border-b border-transparent",
        )}
      >
        <nav aria-label="Primary" className="relative mx-auto flex h-[72px] max-w-[1360px] items-center justify-between gap-6 px-5 md:h-20 md:px-10">
          <div data-nav-part>
            <Link href={ROUTES.home} aria-label={`${SITE.name} home`}>
              <Logo />
            </Link>
          </div>

          <div data-nav-part className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <Suspense fallback={<LinkList pathname={null} />}>
              <ActiveLinkList />
            </Suspense>
          </div>

          <div data-nav-part className="flex items-center gap-2">
            <PillLink href={ROUTES.book} tone="indigo" size="sm" icon="up-right" className="h-11 px-5 max-sm:hidden">
              Book a consultation
            </PillLink>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen(true)}
              className="inline-flex h-11 items-center gap-2.5 rounded-full px-4 text-[14px] font-semibold text-indigo ring-1 ring-line lg:hidden"
            >
              <MenuIcon open={false} />
              Menu
            </button>
          </div>
        </nav>
      </header>

      <div
        ref={overlayRef}
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="surface-light fixed inset-0 z-[60] overflow-y-auto bg-paper"
        data-lenis-prevent
      >
        <div className="flex h-[72px] items-center justify-between px-5 md:h-20 md:px-10">
          <Link href={ROUTES.home} onClick={close} aria-label={`${SITE.name} home`}>
            <Logo />
          </Link>
          <button type="button" onClick={close} className="inline-flex h-11 items-center gap-2.5 rounded-full px-4 text-[14px] font-semibold text-indigo ring-1 ring-line">
            <MenuIcon open />
            Close
          </button>
        </div>
        <div className="px-5 pt-8 pb-12 md:px-10">
          <Suspense fallback={<BigMenu onNavigate={close} pathname={null} />}>
            <ActiveBigMenu onNavigate={close} />
          </Suspense>
          <div className="mt-10 flex flex-col gap-2 text-[15px] text-muted">
            <a href={SITE.phoneHref} className="font-display text-3xl text-indigo">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="break-all hover:text-indigo">
              {SITE.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
