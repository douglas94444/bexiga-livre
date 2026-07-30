import { Star } from "lucide-react";
import { CountdownTimer } from "@/components/landing/CountdownTimer";
import { SOCIAL_PROOF } from "./v2-offer-data";

export function PromoBar() {
  return (
    <div className="border-b border-primary-foreground/10 bg-brand px-4 py-2.5 text-center text-primary-foreground">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[0.75rem] font-medium tracking-[0.04em] sm:text-sm">
        <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>{SOCIAL_PROOF.countLabel} já transformaram suas rotinas</span>
          <span className="inline-flex text-star" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3 fill-current" strokeWidth={0} />
            ))}
          </span>
        </span>
        <span className="hidden text-primary-foreground/40 sm:inline" aria-hidden="true">
          ·
        </span>
        <span className="inline-flex items-center gap-1.5">
          Encerra em{" "}
          <CountdownTimer
            className="text-primary-foreground"
            digitClassName="bg-primary-foreground/15 text-primary-foreground"
          />
        </span>
        <a
          href="#precos"
          className="rounded-full bg-primary-foreground/15 px-3 py-0.5 font-semibold text-primary-foreground underline-offset-2 hover:bg-primary-foreground/25 hover:underline"
        >
          Ver preços
        </a>
      </div>
    </div>
  );
}
