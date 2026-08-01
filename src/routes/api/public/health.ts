import { createFileRoute } from "@tanstack/react-router";

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

        // Guarda contra regressão: o middleware do checkout precisa ser o
        // tolerante a falhas. Se o cliente do navegador não puder ser criado,
        // `safeSupabaseAuth` segue sem token em vez de derrubar o pagamento.
        try {
          const { safeSupabaseAuth } = await import("@/lib/supabase-auth-safe");
          checks.checkout_middleware = safeSupabaseAuth ? "ok" : "erro";
        } catch {
          checks.checkout_middleware = "erro";
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
