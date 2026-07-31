import { z } from "zod";
import { isCheckoutBumpId } from "@/components/landing/offer-data";
import { isValidCpf } from "@/lib/checkout-schema";

export const payerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  cpf: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine(isValidCpf, "CPF inválido"),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((d) => d.length === 10 || d.length === 11, "Celular inválido"),
  plan: z.enum(["basico", "completo"]),
  bumpIds: z.array(z.string().refine(isCheckoutBumpId)).max(10),
});

export const pixInputSchema = payerSchema;

export const cardInputSchema = payerSchema.extend({
  token: z.string().min(8).max(256),
  paymentMethodId: z.string().min(2).max(40),
  issuerId: z.string().max(40).optional(),
  installments: z.number().int().min(1).max(12),
});

export const paymentIdSchema = z.object({
  paymentId: z.string().min(1).max(40),
  orderId: z.string().uuid().optional(),
});

export type PixInput = z.input<typeof pixInputSchema>;
export type CardInput = z.input<typeof cardInputSchema>;