import { createFileRoute } from "@tanstack/react-router";

/**
 * Métricas públicas de checkout — sem dados pessoais.
 * Útil para monitoramento externo (UptimeRobot, Pingdom, etc.)
 */
export const Route = createFileRoute("/api/public/checkout-metrics")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const since60m = new Date(Date.now() - 60 * 60 * 1000).toISOString();

        const { data: rows24h, error: error24h } = await supabaseAdmin
          .from("orders")
          .select("status, pay_method, total_cents, created_at")
          .gte("created_at", since24h);

        if (error24h) {
          console.error("[checkout-metrics] erro ao consultar pedidos", error24h);
          return new Response(JSON.stringify({ error: "Indisponível" }), {
            status: 503,
            headers: { "content-type": "application/json; charset=utf-8" },
          });
        }

        const rows = rows24h ?? [];
        const total = rows.length;
        const approved = rows.filter((r) => r.status === "aprovado").length;
        const rejected = rows.filter((r) => r.status === "recusado").length;
        const pending = rows.filter((r) => r.status === "pendente" || r.status === "iniciado").length;
        const failureRate = total > 0 ? Math.round((rejected / total) * 1000) / 10 : 0;

        const methodSplit = rows.reduce(
          (acc, row) => {
            acc[row.pay_method] = (acc[row.pay_method] ?? 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const revenueCents = rows
          .filter((r) => r.status === "aprovado")
          .reduce((sum, r) => sum + (r.total_cents ?? 0), 0);

        const rows60m = rows.filter((r) => r.created_at >= since60m);
        const failureRate60m = rows60m.length > 0
          ? Math.round((rows60m.filter((r) => r.status === "recusado").length / rows60m.length) * 1000) / 10
          : 0;

        const lastOrder = rows.length > 0
          ? rows.reduce((latest, row) => (row.created_at > latest.created_at ? row : latest)).created_at
          : null;

        return Response.json({
          total_orders_24h: total,
          approved_orders_24h: approved,
          rejected_orders_24h: rejected,
          pending_orders_24h: pending,
          failure_rate_24h: failureRate,
          failure_rate_60m: failureRate60m,
          revenue_24h_cents: revenueCents,
          payment_method_split: methodSplit,
          last_order_at: lastOrder,
          at: new Date().toISOString(),
        });
      },
    },
  },
});
