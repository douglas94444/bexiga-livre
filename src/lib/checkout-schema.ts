import { z } from "zod";
import type { CheckoutBumpId } from "@/components/landing/offer-data";
import { isCheckoutBumpId } from "@/components/landing/offer-data";
import type { PlanId } from "@/components/landing-v2/v2-offer-data";
import type { PayMethod } from "@/lib/mercadopago";

/** Remove máscara; retorna só dígitos. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Validação oficial dos dígitos verificadores do CPF. */
export function isValidCpf(cpf: string): boolean {
  const digits = digitsOnly(cpf);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === Number(digits[10]);
}

const planIdSchema = z.enum(["basico", "completo"] satisfies [PlanId, PlanId]);
const payMethodSchema = z.enum(["pix", "card"] satisfies [PayMethod, PayMethod]);
const bumpIdSchema = z.string().refine(isCheckoutBumpId, {
  message: "Order bump inválido",
});

export const checkoutFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo")
    .max(80, "Nome muito longo"),
  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido")
    .max(120, "E-mail muito longo"),
  cpf: z
    .string()
    .trim()
    .refine((v) => isValidCpf(v), "CPF inválido"),
  phone: z
    .string()
    .trim()
    .refine((v) => {
      const d = digitsOnly(v);
      return d.length === 10 || d.length === 11;
    }, "Informe um celular válido com DDD"),
  plan: planIdSchema,
  bumpIds: z.array(bumpIdSchema),
  payMethod: payMethodSchema,
});

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;

export type CheckoutFormErrors = Partial<
  Record<keyof CheckoutFormInput | "form", string>
>;

export function parseCheckoutForm(
  input: unknown,
):
  | { ok: true; data: CheckoutFormInput }
  | { ok: false; errors: CheckoutFormErrors } {
  const result = checkoutFormSchema.safeParse(input);
  if (result.success) {
    return {
      ok: true,
      data: {
        ...result.data,
        bumpIds: result.data.bumpIds as CheckoutBumpId[],
      },
    };
  }

  const errors: CheckoutFormErrors = {};
  for (const issue of result.error.issues) {
    const key = (issue.path[0] as keyof CheckoutFormInput | undefined) ?? "form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
