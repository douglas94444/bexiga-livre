import { Star } from "lucide-react";
import { SOCIAL_PROOF, testimonials } from "./v2-offer-data";
import { V2Section, V2Title } from "./shared";

export function SocialStrip({
  title = `${SOCIAL_PROOF.countLabel} utilizando o Protocolo Bexiga Blindada`,
  limit = 9,
}: {
  title?: string;
  limit?: number;
}) {
  return (
    <V2Section tone="muted">
      <V2Title>{title}</V2Title>
      <p className="mt-3 text-center text-muted-foreground">
        <span className="text-star">{SOCIAL_PROOF.ratingLabel}</span> avaliações
        ilustrativas
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, limit).map((item) => (
          <article
            key={`${item.name}-${item.city}`}
            className="rounded-2xl border border-border/70 bg-card p-6"
          >
            {/* TODO: depoimento real */}
            <div className="flex gap-0.5 text-star">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" strokeWidth={0} />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed">“{item.text}”</p>
            <p className="mt-4 text-sm font-semibold">
              {item.name}, {item.age} — {item.city}
            </p>
          </article>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Depoimentos ilustrativos — substituir por reais.
      </p>
    </V2Section>
  );
}
