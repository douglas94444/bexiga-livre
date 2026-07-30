import { CtaButton, Reveal, Section } from "./shared";

export function FinalCta() {
  return (
    <Section tone="tint">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[2.75rem]">
            Chega de aceitar isso como normal.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-[1.375rem]">
            Baixe agora o Protocolo Bexiga Blindada™. Acesso imediato por download,
            pagamento único e garantia de 7 dias.
          </p>
          <div className="mt-10">
            <CtaButton>QUERO O PROTOCOLO AGORA</CtaButton>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium tracking-tight">
          Protocolo Bexiga Blindada™
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Este material é educativo e não substitui avaliação, diagnóstico ou
          tratamento médico. Resultados podem variar de pessoa para pessoa. Em
          caso de sintomas, procure seu médico.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Protocolo Bexiga Blindada™
        </p>
      </div>
    </footer>
  );
}
