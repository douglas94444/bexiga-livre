import { Check } from "lucide-react";
import { idealForItems } from "./v2-offer-data";
import { type CtaHandlerProps, V2Card, V2Cta, V2Section, V2Title } from "./shared";

export function IdealFor({ onCta }: CtaHandlerProps) {
  return (
    <V2Section>
      <V2Title>Este protocolo é perfeito para você que:</V2Title>
      <ul className="mx-auto mt-10 max-w-2xl space-y-4">
        {idealForItems.map((item) => (
          <V2Card
            as="li"
            key={item}
            className="flex items-start gap-3 rounded-2xl px-4 py-4 text-lg leading-relaxed"
          >
            <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-primary-foreground">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span>{item}</span>
          </V2Card>
        ))}
      </ul>
      <div className="mt-10 flex justify-center">
        <V2Cta onClick={onCta}>Quero meu protocolo agora</V2Cta>
      </div>
    </V2Section>
  );
}
