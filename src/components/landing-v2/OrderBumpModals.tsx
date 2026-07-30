import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatBRL,
  plans,
  upgradeBump,
  type PlanId,
} from "./v2-offer-data";
import { V2Cta } from "./shared";
import {
  planContentId,
  planContentName,
  trackAddToCart,
} from "@/lib/meta-pixel";

type ModalKind = "upgrade" | null;

function ModalTimer({ active }: { active: boolean }) {
  const [left, setLeft] = useState(120);

  useEffect(() => {
    if (!active) return;
    setLeft(120);
    const id = window.setInterval(() => {
      setLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [active]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <p className="text-sm text-muted-foreground">
      Esta oferta expira em:{" "}
      <span className="font-semibold tabular-nums text-foreground">
        {mm}:{ss}
      </span>
    </p>
  );
}

export function useOrderBumpFunnel() {
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalKind>(null);

  function goCheckout(plan: PlanId) {
    setModal(null);
    trackAddToCart({
      content_name: planContentName(plan),
      content_ids: [planContentId(plan)],
      value: plans[plan].price,
    });
    void navigate({
      to: "/checkout",
      search: { plan, bumps: "" },
    });
  }

  function selectPlan(plan: PlanId) {
    if (plan === "basico") setModal("upgrade");
    else goCheckout("completo");
  }

  function openCompletoDirect() {
    goCheckout("completo");
  }

  const modals = (
    <Dialog open={modal === "upgrade"} onOpenChange={(o) => !o && setModal(null)}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0 sm:rounded-3xl">
        <button
          type="button"
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 rounded-full bg-muted p-1.5"
          onClick={() => setModal(null)}
        >
          <X className="size-4" />
        </button>
        <div className="bg-brand-tint px-6 py-5 text-center">
          <DialogHeader>
            <DialogTitle className="text-xl leading-snug">
              {upgradeBump.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Oferta de upgrade para o Protocolo Completo
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3">
            <ModalTimer active={modal === "upgrade"} />
          </div>
        </div>
        <div className="space-y-4 px-6 py-6">
          <p className="text-sm font-medium text-brand">O que você recebe:</p>
          <ul className="space-y-2">
            {upgradeBump.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={3} />
                {b}
              </li>
            ))}
          </ul>
          <V2Cta className="w-full" onClick={() => goCheckout("completo")}>
            SIM! QUERO O PROTOCOLO COMPLETO POR +{formatBRL(upgradeBump.price)}
          </V2Cta>
          <button
            type="button"
            className="w-full text-center text-sm text-muted-foreground underline-offset-2 hover:underline"
            onClick={() => goCheckout("basico")}
          >
            Não, obrigada. Prefiro continuar apenas com o básico.
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return { selectPlan, openCompletoDirect, modals };
}
