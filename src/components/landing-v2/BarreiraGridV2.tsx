import { Lock } from "lucide-react";
import { barreiras, heroCopy } from "./v2-offer-data";
import { type CtaHandlerProps, V2Card, V2Cta, V2Lead, V2Section, V2Title } from "./shared";

export function BarreiraGridV2({ onCta }: CtaHandlerProps) {
  return (
    <V2Section tone="muted">
      <V2Title>Método B.A.R.R.E.I.R.A™ — o sistema por trás do protocolo</V2Title>
      <V2Lead className="max-w-2xl">
        Oito frentes práticas de prevenção. Cada letra vira ação concreta no
        material — sem milagre e sem substituir o médico.
      </V2Lead>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {barreiras.map((item) => (
          <V2Card
            as="article"
            key={`${item.letra}-${item.title}`}
            className="rounded-2xl p-5"
          >
            <span className="font-display grid size-10 place-items-center rounded-full bg-brand text-lg font-semibold text-primary-foreground">
              {item.letra}
            </span>
            <h3 className="mt-4 text-base font-semibold tracking-tight text-brand">
              {item.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {item.text}
            </p>
          </V2Card>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <V2Cta onClick={onCta}>
          <Lock className="size-4 opacity-90" strokeWidth={2.2} />
          {heroCopy.cta}
        </V2Cta>
      </div>
    </V2Section>
  );
}
