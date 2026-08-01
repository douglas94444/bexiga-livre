import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, CreditCard, Lock, ShieldCheck, User } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { CardForm, type CardTokenPayload } from "@/components/checkout/CardForm";
import { PixPanel } from "@/components/checkout/PixPanel";
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
  type BumpsSearchParam,
  type CheckoutBumpId,
} from "@/components/landing/offer-data";
import { plans, type PlanId } from "@/components/landing-v2/v2-offer-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  digitsOnly,
  parseCheckoutForm,
  type CheckoutFormErrors,
} from "@/lib/checkout-schema";
import { cardStatusMessage, type PayMethod, type PixPaymentResult } from "@/lib/payment-types";
import {
  createCardPayment,
  createPixPayment,
  getPaymentConfig,
  getPaymentStatus,
} from "@/lib/payments.functions";
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
import { toast } from "sonner";

type CheckoutSearch = {
  plan: PlanId;
  bumps: BumpsSearchParam;
};

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
  loader: async () => {
    try {
      return await getPaymentConfig();
    } catch {
      return { publicKey: "", available: false };
    }
  },
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
  const { plan, bumps: bumpsParam }: CheckoutSearch = Route.useSearch();
  const initialIds = useMemo(() => parseBumpIds(bumpsParam), [bumpsParam]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedBumps, setSelectedBumps] = useState<CheckoutBumpId[]>(initialIds);
  const [payMethod, setPayMethod] = useState<PayMethod>("pix");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<CheckoutFormErrors>({});
  const isDev = import.meta.env.DEV;
  const initialConfig = Route.useLoaderData();
  const [publicKey, setPublicKey] = useState(initialConfig.publicKey);
  const [cardStatus, setCardStatus] = useState<
    "loading" | "ready" | "unavailable"
  >(initialConfig.publicKey ? "ready" : "loading");
  const [pix, setPix] = useState<PixPaymentResult | null>(null);
  const [checkingPix, setCheckingPix] = useState(false);
  const tokenizerRef = useRef<(() => Promise<CardTokenPayload>) | null>(null);

  const loadConfig = useServerFn(getPaymentConfig);
  const startPix = useServerFn(createPixPayment);
  const payWithCard = useServerFn(createCardPayment);
  const checkStatus = useServerFn(getPaymentStatus);

  const retryConfig = useCallback(async () => {
    setCardStatus("loading");
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const config = await loadConfig();
        if (config.publicKey) {
          setPublicKey(config.publicKey);
          setCardStatus("ready");
          return;
        }
        setCardStatus("unavailable");
        return;
      } catch {
        if (attempt === 1) setCardStatus("unavailable");
      }
    }
  }, [loadConfig]);

  useEffect(() => {
    if (publicKey) return;
    void retryConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (!import.meta.env.DEV) return;
    fireAddPaymentInfo();
    void navigate({
      to: "/obrigado",
      search: {
        plan,
        bumps: serializeBumpIds(selectedBumps),
      },
    });
  }

  function goToThankYou() {
    void navigate({
      to: "/obrigado",
      search: { plan, bumps: serializeBumpIds(selectedBumps) },
    });
  }

  // Polling do PIX: confirma o pagamento e leva para a página de obrigado.
  useEffect(() => {
    if (!pix) return;
    let cancelled = false;
    const deadline = Date.now() + 30 * 60 * 1000;

    const interval = setInterval(async () => {
      if (cancelled || Date.now() > deadline) {
        clearInterval(interval);
        return;
      }
      setCheckingPix(true);
      try {
        const result = await checkStatus({ data: { paymentId: pix.paymentId } });
        if (!cancelled && result.approved) {
          clearInterval(interval);
          toast.success("Pagamento confirmado!");
          goToThankYou();
        }
      } catch {
        // silencioso: tenta de novo no próximo ciclo
      } finally {
        if (!cancelled) setCheckingPix(false);
      }
    }, 4000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pix]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const parsed = parseCheckoutForm({
      name,
      email,
      cpf,
      phone,
      plan,
      bumpIds: selectedBumps,
      payMethod,
    });

    if (!parsed.ok) {
      setFieldErrors(parsed.errors);
      const first =
        parsed.errors.name ??
        parsed.errors.email ??
        parsed.errors.cpf ??
        parsed.errors.phone ??
        parsed.errors.form ??
        "Revise os dados do formulário";
      toast.error(first);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    fireAddPaymentInfo();

    try {
      const payer = {
        name: parsed.data.name,
        email: parsed.data.email,
        cpf: digitsOnly(parsed.data.cpf),
        phone: digitsOnly(parsed.data.phone),
        plan,
        bumpIds: parsed.data.bumpIds,
      };

      if (parsed.data.payMethod === "pix") {
        const result = await startPix({ data: payer });
        setPix(result);
        toast.success("PIX gerado — pague para liberar o acesso.");
        return;
      }

      if (!tokenizerRef.current) {
        toast.error("Preencha os dados do cartão.");
        return;
      }

      const card = await tokenizerRef.current();
      const result = await payWithCard({ data: { ...payer, ...card } });

      if (result.approved) {
        toast.success("Pagamento aprovado!");
        goToThankYou();
        return;
      }

      toast.error(cardStatusMessage(result.statusDetail));
    } catch (error) {
      console.error("[checkout] falha no pagamento", error);
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Não foi possível processar o pagamento. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <UrgencyBar label="Oferta reservada — encerra em" />
      <CheckoutHero plan={plan} selectedBumps={selectedBumps} />
      <CheckoutTrustBar />

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-8">
          <CheckoutOrderSummary
            plan={plan}
            selectedBumps={selectedBumps}
            total={total}
            className="mb-6 lg:hidden"
          />

          {pix ? (
            <div className="space-y-6">
              <PixPanel
                qrCode={pix.qrCode}
                qrCodeBase64={pix.qrCodeBase64}
                amount={total}
                expiresAt={pix.expiresAt}
                checking={checkingPix}
              />
              <button
                type="button"
                onClick={() => setPix(null)}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium tracking-tight text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Voltar e alterar os dados
              </button>
            </div>
          ) : (
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
                    onChange={(e) => {
                      setName(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    aria-invalid={Boolean(fieldErrors.name)}
                    className="h-12 rounded-xl text-base"
                    placeholder="Como prefere ser chamada"
                  />
                  {fieldErrors.name ? (
                    <p className="text-sm text-destructive">{fieldErrors.name}</p>
                  ) : null}
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    aria-invalid={Boolean(fieldErrors.email)}
                    className="h-12 rounded-xl text-base"
                    placeholder="Para receber o acesso"
                  />
                  {fieldErrors.email ? (
                    <p className="text-sm text-destructive">{fieldErrors.email}</p>
                  ) : null}
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
                    onChange={(e) => {
                      setCpf(formatCpf(e.target.value));
                      setFieldErrors((prev) => ({ ...prev, cpf: undefined }));
                    }}
                    aria-invalid={Boolean(fieldErrors.cpf)}
                    className="h-12 rounded-xl text-base"
                    placeholder="000.000.000-00"
                    minLength={14}
                  />
                  {fieldErrors.cpf ? (
                    <p className="text-sm text-destructive">{fieldErrors.cpf}</p>
                  ) : null}
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
                    onChange={(e) => {
                      setPhone(formatPhone(e.target.value));
                      setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    aria-invalid={Boolean(fieldErrors.phone)}
                    className="h-12 rounded-xl text-base"
                    placeholder="(00) 00000-0000"
                  />
                  {fieldErrors.phone ? (
                    <p className="text-sm text-destructive">{fieldErrors.phone}</p>
                  ) : null}
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
                <CardForm
                  publicKey={publicKey}
                  amount={total}
                  cpfDigits={digitsOnly(cpf)}
                  status={cardStatus}
                  onRetry={() => void retryConfig()}
                  tokenizerRef={tokenizerRef}
                />
              )}
            </section>

            <section>
              <h2 className="text-center text-sm font-semibold uppercase tracking-[0.12em] text-brand">
                Ofertas especiais por tempo limitado
              </h2>

              <div className="mt-4 space-y-4">
                {checkoutBumps
                  .filter((bump) => !bump.upgrade)
                  .map((bump) => {
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

              {isDev ? (
                <>
                  <button
                    type="button"
                    onClick={goObrigado}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-medium tracking-tight text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Simular compra e baixar (dev)
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    Disponível só em desenvolvimento — bypass do gateway.
                  </p>
                </>
              ) : null}
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
          )}

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
