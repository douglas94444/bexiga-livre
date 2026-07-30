import { ShieldCheck } from "lucide-react";
import { GUARANTEE } from "./v2-offer-data";
import { V2Lead, V2Section, V2Title } from "./shared";

export function GuaranteeV2() {
  return (
    <V2Section tone="tint" id="garantia">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand text-primary-foreground shadow-md">
          <ShieldCheck className="size-8" strokeWidth={1.5} />
        </span>
        <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-brand">
          {GUARANTEE.title}
        </p>
        <V2Title className="mt-4">{GUARANTEE.lead}</V2Title>
        <V2Lead className="mt-5 text-lg leading-relaxed">{GUARANTEE.body}</V2Lead>
        <p className="mt-4 text-sm text-muted-foreground">{GUARANTEE.how}</p>
      </div>
    </V2Section>
  );
}
