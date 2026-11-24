import type Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { IconName } from "@/lib/content";
import { TransitionLink } from "./transition-link";

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** `01 — LABEL` mono eyebrow. */
export function Eyebrow({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cx("text-label flex items-center gap-3 text-muted", className)}>
      {index && <span className="text-accent tabular-nums">{index}</span>}
      <span aria-hidden className="h-px w-7 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={cx("size-[0.95em]", className)}>
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={cx("size-[0.95em]", className)}>
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={cx("size-[1em]", className)}>
      <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={cx("size-4 fill-current", className)}>
      <path d="M10 1.8 12.5 7l5.7.6-4.3 3.9 1.2 5.6L10 14.3 4.9 17.1l1.2-5.6L1.8 7.6 7.5 7Z" />
    </svg>
  );
}

const PILL_TONES = {
  teal: "bg-teal text-indigo hover:bg-teal-bright",
  indigo: "bg-indigo text-paper hover:bg-violet",
  white: "bg-paper text-indigo hover:bg-white",
  ghost: "bg-transparent text-fg ring-1 ring-inset ring-line hover:ring-current",
} as const;

const PILL_SIZES = { sm: "h-10 px-4 text-[13px]", md: "h-12 px-6 text-sm", lg: "h-14 px-7 text-[15px]" } as const;

type PillProps = Omit<ComponentProps<typeof Link>, "className"> & {
  tone?: keyof typeof PILL_TONES;
  size?: keyof typeof PILL_SIZES;
  icon?: "up-right" | "right" | "none";
  className?: string;
};

/** Rounded pill button-link used across nav and CTAs. */
export function PillLink({ tone = "teal", size = "md", icon = "right", className, children, ...rest }: PillProps) {
  return (
    <TransitionLink
      {...rest}
      className={cx(
        "group/pill relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-semibold whitespace-nowrap",
        "transition-[background-color,box-shadow,transform] duration-300 ease-out-quart",
        PILL_TONES[tone],
        PILL_SIZES[size],
        className,
      )}
    >
      <PillInner icon={icon}>{children}</PillInner>
    </TransitionLink>
  );
}

/** Same look as PillLink, for plain anchors (tel:, mailto:) and buttons. */
export function pillClass(tone: keyof typeof PILL_TONES = "teal", size: keyof typeof PILL_SIZES = "md") {
  return cx(
    "group/pill relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-semibold whitespace-nowrap",
    "transition-[background-color,box-shadow,transform] duration-300 ease-out-quart",
    PILL_TONES[tone],
    PILL_SIZES[size],
  );
}

export function PillInner({ icon = "right", children }: { icon?: "up-right" | "right" | "none"; children: ReactNode }) {
  return (
    <>
      <span className="relative">{children}</span>
      {icon !== "none" && (
        <span className="relative grid size-[1.1em] place-items-center overflow-hidden">
          {icon === "up-right" ? (
            <>
              <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover/pill:translate-x-[120%] group-hover/pill:-translate-y-[120%]" />
              <ArrowUpRight className="absolute -translate-x-[120%] translate-y-[120%] transition-transform duration-500 ease-out-expo group-hover/pill:translate-0" />
            </>
          ) : (
            <>
              <ArrowRight className="transition-transform duration-500 ease-out-expo group-hover/pill:translate-x-[130%]" />
              <ArrowRight className="absolute -translate-x-[130%] transition-transform duration-500 ease-out-expo group-hover/pill:translate-x-0" />
            </>
          )}
        </span>
      )}
    </>
  );
}

/** Underlined text link. */
export function TextLink({ className, children, ...rest }: ComponentProps<typeof Link>) {
  return (
    <TransitionLink
      {...rest}
      className={cx(
        "group/tl relative inline-flex items-center gap-2 py-1 text-sm font-semibold",
        "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:bg-current after:transition-transform after:duration-500 after:ease-out-expo hover:after:origin-left hover:after:scale-x-[0.3]",
        className,
      )}
    >
      {children}
      <ArrowRight className="transition-transform duration-300 group-hover/tl:translate-x-1" />
    </TransitionLink>
  );
}

/** Line icons drawn for this site (24 grid, 1.5 stroke). */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  const p = { stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cx("size-6", className)}>
      {name === "shield" && (
        <>
          <path {...p} d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6L12 3Z" />
          <path {...p} d="M12 8.5v6M9 11.5h6" />
        </>
      )}
      {name === "send" && (
        <>
          <path {...p} d="M20.5 3.5 3.5 10.2l6.6 2.6 2.6 6.7 7.8-16Z" />
          <path {...p} d="m10.1 12.8 4.4-4.4" />
        </>
      )}
      {name === "ledger" && (
        <>
          <rect {...p} x="4" y="3.5" width="16" height="17" rx="2.5" />
          <path {...p} d="M8 8h8M8 12h5M8 16h3" />
          <path {...p} d="m14.5 15.5 1.5 1.5 3-3.5" />
        </>
      )}
      {name === "follow" && (
        <>
          <path {...p} d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5" />
          <path {...p} d="M20 4v4.5h-4.5" />
          <path {...p} d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5" />
          <path {...p} d="M4 20v-4.5h4.5" />
        </>
      )}
      {name === "denial" && (
        <>
          <circle {...p} cx="12" cy="12" r="8.5" />
          <path {...p} d="m8.5 12.5 2.5 2.5 4.5-5.5" />
        </>
      )}
      {name === "report" && (
        <>
          <path {...p} d="M4 20h16" />
          <path {...p} d="M6.5 16v-4M11 16V8M15.5 16v-6M20 16V5" />
        </>
      )}
      {name === "scale" && (
        <>
          <path {...p} d="M4 19 10 13l3.5 3.5L20 9" />
          <path {...p} d="M15 9h5v5" />
        </>
      )}
      {name === "heart" && (
        <path {...p} d="M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 7.5 2.9C19.5 15.4 12 20 12 20Z" />
      )}
      {name === "spark" && (
        <path {...p} d="M12 3.5 13.9 10l6.6 2-6.6 2L12 20.5 10.1 14l-6.6-2 6.6-2L12 3.5Z" />
      )}
    </svg>
  );
}
