import { BarChart3, Heart, Moon, Users } from "lucide-react";
import cafe from "@/assets/rotina-cafe.jpg";
import dormir from "@/assets/rotina-dormir.jpg";
import hero from "@/assets/hero-liberdade.jpg";
import viajar from "@/assets/rotina-viajar.jpg";
import { V2Section, V2Title } from "./shared";

const results = [
  {
    src: dormir,
    alt: "Quarto tranquilo pela manhã",
    icon: Moon,
    label: "Noites de sono mais tranquilas",
  },
  {
    src: viajar,
    alt: "Mulher viajando com mais confiança",
    icon: Users,
    label: "Segurança para viver sem tanto medo",
  },
  {
    src: cafe,
    alt: "Momento de qualidade de vida",
    icon: Heart,
    label: "Mais qualidade de vida no dia a dia",
  },
  {
    src: hero,
    alt: "Rotina organizada e prática",
    icon: BarChart3,
    label: "Acompanhamento simples e prático",
  },
];

export function ResultsGallery() {
  return (
    <V2Section tone="muted">
      <V2Title>Olha o que é possível com um plano claro</V2Title>
      <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
        Não é milagre. É organização — sono, rotina, viagem e primeiros sinais no
        mesmo sistema.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-10">
        {results.map((item) => (
          <article key={item.label} className="group">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={item.src}
                alt={item.alt}
                width={800}
                height={520}
                loading="lazy"
                className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] sm:h-56"
              />
              <span className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full bg-brand/90 text-primary-foreground backdrop-blur-sm">
                <item.icon className="size-4" strokeWidth={1.7} />
              </span>
            </div>
            <p className="font-display mt-4 text-xl font-semibold tracking-tight">
              {item.label}
            </p>
          </article>
        ))}
      </div>
    </V2Section>
  );
}
