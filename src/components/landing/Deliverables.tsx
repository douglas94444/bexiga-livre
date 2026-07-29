import { Reveal, Section, SectionLead, SectionTitle } from "./shared";

const itens = [
  {
    emoji: "📘",
    title: "Protocolo Principal",
    text: "O plano completo, do entendimento do problema à rotina preventiva.",
  },
  {
    emoji: "🍓",
    title: "Guia Alimentar da Bexiga Saudável",
    text: "O que priorizar, o que observar e como montar o dia sem complicação.",
  },
  {
    emoji: "🚽",
    title: "Plano SOS Primeiros Sinais",
    text: "O que fazer nas primeiras horas, com clareza, sem pânico.",
  },
  {
    emoji: "✈️",
    title: "Kit Viagem Sem Medo",
    text: "Preparo antes, durante e depois da viagem — para voltar a dizer sim.",
  },
  {
    emoji: "🌙",
    title: "Durma a Noite Toda",
    text: "Estratégias noturnas para reduzir idas ao banheiro e recuperar o sono.",
  },
  {
    emoji: "📅",
    title: "Plano Preventivo de 30 Dias",
    text: "Um mês guiado, semana a semana, sem depender de força de vontade.",
  },
  {
    emoji: "📋",
    title: "Checklist Diário",
    text: "Uma página simples para manter a rotina viva todos os dias.",
  },
];

export function Deliverables() {
  return (
    <Section>
      <Reveal>
        <SectionTitle>O que você recebe hoje</SectionTitle>
        <SectionLead>
          Sete materiais independentes que funcionam como um programa único.
        </SectionLead>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {itens.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.05}>
            <article className="flex h-full flex-col rounded-[1.75rem] border border-border bg-muted p-8">
              <span className="text-3xl" aria-hidden="true">
                {item.emoji}
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">
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