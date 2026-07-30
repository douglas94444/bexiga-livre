import mockupBlindada from "@/assets/mockup-blindada-bonus.png";
import { CtaButton, Reveal, Section, SectionLead, SectionTitle } from "./shared";
import { bonuses, mainProduct } from "./offer-data";

export function Deliverables() {
  return (
    <Section>
      <Reveal>
        <SectionTitle>O que você recebe hoje</SectionTitle>
        <SectionLead>
          Produto principal + 4 bônus exclusivos. Acesso imediato por download.
        </SectionLead>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mx-auto mt-10 max-w-5xl">
          <img
            src={mockupBlindada}
            alt="Protocolo Bexiga Blindada™ com produto principal e 4 bônus exclusivos"
            width={1600}
            height={900}
            loading="lazy"
            className="mx-auto h-auto w-full"
          />
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-5">
        <Reveal>
          <article className="flex h-full flex-col rounded-[1.75rem] border-2 border-brand/30 bg-brand-tint/40 p-7 lg:col-span-1">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
              {mainProduct.label}
            </p>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">
              {mainProduct.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {mainProduct.text}
            </p>
          </article>
        </Reveal>

        {bonuses.map((b, i) => (
          <Reveal key={b.title} delay={(i + 1) * 0.04}>
            <article className="flex h-full flex-col rounded-[1.75rem] border border-border bg-muted p-7">
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
                {b.label}
              </p>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{b.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {b.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-12 flex justify-center">
          <CtaButton>QUERO MEU PROTOCOLO AGORA</CtaButton>
        </div>
      </Reveal>
    </Section>
  );
}
