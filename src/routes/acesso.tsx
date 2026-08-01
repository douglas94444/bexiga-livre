import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Check, Loader2, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";
import { DeliverablesList } from "@/components/access/DeliverablesList";
import {
  UPGRADE_BUMP_ID,
  bonuses,
  checkoutBumps,
  formatBRL,
  mainDeliverables,
} from "@/components/landing/offer-data";
import { findOrderAccess } from "@/lib/access.functions";

export const Route = createFileRoute("/acesso")({
  component: AcessoPage,
  head: () => ({
    meta: [
      { title: "Acessar meu material | Protocolo Bexiga Blindada™" },
      {
        name: "description",
        content:
          "Já comprou? Informe o e-mail e o CPF ou telefone do pedido para baixar novamente o Protocolo Bexiga Blindada™.",
      },
      { property: "og:title", content: "Acessar meu material" },
      {
        property: "og:description",
        content: "Recupere o acesso aos PDFs do seu pedido.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AcessoPage() {
  const [email, setEmail] = useState("");
  const [document, setDocument] = useState("");
  const findAccess = useServerFn(findOrderAccess);

  const mutation = useMutation({
    mutationFn: (input: { email: string; document: string }) =>
      findAccess({ data: input }),
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate({ email: email.trim(), document: document.trim() });
  }

  const result = mutation.data;
  const order = result?.found ? result.order : null;
  const showFull =
    order !== null &&
    (order.plan === "completo" || order.bumps.includes(UPGRADE_BUMP_ID));
  const extraBumps = order
    ? checkoutBumps.filter(
        (b) => order.bumps.includes(b.id) && b.id !== UPGRADE_BUMP_ID,
      )
    : [];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-5 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-brand">
          Área do comprador
        </p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Acessar meu material
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Informe o e-mail usado na compra e o CPF ou telefone do pedido para
          liberar os downloads.
        </p>

        {order ? (
          <section className="mt-8">
            <div className="flex items-center gap-2 rounded-2xl border border-brand/30 bg-brand-tint px-5 py-4 text-sm font-medium text-brand">
              <Check className="size-4 shrink-0" strokeWidth={3} />
              Pedido localizado — {formatBRL(order.totalCents / 100)}
            </div>

            <div className="mt-6">
              <DeliverablesList bumpIds={order.bumps} />
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-border bg-muted p-6 sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight">
                O que você recebeu
              </h2>
              <ul className="mt-4 space-y-2.5">
                {mainDeliverables.map((item) => (
                  <li key={item.id} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={3} />
                    <span>
                      <span className="font-medium">PDF — </span>
                      {item.title}
                    </span>
                  </li>
                ))}
                {showFull
                  ? bonuses.map((bonus) => (
                      <li
                        key={bonus.title}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={3} />
                        <span>
                          {bonus.label} — {bonus.title}
                        </span>
                      </li>
                    ))
                  : null}
                {extraBumps.map((bump) => (
                  <li key={bump.id} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={3} />
                    <span>
                      {bump.emoji} {bump.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => mutation.reset()}
              className="mt-6 text-sm text-muted-foreground underline-offset-2 hover:underline"
            >
              Consultar outro pedido
            </button>
          </section>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="acesso-email"
                className="text-sm font-medium tracking-tight"
              >
                E-mail da compra
              </label>
              <input
                id="acesso-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="mt-2 min-h-14 w-full rounded-2xl border border-border bg-background px-5 text-base outline-none transition-colors focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label
                htmlFor="acesso-doc"
                className="text-sm font-medium tracking-tight"
              >
                CPF ou telefone do pedido
              </label>
              <input
                id="acesso-doc"
                type="text"
                inputMode="numeric"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                placeholder="000.000.000-00 ou (00) 00000-0000"
                className="mt-2 min-h-14 w-full rounded-2xl border border-border bg-background px-5 text-base outline-none transition-colors focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-8 text-base font-semibold tracking-tight text-primary-foreground transition-colors hover:bg-brand-hover disabled:opacity-70 sm:text-lg"
            >
              {mutation.isPending ? (
                <Loader2 className="size-5 animate-spin" strokeWidth={2} />
              ) : (
                <Lock className="size-4 opacity-90" strokeWidth={2.2} />
              )}
              Liberar meu material
            </button>

            {mutation.isError ? (
              <p className="rounded-2xl border border-border bg-muted px-5 py-4 text-sm text-muted-foreground">
                Não conseguimos consultar agora. Tente novamente em instantes.
              </p>
            ) : null}

            {result && !result.found ? (
              <p className="rounded-2xl border border-border bg-muted px-5 py-4 text-sm text-muted-foreground">
                Não localizamos um pedido pago com esses dados. Confira o e-mail
                usado na compra ou tente o outro documento (CPF ou telefone).
              </p>
            ) : null}
          </form>
        )}

        <div className="mt-10 flex justify-center gap-4 text-sm">
          <Link to="/" className="text-muted-foreground underline-offset-2 hover:underline">
            Ir para o início
          </Link>
          <Link
            to="/checkout"
            className="text-muted-foreground underline-offset-2 hover:underline"
          >
            Ainda não comprei
          </Link>
        </div>
      </div>
    </main>
  );
}