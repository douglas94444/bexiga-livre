import {
  Heart,
  ListChecks,
  Lock,
  Moon,
  Plane,
  type LucideIcon,
} from "lucide-react";
import { heroCopy, lifeAfterCopy, lifeAfterItems } from "./v2-offer-data";
import { V2Accent, V2Card, V2Cta, V2Lead, V2Section, V2Title } from "./shared";

const iconMap: Record<(typeof lifeAfterItems)[number]["icon"], LucideIcon> = {
  plane: Plane,
  moon: Moon,
  heart: Heart,
  listChecks: ListChecks,
};

export function LifeAfterV2({ onCta }: { onCta: () => void }) {
  return (
    <V2Section>
      <V2Title>
        Imagine a rotina com um{" "}
        <V2Accent>plano na mão</V2Accent>
      </V2Title>
      <V2Lead>{lifeAfterCopy.lead}</V2Lead>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {lifeAfterItems.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <V2Card
              as="li"
              key={item.title}
              className="flex gap-4 rounded-2xl p-5 sm:p-6"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-primary-foreground">
                <Icon className="size-6" strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight text-brand">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
                  {item.text}
                </p>
              </div>
            </V2Card>
          );
        })}
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
