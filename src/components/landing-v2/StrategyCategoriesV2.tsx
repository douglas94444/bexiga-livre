import { Lock } from "lucide-react";
import {
  heroCopy,
  strategyCategories,
  strategyCategoriesCopy,
} from "./v2-offer-data";
import { V2Accent, V2Cta, V2Lead, V2Section, V2Title } from "./shared";

export function StrategyCategoriesV2({ onCta }: { onCta: () => void }) {
  return (
    <V2Section tone="muted">
      <V2Title>
        365 estratégias organizadas{" "}
        <V2Accent>por situação</V2Accent>
      </V2Title>
      <V2Lead>{strategyCategoriesCopy.lead}</V2Lead>

      <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {strategyCategories.map((name) => (
          <li
            key={name}
            className="rounded-2xl border border-border/70 bg-card px-4 py-5 text-center shadow-[0_12px_32px_-28px_oklch(0.32_0.06_155/0.35)]"
          >
            <span className="font-display text-sm font-semibold tracking-tight text-brand sm:text-base">
              {name}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-center">
        <V2Cta onClick={onCta}>
          <Lock className="size-4 opacity-90" strokeWidth={2.2} />
          {heroCopy.cta}
        </V2Cta>
      </div>
    </V2Section>
  );
}
