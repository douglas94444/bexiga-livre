/** Carrega o MercadoPago.js V2 sob demanda (somente no navegador). */
export type MpInstallmentOption = {
  installments: number;
  recommended_message: string;
  total_amount: number;
};

export type MpInstance = {
  getPaymentMethods: (args: { bin: string }) => Promise<{
    results: { id: string; issuer?: { id: number | string } }[];
  }>;
  getInstallments: (args: {
    amount: string;
    bin: string;
    paymentTypeId: string;
  }) => Promise<
    { payer_costs: MpInstallmentOption[]; issuer?: { id: number | string } }[]
  >;
  createCardToken: (args: {
    cardNumber: string;
    cardholderName: string;
    cardExpirationMonth: string;
    cardExpirationYear: string;
    securityCode: string;
    identificationType: string;
    identificationNumber: string;
  }) => Promise<{ id: string }>;
};

declare global {
  interface Window {
    MercadoPago?: new (
      publicKey: string,
      options?: { locale?: string },
    ) => MpInstance;
  }
}

const SDK_URL = "https://sdk.mercadopago.com/js/v2";
let sdkPromise: Promise<void> | null = null;

function loadSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.MercadoPago) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SDK_URL}"]`,
    );
    const script = existing ?? document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () =>
      reject(new Error("Não foi possível carregar o Mercado Pago.")),
    );
    if (!existing) document.head.appendChild(script);
  });

  return sdkPromise;
}

let instance: MpInstance | null = null;

export async function getMercadoPago(publicKey: string): Promise<MpInstance> {
  await loadSdk();
  if (!window.MercadoPago) throw new Error("SDK do Mercado Pago indisponível.");
  if (!instance) instance = new window.MercadoPago(publicKey, { locale: "pt-BR" });
  return instance;
}