import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { FearCards } from "@/components/landing/FearCards";
import { TriedEverything } from "@/components/landing/TriedEverything";
import { ProtocolIntro } from "@/components/landing/ProtocolIntro";
import { MethodLivre } from "@/components/landing/MethodLivre";
import { Deliverables } from "@/components/landing/Deliverables";
import { FutureRoutine } from "@/components/landing/FutureRoutine";
import { Comparison } from "@/components/landing/Comparison";
import { Faq } from "@/components/landing/Faq";
import { Offer } from "@/components/landing/Offer";
import { FinalCta, LandingFooter } from "@/components/landing/FinalCta";
import { faqItems } from "@/components/landing/faq-data";

const title = "Protocolo Bexiga Livre™ | Programa educativo para infecção urinária de repetição";
const description =
  "Programa educativo para mulheres com infecções urinárias repetidas: plano preventivo, checklists e o Método L.I.V.R.E. para voltar a dormir, viajar e sair sem medo.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Protocolo Bexiga Livre™",
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

function Index() {
  return (
    <main className="bg-background">
      <Hero />
      <BeforeAfter />
      <FearCards />
      <TriedEverything />
      <ProtocolIntro />
      <MethodLivre />
      <Deliverables />
      <FutureRoutine />
      <Comparison />
      <Faq />
      <Offer />
      <FinalCta />
      <LandingFooter />
    </main>
  );
}
