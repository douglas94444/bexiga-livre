import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Valida o header x-signature conforme a documentação do Mercado Pago. */
function isValidSignature(
  secret: string,
  signatureHeader: string | null,
  requestId: string | null,
  dataId: string | null,
) {
  if (!signatureHeader || !dataId) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((chunk) => {
      const [key, ...rest] = chunk.split("=");
      return [key.trim(), rest.join("=").trim()];
    }),
  ) as { ts?: string; v1?: string };

  if (!parts.ts || !parts.v1) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId ?? ""};ts:${parts.ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  return safeEqual(parts.v1, expected);
}

export const Route = createFileRoute("/api/public/mercadopago-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
        const url = new URL(request.url);
        const raw = await request.text();

        let body: { type?: string; action?: string; data?: { id?: string } } = {};
        try {
          body = raw ? JSON.parse(raw) : {};
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const dataId = body.data?.id ?? url.searchParams.get("data.id");

        if (secret) {
          const valid = isValidSignature(
            secret,
            request.headers.get("x-signature"),
            request.headers.get("x-request-id"),
            dataId,
          );
          if (!valid) return new Response("Invalid signature", { status: 401 });
        }

        const topic = body.type ?? url.searchParams.get("type");
        if (topic !== "payment" || !dataId) {
          return new Response("ignored", { status: 200 });
        }

        try {
          const { getMpPayment, mapStatus, updateOrder } = await import(
            "@/lib/payments.server"
          );
          const payment = await getMpPayment(dataId);
          const approved = payment.status === "approved";

          await updateOrder(
            {
              id: payment.external_reference ?? null,
              mpPaymentId: payment.id,
            },
            {
              mp_payment_id: String(payment.id),
              status: mapStatus(payment.status),
              status_detail: payment.status_detail,
              paid_at: approved
                ? (payment.date_approved ?? new Date().toISOString())
                : null,
            },
          );
        } catch (error) {
          console.error("[mercadopago webhook] falha ao processar", error);
          return new Response("error", { status: 500 });
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});