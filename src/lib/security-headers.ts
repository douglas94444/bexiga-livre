/**
 * Headers de hardening aplicados em todas as respostas SSR.
 * CSP permite Meta Pixel, Google Fonts e scripts/estilos inline do app.
 */
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' https://connect.facebook.net https://sdk.mercadopago.com https://http2.mlstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://www.facebook.com https://connect.facebook.net https://*.facebook.com https://api.mercadopago.com https://*.mercadopago.com https://*.mercadolibre.com https://www.mercadolibre.com",
    "frame-src 'self' https://sdk.mercadopago.com https://*.mercadopago.com https://*.mercadolibre.com https://www.mercadolibre.com",
  ].join("; "),
};

/** Clona a Response e aplica os headers de segurança (imutável-safe). */
export function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
