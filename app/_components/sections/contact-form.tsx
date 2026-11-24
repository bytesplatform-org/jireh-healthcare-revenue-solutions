"use client";

import { useActionState, useId, useState, type InputHTMLAttributes } from "react";
import { requestConsultation, type ConsultationResult } from "@/app/actions/consultation";
import { SITE } from "@/lib/content";
import { Check, PillInner, cx, pillClass } from "../ui/primitives";

const LABELS: Record<string, string> = {
  agency: "Agency name",
  email: "Email address",
  phone: "Phone number",
  time: "Best contact time",
  payer: "Medicaid/Medicare",
};

/**
 * The consultation form (Book page + Services). Mirrors the client's current
 * fields. Posts to a Server Action; works without JS (plain form post).
 */
export function ContactForm({ className }: { className?: string }) {
  const [state, action, pending] = useActionState<ConsultationResult | null, FormData>(requestConsultation, null);
  const [copied, setCopied] = useState(false);
  const id = useId();
  const v: Record<string, string> = (state && !state.ok && state.values) || {};
  const bad = new Set(state && !state.ok && state.reason === "invalid" ? (state.fields ?? []) : []);

  if (state?.ok) {
    return (
      <div className={cx("rounded-[18px] bg-white p-8 text-indigo ring-1 ring-line md:p-12", className)} role="status">
        <span className="grid size-14 place-items-center rounded-full bg-check/15 text-check">
          <Check className="size-6" />
        </span>
        <h3 className="font-display mt-6 text-3xl">Thank you — we&apos;ll be in touch.</h3>
        <p className="mt-3 max-w-md text-indigo/70">We received your request and will reach out at your best contact time. Need us sooner? Call {SITE.phone}.</p>
      </div>
    );
  }

  const fallback = state && !state.ok && state.reason !== "invalid" ? state : null;

  return (
    <form action={action} noValidate className={cx("rounded-[18px] bg-white p-6 text-indigo ring-1 ring-line md:p-10", className)}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id={`${id}-agency`} name="agency" defaultValue={v.agency} label="Agency name" required invalid={bad.has("agency")} autoComplete="organization" className="md:col-span-2" />
        <Field id={`${id}-clients`} name="clients" defaultValue={v.clients} label="Number of clients" inputMode="numeric" />
        <Field id={`${id}-time`} name="time" defaultValue={v.time} label="Best contact time" required invalid={bad.has("time")} placeholder="e.g. Weekday mornings" />
        <Field id={`${id}-email`} name="email" defaultValue={v.email} type="email" label="Email address" required invalid={bad.has("email")} autoComplete="email" placeholder="you@agency.com" />
        <Field id={`${id}-phone`} name="phone" defaultValue={v.phone} type="tel" label="Phone number" required invalid={bad.has("phone")} autoComplete="tel" placeholder="(757) 000-0000" />

        <fieldset className="md:col-span-2">
          <legend className={cx("mb-3 text-sm font-semibold", bad.has("payer") && "text-[#c2264b]")}>
            Do you bill Medicaid / Medicare? <span className="text-teal-deep">*</span>
          </legend>
          <div className="flex gap-3">
            {["Yes", "No"].map((opt) => (
              <label key={opt} className="relative cursor-pointer">
                <input type="radio" name="payer" value={opt} defaultChecked={v.payer === opt} required className="peer sr-only" />
                <span className="flex h-12 items-center gap-2.5 rounded-full px-6 text-sm font-semibold ring-1 ring-line transition-colors peer-checked:bg-indigo peer-checked:text-paper peer-checked:ring-indigo peer-focus-visible:outline-2 peer-focus-visible:outline-teal">
                  <span className="size-2 rounded-full bg-current opacity-40" />
                  {opt}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label htmlFor={`${id}-note`} className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold">
            Anything we should know? <span className="font-normal text-indigo/50">(optional)</span>
          </span>
          <textarea
            id={`${id}-note`}
            name="note"
            defaultValue={v.note}
            rows={4}
            className="w-full resize-y rounded-xl bg-paper px-4 py-3 text-[15px] ring-1 ring-line transition-shadow outline-none placeholder:text-indigo/35 focus:ring-2 focus:ring-teal"
            placeholder="Programs you run, payers, current billing setup…"
          />
        </label>

        {/* honeypot */}
        <input type="text" name="company_site" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      </div>

      {bad.size > 0 && (
        <p role="alert" className="mt-6 rounded-2xl bg-[#c2264b]/8 px-4 py-3 text-sm text-[#a01d3e]">
          Please check: {[...bad].map((f) => LABELS[f] ?? f).join(", ")}.
        </p>
      )}

      {fallback && (
        <div role="alert" className="mt-6 rounded-2xl bg-mint px-5 py-4 text-sm text-indigo">
          <p className="font-semibold">Online requests aren&apos;t connected yet — your details are ready to send.</p>
          <p className="mt-1 text-indigo/70">
            Email them to us or call <a className="font-semibold underline" href={SITE.phoneHref}>{SITE.phone}</a>.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent("Free consultation request")}&body=${encodeURIComponent(fallback.draft ?? "")}`}
              className={pillClass("indigo", "sm")}
            >
              <PillInner icon="up-right">Open in email</PillInner>
            </a>
            <button
              type="button"
              className={pillClass("ghost", "sm")}
              onClick={() => {
                navigator.clipboard?.writeText(fallback.draft ?? "").then(() => setCopied(true));
              }}
            >
              <PillInner icon="none">{copied ? "Copied" : "Copy details"}</PillInner>
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-indigo/50">* Required. We only use your details to respond to this request.</p>
        <button type="submit" disabled={pending} className={cx(pillClass("teal", "lg"), "disabled:opacity-60")}>
          <PillInner icon="right">{pending ? "Sending…" : "Request consultation"}</PillInner>
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  invalid,
  className,
  ...rest
}: {
  id: string;
  label: string;
  required?: boolean;
  invalid?: boolean;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className={className}>
      <span className={cx("mb-2 block text-sm font-semibold", invalid && "text-[#c2264b]")}>
        {label} {required && <span className="text-teal-deep">*</span>}
      </span>
      <input
        id={id}
        required={required}
        aria-invalid={invalid || undefined}
        className={cx(
          "h-13 w-full rounded-xl bg-paper px-4 text-[15px] ring-1 transition-shadow outline-none placeholder:text-indigo/35 focus:ring-2 focus:ring-teal",
          invalid ? "ring-[#c2264b]" : "ring-line",
        )}
        {...rest}
      />
    </label>
  );
}
