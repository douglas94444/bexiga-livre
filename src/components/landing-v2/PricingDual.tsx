import {
  Check,
  CreditCard,
  Download,
  Gift,
  ListChecks,
  Lock,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";
import { CountdownTimer } from "@/components/landing/CountdownTimer";
import {
  afterPurchaseSteps,
  bonuses,
  formatBRL,
  plans,
  type PlanId,
} from "./v2-offer-data";
import { V2Cta, V2Section, V2Title } from "./shared";
import { cn } from "@/lib/utils";

const afterIcons = [CreditCard, Download, ListChecks];

function TrustLine() {
  return (
    <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <li className="inline-flex items-center gap-1">
        <ShieldCheck className="size-3.5 text-brand" /> Garantia 7 dias
      </li>
      <li className="inline-flex items-center gap-1">
        <Zap className="size-3.5 text-brand" /> Acesso imediato
      </li>
      <li className="inline-flex items-center gap-1">
        <Lock className="size-3.5 text-brand" /> Acesso vitalício
      </li>
    </ul>
  );
}

function PriceBlock({
  compareAt,
  price,
  className,
}: {
  compareAt: number | null;
  price: number;
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      {compareAt ? (
        <p className="text-sm text-muted-foreground">
          De{" "}
          <span className="line-through decoration-red-500/70">
            {formatBRL(compareAt)}
          </span>{" "}
          por apenas
        </p>
      ) : null}
      <p className="font-display mt-1 text-5xl font-semibold tracking-tight text-brand">
        {formatBRL(price)}
      </p>
    </div>
  );
}

export function PricingDual({
  onSelect,
}: {
  onSelect: (plan: PlanId) => void;
}) {
  return (
    <V2Section id="precos" tone="dark" className="bg-brand">
      <V2Title className="text-primary-foreground">
        Escolha o protocolo ideal para você
      </V2Title>
      <p className="mt-4 text-center text-sm text-primary-foreground/80">
        Condição especial encerra em{" "}
        <CountdownTimer className="align-middle text-primary-foreground" />
      </p>

      <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Básico */}
        <article className="relative flex flex-col rounded-3xl border border-transparent bg-card p-7 text-foreground shadow-[0_20px_48px_-28px_oklch(0_0_0/0.45)] sm:p-9">
          <span className="mx-auto -mt-1 mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-tint px-3.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand">
            <Zap className="size-3.5" strokeWidth={2.4} fill="currentColor" />
            {plans.basico.badge}
          </span>
          <h3 className="font-display text-center text-2xl font-semibold tracking-tight text-brand sm:text-[1.65rem]">
            {plans.basico.headline}
          </h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {plans.basico.ideal}
          </p>
          <ul className="mt-8 flex-1 space-y-3">
            {plans.basico.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[0.95rem]">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={3} />
                <span>{item}</span>
              </li>
            ))}
            {plans.basico.excludes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[0.95rem] text-muted-foreground"
              >
                <X className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <PriceBlock compareAt={plans.basico.compareAt} price={plans.basico.price} />
            <div className="mt-6">
              <V2Cta className="w-full" onClick={() => onSelect("basico")}>
                {plans.basico.cta}
              </V2Cta>
              <TrustLine />
            </div>
          </div>
        </article>

        {/* Completo */}
        <article className="relative flex flex-col rounded-3xl border-2 border-brand-soft/50 bg-card p-7 text-foreground shadow-[0_28px_60px_-28px_oklch(0_0_0/0.5)] sm:p-9">
          <span className="absolute right-4 top-4 rounded-md bg-brand px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-primary-foreground">
            Mais escolhido
          </span>
          <span className="mx-auto -mt-1 mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand px-3.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-primary-foreground">
            <Gift className="size-3.5" strokeWidth={2.2} />
            {plans.completo.badge}
          </span>
          <h3 className="font-display text-center text-2xl font-semibold tracking-tight text-brand sm:text-[1.65rem]">
            {plans.completo.headline}
          </h3>
          <p className="mt-2 text-center text-sm font-medium text-brand">
            {plans.completo.ideal}
          </p>
          <ul className="mt-8 flex-1 space-y-3">
            {plans.completo.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[0.95rem]">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={3} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-brand-tint/70 px-4 py-4">
            <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-brand">
              Bônus exclusivos!
            </p>
            <ul className="mt-3 space-y-2.5">
              {bonuses.map((bonus) => (
                <li
                  key={bonus.title}
                  className="flex items-start gap-2.5 text-sm text-foreground"
                >
                  <Gift className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2} />
                  <span>
                    {bonus.label} — {bonus.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-8">
            <PriceBlock
              compareAt={plans.completo.compareAt}
              price={plans.completo.price}
            />
            <div className="mt-6">
              <V2Cta className="w-full" onClick={() => onSelect("completo")}>
                {plans.completo.cta}
              </V2Cta>
              <TrustLine />
            </div>
          </div>
        </article>
      </div>

      <div className="mt-10 border-t border-primary-foreground/15 pt-8">
        <h3 className="font-display text-center text-2xl font-semibold tracking-tight text-primary-foreground sm:text-3xl">
          Como funciona depois da compra
        </h3>
        <p className="mx-auto mt-4 max-w-xl text-center text-primary-foreground/75">
          Do pagamento ao primeiro passo — simples, digital e imediato.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {afterPurchaseSteps.map((step, i) => {
            const Icon = afterIcons[i] ?? ListChecks;
            return (
              <article key={step.title} className="text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-foreground/10 text-primary-foreground">
                  <Icon className="size-6" strokeWidth={1.6} />
                </span>
                <h4 className="font-display mt-5 text-lg font-semibold tracking-tight text-primary-foreground">
                  {step.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">
                  {step.text}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </V2Section>
  );
}
