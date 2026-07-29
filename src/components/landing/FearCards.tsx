import { Heart, Moon, Plane, Sun } from "lucide-react";
import { Reveal, Section, SectionLead, SectionTitle } from "./shared";

const medos = [
  {
    icon: Plane,
    title: "Medo de viajar",
    text: "Você calcula distâncias, banheiros e o “e se acontecer longe de casa?” antes de aceitar qualquer convite.",
  },
  {
    icon: Moon,
    title: "Medo de dormir",
    text: "A noite vira vigilância. Você acorda, checa, volta a deitar e nunca descansa por completo.",
  },
  {
    icon: Heart,
    title: "Medo da intimidade",
    text: "O que deveria ser afeto virou cálculo de risco. E a distância vai crescendo em silêncio.",
  },
  {
    icon: Sun,
    title: "Medo de sair",
    text: "Sair de casa passou a exigir plano B, remédio na bolsa e um mapa mental de banheiros.",
  },
];

export function FearCards() {
  return (
    <Section>
      <Reveal>
        <SectionTitle>
          Você não sofre apenas com uma infecção.
          <span className="block text-muted-foreground">
            Você vive esperando a próxima.
          </span>
        </SectionTitle>
        <SectionLead>
          O maior peso não é a crise. É o estado de alerta permanente entre uma
          crise e outra.
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