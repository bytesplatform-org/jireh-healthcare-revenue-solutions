import { TESTIMONIALS } from "@/lib/content";
import { FadeUp } from "../motion/reveal";
import { ScrubText } from "../motion/scrub-text";
import { Eyebrow, Star } from "../ui/primitives";

/** Client words: the featured review reads itself in; two short quotes follow. */
export function Testimonials({ index = "07" }: { index?: string }) {
  const { featured, more } = TESTIMONIALS;
  return (
    <section aria-labelledby="reviews-title" className="surface-light arc-prev relative bg-paper">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-10">
          <Eyebrow index={index}>What agencies say</Eyebrow>
          <h2 id="reviews-title" className="sr-only">
            Testimonials
          </h2>
          <p className="flex gap-1 text-gold" aria-label="Rated 5 out of 5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-5" />
            ))}
          </p>
        </div>

        <figure className="mt-12 grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          <span aria-hidden className="font-display block text-[8rem] leading-[0.7] text-indigo/20 md:text-[10rem]">
            “
          </span>
          <div>
            <blockquote>
              <ScrubText
                text={featured.quote}
                lit={["professional, responsive, and knowledgeable", "dependable billing support."]}
                className="font-display text-[clamp(1.5rem,2.5vw,2.4rem)] leading-[1.3]"
                end="bottom 60%"
              />
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-indigo/40" />
              <span>
                <span className="block font-semibold">{featured.name}</span>
                <span className="text-sm text-muted">{featured.role}</span>
              </span>
            </figcaption>
          </div>
        </figure>

        <FadeUp className="mt-16 grid gap-4 md:grid-cols-2">
          {more.map((t) => (
            <figure key={t.name} data-stagger className="border-t border-line pt-8">
              <p className="flex gap-1 text-gold" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} />
                ))}
              </p>
              <blockquote className="font-display mt-5 text-xl leading-snug md:text-2xl">“{t.quote}”</blockquote>
              <figcaption className="mt-5 text-sm font-semibold text-muted">{t.name}</figcaption>
            </figure>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
