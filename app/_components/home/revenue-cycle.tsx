"use client";

import { useRef, useState } from "react";
import { CYCLE, HOME, ROUTES } from "@/lib/content";
import { ArcSurface } from "../motion/arc-surface";
import { gsap, ScrollTrigger, useGSAP, MQ } from "../motion/gsap";
import { Eyebrow, Icon, PillLink, cx } from "../ui/primitives";
import { RING, nodeAngle, polarPct } from "./ring";

const N = CYCLE.length;
/** Viewport heights the scene stays pinned for. */
const PIN_VH = 4.2;

/**
 * The revenue cycle, the home page's signature scene. Desktop + motion: the
 * screen pins and scrolling drives a claim around the ring; each stage lights
 * its node, fills its segment of the progress rail and takes over the panel.
 * Otherwise: the six stages as a numbered list.
 */
export function RevenueCycle() {
  const ref = useRef<HTMLElement>(null);
  const [story, setStory] = useState(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.desktopMotion, () => {
      setStory(true);
      return () => setStory(false);
    });
  });

  useGSAP(
    () => {
      const root = ref.current;
      const stage = root?.querySelector<HTMLElement>("[data-stage]");
      if (!story || !root || !stage) return;
      const q = gsap.utils.selector(root);
      const arc = q("[data-cy-progress]")[0] as unknown as SVGCircleElement;
      const dot = q("[data-cy-dot]")[0] as unknown as SVGGElement;
      const nodes = q("[data-cy-node]") as HTMLElement[];
      const panels = q("[data-cy-panel]") as HTMLElement[];
      const fills = q("[data-cy-fill]") as HTMLElement[];
      const coreIcons = q("[data-cy-icon]") as HTMLElement[];
      const coreNo = q("[data-cy-no]")[0] as HTMLElement;
      const coreLabel = q("[data-cy-label]")[0] as HTMLElement;
      const done = q("[data-cy-done]")[0] as HTMLElement;

      let current = -1;
      const show = (i: number, finished: boolean) => {
        if (i !== current) {
          current = i;
          panels.forEach((p, k) => p.toggleAttribute("data-on", k === i));
          coreIcons.forEach((c, k) => c.toggleAttribute("data-on", k === i));
          coreNo.textContent = `${String(i + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
          coreLabel.textContent = CYCLE[i].short;
        }
        done.toggleAttribute("data-on", finished);
      };

      const apply = (p: number) => {
        const prog = p * N;
        arc.style.strokeDashoffset = String(1 - p);
        dot.style.transform = `rotate(${-90 + p * 360}deg)`;
        nodes.forEach((n, i) => n.classList.toggle("is-on", prog >= i - 0.02));
        fills.forEach((f, i) => (f.style.scale = `${Math.min(1, Math.max(0, prog - i))} 1`));
        show(Math.min(N - 1, Math.floor(prog)), p > 0.985);
      };
      apply(0);

      const pin = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => `+=${window.innerHeight * PIN_VH}`,
        pin: true,
        invalidateOnRefresh: true,
      });
      const state = { p: 0 };
      const tween = gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => apply(state.p),
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${window.innerHeight * (PIN_VH - 0.4)}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      // the ring draws itself in on approach
      const intro = gsap.from(q("[data-cy-ring]"), {
        scale: 0.8,
        rotate: -40,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top 85%", end: "top top", scrub: true },
      });

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      return () => {
        pin.kill();
        tween.scrollTrigger?.kill();
        tween.kill();
        intro.scrollTrigger?.kill();
        intro.kill();
      };
    },
    { scope: ref, dependencies: [story], revertOnUpdate: true },
  );

  const { cycle } = HOME;

  return (
    <section ref={ref} id="revenue-cycle" aria-labelledby="cycle-title" className="surface-dark arc-next arc-prev relative z-20">
      <ArcSurface tone="indigo" />

      {story ? (
        <div data-stage className="pin-screen relative overflow-hidden bg-indigo">
          <div className="relative mx-auto grid h-full max-w-[1360px] grid-cols-[1fr_1.05fr] items-center gap-12 px-10 pt-24 pb-10">
            {/* Copy */}
            <div className="flex h-full flex-col justify-center">
              <Eyebrow index="03">{cycle.label}</Eyebrow>
              <h2 id="cycle-title" className="font-display mt-5 max-w-[16ch] text-[clamp(2rem,3.2vw,3.25rem)] leading-[1.06]">
                {cycle.title}
              </h2>

              <div className="relative mt-12 min-h-[17rem] xl:min-h-[15rem]">
                {CYCLE.map((s, i) => (
                  <article
                    key={s.key}
                    data-cy-panel
                    className="absolute inset-0 translate-y-6 opacity-0 transition-[opacity,translate] duration-700 ease-out-expo data-on:translate-y-0 data-on:opacity-100"
                  >
                    <p className="text-label text-paper/55 tabular-nums">
                      Step {String(i + 1).padStart(2, "0")} of {String(N).padStart(2, "0")}
                    </p>
                    <h3 className="font-display text-h3 mt-3">{s.title}</h3>
                    <p className="font-accent mt-2 text-xl text-paper/80">{s.lead}</p>
                    <p className="mt-4 max-w-[34rem] text-[15px] leading-relaxed text-paper/70">{s.body}</p>
                  </article>
                ))}
              </div>

              {/* Progress rail */}
              <div className="mt-8 grid grid-cols-6 gap-2">
                {CYCLE.map((s) => (
                  <div key={s.key}>
                    <div className="h-[2px] overflow-hidden bg-paper/15">
                      <div data-cy-fill className="h-full origin-left scale-x-0 bg-teal" />
                    </div>
                    <p className="mt-2 truncate text-[12px] text-paper/50">{s.short}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ring */}
            <div className="relative flex h-full items-center justify-center">
              <div data-cy-ring className="relative aspect-square w-full max-w-[min(600px,70vh)]">
                <BigRing />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative mx-auto max-w-[1360px] px-5 pb-24 md:px-10">
          <Eyebrow index="03">{cycle.label}</Eyebrow>
          <h2 id="cycle-title" className="font-display text-h2 mt-5 max-w-[16ch]">
            {cycle.title}
          </h2>
          <ol className="mt-12 border-t border-line">
            {CYCLE.map((s, i) => (
              <li key={s.key} className="grid gap-4 border-b border-line py-8 md:grid-cols-[5rem_1fr_1.2fr] md:gap-8">
                <span className="font-display text-3xl text-teal tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-2xl">{s.title}</h3>
                  <p className="font-accent mt-1 text-lg text-paper/75">{s.lead}</p>
                </div>
                <p className="text-[15px] leading-relaxed text-paper/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Outro */}
      <div className={cx("relative mx-auto flex max-w-[1360px] flex-col gap-8 px-5 md:px-10 lg:flex-row lg:items-center lg:justify-between", story ? "pt-24" : "")}>
        <p className="font-display max-w-[32ch] text-[clamp(1.4rem,2.2vw,2rem)] leading-snug text-paper/85">{cycle.outro}</p>
        <PillLink href={ROUTES.services} tone="teal" size="lg">
          See all services
        </PillLink>
      </div>
    </section>
  );
}

function BigRing() {
  const { c, r, size } = RING;
  return (
    <>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgb(245 242 236 / 0.18)" strokeWidth="1" />
        <circle
          data-cy-progress
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="#11b7c9"
          strokeWidth="2"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          transform={`rotate(-90 ${c} ${c})`}
        />
        <g data-cy-dot style={{ transformOrigin: `${c}px ${c}px`, transform: "rotate(-90deg)" }}>
          <circle cx={c + r} cy={c} r="5" fill="#f5f2ec" />
        </g>
      </svg>

      {CYCLE.map((s, i) => {
        const a = nodeAngle(i, N);
        const p = polarPct(a, r);
        const lp = polarPct(a, r + 44);
        const side = Math.cos((a * Math.PI) / 180);
        return (
          <div key={s.key}>
            <span
              data-cy-node
              className="absolute grid size-12 -translate-1/2 place-items-center rounded-full bg-indigo text-paper/60 ring-1 ring-paper/25 transition-colors duration-500 [&.is-on]:bg-teal [&.is-on]:text-indigo [&.is-on]:ring-teal"
              style={{ left: `${p.left}%`, top: `${p.top}%` }}
            >
              <Icon name={s.icon} className="size-5" />
            </span>
            <span
              className={cx("absolute -translate-y-1/2 text-[13px] whitespace-nowrap text-paper/60", side > 0.3 ? "" : side < -0.3 ? "-translate-x-full" : "-translate-x-1/2")}
              style={{ left: `${lp.left}%`, top: `${lp.top}%` }}
            >
              {s.short}
            </span>
          </div>
        );
      })}

      {/* Centre: the current step */}
      <div className="absolute top-1/2 left-1/2 flex -translate-1/2 flex-col items-center text-center">
        <span className="relative grid size-10 place-items-center text-teal">
          {CYCLE.map((s) => (
            <span key={s.key} data-cy-icon className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-500 data-on:opacity-100">
              <Icon name={s.icon} className="size-8" />
            </span>
          ))}
        </span>
        <p data-cy-no className="font-display mt-4 text-[clamp(3rem,5vw,4.5rem)] leading-none tabular-nums">
          01 / 06
        </p>
        <p data-cy-label className="mt-2 text-[15px] text-paper/70">
          Eligibility
        </p>
        <p data-cy-done className="font-accent mt-2 text-lg text-teal opacity-0 transition-opacity duration-500 data-on:opacity-100">
          and paid.
        </p>
      </div>
    </>
  );
}
