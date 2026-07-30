import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/components/landing/faq-data";
import { V2Section, V2Title } from "./shared";

const v2Faqs = [
  {
    q: "Qual a diferença entre o Protocolo Essencial e o Completo?",
    a: "O Essencial inclui o produto principal Protocolo Bexiga Blindada™ com acesso vitalício. O Completo inclui o principal + 4 bônus: Guia Alimentar, Plano SOS, Kit Viagem e Durma a Noite Toda.",
  },
  {
    q: "Esse protocolo substitui antibiótico ou consulta médica?",
    a: "Não. É material educativo. Não substitui avaliação, diagnóstico ou tratamento médico. Em sinais de alerta (febre, sangue, dor lombar), procure atendimento.",
  },
  {
    q: "Serve se eu já tentei cranberry e não resolveu?",
    a: "Sim — a copy e o conteúdo partem desse ponto. O material explica por que suco/cápsula genérica costumam falhar (dose, uso irregular, açúcar) e organiza o quadro completo, sem vender “mais um cranberry”.",
  },
  {
    q: "Em quanto tempo consigo começar?",
    a: "Após a confirmação do pagamento, o download fica disponível de imediato. Dá para começar a ler em poucos minutos.",
  },
  {
    q: "Quando eu preciso procurar um médico?",
    a: "O protocolo inclui um capítulo de sinais de alerta. Febre, sangue na urina, dor lombar intensa ou piora rápida exigem avaliação profissional sem demora.",
  },
  ...faqItems.filter(
    (item) =>
      !item.q.includes("Quanto custa") &&
      !item.q.includes("O que vem no protocolo") &&
      !item.q.includes("substitui") &&
      !item.q.includes("médico"),
  ),
  {
    q: "Os arquivos são meus para sempre?",
    a: "Sim. O acesso é vitalício após a confirmação do pagamento.",
  },
];

/** FAQs da landing (SEO JSON-LD + accordion) */
export const landingFaqItems = v2Faqs;

export function FaqV2() {
  return (
    <V2Section>
      <V2Title>Perguntas frequentes</V2Title>
      <Accordion type="single" collapsible className="mx-auto mt-10 max-w-2xl">
        {v2Faqs.map((item, i) => (
          <AccordionItem key={item.q} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-base sm:text-lg">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </V2Section>
  );
}
