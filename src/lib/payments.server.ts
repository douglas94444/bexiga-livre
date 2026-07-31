import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { CheckoutBumpId } from "@/components/landing/offer-data";
import { planTotal, type PlanId } from "@/components/landing-v2/v2-offer-data";
import type { PayMethod } from "@/lib/payment-types";

const MP_API = "https://api.mercadopago.com";

export function mpAccessToken(): string {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "Pagamento indisponível: credencial do Mercado Pago não configurada.",
    );
  }
  return token;
}

export function mpPublicKey(): string {
  return process.env.MERCADOPAGO_PUBLIC_KEY ?? "";
}

type MpError = { message?: string; cause?: { description?: string }[] };

export async function mpFetch<T>(
  path: string,
  init: RequestInit & { idempotencyKey?: string } = {},
): Promise<T> {
  const { idempotencyKey, ...rest } = init;
  const headers = new Headers(rest.headers);
  headers.set("Authorization", `Bearer ${mpAccessToken()}`);
  headers.set("Content-Type", "application/json");
  if (idempotencyKey) headers.set("X-Idempotency-Key", idempotencyKey);

  const response = await fetch(`${MP_API}${path}`, { ...rest, headers });
  const text = await response.text();
  const json = text ? (JSON.parse(text) as unknown) : {};

  if (!response.ok) {
    const err = json as MpError;
    const detail = err.cause?.[0]?.description ?? err.message ?? response.statusText;
    console.error("[mercadopago] erro", response.status, detail);
    throw new Error(detail || "Falha ao processar o pagamento.");
  }
  return json as T;
}

/** Valor autoritativo, sempre recalculado no servidor. */
export function amountFor(plan: PlanId, bumpIds: readonly CheckoutBumpId[]) {
  return planTotal(plan, bumpIds);
}

export function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  return {
    first_name: parts[0] ?? "",
    last_name: parts.slice(1).join(" ") || parts[0] || "",
  };
}

export function mapStatus(mpStatus: string) {
  if (mpStatus === "approved") return "aprovado";
  if (mpStatus === "rejected" || mpStatus === "cancelled") return "recusado";
  if (mpStatus === "refunded" || mpStatus === "charged_back") return "estornado";
  return "pendente";
}

export type OrderInput = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  plan: PlanId;
  bumpIds: CheckoutBumpId[];
  payMethod: PayMethod;
  totalCents: number;
};

export async function insertOrder(input: OrderInput): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      phone: input.phone,
      plan: input.plan,
      bumps: input.bumpIds,
      total_cents: input.totalCents,
      pay_method: input.payMethod,
      status: "iniciado",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[orders] falha ao gravar pedido", error);
    return null;
  }
  return data.id;
}

export async function updateOrder(
  match: { id?: string | null; mpPaymentId?: string | number | null },
  patch: { status?: string; status_detail?: string | null; mp_payment_id?: string | null; paid_at?: string | null },
) {
  let query = supabaseAdmin.from("orders").update(patch);
  if (match.id) query = query.eq("id", match.id);
  else if (match.mpPaymentId) query = query.eq("mp_payment_id", String(match.mpPaymentId));
  else return;

  const { error } = await query;
  if (error) console.error("[orders] falha ao atualizar pedido", error);
}

export type MpPayment = {
  id: number;
  status: string;
  status_detail: string;
  external_reference?: string | null;
  date_approved?: string | null;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
    };
  };
  date_of_expiration?: string | null;
};

export async function getMpPayment(paymentId: string) {
  return mpFetch<MpPayment>(`/v1/payments/${encodeURIComponent(paymentId)}`, {
    method: "GET",
  });
}