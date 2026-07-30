import { ShieldCheck, Stethoscope, LayoutList } from "lucide-react";
import mockup from "@/assets/mockup-protocolo.jpg";
import { Reveal, Section } from "./shared";

const pontos = [
  {
    icon: Stethoscope,
    title: "Não promete “acabar com a infecção”",
    text: "A maioria dos produtos desse nicho vende a mesma promessa vazia de suco, chá e cápsula. Este começa do jeito oposto: plano e clareza, sem milagre.",
  },
  {
    icon: ShieldCheck,
    title: "Não substitui o médico",
    text: "Existe um capítulo inteiro sobre sinais de alerta — febre, sangue, dor lombar — e quando ir ao médico sem demora.",
  },
  {
    icon: LayoutList,
    title: "Organiza o quadro completo",
    text: "Em vez de mais um tip solto, você recebe o produto principal Protocolo Bexiga Blindada™ e 4 bônus: Guia Alimentar, SOS, Kit Viagem e Durma a Noite Toda.",
  },
];

export function ProtocolIntro() {
  return (
    <Section id="protocolo">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <img
            src={mockup}
            alt="Mockup do Protocolo Bexiga Blindada com dossiê impresso, plano digital em tablet e checklist semanal"
            width={1200}
            height={1008}
            loading="lazy"
            className="w-full rounded-[2rem] border border-border bg-muted object-cover"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="min-w-0">
            <h2 className="text-balance text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[2.75rem]">
              Diferente de tudo que você já tentou
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-[1.375rem]">
              Este material não promete cura nem milagre. Organiza, em um só
              lugar, informação clara e o Método B.A.R.R.E.I.R.A™ — prevenção
              como complemento do acompanhamento médico, nunca substituto.
            </p>

            <ul className="mt-10 space-y-7">
              {pontos.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-tint text-brand">
                    <p.icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-lg leading-relaxed text-muted-foreground">
                      {p.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
