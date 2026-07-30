import { supabase } from "@/integrations/supabase/client";
import type { CheckoutBumpId } from "@/components/landing/offer-data";
import type { PayMethod } from "@/lib/mercadopago";

export type SaveOrderInput = {
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  plan: string;
  bumpIds: CheckoutBumpId[];
  total: number;
  payMethod: PayMethod;
};

/** Grava o pedido iniciado no banco. Nunca quebra o fluxo de checkout. */
export async function saveOrder(input: SaveOrderInput) {
  try {
    const { error } = await supabase
      .from("orders")
      .insert({
        name: input.name,
        email: input.email,
        cpf: input.cpf ?? null,
        phone: input.phone ?? null,
        plan: input.plan,
        bumps: input.bumpIds,
        total_cents: Math.round(input.total * 100),
        pay_method: input.payMethod,
      });

    if (error) {
      console.error("[orders] falha ao gravar pedido", error);
      return { ok: false as const };
    }
    return { ok: true as const };
  } catch (error) {
    console.error("[orders] erro inesperado", error);
    return { ok: false as const };
  }
}
