import { createMiddleware } from "@tanstack/react-start";

/**
 * Middleware de autenticação à prova de falha.
 *
 * O middleware gerado (`attachSupabaseAuth`) importa o cliente do backend no
 * topo do módulo. Esse cliente LANÇA exceção quando as envs públicas não estão
 * no bundle publicado — e, como ele roda antes de TODA chamada de servidor,
 * derrubava o checkout inteiro ("Missing Supabase environment variable(s)").
 *
 * Aqui o import é dinâmico e envolvido em try/catch: se o cliente não puder ser
 * criado, a chamada segue sem token em vez de quebrar. O app não usa login,
 * então nenhuma função de servidor depende desse token.
 */
export const safeSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    if (typeof window === "undefined") return next();

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) return next({ headers: { Authorization: `Bearer ${token}` } });
    } catch {
      // Sem sessão disponível: segue a chamada sem token.
    }

    return next();
  },
);