import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "./faq-data";
import { Reveal, Section, SectionTitle } from "./shared";

export function Faq() {
  return (
    <Section tone="muted">
      <Reveal>
        <SectionTitle>Perguntas frequentes</SectionTitle>
      </Reveal>

      <Reveal delay={0.05}>
        <Accordion
          type="single"
          collapsible
          className="mx-auto mt-12 w-full max-w-3xl"
        >
          {faqItems.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`item-${i}`}
              className="border-b border-border"
            >
              <AccordionTrigger className="py-6 text-left text-lg font-semibold tracking-tight hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-lg leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Section>
  );
}