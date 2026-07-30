import { Star } from "lucide-react";
import { SOCIAL_PROOF, testimonials } from "./offer-data";
import { Reveal, Section, SectionLead, SectionTitle } from "./shared";

export function Testimonials() {
  return (
    <Section id="depoimentos">
      <Reveal>
        <SectionTitle>Mulheres que decidiram sair do modo alerta</SectionTitle>
        <SectionLead>
          {SOCIAL_PROOF.ratingLabel} {SOCIAL_PROOF.countLabel} já acessaram o
          protocolo para organizar a rotina entre uma crise e outra.
        </SectionLead>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, i) => (
          <Reveal key={`${item.name}-${item.city}`} delay={i * 0.04}>
            {/* TODO: depoimento real — substituir por prints/textos autênticos */}
            <article className="flex h-full flex-col rounded-[1.75rem] border border-border bg-muted p-7">
              <div className="flex gap-0.5 text-brand" aria-label="5 de 5 estrelas">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star key={star} className="size-4 fill-current" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-4 flex-1 text-lg leading-relaxed text-foreground">
                “{item.text}”
              </p>
              <p className="mt-6 text-base font-semibold tracking-tight">
                {item.name}, {item.age}
              </p>
              <p className="text-sm text-muted-foreground">{item.city}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Depoimentos ilustrativos — substituir por reais.
      </p>
    </Section>
  );
}
