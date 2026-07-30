import { Lock, Star } from "lucide-react";
import avatarAndrea from "@/assets/avatar-andrea.jpg";
import avatarClaudia from "@/assets/avatar-claudia.jpg";
import avatarHelena from "@/assets/avatar-helena.jpg";
import avatarLuciana from "@/assets/avatar-luciana.jpg";
import avatarMarcia from "@/assets/avatar-marcia.jpg";
import avatarPatricia from "@/assets/avatar-patricia.jpg";
import avatarRenata from "@/assets/avatar-renata.jpg";
import avatarSonia from "@/assets/avatar-sonia.jpg";
import {
  SOCIAL_PROOF,
  heroCopy,
  testimonialAvatarKeys,
  testimonials,
} from "./v2-offer-data";
import { V2Accent, V2Card, V2Cta, V2Lead, V2Section, V2Title } from "./shared";

const avatars: Record<string, string> = {
  marcia: avatarMarcia,
  luciana: avatarLuciana,
  helena: avatarHelena,
  patricia: avatarPatricia,
  sonia: avatarSonia,
  renata: avatarRenata,
  claudia: avatarClaudia,
  andrea: avatarAndrea,
};

export function Feedbacks({ onCta }: { onCta: () => void }) {
  const reviewLabel = new Intl.NumberFormat("pt-BR").format(
    SOCIAL_PROOF.reviewsCount,
  );

  return (
    <V2Section>
      <V2Title>
        +18.500 mulheres já <V2Accent>transformaram</V2Accent> sua rotina
      </V2Title>
      <V2Lead>
        Alguns dos feedbacks de quem já faz parte do Protocolo Bexiga Blindada
      </V2Lead>

      <V2Card className="mx-auto mt-10 max-w-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-stretch sm:gap-10">
          <div className="flex shrink-0 flex-col items-center justify-center sm:min-w-[8.5rem]">
            <p className="font-display text-5xl font-semibold tracking-tight text-brand">
              {SOCIAL_PROOF.ratingValue.toFixed(1)}
            </p>
            <div className="mt-2 flex gap-0.5 text-star">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-5 fill-current" strokeWidth={0} />
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {reviewLabel} avaliações
            </p>
          </div>

          <ul className="w-full flex-1 space-y-2.5">
            {SOCIAL_PROOF.ratingBars.map((row) => (
              <li key={row.stars} className="flex items-center gap-3">
                <span className="w-3 text-sm font-semibold text-brand">
                  {row.stars}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-star"
                    style={{ width: `${row.width}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </V2Card>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {testimonials.slice(0, 4).map((item) => {
          const avatarKey = testimonialAvatarKeys[item.name];
          const avatarSrc = avatarKey ? avatars[avatarKey] : undefined;
          return (
            <V2Card
              as="article"
              key={`fb-${item.name}`}
              className="bg-muted/80 p-8"
            >
              <div className="flex items-center gap-3">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt=""
                    width={72}
                    height={72}
                    className="size-12 shrink-0 rounded-full object-cover ring-2 ring-brand/15"
                  />
                ) : null}
                <div>
                  <div className="flex gap-0.5 text-star">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-current"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <p className="font-display mt-1.5 font-semibold tracking-tight text-brand">
                    {item.name}, {item.age} — {item.city}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-lg leading-relaxed">“{item.text}”</p>
            </V2Card>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <V2Cta onClick={onCta}>
          <Lock className="size-4 opacity-90" strokeWidth={2.2} />
          {heroCopy.cta}
        </V2Cta>
      </div>
    </V2Section>
  );
}
