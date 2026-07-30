import { ShieldCheck } from "lucide-react";
import { GUARANTEE } from "./offer-data";
import { Reveal, Section } from "./shared";

export function Guarantee() {
  return (
    <Section id="garantia" tone="tint">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-background text-brand shadow-sm">
            <ShieldCheck className="size-8" strokeWidth={1.5} />
          </span>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-brand">
            {GUARANTEE.days} dias de garantia incondicional
          </p>
          <h2 className="mt-4 text-balance text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[2.5rem]">
            {GUARANTEE.lead}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-[1.375rem]">
            {GUARANTEE.body}
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {GUARANTEE.how}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
