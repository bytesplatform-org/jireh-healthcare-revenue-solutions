import { PROVIDERS } from "@/lib/content";
import { ArcSurface } from "../motion/arc-surface";
import { FadeUp, SplitReveal } from "../motion/reveal";
import { Eyebrow, cx } from "../ui/primitives";

/** The provider types, as a wrapped cloud of pills that rise in one after another. */
export function ProvidersGrid({ index = "03", arc = false }: { index?: string; arc?: boolean }) {
  return (
    <section aria-labelledby="providers-title" className={cx("surface-light relative pb-24 md:pb-32", arc ? "arc-next z-50" : "bg-paper")}>
      {arc && <ArcSurface tone="paper" />}
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className={cx("grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20", !arc && "border-t border-line pt-12")}>
          <Eyebrow index={index}>Who we serve</Eyebrow>
          <div>
            <SplitReveal as="h2" id="providers-title" className="font-display text-h2 max-w-[18ch]">
              Professional billing for home and community-based care.
            </SplitReveal>
            <FadeUp as="ul" className="mt-10 grid border-t border-line sm:grid-cols-2">
              {PROVIDERS.map((p) => (
                <li key={p} data-stagger className="flex items-center gap-3 border-b border-line py-4 text-[16px] font-medium">
                  <span aria-hidden className="size-1.5 rounded-full bg-teal" />
                  {p}
                </li>
              ))}
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
