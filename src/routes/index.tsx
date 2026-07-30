import { createFileRoute } from "@tanstack/react-router";
import { BarreiraGridV2 } from "@/components/landing-v2/BarreiraGridV2";
import { BonusesGiftV2 } from "@/components/landing-v2/BonusesGiftV2";
import { DifferentiatorV2 } from "@/components/landing-v2/DifferentiatorV2";
import { FaqV2, landingFaqItems } from "@/components/landing-v2/FaqV2";
import { Feedbacks } from "@/components/landing-v2/Feedbacks";
import { FinalCtaV2, FooterV2 } from "@/components/landing-v2/FinalCtaV2";
import { GuaranteeV2 } from "@/components/landing-v2/GuaranteeV2";
import { HeroV2 } from "@/components/landing-v2/HeroV2";
import { IdealFor } from "@/components/landing-v2/IdealFor";
import { LifeAfterV2 } from "@/components/landing-v2/LifeAfterV2";
import { useOrderBumpFunnel } from "@/components/landing-v2/OrderBumpModals";
import { PricingDual } from "@/components/landing-v2/PricingDual";
import { PromoBar } from "@/components/landing-v2/PromoBar";
import { ProtocolLibraryV2 } from "@/components/landing-v2/ProtocolLibraryV2";
import { StickyPricingCta } from "@/components/landing-v2/StickyPricingCta";
import { StrategyCategoriesV2 } from "@/components/landing-v2/StrategyCategoriesV2";
import { SymptomsV2 } from "@/components/landing-v2/SymptomsV2";
import { WhatYouGet } from "@/components/landing-v2/WhatYouGet";
import { WhatsAppTestimonialsV2 } from "@/components/landing-v2/WhatsAppTestimonialsV2";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  absoluteOgImage,
  absoluteUrl,
} from "@/lib/seo";
import { trackViewContent } from "@/lib/meta-pixel";
import { useEffect } from "react";

const title = DEFAULT_TITLE;
const description = DEFAULT_DESCRIPTION;
const pageUrl = absoluteUrl("/");
const ogImage = absoluteOgImage();

export const Route = createFileRoute("/")({
  component: LandingHomePage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "product" },
      { property: "og:url", content: pageUrl },
      { property: "og:image", content: ogImage },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      { rel: "canonical", href: pageUrl },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: SITE_NAME,
          description,
          image: [ogImage],
          brand: { "@type": "Brand", name: SITE_NAME },
          offers: [
            {
              "@type": "Offer",
              name: "Protocolo Completo",
              price: "27.00",
              priceCurrency: "BRL",
              availability: "https://schema.org/InStock",
              url: pageUrl,
            },
            {
              "@type": "Offer",
              name: "Protocolo Essencial",
              price: "10.00",
              priceCurrency: "BRL",
              availability: "https://schema.org/InStock",
              url: pageUrl,
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: landingFaqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
});

function LandingHomePage() {
  const { selectPlan, openCompletoDirect, modals } = useOrderBumpFunnel();

  useEffect(() => {
    trackViewContent();
  }, []);

  return (
    <main className="landing-v2 bg-background text-foreground">
      <PromoBar />
      <HeroV2 onPrimaryCta={openCompletoDirect} />
      <SymptomsV2 onCta={openCompletoDirect} />
      <DifferentiatorV2 onCta={openCompletoDirect} />
      <WhatsAppTestimonialsV2 onCta={openCompletoDirect} />
      <ProtocolLibraryV2 onCta={openCompletoDirect} />
      <StrategyCategoriesV2 onCta={openCompletoDirect} />
      <WhatYouGet onCta={openCompletoDirect} />
      <IdealFor onCta={openCompletoDirect} />
      <BarreiraGridV2 onCta={openCompletoDirect} />
      <BonusesGiftV2 onCta={openCompletoDirect} />
      <LifeAfterV2 onCta={openCompletoDirect} />
      <PricingDual onSelect={selectPlan} />
      <Feedbacks onCta={openCompletoDirect} />
      <GuaranteeV2 />
      <FaqV2 />
      <FinalCtaV2 onCta={openCompletoDirect} />
      <FooterV2 />
      <StickyPricingCta />
      {modals}
    </main>
  );
}
