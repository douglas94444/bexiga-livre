import { Lock } from "lucide-react";
import ardencia from "@/assets/sintoma-ardencia.jpg";
import medo from "@/assets/sintoma-medo.jpg";
import bexigaCheia from "@/assets/sintoma-bexiga-cheia.jpg";
import recorrente from "@/assets/sintoma-recorrente.jpg";
import { heroCopy, symptomItems } from "./v2-offer-data";
import { type CtaHandlerProps, V2Cta, V2Section, V2Title } from "./shared";

const images = [ardencia, medo, bexigaCheia, recorrente];

export function SymptomsV2({ onCta }: CtaHandlerProps) {
  return (
    <V2Section>
      <V2Title>Se você sente…</V2Title>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {symptomItems.map((item, i) => (
          <article key={item.title} className="text-center">
            <div className="overflow-hidden rounded-t-2xl">
              <img
                src={images[i]}
                alt={item.alt}
                width={900}
                height={900}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="h-1 w-full bg-brand" aria-hidden="true" />
            <h3 className="mt-4 px-1 text-sm font-semibold leading-snug tracking-tight text-brand sm:text-[0.95rem]">
              {item.title}
            </h3>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-xl text-center">
        <p className="text-lg font-medium text-foreground">
          O seu corpo está pedindo mais proteção no trato urinário.
        </p>
        <p className="mt-2 text-lg font-semibold text-brand">
          E a solução está aqui — com o Protocolo Bexiga Blindada™.
        </p>
        <div className="mt-8 flex justify-center">
          <V2Cta onClick={onCta}>
            <Lock className="size-4 opacity-90" strokeWidth={2.2} />
            Quero minha proteção agora
          </V2Cta>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{heroCopy.micro}</p>
      </div>
    </V2Section>
  );
}
