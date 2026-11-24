"use client";

import { useActionState, useRef, type InputHTMLAttributes } from "react";
import { requestConsultation, type ConsultationResult } from "@/app/actions/consultation";
import { SITE } from "@/lib/content";
import { gsap, useGSAP, MQ } from "../motion/gsap";
import { Magnetic } from "../motion/magnetic";
import { cx } from "../ui/primitives";
import { Arrow, GRAD, Orb, Tag } from "./bits";

/**
 * Contact: a violet card (call, email, hours) beside the consultation form.
 * The card rises in with a slight spin and its orbs drift; the submit button is
 * magnetic. The form posts to the same Server Action as the main site.
 */
export function ConceptContact() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(ref);
        gsap.fromTo(q("[data-c]"), { y: 120, autoAlpha: 0, rotate: (i: number) => (i ? 2 : -2) }, { y: 0, autoAlpha: 1, rotate: 0, duration: 1.3, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 75%", once: true } });
        q("[data-drift]").forEach((el, i) => gsap.to(el, { y: i ? 18 : -18, x: i ? -10 : 10, duration: 4 + i, yoyo: true, repeat: -1, ease: "sine.inOut" }));
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="bg-white px-5 py-24 sm:px-8 md:py-32 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-3 sm:gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div data-c className={cx("relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[28px] p-7 text-white sm:p-10", GRAD.violet)}>
          <Orb data-drift="" tint="violet" className="absolute -right-[12%] -bottom-[10%] w-[60%]" />
          <Orb data-drift="" tint="sky" className="absolute top-[10%] right-[18%] w-[14%]" />
          <div className="relative">
            <Tag light>free consultation</Tag>
            <h2 id="contact-title" className="mt-6 max-w-[13ch] text-[clamp(2.3rem,4.2vw,4rem)] leading-[1.02] font-medium tracking-[-0.035em]">
              Ready to take billing off your plate?
            </h2>
          </div>
          <div className="relative mt-12 space-y-5">
            <a href={SITE.phoneHref} className="block text-[clamp(1.75rem,3vw,2.6rem)] font-light tracking-[-0.03em] hover:underline">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="block text-[15px] font-medium break-words text-white/85 underline underline-offset-4">
              {SITE.email}
            </a>
            <ul className="grid max-w-xs gap-1 text-[14px] font-medium text-white/80">
              {SITE.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4">
                  <span>{h.days}</span>
                  <span className="text-white">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-c className="rounded-[28px] bg-[#f3f2f9] p-6 sm:p-10">
          <ConceptForm />
        </div>
      </div>
    </section>
  );
}

function ConceptForm() {
  const [state, action, pending] = useActionState<ConsultationResult | null, FormData>(requestConsultation, null);
  const v: Record<string, string> = (state && !state.ok && state.values) || {};
  const bad = new Set(state && !state.ok && state.reason === "invalid" ? (state.fields ?? []) : []);
  const fallback = state && !state.ok && state.reason !== "invalid" ? state : null;

  if (state?.ok) {
    return (
      <div role="status" className="flex h-full flex-col justify-center">
        <p className="text-[clamp(2rem,3.4vw,3rem)] leading-tight font-medium tracking-[-0.03em] text-[#1a1530]">Thank you — we&apos;ll be in touch.</p>
        <p className="mt-3 text-[15px] font-medium text-[#1a1530]/60">We&apos;ll reach out at your best contact time. Need us sooner? Call {SITE.phone}.</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="grid gap-4 text-[#1a1530] sm:grid-cols-2">
      <Field name="agency" label="Agency name" required bad={bad.has("agency")} defaultValue={v.agency} className="sm:col-span-2" autoComplete="organization" />
      <Field name="clients" label="Number of clients" defaultValue={v.clients} inputMode="numeric" />
      <Field name="time" label="Best contact time" required bad={bad.has("time")} defaultValue={v.time} placeholder="e.g. Weekday mornings" />
      <Field name="email" type="email" label="Email" required bad={bad.has("email")} defaultValue={v.email} autoComplete="email" />
      <Field name="phone" type="tel" label="Phone" required bad={bad.has("phone")} defaultValue={v.phone} autoComplete="tel" />
      <fieldset className="sm:col-span-2">
        <legend className={cx("mb-2 text-[13px] font-semibold", bad.has("payer") && "text-[#c2264b]")}>Do you bill Medicaid / Medicare? *</legend>
        <div className="flex gap-2">
          {["Yes", "No"].map((opt) => (
            <label key={opt} className="cursor-pointer">
              <input type="radio" name="payer" value={opt} defaultChecked={v.payer === opt} className="peer sr-only" />
              <span className="block rounded-full bg-white px-6 py-2.5 text-[14px] font-medium transition-colors peer-checked:bg-[#1a1530] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-[#6f63e6]">
                {opt}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="sm:col-span-2">
        <span className="mb-2 block text-[13px] font-semibold">Anything we should know? (optional)</span>
        <textarea name="note" rows={3} defaultValue={v.note} className="w-full resize-y rounded-[18px] bg-white px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#8b80f2]" />
      </label>
      <input type="text" name="company_site" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {bad.size > 0 && (
        <p role="alert" className="text-[14px] font-medium text-[#a01d3e] sm:col-span-2">
          Please check the highlighted fields.
        </p>
      )}
      {fallback && (
        <p role="alert" className="rounded-[18px] bg-white p-4 text-[14px] font-medium sm:col-span-2">
          Online requests aren&apos;t connected yet.{" "}
          <a className="underline" href={`mailto:${SITE.email}?subject=${encodeURIComponent("Free consultation request")}&body=${encodeURIComponent(fallback.draft ?? "")}`}>
            Send it by email
          </a>{" "}
          or call <a className="underline" href={SITE.phoneHref}>{SITE.phone}</a>.
        </p>
      )}

      <div className="mt-2 sm:col-span-2">
        <Magnetic>
          <button
            type="submit"
            disabled={pending}
            className="group inline-flex items-center gap-3 rounded-full bg-[#1a1530] py-3 pr-3 pl-7 text-[15px] font-medium text-white transition-opacity disabled:opacity-60"
          >
            {pending ? "Sending…" : "Request consultation"}
            <span className="grid size-9 place-items-center rounded-full bg-white text-[#1a1530] transition-transform duration-500 group-hover:rotate-45">
              <Arrow className="size-3.5" />
            </span>
          </button>
        </Magnetic>
      </div>
    </form>
  );
}

function Field({ label, required, bad, className, ...rest }: { label: string; required?: boolean; bad?: boolean; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={className}>
      <span className={cx("mb-2 block text-[13px] font-semibold", bad && "text-[#c2264b]")}>
        {label}
        {required && " *"}
      </span>
      <input
        required={required}
        aria-invalid={bad || undefined}
        className={cx("h-12 w-full rounded-[18px] bg-white px-4 text-[15px] outline-none placeholder:text-[#1a1530]/35 focus:ring-2 focus:ring-[#8b80f2]", bad && "ring-2 ring-[#c2264b]")}
        {...rest}
      />
    </label>
  );
}
