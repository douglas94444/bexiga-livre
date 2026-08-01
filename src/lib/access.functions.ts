import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AccessOrder } from "@/lib/access.server";

const accessInputSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  document: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => v ?? ""),
});

export type AccessResult =
  | { found: true; order: AccessOrder }
  | { found: false };

export const findOrderAccess = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => accessInputSchema.parse(input))
  .handler(async ({ data }): Promise<AccessResult> => {
    const { findPaidOrder, rateLimited } = await import("@/lib/access.server");

    // Atraso fixo: mesma latência para acerto e erro.
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (rateLimited(data.email)) {
      throw new Error("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
    }

    const order = await findPaidOrder(data.email, data.document);
    return order ? { found: true, order } : { found: false };
  });