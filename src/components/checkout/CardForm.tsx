import { useEffect, useState, type MutableRefObject } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBRL } from "@/components/landing/offer-data";
import {
  getMercadoPago,
  type MpInstallmentOption,
} from "@/lib/mercadopago-sdk";
import { cn } from "@/lib/utils";

export type CardTokenPayload = {
  token: string;
  paymentMethodId: string;
  issuerId?: string;
  installments: number;
};

type Props = {
  publicKey: string;
  amount: number;
  cpfDigits: string;
  status: "loading" | "ready" | "unavailable";
  onRetry: () => void;
  /** Preenchido pelo formulário; o checkout chama para gerar o token. */
  tokenizerRef: MutableRefObject<(() => Promise<CardTokenPayload>) | null>;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCardNumber(value: string) {
  return onlyDigits(value)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const d = onlyDigits(value).slice(0, 6);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

export function CardForm({
  publicKey,
  amount,
  cpfDigits,
  status,
  onRetry,
  tokenizerRef,
}: Props) {
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [installments, setInstallments] = useState(1);
  const [options, setOptions] = useState<MpInstallmentOption[]>([]);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [issuerId, setIssuerId] = useState<string | undefined>(undefined);
  const [sdkError, setSdkError] = useState<string | null>(null);

  const bin = onlyDigits(number).slice(0, 8);

  useEffect(() => {
    if (!publicKey || bin.length < 6) {
      setOptions([]);
      setPaymentMethodId("");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const mp = await getMercadoPago(publicKey);
        const [methods, installmentInfo] = await Promise.all([
          mp.getPaymentMethods({ bin }),
          mp.getInstallments({
            amount: amount.toFixed(2),
            bin,
            paymentTypeId: "credit_card",
          }),
        ]);
        if (cancelled) return;

        setPaymentMethodId(methods.results?.[0]?.id ?? "");
        const first = installmentInfo?.[0];
        setIssuerId(first?.issuer?.id ? String(first.issuer.id) : undefined);
        setOptions(first?.payer_costs ?? []);
        setSdkError(null);
      } catch (error) {
        if (cancelled) return;
        console.error("[mercadopago] falha ao consultar cartão", error);
        setOptions([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [publicKey, bin, amount]);

  useEffect(() => {
    tokenizerRef.current = async () => {
      const mp = await getMercadoPago(publicKey);
      const [month, year] = expiry.split("/");
      const token = await mp.createCardToken({
        cardNumber: onlyDigits(number),
        cardholderName: holder.trim(),
        cardExpirationMonth: (month ?? "").padStart(2, "0"),
        cardExpirationYear: (year ?? "").length === 2 ? `20${year}` : (year ?? ""),
        securityCode: onlyDigits(cvv),
        identificationType: "CPF",
        identificationNumber: cpfDigits,
      });

      return {
        token: token.id,
        paymentMethodId,
        issuerId,
        installments,
      };
    };

    return () => {
      tokenizerRef.current = null;
    };
  }, [
    publicKey,
    number,
    holder,
    expiry,
    cvv,
    cpfDigits,
    paymentMethodId,
    issuerId,
    installments,
    tokenizerRef,
  ]);

  if (status === "loading") {
    return (
      <div className="mt-5 grid gap-4 sm:grid-cols-2" aria-busy="true">
        <div className="h-12 rounded-xl bg-muted animate-pulse sm:col-span-2" />
        <div className="h-12 rounded-xl bg-muted animate-pulse sm:col-span-2" />
        <div className="h-12 rounded-xl bg-muted animate-pulse" />
        <div className="h-12 rounded-xl bg-muted animate-pulse" />
        <div className="h-12 rounded-xl bg-muted animate-pulse sm:col-span-2" />
      </div>
    );
  }

  if (status === "unavailable") {
    return (
      <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4 text-sm">
        <p className="text-muted-foreground">
          Não conseguimos carregar o pagamento com cartão agora. Tente de novo ou
          pague no PIX (liberação imediata).
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg border border-brand px-4 text-sm font-semibold text-brand"
        >
          Tentar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="card-number">Número do cartão</Label>
        <Input
          id="card-number"
          inputMode="numeric"
          autoComplete="cc-number"
          value={number}
          onChange={(e) => setNumber(formatCardNumber(e.target.value))}
          placeholder="0000 0000 0000 0000"
          className="h-12 rounded-xl text-base"
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="card-holder">Nome impresso no cartão</Label>
        <Input
          id="card-holder"
          autoComplete="cc-name"
          value={holder}
          onChange={(e) => setHolder(e.target.value.toUpperCase())}
          placeholder="COMO ESTÁ NO CARTÃO"
          className="h-12 rounded-xl text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="card-expiry">Validade</Label>
        <Input
          id="card-expiry"
          inputMode="numeric"
          autoComplete="cc-exp"
          value={expiry}
          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
          placeholder="MM/AA"
          className="h-12 rounded-xl text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="card-cvv">CVV</Label>
        <Input
          id="card-cvv"
          inputMode="numeric"
          autoComplete="cc-csc"
          value={cvv}
          onChange={(e) => setCvv(onlyDigits(e.target.value).slice(0, 4))}
          placeholder="000"
          className="h-12 rounded-xl text-base"
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="card-installments">Parcelas</Label>
        <select
          id="card-installments"
          value={installments}
          onChange={(e) => setInstallments(Number(e.target.value))}
          className={cn(
            "h-12 w-full rounded-xl border border-input bg-background px-3 text-base",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          {options.length === 0 ? (
            <option value={1}>1x de {formatBRL(amount)} sem juros</option>
          ) : (
            options.map((option) => (
              <option key={option.installments} value={option.installments}>
                {option.recommended_message}
              </option>
            ))
          )}
        </select>
      </div>

      {sdkError ? (
        <p className="text-sm text-destructive sm:col-span-2">{sdkError}</p>
      ) : null}
    </div>
  );
}