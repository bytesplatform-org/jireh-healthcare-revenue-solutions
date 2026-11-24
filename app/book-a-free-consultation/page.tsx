import type { Metadata } from "next";
import Image from "next/image";
import { BOOK, SITE } from "@/lib/content";
import { Footer } from "../_components/footer";
import { FadeUp } from "../_components/motion/reveal";
import { ContactForm } from "../_components/sections/contact-form";
import { PageHero } from "../_components/sections/page-hero";
import { Eyebrow } from "../_components/ui/primitives";
import swam from "@/public/brand/swam-certified.webp";
import cbcs from "@/public/brand/cbcs-badge.png";

export const metadata: Metadata = {
  title: "Book a Free Consultation",
  description: `Book a free consultation with ${SITE.name}. Call ${SITE.phone} or send us your agency's details.`,
};

export default function BookPage() {
  return (
    <>
      <main id="main" className="overflow-x-clip">
        <PageHero
          eyebrow="Contact"
          lines={["Book a"]}
          accent="free consultation."
          intro={BOOK.intro}
          aside={
            <div className="rounded-[18px] bg-white p-8 ring-1 ring-line md:p-10">
              <p className="text-label text-indigo/50">Call us</p>
              <a href={SITE.phoneHref} className="font-display mt-2 block text-[clamp(2.5rem,4.4vw,3.5rem)] leading-none transition-colors hover:text-teal-deep">
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="mt-4 block text-[15px] font-semibold break-all text-indigo/80 underline decoration-indigo/20 underline-offset-4 hover:text-teal-deep">
                {SITE.email}
              </a>
              <div className="mt-8 grid gap-2 border-t border-line pt-6">
                {SITE.hours.map((h) => (
                  <p key={h.days} className="flex justify-between text-[14px]">
                    <span className="text-indigo/60">{h.days}</span>
                    <span className="font-semibold">{h.time}</span>
                  </p>
                ))}
              </div>
            </div>
          }
        />

        <section aria-labelledby="form-title" className="surface-light border-t border-line pt-20 md:pt-28 arc-prev relative z-10">
          <div className="mx-auto grid max-w-[1360px] gap-12 px-5 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <FadeUp className="flex flex-col gap-10">
              <div data-stagger>
                <Eyebrow index="01">How it works</Eyebrow>
                <h2 id="form-title" className="font-display text-h3 mt-5 max-w-[16ch]">
                  We&apos;d love to hear about your agency.
                </h2>
              </div>
              <ol data-stagger className="grid gap-3">
                {BOOK.steps.map((st, i) => (
                  <li key={st.title} className="flex gap-4 border-t border-line pt-5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full font-display text-lg text-teal-deep ring-1 ring-line">0{i + 1}</span>
                    <span>
                      <span className="block font-semibold">{st.title}</span>
                      <span className="mt-0.5 block text-sm text-muted">{st.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p data-stagger className="text-[15px] text-muted">
                {SITE.region}.
              </p>
              <div data-stagger className="flex items-center gap-3">
                <span className="grid h-16 place-items-center rounded-lg bg-white px-3 ring-1 ring-line">
                  <Image src={swam} alt="SWaM certified: Small, Women and Minority-owned business, Virginia" className="h-11 w-auto" sizes="140px" />
                </span>
                <span className="grid size-16 place-items-center rounded-lg bg-white p-1.5 ring-1 ring-line">
                  <Image src={cbcs} alt="NHA Certified Billing and Coding Specialist (CBCS)" className="h-full w-auto" sizes="64px" />
                </span>
              </div>
            </FadeUp>

            <div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer title={["Your patients come first.", "Your billing is our job."]} />
    </>
  );
}
