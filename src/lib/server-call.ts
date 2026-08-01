/**
 * Erros que acontecem ANTES da requisição sair do navegador (inicialização do
 * cliente do backend em middleware). São seguros para repetir: nenhum
 * pagamento chegou a ser criado.
 */
const CLIENT_INIT_ERROR = /Missing Supabase environment variable/i;

export function isClientInitError(error: unknown): boolean {
  return error instanceof Error && CLIENT_INIT_ERROR.test(error.message);
}

/**
 * Executa a chamada e repete UMA vez apenas quando a falha ocorreu antes do
 * envio. Falhas de pagamento reais nunca são repetidas (evita cobrança dupla).
 */
export async function callSafe<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    if (!isClientInitError(error)) throw error;
    console.warn("[checkout] repetindo chamada após falha de inicialização");
    return await run();
  }
}