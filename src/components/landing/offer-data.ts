export const PRODUCT_NAME = "Protocolo Bexiga Blindada™";

/** Entregáveis principais (compra 1, recebe 2 PDFs) */
export const mainDeliverables = [
  {
    id: "protocolo",
    title: "Protocolo Bexiga Blindada™",
    fileName: "protocolo-bexiga-blindada.pdf",
    path: "/protocolo-bexiga-blindada.pdf",
  },
  {
    id: "estrategias",
    title: "365 Estratégias + 21 Protocolos Práticos",
    fileName: "365-estrategias-21-protocolos.pdf",
    path: "/365-estrategias-21-protocolos.pdf",
  },
] as const;

/** @deprecated Prefer mainDeliverables[0].path */
export const PDF_PATH = mainDeliverables[0].path;

export const OFFER_PRICE = 27;
export const OFFER_COMPARE_AT = 47;
/** Preço do upgrade Essencial → Completo no modal da landing */
export const BUMP_PRICE = 9.9;

export const SOCIAL_PROOF = {
  ratingLabel: "★★★★★",
  countLabel: "+18500 mulheres",
  ratingValue: 4.9,
  reviewsCount: 18524,
  /** Larguras visuais das barras (não precisam somar 100) */
  ratingBars: [
    { stars: 5, width: 92 },
    { stars: 4, width: 38 },
    { stars: 3, width: 12 },
    { stars: 2, width: 6 },
    { stars: 1, width: 3 },
  ],
} as const;

/** Produto principal do pacote */
export const mainProduct = {
  title: "Protocolo Bexiga Blindada™",
  label: "Produto principal",
  text: "PDF completo com o Método B.A.R.R.E.I.R.A™ — prevenção organizada, sem prometer cura e sem substituir o médico.",
  value: 97,
} as const;

/** Stack de valor: apenas o produto principal */
export const stackItems = [mainProduct] as const;

export const stackTotalValue = stackItems.reduce((sum, item) => sum + item.value, 0);

/** Quatro bônus exclusivos */
export const bonuses = [
  {
    label: "Bônus 1",
    title: "Guia Alimentar",
    text: "O que observar e priorizar na alimentação — sem dietas milagrosas.",
    value: 47,
  },
  {
    label: "Bônus 2",
    title: "Plano SOS Primeiros Sinais",
    text: "Roteiro educativo para reconhecer e organizar os primeiros sinais.",
    value: 47,
  },
  {
    label: "Bônus 3",
    title: "Kit Viagem Sem Medo",
    text: "Preparo antes, durante e depois da viagem.",
    value: 37,
  },
  {
    label: "Bônus 4",
    title: "Durma a Noite Toda",
    text: "Orientações práticas para a noite deixar de ser só vigilância.",
    value: 37,
  },
] as const;

export const bonusTotalValue = bonuses.reduce((sum, item) => sum + item.value, 0);

export type CheckoutBumpId = "intimidade" | "calendario" | "cranberry";

const CHECKOUT_BUMP_IDS = ["intimidade", "calendario", "cranberry"] as const satisfies readonly CheckoutBumpId[];

export function isCheckoutBumpId(value: string): value is CheckoutBumpId {
  return (CHECKOUT_BUMP_IDS as readonly string[]).includes(value);
}

/** CSV serializado de CheckoutBumpId (ex.: "intimidade,calendario"). */
export type BumpsSearchParam = string;

export const checkoutBumps: readonly {
  id: CheckoutBumpId;
  emoji: string;
  title: string;
  pain: string;
  text: string;
  price: number;
  compareAt: number;
  featured?: boolean;
  /** PDF do bump — undefined até o arquivo ser enviado */
  fileName?: string;
  path?: string;
}[] = [
  {
    id: "intimidade",
    emoji: "❤️",
    title: "Intimidade Sem Medo",
    pain: "O medo de que a relação “acorde” a infecção — antes, durante ou depois — vira distância, culpa e silêncio. Na menopausa, o ressecamento e o desconforto só aumentam essa tensão.",
    text: "Antes e depois da relação, lubrificação, menopausa, checklist prático e a parte emocional: como voltar a se aproximar sem viver no cálculo do “e se voltar?”.",
    price: 19.9,
    compareAt: 47,
    featured: true,
    fileName: "intimidade-sem-medo.pdf",
    path: "/intimidade-sem-medo.pdf",
  },
  {
    id: "calendario",
    emoji: "📅",
    title: "Calendário Preventivo",
    pain: "",
    text: "Planner diário marcável (água, banheiro, suplementação, sono) + resumo semanal — leve e consumível em 1 minuto por dia.",
    price: 12.9,
    compareAt: 37,
    fileName: "calendario-preventivo.pdf",
    path: "/calendario-preventivo.pdf",
  },
  {
    id: "cranberry",
    emoji: "🍓",
    title: "Guia Completo do Cranberry",
    pain: "",
    text: "PAC, tipos de produto, como ler o rótulo, cápsula vs. suco, mitos e checklist de compra — o conhecimento de insider que o funil já validou.",
    price: 17.9,
    compareAt: 47,
  },
] as const;

export function parseBumpIds(raw: unknown): CheckoutBumpId[] {
  const str =
    typeof raw === "string"
      ? raw
      : Array.isArray(raw)
        ? raw.map(String).join(",")
        : "";
  if (!str.trim()) return [];
  const seen = new Set<CheckoutBumpId>();
  for (const part of str.split(",")) {
    const id = part.trim();
    if (isCheckoutBumpId(id)) seen.add(id);
  }
  return [...seen];
}

export function bumpsTotal(ids: readonly CheckoutBumpId[]) {
  return checkoutBumps
    .filter((b) => ids.includes(b.id))
    .reduce((sum, b) => sum + b.price, 0);
}

export function serializeBumpIds(ids: readonly CheckoutBumpId[]): BumpsSearchParam {
  return ids.join(",");
}

export function parseAmountParam(raw: unknown): number | undefined {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim()) {
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export const barreiras = [
  { letra: "B", title: "Bons hábitos", text: "Hidratação, não segurar urina, higiene e cuidados após a relação." },
  { letra: "A", title: "Alimentação", text: "Apoio nutricional realista — aprofundado no bônus alimentar." },
  { letra: "R", title: "Reconhecimento dos sinais", text: "Identificar cedo o que está acontecendo e buscar orientação." },
  { letra: "R", title: "Rotina preventiva", text: "Transformar hábitos em automático — plano de 30 dias." },
  { letra: "E", title: "Estratégias de apoio", text: "Complementos discutidos na literatura, sempre sob acompanhamento." },
  { letra: "I", title: "Informação baseada em evidências", text: "Clareza sem milagre e sem achismo de internet." },
  { letra: "R", title: "Redução dos fatores de risco", text: "Atuar nas peças do quebra-cabeça que cabem a você." },
  { letra: "A", title: "Acompanhamento", text: "Manter relação com o médico ao longo do tempo." },
] as const;

export const GUARANTEE = {
  days: 7,
  title: "7 dias de garantia incondicional",
  lead: "Seu investimento é totalmente protegido.",
  body: "Se você sentir que o material não te ajudou, é só pedir reembolso — sem perguntas. Sem burocracia. Sem risco.",
  how: "Envie um e-mail de solicitação em até 7 dias após a compra. Nós processamos o reembolso sem complicação.",
};

/** TODO: depoimento real — substituir por prints/textos autênticos */
export const testimonials = [
  {
    name: "Márcia",
    age: 52,
    city: "Curitiba, PR",
    text: "Passei anos indo ao banheiro de madrugada e cancelando viagem. Pela primeira vez senti que tinha um plano, não mais um remédio solto.",
  },
  {
    name: "Luciana",
    age: 44,
    city: "Campinas, SP",
    text: "O SOS nos primeiros sinais mudou tudo. Eu parava de entrar em pânico e sabia o que fazer nas primeiras horas.",
  },
  {
    name: "Helena",
    age: 61,
    city: "Belo Horizonte, MG",
    text: "É direto, com letra grande, sem enrolação. Consigo consultar o material no celular sem me perder.",
  },
  {
    name: "Patrícia",
    age: 38,
    city: "Recife, PE",
    text: "Depois de tantas infecções repetidas, eu só queria voltar a viver. O protocolo me organizou — e a garantia me deu segurança para tentar.",
  },
  {
    name: "Sônia",
    age: 57,
    city: "Porto Alegre, RS",
    text: "O kit de viagem valeu sozinho. Marquei um fim de semana sem aquele cálculo mental de ‘e se voltar?’",
  },
  {
    name: "Renata",
    age: 47,
    city: "Brasília, DF",
    text: "Não é milagre. É organização. E era isso que faltava entre uma crise e outra.",
  },
  {
    name: "Cláudia",
    age: 49,
    city: "Fortaleza, CE",
    text: "Eu já tinha desistido de “mais um chá”. Ter um passo a passo claro me deu segurança para agir sem culpa.",
  },
  {
    name: "Andréa",
    age: 41,
    city: "Florianópolis, SC",
    text: "O que mais me pegou foi saber quando ir ao médico. Parece simples, mas ninguém tinha me dito com essa objetividade.",
  },
  {
    name: "Eliane",
    age: 55,
    city: "Goiânia, GO",
    text: "Finalmente parei de espalhar dicas de grupo de WhatsApp. Tudo ficou em um lugar só, no celular.",
  },
  {
    name: "Juliana",
    age: 36,
    city: "São Paulo, SP",
    text: "Depois do protocolo, a noite deixou de ser só vigilância. Ainda tenho dias difíceis, mas não vivo mais no piloto do medo.",
  },
] as const;

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
