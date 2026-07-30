import { CtaButton, Reveal, Section, SectionLead, SectionTitle } from "./shared";

const tentativas = [
  {
    label: "Mais água",
    text: "E a garrafa virou obrigação — sem explicar o quadro completo.",
  },
  {
    label: "Mais antibiótico",
    text: "Mais uma caixa, mais uma recaída depois. O sintoma passa; a dúvida fica.",
  },
  {
    label: "Mais cranberry",
    text: "Uso irregular, suco cheio de açúcar, cápsula genérica… e a expectativa de que “só isso” resolvesse.",
  },
  {
    label: "Mais chá",
    text: "Receitas caseiras, cada dia uma diferente, zero plano.",
  },
  {
    label: "Mais promessas",
    text: "A mesma frase vazia: “acaba com a infecção urinária” — e a infecção volta.",
  },
  {
    label: "Resultado",
    text: "Você tratou pedaços isolados. A infecção de repetição quase sempre é a soma de fatores.",
    highlight: true,
  },
];

export function TriedEverything() {
  return (
    <Section tone="muted">
      <Reveal>
        <SectionTitle>Por que nada resolveu até agora</SectionTitle>
        <SectionLead>
          Você já tentou de tudo. Isso não significa que não existe caminho.
          Significa que ninguém te deu o quadro completo.
        </SectionLead>
      </Reveal>

      <div className="mx-auto mt-14 max-w-2xl">
        <ol className="relative border-l border-border pl-8">
          {tentativas.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05}>
              <li className="relative pb-10 last:pb-0">
                <span
                  className={`absolute -left-[2.3rem] top-1.5 size-3 rounded-full ring-4 ring-muted ${
                    item.highlight ? "bg-brand" : "bg-border"
                  }`}
                />
                <p
                  className={`text-xl font-semibold tracking-tight ${
                    item.highlight ? "text-brand" : ""
                  }`}
                >
                  {item.label}
                </p>
                <p className="mt-1 text-lg text-muted-foreground">{item.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <p className="mt-12 text-balance text-center text-2xl font-semibold leading-snug tracking-tight">
            Não é falha sua.
            <span className="block text-brand">
              É que ninguém te mostrou a causa composta.
            </span>
          </p>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg leading-relaxed text-muted-foreground">
            Hidratação, hábitos após a relação, roupa, rotina — atacar só um
            pedaço de cada vez dificilmente muda o ciclo. O protocolo organiza o
            que estava espalhado.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex justify-center">
            <CtaButton>QUERO MEU PROTOCOLO AGORA</CtaButton>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
