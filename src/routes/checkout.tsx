import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, CreditCard, Lock, ShieldCheck, User } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CheckoutHero } from "@/components/checkout/CheckoutHero";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { CheckoutTrustBar } from "@/components/checkout/CheckoutTrustBar";
import { UrgencyBar } from "@/components/landing/CountdownTimer";
import {
  GUARANTEE,
  PRODUCT_NAME,
  bumpsTotal,
  checkoutBumps,
  formatBRL,
  parseBumpIds,
  serializeBumpIds,
  type CheckoutBumpId,
} from "@/components/landing/offer-data";
import { plans, type PlanId } from "@/components/landing-v2/v2-offer-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startMercadoPagoCheckout } from "@/lib/mercadopago";
import {
  createEventId,
  persistPurchaseEventId,
  planContentId,
  planContentName,
  setMetaUserData,
  trackAddPaymentInfo,
  trackAddToCart,
  trackInitiateCheckout,
} from "@/lib/meta-pixel";
import { cn } from "@/lib/utils";

type CheckoutSearch = {
  plan: PlanId;
  bumps: string;
};

type PayMethod = "pix" | "card";

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): CheckoutSearch => ({
    plan: search.plan === "basico" ? "basico" : "completo",
    bumps: serializeBumpIds(parseBumpIds(search.bumps ?? search.bump)),
  }),
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: `Finalizar acesso | ${PRODUCT_NAME}` },
      {
        name: "description",
        content: `Finalize seu acesso ao ${PRODUCT_NAME}. Pagamento único com garantia de 7 dias.`,
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { plan, bumps: bumpsParam } = Route.useSearch();
  const initialIds = useMemo(() => parseBumpIds(bumpsParam), [bumpsParam]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedBumps, setSelectedBumps] = useState<CheckoutBumpId[]>(initialIds);
  const [payMethod, setPayMethod] = useState<PayMethod>("pix");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSelectedBumps(initialIds);
  }, [initialIds]);

  const planData = plans[plan];
  const bumpExtra = bumpsTotal(selectedBumps);
  const total = planData.price + bumpExtra;

  const contentIds = useMemo(() => {
    const ids = [planContentId(plan)];
    for (const id of selectedBumps) ids.push(`bump-${id}`);
    return ids;
  }, [plan, selectedBumps]);

  useEffect(() => {
    trackInitiateCheckout({
      content_name: planContentName(plan),
      content_ids: [planContentId(plan)],
      value: planData.price,
      num_items: 1,
    });
  }, [plan, planData.price]);

  function toggleBump(id: CheckoutBumpId) {
    const bump = checkoutBumps.find((b) => b.id === id);
    setSelectedBumps((prev) => {
      const adding = !prev.includes(id);
      if (adding && bump) {
        trackAddToCart({
          content_name: bump.title,
          content_ids: [`bump-${bump.id}`],
          value: bump.price,
        });
      }
      return adding ? [...prev, id] : prev.filter((x) => x !== id);
    });
  }

  function fireAddPaymentInfo() {
    setMetaUserData({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });

    const eventID = createEventId();
    persistPurchaseEventId(eventID);

    trackAddPaymentInfo(
      {
        content_name: planContentName(plan),
        content_ids: contentIds,
        value: total,
        payment_method: payMethod,
      },
      { eventID },
    );
  }

  function goObrigado() {
    fireAddPaymentInfo();
    void navigate({
      to: "/obrigado",
      search: {
        plan,
        bumps: serializeBumpIds(selectedBumps),
        amount: String(total),
      },
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const cpfDigits = cpf.replace(/\D/g, "");
    if (cpfDigits.length !== 11) return;

    setSubmitting(true);
    fireAddPaymentInfo();

    try {
      await startMercadoPagoCheckout({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        document: cpfDigits,
        amount: total,
        bumpIds: selectedBumps,
        payMethod,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <UrgencyBar label="Oferta reservada — encerra em" />
      <CheckoutHero plan={plan} />
      <CheckoutTrustBar />

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-8">
          <CheckoutOrderSummary
            plan={plan}
            selectedBumps={selectedBumps}
            total={total}
            className="mb-6 lg:hidden"
          />

          <form onSubmit={onSubmit} className="space-y-6">
            <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <User className="size-4 text-brand" strokeWidth={2} />
                <h2 className="text-lg font-semibold tracking-tight">Dados pessoais</h2>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="checkout-name">Nome completo</Label>
                  <Input
                    id="checkout-name"
                    name="name"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl text-base"
                    placeholder="Como prefere ser chamada"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-email">E-mail</Label>
                  <Input
                    id="checkout-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl text-base"
                    placeholder="Para receber o acesso"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-cpf">CPF</Label>
                  <Input
                    id="checkout-cpf"
                    name="cpf"
                    required
                    inputMode="numeric"
                    autoComplete="off"
                    value={cpf}
                    onChange={(e) => setCpf(formatCpf(e.target.value))}
                    className="h-12 rounded-xl text-base"
                    placeholder="000.000.000-00"
                    minLength={14}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-phone">Celular / WhatsApp</Label>
                  <Input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className="h-12 rounded-xl text-base"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-brand" strokeWidth={2} />
                <h2 className="text-lg font-semibold tracking-tight">Pagamento</h2>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {(
                  [
                    { id: "pix" as const, label: "PIX" },
                    { id: "card" as const, label: "Cartão de crédito" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPayMethod(tab.id)}
                    className={cn(
                      "rounded-xl border px-3 py-3 text-sm font-semibold tracking-tight transition-colors",
                      payMethod === tab.id
                        ? "border-brand bg-brand-tint text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-brand/40",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {payMethod === "pix" ? (
                <ol className="mt-5 space-y-4">
                  {[
                    {
                      n: "1",
                      title: "Copie os dados de pagamento",
                      body: "Clique em Finalizar pagamento para gerar o QR Code / chave PIX.",
                    },
                    {
                      n: "2",
                      title: "Pague no seu banco",
                      body: "Abra o app do banco, escolha PIX copia e cola e confirme.",
                    },
                    {
                      n: "3",
                      title: "Pronto!",
                      body: "Assim que o pagamento for confirmado, o acesso é liberado no e-mail.",
                    },
                  ].map((step) => (
                    <li key={step.n} className="flex gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-primary-foreground">
                        {step.n}
                      </span>
                      <div>
                        <p className="text-sm font-semibold tracking-tight">{step.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  Ao finalizar, você será redirecionada ao checkout seguro do Mercado Pago
                  para pagar com cartão em até 12x (quando disponível).
                </p>
              )}
            </section>

            <section>
              <h2 className="text-center text-sm font-semibold uppercase tracking-[0.12em] text-brand">
                Ofertas especiais por tempo limitado
              </h2>

              <div className="mt-4 space-y-4">
                {checkoutBumps.map((bump) => {
                  const selected = selectedBumps.includes(bump.id);
                  return (
                    <div
                      key={bump.id}
                      className={cn(
                        "rounded-2xl border p-5 transition-colors",
                        selected
                          ? "border-brand bg-brand-tint"
                          : "border-border bg-background",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleBump(bump.id)}
                        className="flex w-full items-start gap-3 text-left"
                      >
                        <span
                          className={cn(
                            "mt-0.5 grid size-5 shrink-0 place-items-center rounded border",
                            selected
                              ? "border-brand bg-brand text-primary-foreground"
                              : "border-input bg-background",
                          )}
                          aria-hidden="true"
                        >
                          {selected ? (
                            <Check className="size-3" strokeWidth={3} />
                          ) : null}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold tracking-tight text-brand">
                            + {bump.emoji} {bump.title}
                          </p>
                          {bump.pain ? (
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                              {bump.pain}
                            </p>
                          ) : null}
                          <p
                            className={cn(
                              "text-sm leading-relaxed",
                              bump.pain
                                ? "mt-2 text-foreground"
                                : "mt-2 text-muted-foreground",
                            )}
                          >
                            {bump.text}
                          </p>
                          <p className="mt-3 text-sm">
                            <span className="text-destructive line-through">
                              De {formatBRL(bump.compareAt)}
                            </span>{" "}
                            <span className="font-semibold text-brand">
                              Por apenas {formatBRL(bump.price)}
                            </span>
                          </p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBump(bump.id)}
                        className={cn(
                          "mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border text-sm font-semibold tracking-tight transition-colors",
                          selected
                            ? "border-brand bg-brand text-primary-foreground hover:bg-brand-hover"
                            : "border-border bg-background hover:bg-muted",
                        )}
                      >
                        {selected ? "Oferta adicionada" : "Adicionar à oferta"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="space-y-3">
              <p className="text-center text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {formatBRL(total)} à vista no {payMethod === "pix" ? "PIX" : "cartão"}
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-brand px-8 text-base font-semibold uppercase tracking-tight text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.49_0.089_181/0.55)] transition-colors duration-200 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 sm:text-lg"
              >
                {submitting ? "Preparando pagamento…" : "Finalizar pagamento"}
              </button>

              <button
                type="button"
                onClick={goObrigado}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium tracking-tight text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Simular compra e baixar
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Use este botão enquanto o Mercado Pago não está integrado.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="size-4 text-brand" strokeWidth={1.6} />
                Conexão segura · dados protegidos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-brand" strokeWidth={1.6} />
                Acesso imediato por PDF
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-muted/60 p-5 text-center">
              <p className="font-semibold tracking-tight">{GUARANTEE.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {GUARANTEE.body}
              </p>
            </div>

            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              Conteúdo estritamente educativo. Não realiza diagnóstico, não prescreve
              tratamento e não substitui a orientação de um profissional de saúde.
            </p>
          </form>

          <CheckoutOrderSummary
            plan={plan}
            selectedBumps={selectedBumps}
            total={total}
            className="mt-6 hidden lg:mt-0 lg:sticky lg:top-6 lg:block"
          />
        </div>
      </div>
    </main>
  );
}
