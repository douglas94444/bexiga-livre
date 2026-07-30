import { Check, CreditCard, ShieldCheck } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import {
  OFFER_COMPARE_AT,
  OFFER_PRICE,
  bonusTotalValue,
  bonuses,
  formatBRL,
  stackItems,
  stackTotalValue,
} from "./offer-data";
import { CtaButton, Reveal, Section } from "./shared";

export function Offer() {
  const totalValue = stackTotalValue + bonusTotalValue;

  return (
    <Section id="oferta">
      <Reveal>
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-muted p-8 text-center sm:p-14">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand">
            Acesso completo
          </p>
          <h2 className="mt-5 text-balance text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[2.5rem]">
            Protocolo Bexiga Blindada™
          </h2>

          <p className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-base text-muted-foreground">
            <span>Condição especial encerra em</span>
            <CountdownTimer />
          </p>

          <div className="mt-8 flex items-end justify-center gap-3">
            <span className="text-xl text-muted-foreground line-through">
              {formatBRL(OFFER_COMPARE_AT)}
            </span>
            <span className="text-5xl font-semibold tracking-tight text-brand sm:text-6xl">
              {formatBRL(OFFER_PRICE)}
            </span>
          </div>
          <p className="mt-3 text-lg text-muted-foreground">
            Pagamento único · sem assinatura · acesso vitalício
          </p>
          <p className="mt-2 text-base text-muted-foreground">
            Praticamente nada — {formatBRL(OFFER_PRICE)} e uma leitura objetiva.
            O que você realmente tem a perder, continuando exatamente como está,
            é repetir o mesmo ciclo de dor, vergonha e antibiótico.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Valor total do pacote:{" "}
            <span className="line-through">{formatBRL(totalValue)}</span> — hoje{" "}
            {formatBRL(OFFER_PRICE)}
          </p>

          <ul className="mx-auto mt-10 grid max-w-xl gap-3 text-left">
            {stackItems.map((item) => (
              <li key={item.title} className="flex items-start justify-between gap-3 text-base">
                <span className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="min-w-0 leading-snug">
                    <span className="block text-xs font-medium uppercase tracking-[0.12em] text-brand">
                      {item.label}
                    </span>
                    <span className="font-semibold">{item.title}</span>
                  </span>
                </span>
                <span className="shrink-0 text-sm text-muted-foreground line-through">
                  {formatBRL(item.value)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-brand/20 bg-brand-tint/60 p-6 text-left">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-brand">
              Bônus exclusivos
            </p>
              <ul className="mt-4 space-y-3">
              {bonuses.map((bonus) => (
                <li key={bonus.title} className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block text-xs font-medium uppercase tracking-[0.12em] text-brand">
                      {bonus.label}
                    </span>
                    <span className="mt-0.5 block font-semibold tracking-tight">
                      {bonus.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {bonus.text}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm text-muted-foreground line-through">
                    {formatBRL(bonus.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <CtaButton>QUERO MEU PROTOCOLO AGORA</CtaButton>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="size-4 text-brand" strokeWidth={1.6} />
              PIX e cartão via Mercado Pago
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-brand" strokeWidth={1.6} />
              <a href="#garantia" className="underline-offset-2 hover:underline">
                Garantia de 7 dias
              </a>
            </span>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
