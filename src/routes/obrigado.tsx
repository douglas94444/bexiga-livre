import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Download } from "lucide-react";
import { useEffect, useMemo } from "react";
import {
  bonuses,
  checkoutBumps,
  formatBRL,
  mainDeliverables,
  parseBumpIds,
  serializeBumpIds,
  type BumpsSearchParam,
} from "@/components/landing/offer-data";
import {
  loadMetaUserData,
  loadPurchaseEventId,
  planContentId,
  planContentName,
  setMetaUserData,
  trackPurchaseOnce,
} from "@/lib/meta-pixel";
import { planTotal, type PlanId } from "@/components/landing-v2/v2-offer-data";

type ObrigadoSearch = {
  plan: PlanId;
  bumps: BumpsSearchParam;
};

export const Route = createFileRoute("/obrigado")({
  validateSearch: (search: Record<string, unknown>): ObrigadoSearch => ({
    plan: search.plan === "basico" ? "basico" : "completo",
    bumps: serializeBumpIds(parseBumpIds(search.bumps ?? search.bump)),
  }),
  component: ObrigadoPage,
  head: () => ({
    meta: [
      { title: "Acesso liberado | Protocolo Bexiga Blindada™" },
      {
        name: "description",
        content:
          "Baixe agora o Protocolo Bexiga Blindada™ e as 365 Estratégias + 21 Protocolos Práticos.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function ObrigadoPage() {
  const { plan, bumps: bumpsParam } = Route.useSearch();
  const bumpIds = useMemo(() => parseBumpIds(bumpsParam), [bumpsParam]);
  const selectedBumps = checkoutBumps.filter((b) => bumpIds.includes(b.id));
  const showFull = plan === "completo" || bumpIds.includes(UPGRADE_BUMP_ID);
  /** Valor do pedido recalculado — nunca confiar em ?amount= da URL. */
  const purchaseValue = planTotal(plan, bumpIds);

  useEffect(() => {
    const value = Number.isFinite(purchaseValue) ? purchaseValue : 27;
    const contentIds = [
      planContentId(plan),
      ...bumpIds.map((id) => `bump-${id}`),
    ];

    const userData = loadMetaUserData();
    if (userData) setMetaUserData(userData);

    const eventID = loadPurchaseEventId() ?? undefined;

    trackPurchaseOnce(
      `${plan}_${bumpsParam}_${value}`,
      {
        content_name: planContentName(plan),
        content_ids: contentIds,
        value,
        num_items: contentIds.length,
      },
      eventID ? { eventID } : undefined,
    );
  }, [plan, bumpsParam, bumpIds, purchaseValue]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-5 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-brand">
          Acesso liberado
        </p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Seus materiais estão prontos.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Baixe seus PDFs agora. Guarde esta página — o acesso é vitalício.
        </p>

        <div className="mt-8 space-y-3">
          {mainDeliverables.map((item, index) => (
            <a
              key={item.id}
              href={item.path}
              download={item.fileName}
              className={
                index === 0
                  ? "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-8 text-base font-semibold tracking-tight text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.49_0.089_181/0.55)] transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-lg"
                  : "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-brand/30 bg-brand-tint px-8 text-base font-semibold tracking-tight text-brand transition-colors hover:bg-brand hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-lg"
              }
            >
              <Download className="size-5" strokeWidth={2} />
              Baixar {item.title}
            </a>
          ))}

          {selectedBumps
            .filter((bump) => bump.path && bump.fileName)
            .map((bump) => (
              <a
                key={bump.id}
                href={bump.path}
                download={bump.fileName}
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background px-8 text-base font-semibold tracking-tight text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-lg"
              >
                <Download className="size-5" strokeWidth={2} />
                Baixar {bump.emoji} {bump.title}
              </a>
            ))}
        </div>

        <section className="mt-10 rounded-[1.75rem] border border-border bg-muted p-6 sm:p-8">
          <h2 className="text-lg font-semibold tracking-tight">O que você recebeu</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {showFull ? "Protocolo Completo" : "Protocolo Essencial"}
            {selectedBumps.length > 0
              ? ` + ${selectedBumps.map((b) => b.title).join(", ")}`
              : ""}
            {` · ${formatBRL(purchaseValue)}`}
          </p>

          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand">
              2 produtos principais
            </p>
            <ul className="mt-3 space-y-2.5">
              {mainDeliverables.map((item) => (
                <li key={item.id} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={3} />
                  <span>
                    <span className="font-medium">PDF — </span>
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {showFull ? (
            <div className="mt-5 border-t border-border pt-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand">
                4 bônus exclusivos
              </p>
              <ul className="mt-3 space-y-2">
                {bonuses.map((bonus) => (
                  <li key={bonus.title} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={3} />
                    <span>
                      {bonus.label} — {bonus.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">
              O Protocolo Essencial inclui os 2 PDFs principais. Os 4 bônus fazem parte do
              Protocolo Completo.
            </p>
          )}

          {selectedBumps.length > 0 ? (
            <div className="mt-5 border-t border-border pt-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand">
                Ofertas adicionadas
              </p>
              <ul className="mt-3 space-y-2">
                {selectedBumps.map((bump) => (
                  <li key={bump.id} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={3} />
                    <span>
                      {bump.emoji} {bump.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
          Conteúdo estritamente educativo. Não realiza diagnóstico, não prescreve
          tratamento e não substitui a orientação de um profissional de saúde.
        </p>

        <div className="mt-8 flex justify-center gap-4 text-sm">
          <Link to="/" className="text-muted-foreground underline-offset-2 hover:underline">
            Ir para o início
          </Link>
        </div>
      </div>
    </main>
  );
}
