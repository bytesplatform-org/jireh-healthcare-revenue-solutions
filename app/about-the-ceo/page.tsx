import type { Metadata } from "next";
import Image from "next/image";
import { CEO, SITE } from "@/lib/content";
import { Footer } from "../_components/footer";
import { ArcSurface } from "../_components/motion/arc-surface";
import { FadeUp, SplitReveal } from "../_components/motion/reveal";
import { ScrubText } from "../_components/motion/scrub-text";
import { PageHero } from "../_components/sections/page-hero";
import { Timeline } from "../_components/sections/timeline";
import { Check, Eyebrow } from "../_components/ui/primitives";
import portrait from "@/public/images/ceo-tammy.webp";

export const metadata: Metadata = {
  title: "About the CEO",
  description: `${CEO.name}, ${CEO.role} of ${SITE.name}: over a decade of Medicaid and Medicare experience, CBCS, award-winning author and advocate.`,
};

const LEADERSHIP = [
  "Claims submission and tracking",
  "Medicaid and insurance billing",
  "Payment posting and reconciliation",
  "Denial management and resubmissions",
  "Continuous process improvement",
];

export default function CeoPage() {
  return (
    <>
      <main id="main" className="overflow-x-clip">
        <PageHero
          eyebrow="About the CEO"
          lines={[CEO.headline[0], CEO.headline[1]]}
          accent={CEO.headline[2]}
          aside={
            <figure className="relative mx-auto w-full max-w-[420px] lg:mb-6">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[18px] bg-cloud">
                <Image src={portrait} alt={`${CEO.name}, ${CEO.role}`} fill priority sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover object-top" />
              </div>
              <figcaption className="mt-5 text-center">
                <span className="font-display block text-2xl">{CEO.name}</span>
                <span className="mt-1 block text-sm text-muted">{CEO.role}</span>
              </figcaption>
            </figure>
          }
        >
          <ul className="mt-10 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
            {CEO.credentials.map((c) => (
              <li key={c.label} className="border-t border-line pt-4">
                <p className="font-display text-2xl">{c.value}</p>
                <p className="mt-1 text-[13px] leading-snug text-muted">{c.label}</p>
              </li>
            ))}
          </ul>
        </PageHero>

        {/* Story */}
        <section aria-labelledby="story-title" className="surface-light border-t border-line pt-20 md:pt-28 relative z-10 pb-24 md:pb-32">
          <div className="mx-auto max-w-[1360px] px-5 md:px-10">
            <Eyebrow index="01">Her story</Eyebrow>
            <h2 id="story-title" className="sr-only">
              Her story
            </h2>
            <ScrubText
              text={CEO.bio[0]}
              lit={["caregiver at just 15 years old.", "compassion"]}
              className="font-display mt-8 max-w-[30ch] text-[clamp(1.75rem,3.4vw,3.4rem)] leading-[1.12] tracking-[-0.03em]"
            />
            <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-16">
              <FadeUp>
                <p data-stagger className="font-accent text-[clamp(1.5rem,2.4vw,2.25rem)] leading-snug">
                  {CEO.bio[1]}
                </p>
              </FadeUp>
              <FadeUp className="flex flex-col gap-6 text-[16px] leading-relaxed text-muted">
                <p data-stagger>{CEO.education}</p>
                <p data-stagger>{CEO.career}</p>
              </FadeUp>
            </div>
          </div>

          {/* Organisations she has worked with */}
          <div aria-hidden className="marquee mt-20 flex overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
            <div className="marquee-track flex shrink-0 items-center gap-12 pr-12" style={{ ["--marquee-speed" as string]: "36s" }}>
              {[...CEO.organizations, ...CEO.organizations, ...CEO.organizations, ...CEO.organizations].map((o, i) => (
                <span key={i} className="flex shrink-0 items-center gap-12 font-display text-[clamp(2rem,4vw,3.75rem)] whitespace-nowrap text-indigo/85">
                  {o}
                  <span className="size-3 rounded-full bg-teal" />
                </span>
              ))}
            </div>
          </div>
          <p className="sr-only">Organizations: {CEO.organizations.join(", ")}</p>
        </section>

        {/* Journey */}
        <section aria-labelledby="journey-title" className="surface-light arc-prev relative bg-paper">
          <div className="mx-auto max-w-[1360px] px-5 md:px-10">
            <div className="text-center">
              <Eyebrow index="02" className="justify-center">
                The journey
              </Eyebrow>
              <SplitReveal as="h2" id="journey-title" className="font-display text-h2 mx-auto mt-6 max-w-[16ch]">
                From caregiver to CEO.
              </SplitReveal>
            </div>
            <div className="mt-16">
              <Timeline />
            </div>
          </div>
        </section>

        {/* Operations + leadership */}
        <section aria-labelledby="lead-title" className="surface-dark arc-next arc-prev relative z-20">
          <ArcSurface tone="indigo" />
          <div className="mx-auto grid max-w-[1360px] gap-12 px-5 md:px-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow index="03">Leadership in practice</Eyebrow>
              <SplitReveal as="h2" id="lead-title" className="font-display text-h2 mt-6 max-w-[14ch]">
                Where care delivery meets reimbursement.
              </SplitReveal>
              <p className="mt-8 text-[16px] leading-relaxed text-paper/70">{CEO.operations}</p>
            </div>
            <div className="lg:pt-16">
              <p className="text-lede text-paper/85">{CEO.leadership}</p>
              <FadeUp as="ul" className="mt-8 grid border-t border-line">
                {LEADERSHIP.map((l) => (
                  <li key={l} data-stagger className="flex items-center gap-4 border-b border-line py-4">
                    <span className="grid size-7 place-items-center text-teal">
                      <Check className="size-4" />
                    </span>
                    <span className="font-semibold">{l}</span>
                  </li>
                ))}
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Beyond billing */}
        <section aria-labelledby="beyond-title" className="surface-light arc-next arc-prev relative z-30">
          <ArcSurface tone="paper" />
          <div className="mx-auto max-w-[1360px] px-5 md:px-10">
            <Eyebrow index="04">Beyond billing</Eyebrow>
            <SplitReveal as="h2" id="beyond-title" className="font-display text-h2 mt-6 max-w-[18ch]">
              Author, teacher, advocate.
            </SplitReveal>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {/* Book */}
              <FadeUp className="rounded-[18px] bg-indigo p-8 text-paper md:p-10 lg:row-span-2">
                <div data-stagger className="relative mx-auto flex aspect-[3/4] w-44 flex-col justify-between rounded-r-md rounded-l-sm bg-paper p-5 text-indigo">
                  <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-indigo/60">A memoir</span>
                  <span className="font-display text-4xl leading-none">Circles</span>
                  <span className="text-[11px] leading-snug text-indigo/60">Breaking the Chains of Generational Curses</span>
                </div>
                <p data-stagger className="text-label mt-8 text-paper/60">
                  2023 · Award-winning author
                </p>
                <p data-stagger className="mt-3 text-[15px] leading-relaxed text-paper/75">
                  {CEO.advocacy[0]}
                </p>
              </FadeUp>
              <FadeUp className="rounded-[18px] bg-white p-8 ring-1 ring-line md:p-10 lg:col-span-2">
                <p data-stagger className="text-label text-teal-deep">
                  Seminars & ministry
                </p>
                <p data-stagger className="mt-4 text-lg leading-relaxed text-indigo/80">
                  {CEO.advocacy[1]}
                </p>
              </FadeUp>
              <FadeUp className="rounded-[18px] bg-mint p-8 md:p-10 lg:col-span-2">
                <div data-stagger className="flex flex-wrap items-center gap-3">
                  <p className="text-label text-teal-deep">Founder · Bridging the Gaps For Queens</p>
                  <span className="rounded-full bg-gold/20 px-3 py-1 text-[12px] font-semibold text-[#8a5a00]">Mentorship Excellence Award 2025</span>
                </div>
                <p data-stagger className="mt-4 text-lg leading-relaxed text-indigo/80">
                  {CEO.advocacy[2]}
                </p>
              </FadeUp>
            </div>

            <ScrubText
              text={CEO.closing}
              lit={["stability, empowerment, and long-term success"]}
              className="font-display mt-24 max-w-[34ch] text-[clamp(1.6rem,3vw,3rem)] leading-[1.15] tracking-[-0.03em]"
            />
          </div>
        </section>
      </main>
      <Footer title={["Partner with a leader", "who cares about your mission."]} />
    </>
  );
}
