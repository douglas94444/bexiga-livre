import { UPGRADE_BUMP_ID, isCheckoutBumpId, type CheckoutBumpId } from "@/components/landing/offer-data";

const PAID_STATUSES = ["aprovado", "approved", "paid"];

export type AccessOrder = {
  plan: "basico" | "completo";
  bumps: CheckoutBumpId[];
  totalCents: number;
  paidAt: string | null;
};

function digits(value: string | null | undefined) {
  return (value ?? "").replace(/\D/g, "");
}

/** Limite simples por e-mail para dificultar tentativa em massa. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60_000;
const MAX_ATTEMPTS = 10;

export function rateLimited(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function findPaidOrder(
  email: string,
  document: string,
): Promise<AccessOrder | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("plan, bumps, total_cents, paid_at, cpf, phone, status, email, created_at")
    .ilike("email", email)
    .in("status", PAID_STATUSES)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw new Error("Não foi possível consultar seu pedido agora.");
  if (!data || data.length === 0) return null;

  const wanted = digits(document);

  const match = data.find((row) => {
    const cpf = digits(row.cpf);
    const phone = digits(row.phone);
    // Pedido sem CPF/telefone salvos: valida apenas pelo e-mail.
    if (!cpf && !phone) return true;
    if (!wanted) return false;
    return (
      (cpf.length > 0 && cpf === wanted) ||
      (phone.length > 0 && (phone === wanted || phone.endsWith(wanted) || wanted.endsWith(phone)))
    );
  });

  if (!match) return null;

  const bumps = (match.bumps ?? []).filter((id): id is CheckoutBumpId =>
    isCheckoutBumpId(id),
  );

  return {
    plan: match.plan === "basico" ? "basico" : "completo",
    bumps: bumps.length > 0 || match.plan === "basico" ? bumps : bumps,
    totalCents: match.total_cents ?? 0,
    paidAt: match.paid_at ?? null,
  };
}

export { UPGRADE_BUMP_ID };