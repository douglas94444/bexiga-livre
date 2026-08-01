import { createFileRoute } from "@tanstack/react-router";
import { startInstance } from "@/start";

type CheckState = "ok" | "erro";

/**
 * Monitoramento leve para tráfego pago: confirma que app, banco e
 * credenciais de pagamento estão vivos. Não expõe segredos.
 */
export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        const checks: Record<string, CheckState> = {
          app: "ok",
          checkout_middleware: "ok",
          mercadopago: process.env.MERCADOPAGO_ACCESS_TOKEN ? "ok" : "erro",
          mercadopago_public_key: process.env.MERCADOPAGO_PUBLIC_KEY ? "ok" : "erro",
          banco: "erro",
        };

        // Guarda contra regressão: o middleware gerado do backend não pode
        // voltar a ser registrado, senão o checkout quebra no site publicado.
        try {
          const options = (startInstance as unknown as {
            getOptions?: () => { functionMiddleware?: unknown[] };
          }).getOptions?.();
          const registered = options?.functionMiddleware ?? [];
          const unsafe = registered.some((mw) =>
            String((mw as { options?: { client?: unknown } })?.options?.client ?? "")
              .includes("auth-attacher"),
          );
          if (unsafe) checks.checkout_middleware = "erro";
        } catch {
          // inspeção indisponível: não derruba o health check
        }

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin
            .from("orders")
            .select("id", { count: "exact", head: true });
          checks.banco = error ? "erro" : "ok";
          if (error) console.error("[health] banco indisponível", error);
        } catch (error) {
          console.error("[health] banco indisponível", error);
        }

        const healthy = Object.values(checks).every((state) => state === "ok");

        return new Response(
          JSON.stringify({ status: healthy ? "ok" : "degradado", checks, at: new Date().toISOString() }),
          {
            status: healthy ? 200 : 503,
            headers: {
              "content-type": "application/json; charset=utf-8",
              "cache-control": "no-store",
            },
          },
        );
      },
    },
  },
});
