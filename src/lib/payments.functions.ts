import { createServerFn } from "@tanstack/react-start";
import {
  cardInputSchema,
  paymentIdSchema,
  pixInputSchema,
} from "@/lib/payment-schemas";
import type { CardPaymentResult, PixPaymentResult } from "@/lib/payment-types";

export const getPaymentConfig = createServerFn({ method: "GET" }).handler(
  async () => {
    const { mpPublicKey } = await import("@/lib/payments.server");
    return { publicKey: mpPublicKey() };
  },
);

export const createPixPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => pixInputSchema.parse(input))
  .handler(async ({ data }): Promise<PixPaymentResult> => {
    const {
      amountFor,
      insertOrder,
      mpFetch,
      splitName,
      updateOrder,
      mapStatus,
    } = await import("@/lib/payments.server");

    const amount = amountFor(data.plan, data.bumpIds);
    const orderId = await insertOrder({
      ...data,
      payMethod: "pix",
      totalCents: Math.round(amount * 100),
    });

    const payment = await mpFetch<{
      id: number;
      status: string;
      date_of_expiration?: string | null;
      point_of_interaction?: {
        transaction_data?: {
          qr_code?: string;
          qr_code_base64?: string;
          ticket_url?: string;
        };
      };
    }>("/v1/payments", {
      method: "POST",
      idempotencyKey: `pix-${orderId ?? crypto.randomUUID()}`,
      body: JSON.stringify({
        transaction_amount: amount,
        description: "Protocolo Bexiga Blindada",
        payment_method_id: "pix",
        external_reference: orderId ?? undefined,
        payer: {
          email: data.email,
          ...splitName(data.name),
          identification: { type: "CPF", number: data.cpf },
        },
      }),
    });

    await updateOrder(
      { id: orderId },
      {
        mp_payment_id: String(payment.id),
        status: mapStatus(payment.status),
      },
    );

    const tx = payment.point_of_interaction?.transaction_data;
    return {
      ok: true,
      paymentId: String(payment.id),
      status: payment.status,
      qrCode: tx?.qr_code ?? "",
      qrCodeBase64: tx?.qr_code_base64 ?? "",
      ticketUrl: tx?.ticket_url,
      expiresAt: payment.date_of_expiration ?? null,
    };
  });

export const createCardPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => cardInputSchema.parse(input))
  .handler(async ({ data }): Promise<CardPaymentResult> => {
    const {
      amountFor,
      insertOrder,
      mpFetch,
      splitName,
      updateOrder,
      mapStatus,
    } = await import("@/lib/payments.server");

    const amount = amountFor(data.plan, data.bumpIds);
    const orderId = await insertOrder({
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      phone: data.phone,
      plan: data.plan,
      bumpIds: data.bumpIds,
      payMethod: "card",
      totalCents: Math.round(amount * 100),
    });

    const payment = await mpFetch<{
      id: number;
      status: string;
      status_detail: string;
    }>("/v1/payments", {
      method: "POST",
      idempotencyKey: `card-${orderId ?? crypto.randomUUID()}`,
      body: JSON.stringify({
        transaction_amount: amount,
        token: data.token,
        description: "Protocolo Bexiga Blindada",
        installments: data.installments,
        payment_method_id: data.paymentMethodId,
        issuer_id: data.issuerId,
        external_reference: orderId ?? undefined,
        payer: {
          email: data.email,
          ...splitName(data.name),
          identification: { type: "CPF", number: data.cpf },
        },
      }),
    });

    const approved = payment.status === "approved";
    await updateOrder(
      { id: orderId },
      {
        mp_payment_id: String(payment.id),
        status: mapStatus(payment.status),
        status_detail: payment.status_detail,
        paid_at: approved ? new Date().toISOString() : null,
      },
    );

    return {
      ok: true,
      paymentId: String(payment.id),
      status: payment.status,
      statusDetail: payment.status_detail,
      approved,
    };
  });

export const getPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => paymentIdSchema.parse(input))
  .handler(async ({ data }) => {
    const { getMpPayment, mapStatus, updateOrder } = await import(
      "@/lib/payments.server"
    );

    const payment = await getMpPayment(data.paymentId);
    const status = mapStatus(payment.status);
    const approved = payment.status === "approved";

    await updateOrder(
      { id: data.orderId ?? null, mpPaymentId: payment.id },
      {
        status,
        status_detail: payment.status_detail,
        paid_at: approved ? (payment.date_approved ?? new Date().toISOString()) : null,
      },
    );

    return {
      status: payment.status,
      statusDetail: payment.status_detail,
      approved,
    };
  });