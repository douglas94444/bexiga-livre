import { Check, Lock } from "lucide-react";
import mockupBlindada from "@/assets/mockup-blindada-hero.png";
import { SOCIAL_PROOF, heroCopy } from "./v2-offer-data";
import { V2Cta } from "./shared";

export function HeroV2({ onPrimaryCta }: { onPrimaryCta: () => void }) {
  return (
    <header className="relative overflow-hidden px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.95_0.025_150),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="v2-rise text-xs font-semibold uppercase tracking-[0.16em] text-brand">
          {heroCopy.eyebrow}
        </p>
        <p className="v2-rise v2-rise-delay-1 font-display mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {heroCopy.brand}
        </p>
        <h1 className="v2-rise v2-rise-delay-1 font-display mt-4 text-balance text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.5rem]">
          {heroCopy.h1}
        </h1>
        <p className="v2-rise v2-rise-delay-2 mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-[1.15rem]">
          {heroCopy.lead}
        </p>

        <ul className="v2-rise v2-rise-delay-2 mx-auto mt-5 grid max-w-lg grid-cols-2 gap-x-4 gap-y-2 text-left sm:max-w-xl sm:grid-cols-3">
          {heroCopy.bullets.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm font-medium text-foreground sm:text-[0.95rem]"
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-primary-foreground">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="v2-rise v2-rise-delay-2 relative mx-auto mt-6 max-w-5xl sm:mt-8">
        <img
          src={mockupBlindada}
          alt="Protocolo Bexiga Blindada 365™ com método B.A.R.R.E.I.R.A™, app, tablet e entregáveis"
          width={1600}
          height={900}
          fetchPriority="high"
          className="mx-auto h-auto w-full"
        />
      </div>

      <div className="v2-rise v2-rise-delay-3 relative mx-auto mt-6 max-w-3xl text-center sm:mt-8">
        <div className="flex justify-center">
          <V2Cta onClick={onPrimaryCta}>
            <Lock className="size-4 opacity-90" strokeWidth={2.2} />
            {heroCopy.cta}
          </V2Cta>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{heroCopy.micro}</p>
        <p className="mt-5 text-base text-muted-foreground">
          <span className="text-star" aria-hidden="true">
            {SOCIAL_PROOF.ratingLabel}
          </span>{" "}
          <span className="font-medium text-foreground">4,9/5</span> de{" "}
          <span className="font-semibold text-foreground">
            {SOCIAL_PROOF.countLabel}
          </span>
        </p>
      </div>
    </header>
  );
}
