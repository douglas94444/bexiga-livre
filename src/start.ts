import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { withSecurityHeaders } from "./lib/security-headers";
import { safeSupabaseAuth } from "./lib/supabase-auth-safe";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
// NÃO registrar `attachSupabaseAuth` (@/integrations/supabase/auth-attacher).
// O app não usa login: nenhum server fn exige autenticação. O middleware
// gerado inicializa o cliente do backend no navegador e quebra TODAS as
// chamadas de servidor quando as envs públicas faltam no build publicado
// (checkout ficava "indisponível"). Use sempre `safeSupabaseAuth`, que faz o
// mesmo de forma tolerante a falhas.

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return withSecurityHeaders(
      new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
    );
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth, safeSupabaseAuth],
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
