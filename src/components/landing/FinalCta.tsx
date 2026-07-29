import { CtaButton, Reveal, Section } from "./shared";

export function FinalCta() {
  return (
    <Section tone="tint">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[2.75rem]">
            Chega de organizar sua vida em torno do medo da próxima crise.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-[1.375rem]">
            Recupere sua tranquilidade. Comece hoje.
          </p>
          <div className="mt-10">
            <CtaButton href="#">QUERO VOLTAR A VIVER</CtaButton>
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
          Protocolo Bexiga Livre™
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Conteúdo estritamente educativo. Não realiza diagnóstico, não prescreve
          tratamento e não substitui a orientação de um profissional de saúde.
          Em caso de sintomas, procure seu médico.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Protocolo Bexiga Livre™
        </p>
      </div>
    </footer>
  );
}