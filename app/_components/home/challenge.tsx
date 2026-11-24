import Image from "next/image";
import { HOME, ROUTES } from "@/lib/content";
import { Parallax } from "../motion/parallax";
import { FadeUp } from "../motion/reveal";
import { ScrubText } from "../motion/scrub-text";
import { Eyebrow, TextLink } from "../ui/primitives";
import team from "@/public/images/team-at-work.webp";

/**
 * "Key challenges": the paragraph reads itself in as you scroll (words come up
 * from dim), then the answer beside a photograph of a care team.
 */
export function Challenge() {
  const { challenge } = HOME;
  return (
    <section aria-labelledby="challenge-title" className="surface-light relative border-t border-line bg-paper pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <Eyebrow index="01">{challenge.label}</Eyebrow>
        <h2 id="challenge-title" className="sr-only">
          {challenge.label}
        </h2>
        <ScrubText text={challenge.text} lit={challenge.lit} className="font-display mt-8 max-w-[26ch] text-[clamp(1.9rem,3.6vw,3.5rem)] leading-[1.14]" />

        <div className="mt-16 grid items-end gap-10 md:mt-24 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <FadeUp className="max-w-md">
            <p data-stagger className="text-lede text-muted">
              {challenge.answer}
            </p>
            <div data-stagger className="mt-6">
              <TextLink href={ROUTES.book}>Get in touch</TextLink>
            </div>
          </FadeUp>
          <Parallax amount={10} className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-cloud">
            <Image src={team} alt="The Jireh billing team reviewing claims together" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover object-top" />
          </Parallax>
        </div>
      </div>
    </section>
  );
}
