import { Lock, Star } from "lucide-react";
import { SOCIAL_PROOF } from "@/components/landing/offer-data";

export function CheckoutTrustBar() {
  return (
    <div className="bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5">
        <p className="inline-flex items-start gap-3 text-xs font-medium uppercase leading-snug tracking-wide sm:text-sm sm:normal-case sm:tracking-normal">
          <Lock className="mt-0.5 size-5 shrink-0 text-brand-soft" strokeWidth={2} />
          <span>
            Coloque seus dados e finalize sua compra para receber o acesso imediato no
            e-mail
          </span>
        </p>
        <p className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold sm:text-sm">
          <span className="inline-flex gap-0.5" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="size-3.5 fill-[var(--star)] text-[var(--star)]"
              />
            ))}
          </span>
          <span>
            {SOCIAL_PROOF.ratingValue.toFixed(1)}/5 — Material bem avaliado
          </span>
        </p>
      </div>
    </div>
  );
}
