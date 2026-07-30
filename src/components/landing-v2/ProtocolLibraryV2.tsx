import {
  Calendar,
  Droplets,
  Flower2,
  Heart,
  Leaf,
  ListChecks,
  Lock,
  Moon,
  NotebookPen,
  Plane,
  Repeat,
  Shield,
  Siren,
  Stethoscope,
  TriangleAlert,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import {
  heroCopy,
  protocolLibraryCopy,
  protocolLibraryItems,
} from "./v2-offer-data";
import { V2Accent, V2Card, V2Cta, V2Lead, V2Section, V2Title } from "./shared";

const iconMap: Record<(typeof protocolLibraryItems)[number]["icon"], LucideIcon> =
  {
    siren: Siren,
    heart: Heart,
    leaf: Leaf,
    droplets: Droplets,
    moon: Moon,
    plane: Plane,
    stethoscope: Stethoscope,
    notebook: NotebookPen,
    calendar: Calendar,
    flower: Flower2,
    utensils: Utensils,
    listChecks: ListChecks,
    triangleAlert: TriangleAlert,
    shield: Shield,
    repeat: Repeat,
  };

export function ProtocolLibraryV2({ onCta }: { onCta: () => void }) {
  return (
    <V2Section>
      <V2Title>
        Veja o que você encontra{" "}
        <V2Accent>dentro</V2Accent> do protocolo
      </V2Title>
      <V2Lead>{protocolLibraryCopy.lead}</V2Lead>

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {protocolLibraryItems.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <V2Card
              as="li"
              key={item.title}
              className="flex flex-col gap-3 rounded-2xl p-4 sm:p-5"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-brand text-primary-foreground">
                <Icon className="size-5" strokeWidth={2.1} />
              </span>
              <h3 className="font-display text-sm font-semibold tracking-tight text-brand sm:text-base">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {item.text}
              </p>
            </V2Card>
          );
        })}
      </ul>

      <div className="mt-10 flex justify-center">
        <V2Cta onClick={onCta}>
          <Lock className="size-4 opacity-90" strokeWidth={2.2} />
          {heroCopy.cta}
        </V2Cta>
      </div>
    </V2Section>
  );
}
