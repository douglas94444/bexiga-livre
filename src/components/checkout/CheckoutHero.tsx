import { Check, Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";
import mockupBlindada from "@/assets/mockup-blindada-hero.png";
import { PRODUCT_NAME } from "@/components/landing/offer-data";
import type { PlanId } from "@/components/landing-v2/v2-offer-data";
import { plans } from "@/components/landing-v2/v2-offer-data";

export function CheckoutHero({ plan }: { plan: PlanId }) {
  const planData = plans[plan];
  const showBonuses = plan === "completo";

  const bullets = [
    planData.name,
    showBonuses ? "4 bônus exclusivos inclusos" : "Produto principal com acesso vitalício",
    "Acesso imediato por PDF",
  ];

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-brand-tint via-background to-muted">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:py-12">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-brand">
              Checkout seguro
            </p>
            <Link
              to="/"
              className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Voltar
            </Link>
          </div>

          <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Falta pouco para você ter acesso ao{" "}
            <span className="text-brand">{PRODUCT_NAME}</span>
          </h1>

          <ul className="mt-6 space-y-2.5">
            {bullets.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm sm:text-base">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={3} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <img
            src={mockupBlindada}
            alt={`Mockup do ${PRODUCT_NAME}`}
            className="mx-auto w-full max-w-sm object-contain drop-shadow-lg lg:max-w-md"
          />
          <div
            className="absolute right-2 top-2 flex size-20 flex-col items-center justify-center rounded-full border-4 border-background bg-brand text-center text-primary-foreground shadow-lg sm:right-4 sm:top-4 sm:size-24"
            aria-hidden="true"
          >
            <Shield className="mb-0.5 size-4 sm:size-5" strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase leading-none tracking-wide sm:text-xs">
              7 dias
            </span>
            <span className="mt-0.5 text-[9px] leading-tight opacity-90 sm:text-[10px]">
              garantia
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
