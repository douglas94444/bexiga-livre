import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

import { safeSupabaseAuth } from "./supabase-auth-safe";

/**
 * Blindagem contra regressão.
 *
 * `src/start.ts` é reescrito pela integração do Cloud, que reintroduz o
 * middleware gerado `attachSupabaseAuth`. Ele inicializa o cliente do backend
 * no navegador antes de TODA chamada de servidor e lança exceção quando as
 * envs públicas não estão no bundle publicado — derrubando o checkout
 * ("Missing Supabase environment variable(s)").
 *
 * Aqui a lista final é filtrada: o middleware gerado nunca é registrado, e o
 * substituto tolerante a falhas (`safeSupabaseAuth`) entra sempre.
 */
let generatedAttacherDetected = false;

export function sanitizeFunctionMiddleware(
  middleware: readonly unknown[] = [],
): unknown[] {
  const filtered = middleware.filter((entry) => {
    if (entry === attachSupabaseAuth) {
      generatedAttacherDetected = true;
      return false;
    }
    return entry !== safeSupabaseAuth;
  });

  return [...filtered, safeSupabaseAuth];
}

/** Usado pelo health check para detectar a regressão. */
export function isGeneratedAttacherRegistered(): boolean {
  return generatedAttacherDetected;
}