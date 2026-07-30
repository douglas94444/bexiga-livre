import { Reveal, Section, SectionTitle } from "./shared";

const internet = [
  "Informações soltas",
  "Promessas de “acabar com a infecção”",
  "Receitas e fóruns contraditórios",
  "Tratar um sintoma de cada vez",
];

const protocolo = [
  "Produto principal: Protocolo Bexiga Blindada™",
  "Método B.A.R.R.E.I.R.A™",
  "Bônus 1 — Guia Alimentar",
  "Bônus 2 — Plano SOS Primeiros Sinais",
  "Bônus 3 — Kit Viagem Sem Medo",
  "Bônus 4 — Durma a Noite Toda",
];

export function Comparison() {
  return (
    <Section>
      <Reveal>
        <SectionTitle>Por que este protocolo é diferente?</SectionTitle>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-[1.75rem] border border-border bg-muted p-8">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Internet
            </p>
            <ul className="mt-6 space-y-3 text-lg text-muted-foreground">
              {internet.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-border" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-border pt-6 text-xl font-semibold tracking-tight text-muted-foreground">
              ↓ Confusão
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full rounded-[1.75rem] border border-brand/20 bg-brand-tint p-8">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand">
              Protocolo Bexiga Blindada™
            </p>
            <ul className="mt-6 space-y-3 text-lg">
              {protocolo.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-brand/20 pt-6 text-xl font-semibold tracking-tight text-brand">
              ↓ Clareza
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
