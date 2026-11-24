"use client";

import { useRef } from "react";
import { CYCLE } from "@/lib/content";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { Icon, cx } from "../ui/primitives";
import { Chip, GRAD, type Grad } from "./bits";
import { Glass, type GlassKind } from "./glass";
import { ShaderCanvas } from "./gl/shader-canvas";
import { CURTAIN } from "./gl/shaders";

const TONES: Grad[] = ["violet", "sky", "lilac", "aqua", "violet", "sky"];
/** The dark stage is built from this many stripe columns, alternating these shades. */
const CURTAIN_BARS = 14;
const CURTAIN_SHADES = ["#1c1644", "#221b4f", "#1f1849"];
/** Pastel cards carry ink text; saturated ones white. */
const LIGHT = new Set<Grad>(["lilac", "aqua"]);
/** The glass object for each stage of the cycle. */
const STAGE_GLASS: Record<string, GlassKind> = { eligibility: "shield", claims: "claim", posting: "coin", ar: "cycle", denials: "seal", reporting: "chart" };

/**
 * How we work: the six stages of the revenue cycle as gradient cards.
 * Desktop + motion: the section pins and vertical scroll drives the row
 * sideways; each card swings and scales in as it enters, its orb rolls, and a
 * progress bar + counter track the stage. Otherwise the cards simply stack.
 */
export function ConceptRail() {
  const ref = useRef<HTMLElement>(null);

  // Arrival: the stripe columns shoot up (in a scattered order, so the top edge
  // is jagged until it fills) and the heading turns from ink to white as the
  // stage completes. Scrubbed, so it runs backwards on the way up.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const root = ref.current;
        if (!root) return;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root, start: "top 95%", end: "top top", scrub: 0.6 },
        });
        tl.fromTo(root.querySelectorAll("[data-curtain]"), { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: "power2.out", stagger: { each: 0.03, from: "random" } }, 0)
          .fromTo(root.querySelectorAll("[data-ink]"), { color: "#1a1530" }, { color: "#ffffff", duration: 0.35 }, 0.65)
          // once the columns are up, the live (shader) fabric takes over from them
          .fromTo(root.querySelectorAll("[data-curtain-gl]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.7);
      });
    },
    { scope: ref },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktopMotion, () => {
        const root = ref.current;
        const track = root?.querySelector<HTMLElement>("[data-track]");
        const pinEl = root?.querySelector<HTMLElement>("[data-pin]");
        if (!root || !track || !pinEl) return;
        const distance = () => track.scrollWidth - window.innerWidth + 80;
        const counter = root.querySelector<HTMLElement>("[data-counter]");
        const n = CYCLE.length;

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinEl,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (counter) counter.textContent = String(Math.min(n, Math.floor(self.progress * n) + 1)).padStart(2, "0");
            },
          },
        });
        gsap.fromTo(root.querySelector("[data-bar]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: pinEl, start: "top top", end: () => `+=${distance()}`, scrub: 1, invalidateOnRefresh: true } });

        gsap.utils.toArray<HTMLElement>("[data-step]", track).forEach((card, i) => {
          if (i === 0) return;
          gsap.fromTo(
            card,
            { rotate: 8, scale: 0.82, yPercent: 14 },
            { rotate: 0, scale: 1, yPercent: 0, ease: "power2.out", scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "left 45%", scrub: true } },
          );
          const orb = card.querySelector("[data-roll]");
          if (orb) gsap.fromTo(orb, { xPercent: 45, rotate: 24 }, { xPercent: 0, rotate: 0, ease: "none", scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "right 40%", scrub: true } });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="how-we-work" aria-labelledby="rail-title" className="relative bg-white">
      {/* everything (cards included) is clipped to the dark stage's rounded rectangle */}
      <div data-pin className="relative flex flex-col justify-center overflow-hidden py-20 [clip-path:inset(12px_round_30px)] lg:h-svh lg:py-0">
        {/* Dark stage, built from stripe columns that shoot up as the section arrives */}
        <div aria-hidden className="absolute inset-3 flex overflow-hidden rounded-[30px]">
          {Array.from({ length: CURTAIN_BARS }).map((_, i) => (
            <span key={i} data-curtain className="h-full flex-1 origin-bottom" style={{ background: CURTAIN_SHADES[i % CURTAIN_SHADES.length] }} />
          ))}
        </div>
        {/* …and the same columns as lit fabric (shader): the pointer brushes them, scrolling ripples them */}
        <div aria-hidden data-curtain-gl className="absolute inset-3 overflow-hidden rounded-[30px]">
          <ShaderCanvas frag={CURTAIN} resolution={0.6} className="size-full" />
        </div>
        <div className="relative mx-auto flex w-full max-w-[1440px] flex-wrap items-end justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <div>
            <h2 id="rail-title" data-ink className="max-w-[16ch] text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.035em] text-white">
              Six steps. One partner. Every claim followed through.
            </h2>
          </div>
          <div className="hidden w-64 lg:block">
            <p data-ink className="flex items-baseline justify-end gap-1 text-white">
              <span data-counter className="text-5xl font-light tabular-nums">
                01
              </span>
              <span className="text-lg opacity-40">/ 0{CYCLE.length}</span>
            </p>
            <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/15">
              <div data-bar className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#6f63e6,#5fa8f5,#d39be6)]" />
            </div>
          </div>
        </div>

        <ol data-track className="relative mt-10 flex flex-col gap-4 px-5 sm:px-8 lg:mt-14 lg:flex-row lg:gap-5 lg:px-10 lg:will-change-transform">
          {CYCLE.map((s, i) => (
            <li
              key={s.key}
              data-step
              className={cx(
                "group relative flex shrink-0 flex-col justify-between overflow-hidden rounded-[26px] p-6 sm:p-8 lg:h-[min(60vh,520px)] lg:w-[min(42vw,540px)]",
                LIGHT.has(TONES[i]) ? "text-[#1a1530]" : "text-white",
                GRAD[TONES[i]],
                "min-h-[360px]",
              )}
            >
              <Glass kind={STAGE_GLASS[s.key]} data-roll="" tint={TONES[i]} className="absolute -right-[7%] -bottom-[9%] w-[36%]" />
              <div className="relative flex items-center justify-between">
                <Chip>{s.short.toLowerCase()}</Chip>
                <span className="grid size-11 place-items-center rounded-full bg-white/30 backdrop-blur-sm">
                  <Icon name={s.icon} className="size-5" />
                </span>
              </div>
              <div className="relative">
                <p className="text-[clamp(4rem,7vw,6.5rem)] leading-none font-light tracking-[-0.05em] opacity-90">0{i + 1}</p>
                <h3 className="mt-3 max-w-[16ch] text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.05] tracking-[-0.025em]">{s.title}</h3>
                <p className="mt-3 max-w-[34ch] text-[14px] leading-relaxed font-medium opacity-85">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
