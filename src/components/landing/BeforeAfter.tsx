import { ArrowDown, ArrowRight } from "lucide-react";
import { Reveal, Section, SectionTitle } from "./shared";

const antes = [
  "Dorme mal.",
  "Vive procurando banheiro.",
  "Viaja com medo.",
  "Carrega remédios “por garantia”.",
  "Analisa qualquer ardência.",
];

const depois = [
  "Mais tranquilidade.",
  "Rotina organizada.",
  "Mais confiança para viajar.",
  "Conhece os sinais de alerta.",
  "Sabe quais hábitos fazem parte de uma estratégia preventiva.",
];

export function BeforeAfter() {
  return (
    <Section tone="muted">
      <Reveal>
        <SectionTitle>A diferença não está no esforço. Está no plano.</SectionTitle>
      </Reveal>

      <div className="mt-14 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <Reveal>
          <div className="rounded-[1.75rem] border border-border bg-card p-8">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Antes
            </p>
            <ul className="mt-6 space-y-4">
              {antes.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-lg leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-border" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <ArrowDown className="size-6 text-brand lg:hidden" />
            <ArrowRight className="hidden size-6 text-brand lg:block" />
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
              Protocolo
              <br />
              Bexiga Livre™
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="rounded-[1.75rem] border border-brand/15 bg-brand-tint p-8">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand">
              Depois
            </p>
            <ul className="mt-6 space-y-4">
              {depois.map((item) => (
                <li key={item} className="flex gap-3 text-lg leading-relaxed">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}