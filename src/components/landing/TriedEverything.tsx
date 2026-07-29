import { Reveal, Section, SectionTitle } from "./shared";

const tentativas = [
  { label: "Mais água", text: "E a garrafa virou obrigação diária." },
  { label: "Mais antibiótico", text: "Mais uma caixa, mais uma recaída depois." },
  { label: "Mais cranberry", text: "Cápsulas, sucos, promessas na internet." },
  { label: "Mais chá", text: "Receitas caseiras, cada dia uma diferente." },
  { label: "Mais promessas", text: "Vídeos, fóruns, opiniões contraditórias." },
  { label: "Resultado", text: "A infecção volta.", highlight: true },
];

export function TriedEverything() {
  return (
    <Section tone="muted">
      <Reveal>
        <SectionTitle>Você já tentou de tudo.</SectionTitle>
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
            O problema nunca foi falta de esforço.
            <span className="block text-brand">Foi falta de um plano.</span>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}