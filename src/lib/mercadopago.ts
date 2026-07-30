import { toast } from "sonner";
import type { CheckoutBumpId } from "@/components/landing/offer-data";

export type MercadoPagoCheckoutInput = {
  email: string;
  name: string;
  phone?: string;
  /** CPF só dígitos */
  document?: string;
  amount: number;
  bumpIds: CheckoutBumpId[];
  payMethod?: "pix" | "card";
};

/**
 * TODO: integrar Mercado Pago — criar preferência no backend e redirecionar
 * para o checkout (PIX / cartão).
 */
export async function startMercadoPagoCheckout(input: MercadoPagoCheckoutInput) {
  console.info("[MercadoPago stub] checkout iniciado", input);

  toast.message("Checkout preparado — integrar Mercado Pago", {
    description:
      "Os dados do pedido estão prontos. Plugue a preferência do Mercado Pago para concluir o pagamento.",
  });

  return { ok: false as const, reason: "not_integrated" as const };
}
