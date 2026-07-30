import { PRODUCT_NAME } from "@/components/landing/offer-data";
import { plans, type PlanId } from "@/components/landing-v2/v2-offer-data";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export type MetaPixelParams = Record<
  string,
  string | number | boolean | string[] | Record<string, string | number>[]
>;

export function trackMetaEvent(event: string, params?: MetaPixelParams) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
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

export function trackAddPaymentInfo(params: {
  content_name: string;
  content_ids: string[];
  value: number;
  payment_method?: string;
}) {
  trackMetaEvent("AddPaymentInfo", {
    content_name: params.content_name,
    content_ids: params.content_ids,
    content_type: "product",
    value: params.value,
    currency: "BRL",
    ...(params.payment_method
      ? { payment_method: params.payment_method }
      : {}),
  });
}

export function trackPurchase(params: {
  content_name: string;
  content_ids: string[];
  value: number;
  num_items: number;
}) {
  trackMetaEvent("Purchase", {
    content_name: params.content_name,
    content_ids: params.content_ids,
    content_type: "product",
    value: params.value,
    currency: "BRL",
    num_items: params.num_items,
  });
}

export function planContentId(plan: PlanId) {
  return plan === "basico" ? "protocolo-essencial" : "protocolo-completo";
}

export function planContentName(plan: PlanId) {
  return `${PRODUCT_NAME} — ${plans[plan].name}`;
}

/** Evita Purchase duplicado no Strict Mode / remount. */
export function trackPurchaseOnce(key: string, params: Parameters<typeof trackPurchase>[0]) {
  if (typeof window === "undefined") return;
  const storageKey = `meta_purchase_${key}`;
  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
  } catch {
    // sessionStorage indisponível — dispara mesmo assim
  }
  trackPurchase(params);
}
