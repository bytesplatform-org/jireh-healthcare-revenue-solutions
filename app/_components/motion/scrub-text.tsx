"use client";

import { Fragment, useRef, type ElementType } from "react";
import { gsap, useGSAP, MQ } from "./gsap";

/** Opacity of words the reading head hasn't reached yet. */
const DIM = 0.18;
/** How many words the head's soft edge spans. */
const EDGE = 4;

const bare = (w: string) => w.replace(/[.,;:!?—]+$/, "");

/** Indexes of the words belonging to the `lit` phrases. */
function hiWords(words: string[], lit: readonly string[]) {
  const hi = new Set<number>();
  for (const phrase of lit) {
    const run = phrase.split(/\s+/).map(bare);
    for (let i = 0; i + run.length <= words.length; i++) {
      if (run.every((w, k) => bare(words[i + k]) === w)) run.forEach((_, k) => hi.add(i + k));
    }
  }
  return hi;
}

/**
 * A paragraph read in as you scroll (from Mobile Lab Draws): a reading head runs
 * through the words and each rises from dim to full ink as it passes; words in
 * `lit` phrases also turn the accent colour. Scrolling back dims them again.
 * Without motion it is a plain paragraph with the lit phrases in the accent.
 */
export function ScrubText({
  text,
  className,
  lit = [],
  as = "p",
  start = "top 80%",
  end = "bottom 45%",
}: {
  text: string;
  className?: string;
  lit?: readonly string[];
  as?: ElementType;
  start?: string;
  end?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const p = ref.current;
        if (!p) return;
        const words = [...p.querySelectorAll<HTMLElement>("[data-w]")];
        const n = words.length;
        p.classList.add("is-scrub");
        const apply = (progress: number) => {
          const head = progress * (n + EDGE);
          words.forEach((w, i) => {
            const on = Math.min(1, Math.max(0, (head - i) / EDGE));
            w.style.opacity = (DIM + (1 - DIM) * on).toFixed(3);
            if (w.hasAttribute("data-hi")) w.classList.toggle("is-lit", on > 0.55);
          });
        };
        apply(0);
        const state = { p: 0 };
        gsap.to(state, {
          p: 1,
          ease: "none",
          onUpdate: () => apply(state.p),
          scrollTrigger: { trigger: p, start, end, scrub: 0.5, invalidateOnRefresh: true },
        });
        return () => {
          p.classList.remove("is-scrub");
          words.forEach((w) => {
            w.style.removeProperty("opacity");
            w.classList.remove("is-lit");
          });
        };
      });
    },
    { scope: ref, dependencies: [start, end] },
  );

  const words = text.split(/\s+/);
  const hi = hiWords(words, lit);
  return (
    <Tag className={className} ref={ref}>
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span data-w="" data-hi={hi.has(i) ? "" : undefined}>
            {w}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
