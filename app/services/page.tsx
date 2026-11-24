import type { Metadata } from "next";
import { CYCLE, HOME, SITE } from "@/lib/content";
import { Footer } from "../_components/footer";
import { ContactForm } from "../_components/sections/contact-form";
import { PageHero } from "../_components/sections/page-hero";
import { ProvidersGrid } from "../_components/sections/providers-grid";
import { ServiceRows } from "../_components/sections/service-rows";
import { Waiver } from "../_components/sections/waiver";
import { Eyebrow } from "../_components/ui/primitives";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Eligibility and authorization, billing and claims, payment posting, accounts receivable, denial management, reporting and Virginia ID/DD Waiver billing.",
};

export default function ServicesPage() {
  return (
    <>
      <main id="main" className="overflow-x-clip">
        <PageHero
          eyebrow="Services"
          lines={["Revenue cycle", "management,"]}
          accent="end to end."
          intro={HOME.benefits.items[0].body}
          aside={
            <nav aria-label="Services on this page">
              <p className="text-label text-muted">On this page</p>
              <ul className="mt-4 border-t border-line">
                {CYCLE.map((s, i) => (
                  <li key={s.key} className="border-b border-line">
                    <a href={`#${s.key}`} className="group flex items-center gap-4 py-3.5 text-[15px] font-medium transition-colors hover:text-teal-deep">
                      <span className="w-6 text-sm text-muted tabular-nums">0{i + 1}</span>
                      <span className="flex-1">{s.title}</span>
                      <span aria-hidden className="text-muted transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </a>
                  </li>
                ))}
                <li className="border-b border-line">
                  <a href="#waiver" className="group flex items-center gap-4 py-3.5 text-[15px] font-medium transition-colors hover:text-teal-deep">
                    <span className="w-6 text-sm text-muted">VA</span>
                    <span className="flex-1">Virginia ID/DD Waiver billing</span>
                    <span aria-hidden className="text-muted transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                </li>
              </ul>
            </nav>
          }
        />
        <ServiceRows />
        <Waiver index="02" />
        <ProvidersGrid index="03" arc />

        <section aria-labelledby="contact-title" className="surface-light arc-prev relative bg-paper">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <Eyebrow index="04">Contact us</Eyebrow>
              <h2 id="contact-title" className="font-display text-h2 mt-6 max-w-[12ch]">
                Reach out today to streamline your billing.
              </h2>
              <p className="mt-6 max-w-sm text-muted">
                Prefer to talk? Call{" "}
                <a href={SITE.phoneHref} className="font-semibold text-indigo underline decoration-indigo/25 underline-offset-4">
                  {SITE.phone}
                </a>
                .
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer title={["Start billing smarter", "with a partner who cares."]} />
    </>
  );
}
