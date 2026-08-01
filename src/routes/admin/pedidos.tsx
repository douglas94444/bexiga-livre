import { createFileRoute } from "@tanstack/react-router";
import { formatBRL } from "@/components/landing/offer-data";

/**
 * Página interna de acompanhamento de pedidos.
 * Protegida por um segredo de ambiente (ADMIN_SECRET).
 * Não exibe CPF/telefone. Nome e e-mail são parcialmente mascarados.
 */
export const Route = createFileRoute("/admin/pedidos")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.ADMIN_SECRET;
        if (!secret) {
          return new Response("Not found", { status: 404 });
        }

        const url = new URL(request.url);
        const provided = url.searchParams.get("secret");
        if (provided !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: orders, error } = await supabaseAdmin
          .from("orders")
          .select("id, created_at, status, pay_method, total_cents, name, email, mp_payment_id, status_detail")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) {
          console.error("[admin/pedidos] erro ao consultar pedidos", error);
          return new Response("Erro interno", { status: 500 });
        }

        function maskName(name: string): string {
          const parts = name.trim().split(/\s+/);
          return parts
            .map((part, index) =>
              index === 0 ? `${part[0] ?? ""}***` : `${part[0] ?? ""}***`,
            )
            .join(" ");
        }

        function maskEmail(email: string): string {
          const [user, domain] = email.split("@");
          if (!domain) return "***";
          return `${user.slice(0, 3)}***@${domain}`;
        }

        function statusBadge(status: string): string {
          const colors: Record<string, string> = {
            aprovado: "#0F766E",
            recusado: "#DC2626",
            pendente: "#D97706",
            iniciado: "#6B7280",
            estornado: "#7C3AED",
          };
          return `<span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${colors[status] ?? "#6B7280"};color:white;font-size:12px;font-weight:600;">${status}</span>`;
        }

        const rows = (orders ?? [])
          .map((order) => {
            const date = new Date(order.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
            return `
            <tr>
              <td style="padding:12px;border-bottom:1px solid #E5E7EB;font-size:13px;white-space:nowrap;">${date}</td>
              <td style="padding:12px;border-bottom:1px solid #E5E7EB;">${statusBadge(order.status)}</td>
              <td style="padding:12px;border-bottom:1px solid #E5E7EB;font-size:13px;">${order.pay_method}</td>
              <td style="padding:12px;border-bottom:1px solid #E5E7EB;font-size:13px;white-space:nowrap;">${formatBRL(order.total_cents / 100)}</td>
              <td style="padding:12px;border-bottom:1px solid #E5E7EB;font-size:13px;">${maskName(order.name)}</td>
              <td style="padding:12px;border-bottom:1px solid #E5E7EB;font-size:13px;">${maskEmail(order.email)}</td>
              <td style="padding:12px;border-bottom:1px solid #E5E7EB;font-size:12px;word-break:break-all;">${order.mp_payment_id ?? "—"}</td>
              <td style="padding:12px;border-bottom:1px solid #E5E7EB;font-size:12px;">${order.status_detail ?? "—"}</td>
            </tr>
          `;
          })
          .join("");

        const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pedidos | Protocolo Bexiga Blindada</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; background: #F9FAFB; color: #111827; margin: 0; padding: 24px; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 24px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    th { text-align: left; padding: 14px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B7280; background: #F3F4F6; border-bottom: 1px solid #E5E7EB; }
    td { vertical-align: middle; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Últimos pedidos</h1>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Status</th>
          <th>Meio</th>
          <th>Valor</th>
          <th>Nome</th>
          <th>E-mail</th>
          <th>ID MP</th>
          <th>Detalhe</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="8" style="padding:24px;text-align:center;color:#6B7280;">Nenhum pedido encontrado</td></tr>`}
      </tbody>
    </table>
  </div>
</body>
</html>
        `;

        return new Response(html, {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
