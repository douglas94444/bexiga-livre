import { Check, Gift, Lock } from "lucide-react";
import mockupAlimentar from "@/assets/mockup-bonus-alimentar.png";
import mockupSos from "@/assets/mockup-bonus-sos.png";
import mockupViagem from "@/assets/mockup-bonus-viagem.png";
import mockupNoite from "@/assets/mockup-bonus-noite.png";
import {
  bonusTotalValue,
  bonuses,
  bonusesGiftCopy,
  formatBRL,
  heroCopy,
} from "./v2-offer-data";
import { type CtaHandlerProps, V2Accent, V2Card, V2Cta, V2Section, V2Title } from "./shared";

const bonusMockups = [mockupAlimentar, mockupSos, mockupViagem, mockupNoite];

export function BonusesGiftV2({ onCta }: CtaHandlerProps) {
  return (
    <V2Section tone="tint">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground">
          <Gift className="size-3.5" strokeWidth={2.2} />
          {bonusesGiftCopy.badge}
        </p>
        <V2Title className="mt-5">
          Compre agora e <V2Accent>receba</V2Accent>
        </V2Title>
        <p className="mt-2 text-xl font-semibold tracking-tight text-star sm:text-2xl">
          {bonusesGiftCopy.highlight}
        </p>
      </div>

      <ul className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2 sm:gap-6">
        {bonuses.map((bonus, i) => (
          <V2Card
            as="li"
            key={bonus.title}
            className="flex flex-col overflow-hidden rounded-2xl sm:flex-row"
          >
            <div className="relative mx-auto w-full max-w-[11rem] shrink-0 p-4 sm:mx-0 sm:max-w-[9.5rem] sm:self-stretch sm:p-5">
              <span className="absolute left-5 top-5 z-10 rounded bg-brand px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-primary-foreground shadow-sm sm:left-6 sm:top-6">
                {bonus.label}
              </span>
              <img
                src={bonusMockups[i]}
                alt={`Mockup do bônus ${bonus.title}`}
                width={280}
                height={360}
                loading="lazy"
                className="aspect-[3/4] w-full rounded-xl object-cover object-center shadow-md"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center px-5 pb-5 pt-1 sm:py-6 sm:pl-0 sm:pr-6">
              <h3 className="font-display text-xl font-semibold tracking-tight text-brand sm:text-[1.35rem]">
                {bonus.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
                {bonus.text}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <span className="text-sm text-muted-foreground line-through">
                  {formatBRL(bonus.value)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.94_0.05_145)] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-[oklch(0.42_0.12_145)]">
                  <Check className="size-3" strokeWidth={3} />
                  {bonusesGiftCopy.freeToday}
                </span>
              </div>
            </div>
          </V2Card>
        ))}
      </ul>

      <p className="mx-auto mt-8 max-w-2xl rounded-2xl bg-brand px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.06em] text-primary-foreground sm:text-base">
        {bonusesGiftCopy.footerPrefix} ({formatBRL(bonusTotalValue)}) →{" "}
        {bonusesGiftCopy.footerSuffix}
      </p>

      <div className="mt-8 flex justify-center">
        <V2Cta onClick={onCta}>
          <Lock className="size-4 opacity-90" strokeWidth={2.2} />
          {heroCopy.cta}
        </V2Cta>
      </div>
    </V2Section>
  );
}
