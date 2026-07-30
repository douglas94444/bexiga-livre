import { Briefcase, Heart, Moon, Plane } from "lucide-react";
import { Reveal, Section, SectionLead, SectionTitle } from "./shared";

const medos = [
  {
    icon: Moon,
    title: "Noites em claro",
    text: "Correndo para o banheiro, checando sinais, sem nunca descansar de verdade.",
  },
  {
    icon: Plane,
    title: "Medo de sair e viajar",
    text: "Passeios cancelados, viagens adiadas e o “e se acontecer longe de casa?” sempre no caminho.",
  },
  {
    icon: Heart,
    title: "Afastamento na intimidade",
    text: "O que deveria ser afeto virou cálculo de risco — e a distância cresce em silêncio.",
  },
  {
    icon: Briefcase,
    title: "Dias perdidos na dor",
    text: "Trabalho, rotina e planos que a infecção e o medo simplesmente engolem.",
  },
];

export function FearCards() {
  return (
    <Section>
      <Reveal>
        <SectionTitle>
          Mais do que desconforto:
          <span className="block text-muted-foreground">
            o tempo que você perdeu.
          </span>
        </SectionTitle>
        <SectionLead>
          Porque isso nunca foi só sobre a urgência no banheiro. É sobre a
          liberdade que a dor — e a espera da próxima crise — já roubou de você.
          Se importar aqui não é vaidade.
        </SectionLead>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {medos.map((medo, i) => (
          <Reveal key={medo.title} delay={i * 0.06}>
            <article className="h-full rounded-[1.75rem] border border-border bg-muted p-8 transition-shadow duration-300 hover:shadow-[0_20px_50px_-30px_oklch(0.21_0.034_264.7/0.4)]">
              <span className="grid size-12 place-items-center rounded-2xl bg-card text-brand shadow-sm">
                <medo.icon className="size-5" strokeWidth={1.6} />
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">
                {medo.title}
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                {medo.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
