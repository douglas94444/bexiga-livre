import { Check, Copy, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { formatBRL } from "@/components/landing/offer-data";

type Props = {
  qrCodeBase64: string;
  qrCode: string;
  amount: number;
  expiresAt: string | null;
  checking: boolean;
};

function useCountdown(expiresAt: string | null) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!expiresAt) return;
    const target = new Date(expiresAt).getTime();
    const tick = () => setLeft(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (left === null) return null;
  const minutes = String(Math.floor(left / 60)).padStart(2, "0");
  const seconds = String(left % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function PixPanel({
  qrCodeBase64,
  qrCode,
  amount,
  expiresAt,
  checking,
}: Props) {
  const [copied, setCopied] = useState(false);
  const countdown = useCountdown(expiresAt);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-2xl border border-brand bg-brand-tint p-5 text-center sm:p-6">
      <h3 className="text-lg font-semibold tracking-tight">
        Pague {formatBRL(amount)} no PIX para liberar o acesso
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Escaneie o QR Code ou use o código copia e cola.
        {countdown ? ` Expira em ${countdown}.` : null}
      </p>

      {qrCodeBase64 ? (
        <img
          src={`data:image/png;base64,${qrCodeBase64}`}
          alt="QR Code do PIX para pagamento"
          className="mx-auto mt-5 size-56 rounded-xl bg-background p-2"
          width={224}
          height={224}
        />
      ) : null}

      <button
        type="button"
        onClick={copyCode}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold uppercase tracking-tight text-primary-foreground transition-colors hover:bg-brand-hover"
      >
        {copied ? (
          <Check className="size-4" strokeWidth={2.4} />
        ) : (
          <Copy className="size-4" strokeWidth={2} />
        )}
        {copied ? "Código copiado" : "Copiar código PIX"}
      </button>

      <p className="mt-3 break-all rounded-xl border border-border bg-background p-3 text-left text-xs text-muted-foreground">
        {qrCode}
      </p>

      <p className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
        {checking ? <Loader2 className="size-4 animate-spin" /> : null}
        Aguardando confirmação do pagamento…
      </p>
    </div>
  );
}