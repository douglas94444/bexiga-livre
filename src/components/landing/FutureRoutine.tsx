import cafe from "@/assets/rotina-cafe.jpg";
import dormir from "@/assets/rotina-dormir.jpg";
import viajar from "@/assets/rotina-viajar.jpg";
import { CtaButton, Reveal, Section, SectionLead, SectionTitle } from "./shared";

const cenas = [
  {
    src: dormir,
    alt: "Quarto claro e tranquilo com cama arrumada na luz da manhã",
    label: "Uma noite inteira de sono.",
  },
  {
    src: viajar,
    alt: "Mulher madura sorridente com mala de viagem em um aeroporto claro",
    label: "Uma viagem marcada sem cálculo mental.",
  },
  {
    src: cafe,
    alt: "Mulher madura tomando café tranquilamente perto da janela",
    label: "Um café demorado, sem pressa de voltar para casa.",
  },
];

export function FutureRoutine() {
  return (
    <Section tone="muted">
      <Reveal>
        <SectionTitle>Imagine sua rotina daqui a alguns meses.</SectionTitle>
        <SectionLead>
          Não é sobre pensar menos na bexiga. É sobre voltar a pensar em você.
        </SectionLead>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {cenas.map((cena, i) => (
          <Reveal key={cena.label} delay={i * 0.08}>
            <figure className="h-full overflow-hidden rounded-[1.75rem] bg-card">
              <img
                src={cena.src}
                alt={cena.alt}
                width={900}
                height={1100}
                loading="lazy"
                className="h-64 w-full object-cover sm:h-72"
              />
              <figcaption className="p-7 text-lg leading-relaxed text-muted-foreground">
                {cena.label}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-14 max-w-2xl text-balance text-center text-2xl font-semibold leading-snug tracking-tight">
          Você não quer apenas prevenir.
          <span className="block text-brand">Você quer voltar a viver.</span>
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-10 flex justify-center">
          <CtaButton>QUERO MEU PROTOCOLO AGORA</CtaButton>
        </div>
      </Reveal>
    </Section>
  );
}
