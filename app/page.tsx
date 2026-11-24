import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import { Hero } from "./_components/home/hero";
import { Challenge } from "./_components/home/challenge";
import { Serve } from "./_components/home/serve";
import { RevenueCycle } from "./_components/home/revenue-cycle";
import { Benefits } from "./_components/home/benefits";
import { Waiver } from "./_components/sections/waiver";
import { CeoTeaser } from "./_components/home/ceo-teaser";
import { Testimonials } from "./_components/sections/testimonials";
import { Footer } from "./_components/footer";

export const metadata: Metadata = {
  title: { absolute: `Home Health Billing & Revenue Cycle Management | ${SITE.name}` },
};

export default function HomePage() {
  return (
    <>
      <main id="main" className="overflow-x-clip">
        <Hero />
        <Challenge />
        <Serve />
        <RevenueCycle />
        <Benefits />
        <Waiver />
        <CeoTeaser />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
