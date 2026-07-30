import { PRODUCT_NAME } from "@/components/landing/offer-data";
import { plans, type PlanId } from "@/components/landing-v2/v2-offer-data";
import type { PayMethod } from "@/lib/mercadopago";

export const META_PIXEL_ID = "1511388837456671";

const USER_DATA_KEY = "meta_user_data";
const EVENT_ID_KEY = "meta_purchase_event_id";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Eventos padrão usados no funil (Pixel). */
export type MetaStandardEvent =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase";

export type MetaPixelParams = {
  content_name?: string;
  content_ids?: string[];
  content_type?: "product" | "product_group";
  value?: number;
  currency?: "BRL";
  num_items?: number;
  payment_method?: PayMethod;
};

export type MetaUserInput = {
  email?: string;
  phone?: string;
  name?: string;
};

/** Dados normalizados para Advanced Matching do Pixel (Meta faz o hash no browser). */
export type MetaAdvancedMatching = {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  country: "br";
  external_id?: string;
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Telefone só dígitos, com DDI 55 (BR) se faltar. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  if (digits.length >= 10 && digits.length <= 11) return `55${digits}`;
  return digits;
}

function stripNamePart(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim();
}

export function splitFullName(name: string): { fn?: string; ln?: string } {
  const cleaned = stripNamePart(name);
  if (!cleaned) return {};
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { fn: parts[0] };
  return { fn: parts[0], ln: parts.slice(1).join(" ") };
}

export function hasMatchableUserData(input: MetaUserInput): boolean {
  return Boolean(input.email?.trim() || input.phone?.trim());
}

export function isMetaUserInput(value: unknown): value is MetaUserInput {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  const keys = ["email", "phone", "name"] as const;
  for (const key of keys) {
    if (key in obj && obj[key] !== undefined && typeof obj[key] !== "string") {
      return false;
    }
  }
  return keys.some((key) => typeof obj[key] === "string" && obj[key].trim().length > 0);
}

export function buildAdvancedMatching(input: MetaUserInput): MetaAdvancedMatching {
  const matching: MetaAdvancedMatching = { country: "br" };

  if (input.email?.trim()) {
    matching.em = normalizeEmail(input.email);
  }
  if (input.phone?.trim()) {
    const ph = normalizePhone(input.phone);
    if (ph) matching.ph = ph;
  }
  if (input.name?.trim()) {
    const { fn, ln } = splitFullName(input.name);
    if (fn) matching.fn = fn;
    if (ln) matching.ln = ln;
  }
  if (matching.em) {
    matching.external_id = matching.em;
  }

  return matching;
}

export function persistMetaUserData(input: MetaUserInput) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(input));
  } catch {
    // ignore
  }
}

export function loadMetaUserData(): MetaUserInput | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(USER_DATA_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isMetaUserInput(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function persistPurchaseEventId(eventId: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(EVENT_ID_KEY, eventId);
  } catch {
    // ignore
  }
}

export function loadPurchaseEventId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(EVENT_ID_KEY);
  } catch {
    return null;
  }
}

export function createEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Atualiza Advanced Matching no Pixel (re-init com user_data). */
export function setMetaUserData(input: MetaUserInput) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  persistMetaUserData(input);
  if (!hasMatchableUserData(input)) return;
  const matching = buildAdvancedMatching(input);
  window.fbq("init", META_PIXEL_ID, matching);
}

export function trackMetaEvent(
  event: MetaStandardEvent,
  params?: MetaPixelParams,
  options?: { eventID?: string },
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (options?.eventID) {
    if (params) window.fbq("track", event, params, { eventID: options.eventID });
    else window.fbq("track", event, {}, { eventID: options.eventID });
    return;
  }
  if (params) window.fbq("track", event, params);
  else window.fbq("track", event);
}

/** SPA: dispara PageView em mudanças de rota (o script inicial já cobre o 1º load). */
export function trackPageView() {
  trackMetaEvent("PageView");
}

export function trackViewContent(params?: {
  content_name?: string;
  content_ids?: string[];
  value?: number;
}) {
  trackMetaEvent("ViewContent", {
    content_name: params?.content_name ?? PRODUCT_NAME,
    content_ids: params?.content_ids ?? ["protocolo-bexiga-blindada"],
    content_type: "product",
    value: params?.value ?? plans.completo.price,
    currency: "BRL",
  });
}

export function trackAddToCart(params: {
  content_name: string;
  content_ids: string[];
  value: number;
}) {
  trackMetaEvent("AddToCart", {
    content_name: params.content_name,
    content_ids: params.content_ids,
    content_type: "product",
    value: params.value,
    currency: "BRL",
  });
}

export function trackInitiateCheckout(params: {
  content_name: string;
  content_ids: string[];
  value: number;
  num_items: number;
}) {
  trackMetaEvent("InitiateCheckout", {
    content_name: params.content_name,
    content_ids: params.content_ids,
    content_type: "product",
    value: params.value,
    currency: "BRL",
    num_items: params.num_items,
  });
}

export function trackAddPaymentInfo(
  params: {
    content_name: string;
    content_ids: string[];
    value: number;
    payment_method?: PayMethod;
  },
  options?: { eventID?: string },
) {
  trackMetaEvent(
    "AddPaymentInfo",
    {
      content_name: params.content_name,
      content_ids: params.content_ids,
      content_type: "product",
      value: params.value,
      currency: "BRL",
      ...(params.payment_method
        ? { payment_method: params.payment_method }
        : {}),
    },
    options,
  );
}

export function trackPurchase(
  params: {
    content_name: string;
    content_ids: string[];
    value: number;
    num_items: number;
  },
  options?: { eventID?: string },
) {
  trackMetaEvent(
    "Purchase",
    {
      content_name: params.content_name,
      content_ids: params.content_ids,
      content_type: "product",
      value: params.value,
      currency: "BRL",
      num_items: params.num_items,
    },
    options,
  );
}

export function planContentId(plan: PlanId) {
  return plan === "basico" ? "protocolo-essencial" : "protocolo-completo";
}

export function planContentName(plan: PlanId) {
  return `${PRODUCT_NAME} — ${plans[plan].name}`;
}

/** Evita Purchase duplicado no Strict Mode / remount. */
export function trackPurchaseOnce(
  key: string,
  params: Parameters<typeof trackPurchase>[0],
  options?: { eventID?: string },
) {
  if (typeof window === "undefined") return;
  const storageKey = `meta_purchase_${key}`;
  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
  } catch {
    // sessionStorage indisponível — dispara mesmo assim
  }
  trackPurchase(params, options);
}
