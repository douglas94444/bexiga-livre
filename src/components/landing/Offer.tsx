import { Check, ShieldCheck } from "lucide-react";
import { CtaButton, Reveal, Section } from "./shared";

const incluso = [
  "Protocolo Principal",
  "Guia Alimentar da Bexiga Saudável",
  "Plano SOS Primeiros Sinais",
  "Kit Viagem Sem Medo",
  "Durma a Noite Toda",
  "Plano Preventivo de 30 Dias",
  "Checklist Diário",
];

export function Offer() {
  return (
    <Section id="oferta">
      <Reveal>
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-muted p-8 text-center sm:p-14">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand">
            Acesso completo
          </p>
          <h2 className="mt-5 text-balance text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[2.5rem]">
            Protocolo Bexiga Livre™
          </h2>

          <div className="mt-8 flex items-end justify-center gap-3">
            <span className="text-xl text-muted-foreground line-through">
              R$47
            </span>
            <span className="text-5xl font-semibold tracking-tight text-brand sm:text-6xl">
              R$27
            </span>
          </div>
          <p className="mt-3 text-lg text-muted-foreground">
            Pagamento único. Sem assinatura, sem renovação.
          </p>

          <ul className="mx-auto mt-10 grid max-w-xl gap-3 text-left sm:grid-cols-2">
            {incluso.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <CtaButton href="#">QUERO MEU ACESSO POR R$27</CtaButton>
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-base text-muted-foreground">
            <ShieldCheck className="size-5 shrink-0 text-brand" strokeWidth={1.6} />
            Garantia incondicional de 7 dias.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}