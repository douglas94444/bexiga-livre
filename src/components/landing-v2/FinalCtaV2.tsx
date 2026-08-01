import { Lock, ShieldCheck, Zap } from "lucide-react";
import { finalCopy } from "./v2-offer-data";
import { type CtaHandlerProps, V2Accent, V2Cta, V2Section } from "./shared";

export function FinalCtaV2({ onCta }: CtaHandlerProps) {
  return (
    <V2Section tone="dark">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-balance text-[1.9rem] font-semibold leading-tight tracking-[-0.02em] text-primary-foreground sm:text-[2.5rem]">
          Chega de <V2Accent>aceitar</V2Accent> isso como normal.
        </h2>
        <p className="mt-5 text-lg text-primary-foreground/80">{finalCopy.lead}</p>
        <div className="mt-10 flex justify-center">
          <V2Cta
            className="bg-card text-brand shadow-[0_14px_32px_-16px_oklch(0_0_0/0.35)] hover:bg-background hover:text-brand"
            onClick={onCta}
          >
            <Lock className="size-4" strokeWidth={2.2} />
            {finalCopy.cta}
          </V2Cta>
        </div>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-primary-foreground/75">
          <li className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-4" /> Compra segura
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Zap className="size-4" /> Acesso imediato
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Lock className="size-4" /> Privacidade protegida
          </li>
        </ul>
      </div>
    </V2Section>
  );
}

export function FooterV2() {
  return (
    <footer className="border-t border-border bg-background px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-display text-lg font-semibold tracking-tight">
          Protocolo Bexiga Blindada™
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Este material é educativo e não substitui avaliação, diagnóstico ou
          tratamento médico. Resultados podem variar de pessoa para pessoa.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Protocolo Bexiga Blindada™
        </p>
        <p className="mt-3 text-sm">
          <a
            href="/acesso"
            className="text-muted-foreground underline-offset-2 hover:underline"
          >
            Já comprei? Acessar meu material
          </a>
        </p>
      </div>
    </footer>
  );
}
