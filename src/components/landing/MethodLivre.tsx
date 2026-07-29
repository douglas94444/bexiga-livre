import { Reveal, Section, SectionLead, SectionTitle } from "./shared";

const letras = [
  {
    letra: "L",
    title: "Liberdade",
    text: "O objetivo real: voltar a ocupar sua rotina sem que o medo decida por você.",
  },
  {
    letra: "I",
    title: "Informação baseada em evidências",
    text: "O que a ciência já sabe, explicado de forma simples — sem achismo de internet.",
  },
  {
    letra: "V",
    title: "Vigilância dos primeiros sinais",
    text: "Reconhecer cedo o que está acontecendo e saber exatamente qual é o próximo passo.",
  },
  {
    letra: "R",
    title: "Rotina preventiva",
    text: "Hábitos diários organizados em um plano possível de sustentar na vida real.",
  },
  {
    letra: "E",
    title: "Estratégias de apoio",
    text: "Alimentação, hidratação, sono e viagens tratados como parte da mesma estratégia.",
  },
];

export function MethodLivre() {
  return (
    <Section tone="tint">
      <Reveal>
        <SectionTitle>Método L.I.V.R.E.</SectionTitle>
        <SectionLead>
          Cinco pilares que transformam informação solta em um plano que você
          consegue seguir.
        </SectionLead>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {letras.map((item, i) => (
          <Reveal key={item.letra} delay={i * 0.06}>
            <article className="h-full rounded-[1.75rem] border border-brand/10 bg-card p-8">
              <span className="text-4xl font-semibold tracking-tight text-brand">
                {item.letra}
              </span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}