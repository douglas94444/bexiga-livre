import { barreiras } from "./offer-data";
import { Reveal, Section, SectionLead, SectionTitle } from "./shared";

export function MethodLivre() {
  return (
    <Section tone="tint" id="caminho">
      <Reveal>
        <SectionTitle>Método B.A.R.R.E.I.R.A™</SectionTitle>
        <SectionLead>
          Oito frentes que, juntas, formam uma defesa consistente. Nenhuma
          camada sozinha impede tudo — juntas, organizam a prevenção. Não é
          mágica. É sistema.
        </SectionLead>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground">
          No material: capítulos do ciclo de recorrência ao plano de 30 dias,
          erros comuns, sinais de alerta e como manter a rotina por anos.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {barreiras.map((item, i) => (
          <Reveal key={`${item.letra}-${item.title}`} delay={i * 0.04}>
            <article className="h-full rounded-[1.75rem] border border-brand/10 bg-card p-6">
              <span className="text-3xl font-semibold tracking-tight text-brand">
                {item.letra}
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
