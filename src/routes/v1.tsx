import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { FearCards } from "@/components/landing/FearCards";
import { TriedEverything } from "@/components/landing/TriedEverything";
import { ProtocolIntro } from "@/components/landing/ProtocolIntro";
import { Authority } from "@/components/landing/Authority";
import { MethodLivre } from "@/components/landing/MethodLivre";
import { Deliverables } from "@/components/landing/Deliverables";
import { FutureRoutine } from "@/components/landing/FutureRoutine";
import { Comparison } from "@/components/landing/Comparison";
import { Testimonials } from "@/components/landing/Testimonials";
import { Faq } from "@/components/landing/Faq";
import { Guarantee } from "@/components/landing/Guarantee";
import { Offer } from "@/components/landing/Offer";
import { FinalCta, LandingFooter } from "@/components/landing/FinalCta";
import { faqItems } from "@/components/landing/faq-data";

const title = "Protocolo Bexiga Blindada™ | Guia educativo para ITU de repetição";
const description =
  "Não é a dor que mais dói — é o medo de que ela volte. Protocolo Bexiga Blindada™ com Método B.A.R.R.E.I.R.A™, plano de 30 dias e 4 bônus. Conteúdo educativo, sem substituir o médico.";

export const Route = createFileRoute("/v1")({
  component: LandingV1Page,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "product" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Protocolo Bexiga Blindada™",
          description,
          offers: {
            "@type": "Offer",
            price: "27.00",
            priceCurrency: "BRL",
            availability: "https://schema.org/InStock",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
});

function LandingV1Page() {
  return (
    <main className="bg-background">
      <Hero />
      <BeforeAfter />
      <FearCards />
      <TriedEverything />
      <ProtocolIntro />
      <Authority />
      <MethodLivre />
      <Deliverables />
      <FutureRoutine />
      <Comparison />
      <Testimonials />
      <Faq />
      <Guarantee />
      <Offer />
      <FinalCta />
      <LandingFooter />
    </main>
  );
}
