import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { CheckoutBumpId } from "@/components/landing/offer-data";
import { planTotal, type PlanId } from "@/components/landing-v2/v2-offer-data";
import type { PayMethod } from "@/lib/payment-types";

const MP_API = "https://api.mercadopago.com";
const MP_TIMEOUT_MS = 20_000;
const MP_MAX_ATTEMPTS = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Reexecuta operações de banco que falharam por instabilidade momentânea. */
async function withRetry<T>(label: string, run: () => Promise<T>, attempts = 3): Promise<T | null> {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      console.error(`[${label}] tentativa ${attempt}/${attempts} falhou`, error);
      if (attempt === attempts) return null;
      await sleep(250 * attempt);
    }
  }
  return null;
}

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

  // Só é seguro repetir requisições idempotentes (GET ou POST com chave de idempotência).
  const method = (rest.method ?? "GET").toUpperCase();
  const retryable = method === "GET" || Boolean(idempotencyKey);
  const maxAttempts = retryable ? MP_MAX_ATTEMPTS : 1;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${MP_API}${path}`, {
        ...rest,
        headers,
        signal: AbortSignal.timeout(MP_TIMEOUT_MS),
      });
      const text = await response.text();
      const json = text ? (JSON.parse(text) as unknown) : {};

      if (!response.ok) {
        const err = json as MpError;
        const detail = err.cause?.[0]?.description ?? err.message ?? response.statusText;
        console.error("[mercadopago] erro", response.status, detail);

        // 429/5xx são instabilidades temporárias: vale repetir.
        if (attempt < maxAttempts && (response.status === 429 || response.status >= 500)) {
          await sleep(400 * attempt);
          continue;
        }
        throw new Error(detail || "Falha ao processar o pagamento.");
      }
      return json as T;
    } catch (error) {
      lastError = error;
      const isNetwork =
        error instanceof DOMException ||
        (error instanceof TypeError && /fetch|network/i.test(error.message));
      if (attempt < maxAttempts && isNetwork) {
        console.error(`[mercadopago] falha de rede (tentativa ${attempt})`, error);
        await sleep(400 * attempt);
        continue;
      }
      throw error instanceof Error
        ? error
        : new Error("Falha ao processar o pagamento.");
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Falha ao processar o pagamento.");
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
  // Nunca bloqueia o pagamento: se o banco falhar, o pedido é reconciliado pelo webhook.
  return withRetry("orders:insert", async () => {
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

    if (error) throw error;
    return data.id;
  });
}

export async function updateOrder(
  match: { id?: string | null; mpPaymentId?: string | number | null },
  patch: { status?: string; status_detail?: string | null; mp_payment_id?: string | null; paid_at?: string | null },
) {
  if (!match.id && !match.mpPaymentId) return;

  await withRetry("orders:update", async () => {
    let query = supabaseAdmin.from("orders").update(patch);
    if (match.id) query = query.eq("id", match.id);
    else query = query.eq("mp_payment_id", String(match.mpPaymentId));

    const { error } = await query;
    if (error) throw error;
    return true;
  });
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