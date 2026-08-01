import ogImageAsset from "@/assets/mockup-blindada-hero.png";

export const SITE_NAME = "Protocolo Bexiga Blindada™";

export const DEFAULT_TITLE =
  "Protocolo Bexiga Blindada™ | Infecção Urinária Recorrente";

export const DEFAULT_DESCRIPTION =
  "Chega de viver com medo da próxima infecção urinária. Protocolo Bexiga Blindada™ com 365 estratégias, acesso imediato e garantia de 7 dias — conteúdo educativo, sem substituir o médico.";

/** Path resolvido pelo Vite (hash em produção). Prefira absoluteUrl() para OG. */
export const OG_IMAGE_PATH = ogImageAsset;

/** Domínio público do projeto (fallback quando VITE_SITE_URL não está definido). */
export const SITE_URL = "https://protocolobexigablindada.lovable.app";

export function siteOrigin(): string {
  const raw = import.meta.env.VITE_SITE_URL;
  if (typeof raw === "string" && raw.trim()) {
    return raw.trim().replace(/\/$/, "");
  }
  return SITE_URL;
}

/** Monta URL absoluta quando VITE_SITE_URL existe; senão devolve o path. */
export function absoluteUrl(path = "/"): string {
  const normalized =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : path.startsWith("/")
        ? path
        : `/${path}`;
  const origin = siteOrigin();
  if (!origin) return normalized;
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  return `${origin}${normalized}`;
}

export function absoluteOgImage(): string {
  const path = OG_IMAGE_PATH.startsWith("/")
    ? OG_IMAGE_PATH
    : `/${OG_IMAGE_PATH}`;
  return absoluteUrl(path);
}
