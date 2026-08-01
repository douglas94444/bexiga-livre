import { createFileRoute } from "@tanstack/react-router";

type CheckState = "ok" | "erro" | "alerta";

/**
 * Monitoramento leve para tráfego pago: confirma que app, banco,
 * credenciais de pagamento e saúde do checkout estão vivos.
 * Não expõe segredos nem dados pessoais.
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
          mercadopago_webhook_secret: process.env.MERCADOPAGO_WEBHOOK_SECRET ? "ok" : "alerta",
          banco: "erro",
          iniciados_recentes: "ok",
          rejeicao_recente: "ok",
        };

        // Guarda contra regressão: o middleware do checkout precisa ser o
        // tolerante a falhas. Se o cliente do navegador não puder ser criado,
        // `safeSupabaseAuth` segue sem token em vez de derrubar o pagamento.
        try {
          const { safeSupabaseAuth } = await import("@/lib/supabase-auth-safe");
          const { isGeneratedAttacherRegistered } = await import("@/lib/start-middleware");
          await import("@/start");
          checks.checkout_middleware =
            safeSupabaseAuth && !isGeneratedAttacherRegistered() ? "ok" : "erro";
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

          // Pedidos iniciados há muito tempo podem indicar checkout travado.
          const since30m = new Date(Date.now() - 30 * 60 * 1000).toISOString();
          const { count: iniciados, error: iniciadosError } = await supabaseAdmin
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("status", "iniciado")
            .gte("created_at", since30m);
          if (iniciadosError) {
            console.error("[health] erro ao contar iniciados", iniciadosError);
            checks.iniciados_recentes = "erro";
          } else if ((iniciados ?? 0) > 10) {
            checks.iniciados_recentes = "alerta";
          }

          // Taxa de rejeição nos últimos 60 minutos.
          const since60m = new Date(Date.now() - 60 * 60 * 1000).toISOString();
          const { data: recentRows, error: recentError } = await supabaseAdmin
            .from("orders")
            .select("status")
            .gte("created_at", since60m);
          if (recentError) {
            console.error("[health] erro ao calcular rejeição", recentError);
            checks.rejeicao_recente = "erro";
          } else if (recentRows && recentRows.length > 0) {
            const rejected = recentRows.filter((r) => r.status === "recusado").length;
            const rate = rejected / recentRows.length;
            if (rate > 0.6) checks.rejeicao_recente = "alerta";
          }
        } catch (error) {
          console.error("[health] banco indisponível", error);
        }

        const degraded = Object.values(checks).some((state) => state === "alerta");
        const healthy = Object.values(checks).every((state) => state === "ok");

        const status = healthy ? "ok" : degraded ? "degradado" : "indisponível";
        const statusCode = healthy ? 200 : degraded ? 200 : 503;

        return new Response(
          JSON.stringify({ status, checks, at: new Date().toISOString() }),
          {
            status: statusCode,
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

