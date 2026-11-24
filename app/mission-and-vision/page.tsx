import type { Metadata } from "next";
import { MISSION, SITE } from "@/lib/content";
import { Footer } from "../_components/footer";
import { ArcSurface } from "../_components/motion/arc-surface";
import { FadeUp } from "../_components/motion/reveal";
import { ScrubText } from "../_components/motion/scrub-text";
import { PageHero } from "../_components/sections/page-hero";
import { Values } from "../_components/sections/values";
import { WidePhoto } from "../_components/sections/wide-photo";
import { Eyebrow } from "../_components/ui/primitives";

export const metadata: Metadata = {
  title: "Mission & Vision",
  description: `The mission and vision of ${SITE.name}: integrity, compassion and excellence in home health revenue cycle management.`,
};

export default function MissionPage() {
  return (
    <>
      <main id="main" className="overflow-x-clip">
        <PageHero
          eyebrow="Mission & Vision"
          lines={["Guided by faith"]}
          accent="and purpose."
          intro="Serving home healthcare agencies with integrity, compassion, and excellence — so providers can focus their time, energy, and hearts on caring for patients."
          aside={
            // NEW copy: the meaning of the name — have the client confirm the wording.
            <figure className="border-l border-line pl-8 md:pl-10">
              <p className="text-label text-muted">The name</p>
              <p className="font-display mt-4 text-[clamp(4rem,7vw,6rem)] leading-none">Jireh</p>
              <p className="mt-2 text-sm text-muted">From Jehovah-Jireh</p>
              <blockquote className="font-accent mt-6 text-2xl leading-snug">&ldquo;The Lord will provide.&rdquo;</blockquote>
              <figcaption className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
                A promise of provision at the heart of everything we do — for the agencies we serve and the people in their care.
              </figcaption>
            </figure>
          }
        />

        {/* Mission */}
        <section aria-labelledby="mission-title" className="surface-light border-t border-line pt-20 md:pt-28 relative z-10 pb-20">
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <Eyebrow index="01">Our mission</Eyebrow>
            <h2 id="mission-title" className="sr-only">
              Our mission
            </h2>
            <ScrubText
              text={MISSION.mission}
              lit={["integrity, compassion, and excellence"]}
              className="font-display mt-8 max-w-[26ch] text-[clamp(2rem,4.2vw,4.25rem)] leading-[1.06] tracking-[-0.035em]"
            />
            <FadeUp className="mt-12 ml-auto max-w-[40rem]">
              <p data-stagger className="text-lede text-muted">
                {MISSION.missionMore}
              </p>
            </FadeUp>
          </div>
        </section>

        <WidePhoto />

        <Values />

        {/* Vision */}
        <section aria-labelledby="vision-title" className="surface-light arc-next arc-prev relative z-30">
          <ArcSurface tone="paper" />
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <Eyebrow index="03">Our vision</Eyebrow>
            <h2 id="vision-title" className="sr-only">
              Our vision
            </h2>
            <ScrubText
              text={MISSION.vision}
              lit={["most trusted and respected partner"]}
              className="font-display mt-8 max-w-[26ch] text-[clamp(2rem,4.2vw,4.25rem)] leading-[1.06] tracking-[-0.035em]"
            />
            <FadeUp className="mt-12 ml-auto max-w-[40rem]">
              <p data-stagger className="text-lede text-muted">
                {MISSION.visionMore}
              </p>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer title={["Built on faith.", "Measured by your success."]} />
    </>
  );
}
