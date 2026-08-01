import { Download } from "lucide-react";
import {
  checkoutBumps,
  mainDeliverables,
  type CheckoutBumpId,
} from "@/components/landing/offer-data";

type Props = {
  bumpIds: readonly CheckoutBumpId[];
};

const primary =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-8 text-base font-semibold tracking-tight text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.49_0.089_181/0.55)] transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-lg";
const secondary =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-brand/30 bg-brand-tint px-8 text-base font-semibold tracking-tight text-brand transition-colors hover:bg-brand hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-lg";
const tertiary =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background px-8 text-base font-semibold tracking-tight text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-lg";

/** Botões de download do pedido: PDFs principais + bumps com arquivo. */
export function DeliverablesList({ bumpIds }: Props) {
  const selectedBumps = checkoutBumps.filter(
    (b) => bumpIds.includes(b.id) && b.path && b.fileName,
  );

  return (
    <div className="space-y-3">
      {mainDeliverables.map((item, index) => (
        <a
          key={item.id}
          href={item.path}
          download={item.fileName}
          className={index === 0 ? primary : secondary}
        >
          <Download className="size-5" strokeWidth={2} />
          Baixar {item.title}
        </a>
      ))}

      {selectedBumps.map((bump) => (
        <a
          key={bump.id}
          href={bump.path}
          download={bump.fileName}
          className={tertiary}
        >
          <Download className="size-5" strokeWidth={2} />
          Baixar {bump.emoji} {bump.title}
        </a>
      ))}
    </div>
  );
}