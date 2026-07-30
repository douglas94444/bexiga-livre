import { Check, ShoppingCart } from "lucide-react";
import mockupBlindada from "@/assets/mockup-blindada-hero.png";
import {
  PRODUCT_NAME,
  bonuses,
  checkoutBumps,
  formatBRL,
  type CheckoutBumpId,
} from "@/components/landing/offer-data";
import { plans, type PlanId } from "@/components/landing-v2/v2-offer-data";
import { cn } from "@/lib/utils";

type CheckoutOrderSummaryProps = {
  plan: PlanId;
  selectedBumps: CheckoutBumpId[];
  total: number;
  className?: string;
};

export function CheckoutOrderSummary({
  plan,
  selectedBumps,
  total,
  className,
}: CheckoutOrderSummaryProps) {
  const planData = plans[plan];
  const showBonuses = plan === "completo";
  const selected = checkoutBumps.filter((b) => selectedBumps.includes(b.id));

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-muted p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <ShoppingCart className="size-4 text-brand" strokeWidth={2} />
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground">
          Resumo do pedido
        </h2>
      </div>

      <div className="mt-5 flex gap-3">
        <img
          src={mockupBlindada}
          alt=""
          className="size-16 shrink-0 rounded-lg border border-border object-cover bg-background"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold tracking-tight leading-snug">
            {planData.name}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">{PRODUCT_NAME}</p>
          <p className="mt-2 text-sm font-semibold tabular-nums text-brand">
            {formatBRL(planData.price)}
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2 border-t border-border pt-4">
        <li className="flex items-start gap-2 text-sm">
          <Check className="mt-0.5 size-3.5 shrink-0 text-brand" strokeWidth={3} />
          <span>2 PDFs principais (Protocolo + 365 Estratégias)</span>
        </li>
        {showBonuses ? (
          <li className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 size-3.5 shrink-0 text-brand" strokeWidth={3} />
            <span>4 bônus exclusivos</span>
          </li>
        ) : null}
        {showBonuses
          ? bonuses.slice(0, 2).map((b) => (
              <li
                key={b.title}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <Check className="mt-0.5 size-3 shrink-0 text-brand/70" strokeWidth={3} />
                <span>{b.title}</span>
              </li>
            ))
          : null}
        {showBonuses && bonuses.length > 2 ? (
          <li className="pl-5 text-xs text-muted-foreground">
            +{bonuses.length - 2} bônus
          </li>
        ) : null}
      </ul>

      {selected.length > 0 ? (
        <ul className="mt-3 space-y-2 border-t border-border pt-3">
          {selected.map((bump) => (
            <li
              key={bump.id}
              className="flex items-start justify-between gap-2 text-sm"
            >
              <span className="min-w-0">
                {bump.emoji} {bump.title}
              </span>
              <span className="shrink-0 font-medium tabular-nums text-brand">
                +{formatBRL(bump.price)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-right text-lg font-semibold tabular-nums text-brand">
          total {formatBRL(total)} à vista
        </p>
      </div>
    </aside>
  );
}
