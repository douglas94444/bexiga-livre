import { Check } from "lucide-react";
import heroImage from "@/assets/hero-liberdade.jpg";
import { UrgencyBar } from "./CountdownTimer";
import { SOCIAL_PROOF } from "./offer-data";
import { CtaButton } from "./shared";

const selos = [
  "Conteúdo educativo",
  "Acesso imediato por download",
  "Acesso vitalício",
  "Garantia de 7 dias",
];

export function Hero() {
  return (
    <header>
      <UrgencyBar />
      <div className="px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand">
              Protocolo Bexiga Blindada™
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              para quem já sofreu demais com infecção urinária
            </p>
            <h1 className="mt-6 text-balance text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[3rem]">
              Não é a dor que mais dói.
              <span className="block text-brand">
                É o medo de que ela volte.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-[1.375rem]">
              Não é falta de higiene. Não é exagero. Não é “coisa da sua cabeça”.
              É biologia — e biologia se entende. Se você já perdeu a conta dos
              antibióticos, cancelou viagem ou vive calculando o próximo banheiro,
              o Protocolo Bexiga Blindada™ organiza prevenção sem prometer cura
              e sem substituir o médico.
            </p>

            <div className="mt-9">
              <CtaButton>QUERO MEU PROTOCOLO AGORA</CtaButton>
            </div>

            <p className="mt-5 text-base text-muted-foreground">
              <span className="font-medium text-foreground">
                {SOCIAL_PROOF.ratingLabel}
              </span>{" "}
              {SOCIAL_PROOF.countLabel}
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {selos.map((selo) => (
                <li
                  key={selo}
                  className="flex items-center gap-3 text-base text-muted-foreground"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {selo}
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <img
              src={heroImage}
              alt="Mulher madura sorrindo enquanto caminha tranquilamente na praia ao entardecer"
              width={1200}
              height={1408}
              fetchPriority="high"
              className="h-full w-full rounded-[2rem] object-cover shadow-[0_30px_80px_-40px_oklch(0.21_0.034_264.7/0.35)]"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
