import type { ReactNode } from "react";
import { cx } from "../ui/primitives";

/** Ink colour of the concept page. */
export const INK = "#1a1530";

/** Card gradients (full class strings so Tailwind sees them). */
export const GRAD = {
  violet: "bg-[linear-gradient(135deg,#6f63e6_0%,#8b80f2_55%,#b3a8f8_100%)]",
  sky: "bg-[linear-gradient(160deg,#9fd3fb_0%,#5fa8f5_55%,#4b8ff0_100%)]",
  lilac: "bg-[linear-gradient(165deg,#f4ddf3_0%,#e5b9ec_55%,#d39be6_100%)]",
  aqua: "bg-[linear-gradient(150deg,#c9f1f4_0%,#8fdbe4_55%,#4fbfcf_100%)]",
  dusk: "bg-[linear-gradient(150deg,#3b2f8f_0%,#2a2160_55%,#1a1530_100%)]",
} as const;
export type Grad = keyof typeof GRAD;

/** Text gradient used for highlighted words and the footer wordmark. */
export const TEXT_GRAD = "bg-[linear-gradient(100deg,#6f63e6_0%,#5fa8f5_45%,#d39be6_100%)] bg-clip-text text-transparent";

/** Small white pill label used on cards ("services", "experience"…). */
export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("inline-flex rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#1a1530]", className)}>{children}</span>;
}

/** Section label: outlined pill with a gradient dot. */
export function Tag({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <span className={cx("inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium ring-1", light ? "text-white ring-white/40" : "text-[#1a1530] ring-[#1a1530]/15")}>
      <span aria-hidden className="size-2 rounded-full bg-[linear-gradient(135deg,#6f63e6,#5fa8f5)]" />
      {children}
    </span>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={cx("size-4", className)}>
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Round white arrow button (rotates when its `group` is hovered). */
export function ArrowButton({ large, dark }: { large?: boolean; dark?: boolean }) {
  return (
    <span
      className={cx(
        "grid shrink-0 place-items-center rounded-full transition-transform duration-500 ease-out-expo group-hover:rotate-45",
        dark ? "bg-[#1a1530] text-white" : "bg-white text-[#1a1530]",
        large ? "size-12 sm:size-14" : "size-8",
      )}
    >
      <Arrow className={large ? "size-5" : "size-3.5"} />
    </span>
  );
}

const ORB_TINT = {
  violet: "rgb(70 55 190 / 0.5)",
  sky: "rgb(30 80 180 / 0.4)",
  lilac: "rgb(170 80 190 / 0.35)",
  aqua: "rgb(20 130 150 / 0.4)",
  dusk: "rgb(10 5 40 / 0.6)",
} as const;

/** A clear glass sphere (pure CSS); size it with className. */
export function Orb({ tint = "violet", className, ...rest }: { tint?: Grad; className?: string } & Record<`data-${string}`, string | number | boolean>) {
  const shade = ORB_TINT[tint];
  return (
    <div
      aria-hidden
      {...rest}
      className={cx("pointer-events-none aspect-square rounded-full", className)}
      style={{
        background:
          "radial-gradient(circle at 32% 28%, rgb(255 255 255 / 0.95), rgb(255 255 255 / 0.22) 22%, transparent 40%), radial-gradient(circle at 68% 76%, rgb(255 255 255 / 0.45), transparent 42%), linear-gradient(160deg, rgb(255 255 255 / 0.35), rgb(255 255 255 / 0.05))",
        boxShadow: `inset -14px -18px 34px ${shade}, inset 10px 12px 24px rgb(255 255 255 / 0.55), 0 24px 50px -18px ${shade}`,
      }}
    />
  );
}
