import type { Metadata } from "next";
import { ConceptHeader } from "../_components/concept/header";
import { ConceptHero } from "../_components/concept/concept-hero";
import { ConceptMarquee } from "../_components/concept/marquee";
import { ConceptStatement } from "../_components/concept/statement";
import { ConceptRail } from "../_components/concept/rail";
import { ConceptBento } from "../_components/concept/bento";
import { ConceptWaiver } from "../_components/concept/waiver-reveal";
import { ConceptCeo } from "../_components/concept/ceo";
import { ConceptTestimonials } from "../_components/concept/testimonials";
import { ConceptValues } from "../_components/concept/values";
import { ConceptContact } from "../_components/concept/contact";
import { ConceptFooter } from "../_components/concept/footer";

export const metadata: Metadata = {
  title: "Concept",
  robots: { index: false, follow: false },
};

/** The whole site as one page, in the bento / soft-gradient theme. */
export default function HeroConceptPage() {
  return (
    <div data-concept className="bg-white" style={{ fontFamily: "var(--font-urbanist), ui-sans-serif, system-ui, sans-serif" }}>
      {/* White edge to edge: unpainted tiles in fast scrolls and the macOS overscroll
          bounce show the body (paper elsewhere on the site), so whiten it on this page only. */}
      <style>{"html,body{background:#fff}"}</style>
      <ConceptHeader />
      <main id="main" className="overflow-x-clip">
        <ConceptHero />
        <ConceptMarquee />
        <ConceptStatement />
        <ConceptRail />
        <ConceptBento />
        <ConceptWaiver />
        <ConceptCeo />
        <ConceptTestimonials />
        <ConceptValues />
        <ConceptContact />
      </main>
      <ConceptFooter />
    </div>
  );
}
