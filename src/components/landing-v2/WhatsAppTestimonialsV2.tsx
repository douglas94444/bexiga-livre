import { ChevronLeft, Lock, MoreVertical, Phone, Smile, Video } from "lucide-react";
import avatarAndrea from "@/assets/avatar-andrea.jpg";
import avatarClaudia from "@/assets/avatar-claudia.jpg";
import avatarHelena from "@/assets/avatar-helena.jpg";
import avatarLuciana from "@/assets/avatar-luciana.jpg";
import avatarMarcia from "@/assets/avatar-marcia.jpg";
import avatarPatricia from "@/assets/avatar-patricia.jpg";
import avatarRenata from "@/assets/avatar-renata.jpg";
import avatarSonia from "@/assets/avatar-sonia.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { heroCopy, whatsappTestimonials } from "./v2-offer-data";
import { type CtaHandlerProps, V2Cta, V2Section, V2Title } from "./shared";

const avatars = {
  marcia: avatarMarcia,
  luciana: avatarLuciana,
  helena: avatarHelena,
  patricia: avatarPatricia,
  sonia: avatarSonia,
  renata: avatarRenata,
  claudia: avatarClaudia,
  andrea: avatarAndrea,
} as const;

/** Padrão leve de "+" no fundo (estilo chat, sem asset oficial) */
const chatPattern =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cpath fill='%23b0a698' fill-opacity='0.35' d='M13 11h2v6h-2zm-2 2h6v2h-6z'/%3E%3C/svg%3E\")";

function WhatsAppChat({
  name,
  avatarKey,
  messages,
}: (typeof whatsappTestimonials)[number]) {
  return (
    <article className="mx-auto flex h-full w-full max-w-[22rem] flex-col overflow-hidden rounded-[1.6rem] border-[6px] border-[#1c1c1e] bg-[#0b141a] shadow-[0_20px_48px_-28px_rgba(0,0,0,0.55)]">
      {/* status bar fake */}
      <div className="flex items-center justify-between bg-[#008069] px-4 pb-1 pt-2 text-[0.65rem] font-medium text-white/90">
        <span>9:41</span>
        <span className="tracking-wide">••• ▮</span>
      </div>

      <header className="flex items-center gap-2 bg-[#008069] px-2 pb-2.5 pt-1 text-white">
        <ChevronLeft className="size-5 shrink-0 opacity-95" strokeWidth={2.2} />
        <img
          src={avatars[avatarKey]}
          alt=""
          width={72}
          height={72}
          className="size-9 shrink-0 rounded-full object-cover ring-1 ring-white/30"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.95rem] font-medium leading-tight">{name}</p>
          <p className="text-[0.7rem] text-white/80">online</p>
        </div>
        <Video className="size-[1.15rem] opacity-95" strokeWidth={1.8} />
        <Phone className="size-[1.05rem] opacity-95" strokeWidth={1.8} />
        <MoreVertical className="size-4 opacity-95" strokeWidth={1.8} />
      </header>

      <div
        className="flex min-h-[22rem] flex-1 flex-col gap-1.5 px-2.5 py-3"
        style={{
          backgroundColor: "#e5ddd5",
          backgroundImage: chatPattern,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={`${name}-${i}`}
            className="relative max-w-[88%] self-start rounded-lg rounded-tl-none bg-white px-2.5 pb-1.5 pt-1.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]"
          >
            {/* cauda da bolha */}
            <span
              aria-hidden="true"
              className="absolute -left-[6px] top-0 h-0 w-0 border-y-[6px] border-r-[6px] border-y-transparent border-r-white"
            />
            <p className="pr-10 text-[0.92rem] leading-[1.35] text-[#111b21]">
              {msg.text}
            </p>
            <span className="absolute bottom-1 right-2 text-[0.65rem] leading-none text-[#667781]">
              {msg.time}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-[#f0f2f5] px-2 py-2">
        <Smile className="size-5 text-[#54656f]" strokeWidth={1.6} />
        <div className="h-9 flex-1 rounded-full bg-white px-3 text-[0.8rem] leading-9 text-[#667781]">
          Mensagem
        </div>
        <span className="grid size-9 place-items-center rounded-full bg-[#008069] text-xs font-semibold text-white">
          ▶
        </span>
      </div>
    </article>
  );
}

export function WhatsAppTestimonialsV2({ onCta }: CtaHandlerProps) {
  return (
    <V2Section tone="muted">
      <V2Title>Veja o que estão dizendo das receitas:</V2Title>

      <div className="relative mx-auto mt-10 max-w-6xl px-2 sm:px-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {whatsappTestimonials.map((chat) => (
              <CarouselItem
                key={chat.name}
                className="basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                <WhatsAppChat {...chat} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 size-8 border-brand/20 bg-card text-brand hover:bg-brand-tint hover:text-brand disabled:opacity-40 sm:left-0" />
          <CarouselNext className="right-1 size-8 border-brand/20 bg-card text-brand hover:bg-brand-tint hover:text-brand disabled:opacity-40 sm:right-0" />
        </Carousel>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground sm:text-[0.95rem]">
          <span aria-hidden="true">👉</span>
          <span>Arraste para ver mais relatos</span>
          <span aria-hidden="true">👈</span>
        </p>
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
