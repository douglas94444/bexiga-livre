import { Check, Lock, Zap } from "lucide-react";
import mockupBlindada from "@/assets/mockup-blindada-hero.png";
import {
  offerStackChecklist,
  offerStackCopy,
  offerStackGrid,
} from "./v2-offer-data";
import { type CtaHandlerProps, V2Accent, V2Section, V2Title } from "./shared";
import { cn } from "@/lib/utils";

export function WhatYouGet({ onCta }: CtaHandlerProps) {
  return (
    <V2Section tone="muted">
      <V2Title>
        Tudo o que você vai <V2Accent>receber</V2Accent>
      </V2Title>

      <div className="mx-auto mt-10 max-w-2xl rounded-[1.75rem] bg-brand px-5 py-10 text-primary-foreground shadow-[0_28px_60px_-36px_oklch(0.22_0.05_155/0.7)] sm:px-10 sm:py-12">
        <p className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-brand-soft/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground">
          <Zap className="size-3.5" strokeWidth={2.4} fill="currentColor" />
          {offerStackCopy.badge}
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
          <img
            src={mockupBlindada}
            alt="Protocolo Bexiga Blindada 365™ com método B.A.R.R.E.I.R.A™, app, tablet e entregáveis"
            width={1600}
            height={900}
            loading="lazy"
            className="mx-auto h-auto w-full"
          />
        </div>

        <ul className="mt-10">
          {offerStackChecklist.map((item, i) => (
            <li
              key={item}
              className={cn(
                "flex items-start gap-3 py-3.5 text-[0.95rem] leading-snug sm:text-base",
                i > 0 && "border-t border-brand-soft/35",
              )}
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-primary-foreground">
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-brand-soft/35 pt-8">
          {offerStackGrid.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm leading-snug text-primary-foreground/90"
            >
              <span className="mt-0.5 size-3.5 shrink-0 rounded-[3px] border-2 border-brand-soft bg-transparent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onCta}
          className="mt-10 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[oklch(0.97_0.01_145)] px-8 text-base font-semibold tracking-[-0.01em] text-brand shadow-[0_14px_32px_-16px_oklch(0_0_0/0.35)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:translate-y-0 sm:text-lg"
        >
          <Lock className="size-4 opacity-90" strokeWidth={2.2} />
          {offerStackCopy.cta}
        </button>
      </div>
    </V2Section>
  );
}
