import { Check, Lock } from "lucide-react";
import {
  differentiatorCopy,
  differentiatorFeatures,
  heroCopy,
} from "./v2-offer-data";
import { V2Card, V2Cta, V2Section, V2Title } from "./shared";

export function DifferentiatorV2({ onCta }: { onCta: () => void }) {
  return (
    <V2Section tone="muted">
      <V2Title>{differentiatorCopy.title}</V2Title>

      <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
        {differentiatorFeatures.map((item) => (
          <V2Card
            as="li"
            key={item}
            className="flex items-center gap-3 rounded-2xl px-4 py-4"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-primary-foreground">
              <Check className="size-4" strokeWidth={3} />
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {item}
            </span>
          </V2Card>
        ))}
      </ul>

      <div className="mx-auto mt-10 max-w-2xl border-t border-border pt-8">
        <h3 className="font-display text-center text-2xl font-semibold tracking-tight text-brand sm:text-[1.75rem]">
          {differentiatorCopy.costTitle}
        </h3>
        <p className="mt-4 text-center text-lg leading-relaxed text-muted-foreground">
          {differentiatorCopy.costBody}
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <V2Cta onClick={onCta}>
          <Lock className="size-4 opacity-90" strokeWidth={2.2} />
          {heroCopy.cta}
        </V2Cta>
        <a
          href="#precos"
          className="text-sm font-medium text-brand underline-offset-4 hover:underline"
        >
          Ver protocolos e preços
        </a>
      </div>
    </V2Section>
  );
}
