import {
  BUMP_PRICE,
  PRODUCT_NAME,
  SOCIAL_PROOF,
  bonuses,
  barreiras,
  formatBRL,
  mainProduct,
  checkoutBumps,
  bumpsTotal,
  parseBumpIds,
  serializeBumpIds,
  stackItems,
  testimonials,
  bonusTotalValue,
  type CheckoutBumpId,
} from "@/components/landing/offer-data";

export {
  PRODUCT_NAME,
  SOCIAL_PROOF,
  bonuses,
  barreiras,
  formatBRL,
  checkoutBumps,
  bumpsTotal,
  parseBumpIds,
  serializeBumpIds,
  testimonials,
  BUMP_PRICE,
  mainProduct,
  bonusTotalValue,
  type CheckoutBumpId,
};

/** Garantia alinhada ao PDF de vendas (v2) */
export const GUARANTEE = {
  days: 7,
  title: "7 dias de garantia incondicional",
  lead: "Garantia incondicional de 7 dias",
  body: "Se você sentir que o material não te ajudou, é só pedir reembolso — sem perguntas.",
  how: "Sem burocracia. Seu investimento fica protegido enquanto você avalia o material.",
} as const;

export type PlanId = "basico" | "completo";

export const plans = {
  basico: {
    id: "basico" as const,
    name: "Protocolo Essencial",
    price: 10,
    compareAt: 37 as number | null,
    badge: "Oferta essencial",
    ideal: "Ideal para conhecer o produto principal.",
    headline: "Protocolo Bexiga Blindada™",
    includes: [
      "Protocolo Bexiga Blindada™ (produto principal)",
      "Método B.A.R.R.E.I.R.A™ no PDF",
      "Download imediato",
      "Acesso vitalício",
    ],
    excludes: [
      "Não inclui Bônus 1 — Guia Alimentar",
      "Não inclui Bônus 2 — Plano SOS",
      "Não inclui Bônus 3 — Kit Viagem",
      "Não inclui Bônus 4 — Durma a Noite Toda",
    ],
    cta: "Quero o Essencial",
  },
  completo: {
    id: "completo" as const,
    name: "Protocolo Completo",
    price: 27,
    compareAt: 168,
    badge: "Super oferta",
    ideal: "PRODUTO PRINCIPAL + 4 BÔNUS EXCLUSIVOS",
    headline: "Protocolo Completo Blindada™",
    includes: [
      "Protocolo Bexiga Blindada™ (produto principal)",
      "Método B.A.R.R.E.I.R.A™ no PDF",
      "Download imediato",
      "Acesso vitalício",
      "Suporte ao acesso",
    ],
    excludes: [] as string[],
    cta: "Quero o Completo",
  },
} as const;

export const completoExtras = stackItems;

export const heroCopy = {
  eyebrow: "Para quem já sofreu com infecção urinária",
  brand: "Protocolo Bexiga Blindada™",
  h1: "Chega de viver com medo da próxima infecção urinária.",
  lead: "O protocolo mais completo para quem sofre com infecção urinária recorrente.",
  bullets: [
    "365 estratégias",
    "21 protocolos",
    "7 checklists",
    "4 guias",
    "Plano SOS",
    "Rotina Preventiva",
  ],
  cta: "Quero meu protocolo agora",
  micro: "Acesso imediato · Pagamento único · Pagamento 100% seguro · Acesso vitalício · Garantia de 7 dias",
  support:
    "Você já tentou de tudo. Cranberry, chá, água em excesso, antibiótico atrás de antibiótico. E mesmo assim, em algum momento, a infecção voltou. Isso não significa que não existe solução. Significa que ninguém nunca te explicou o que realmente está por trás dela.",
} as const;

export const symptomItems = [
  {
    title: "Ardência ou dor ao urinar",
    alt: "Mulher com a mão na região abdominal, sinalizando desconforto ao urinar",
  },
  {
    title: "Medo de sair de casa por causa das idas ao banheiro",
    alt: "Mulher pensativa junto à janela, com receio de sair de casa",
  },
  {
    title: "Sensação constante de bexiga cheia",
    alt: "Mulher sentada no sofá com expressão de desconforto",
  },
  {
    title: "Infecções urinárias frequentes",
    alt: "Pessoa com as mãos sobre a região pélvica, sugerindo desconforto recorrente",
  },
] as const;

export const pathBenefits = [
  {
    title: "Gatilhos reais",
    text: "Entenda o que está por trás das crises — sem achismo.",
  },
  {
    title: "Primeiras 24 horas",
    text: "Protocolo simples de organização quando os sintomas começam.",
  },
  {
    title: "Prevenção contínua",
    text: "Rotina prática: hidratação, hábitos e o que observar no dia a dia.",
  },
  {
    title: "Quando ir ao médico",
    text: "Sinais de alerta claros — sem enrolação e sem milagre.",
  },
] as const;

export const differentiatorCopy = {
  title: "O que torna o Protocolo Bexiga Blindada tão valiosos?",
  costTitle: "Mais do que desconforto: o tempo que você perdeu",
  costBody:
    "Porque isso nunca foi sobre desconforto. É sobre o tempo que você perdeu — as noites em claro correndo pro banheiro, o medo de sair de casa, o afastamento na intimidade, os dias de trabalho perdidos com dor. Se importar aqui não é vaidade. É querer de volta a liberdade que a dor já roubou de você.",
} as const;

export const differentiatorFeatures = [
  "365 estratégias organizadas",
  "21 protocolos práticos",
  "Plano SOS Primeiras 24 Horas",
  "Rotina Preventiva de 30 Dias",
  "Acesso Vitalício",
] as const;

/** Mini-produtos do inventário visual */
export const protocolLibraryItems = [
  {
    icon: "siren" as const,
    title: "SOS Primeiras 24h",
    text: "Checklist para organizar as primeiras horas dos sinais.",
  },
  {
    icon: "droplets" as const,
    title: "Plano de Hidratação",
    text: "Quanto, quando e como beber sem exagero.",
  },
  {
    icon: "moon" as const,
    title: "Rotina Noturna",
    text: "Menos vigília no banheiro, mais sono.",
  },
  {
    icon: "plane" as const,
    title: "Viagem Blindada",
    text: "Antes, durante e depois — sem cálculo mental.",
  },
  {
    icon: "stethoscope" as const,
    title: "Checklist Médico",
    text: "O que perguntar e quando procurar ajuda.",
  },
  {
    icon: "notebook" as const,
    title: "Diário Urinário",
    text: "Registrar padrões sem virar obsessão.",
  },
  {
    icon: "calendar" as const,
    title: "Plano 30 Dias",
    text: "Rotina preventiva dia a dia.",
  },
  {
    icon: "flower" as const,
    title: "Guia Menopausa",
    text: "Orientações para essa fase da vida.",
  },
  {
    icon: "utensils" as const,
    title: "Alimentação",
    text: "O que observar nas refeições — sem dieta milagrosa.",
  },
  {
    icon: "listChecks" as const,
    title: "Checklist de Sintomas",
    text: "Reconhecer cedo o que está acontecendo.",
  },
  {
    icon: "triangleAlert" as const,
    title: "Sinais de Alerta",
    text: "Quando agir em casa e quando ir ao médico.",
  },
  {
    icon: "shield" as const,
    title: "Método B.A.R.R.E.I.R.A™",
    text: "Oito frentes práticas de prevenção.",
  },
  {
    icon: "repeat" as const,
    title: "Rotina Preventiva",
    text: "Hábitos que viram automático.",
  },
] as const;

export const protocolLibraryCopy = {
  title: "Veja o que você encontra dentro do protocolo",
  lead: "Cada item é um entregável claro — para abrir no celular na hora certa.",
} as const;

export const strategyCategories = [
  "Primeiros Sintomas",
  "Viagem",
  "Sono",
  "Hidratação",
  "Menopausa",
  "Alimentação",
  "Médicos",
  "Checklists",
  "SOS",
  "Rotina",
] as const;

export const strategyCategoriesCopy = {
  title: "365 estratégias organizadas por situação",
  lead: "Tudo separado para você abrir no celular no momento certo — sem caçar dica na internet.",
} as const;

export const lifeAfterItems = [
  {
    icon: "plane" as const,
    title: "Viajar sem cálculo mental",
    text: "Checklist antes, durante e depois — menos “e se voltar?”.",
  },
  {
    icon: "moon" as const,
    title: "Dormir sem vigília",
    text: "Rotina noturna para a noite deixar de ser só banheiro.",
  },
  {
    icon: "heart" as const,
    title: "Intimidade com menos medo",
    text: "Hábitos claros depois da relação — sem culpa e sem achismo.",
  },
  {
    icon: "listChecks" as const,
    title: "Dia a dia com checklist",
    text: "Plano na mão em vez de pânico e dica solta de grupo.",
  },
] as const;

export const lifeAfterCopy = {
  title: "Imagine a rotina com um plano na mão",
  lead: "Não é só alívio da dor — é voltar a viver com organização.",
} as const;

export const pathCopy = {
  title: "O caminho, passo a passo",
  lead: "Você entende os gatilhos reais por trás das suas crises. Aplica um protocolo simples de alívio nas primeiras 24 horas quando os sintomas começam. Constrói uma rotina de prevenção contínua — hidratação certa, hábito pós-relação, cranberry na concentração que realmente funciona. E aprende a reconhecer os sinais que exigem ir ao médico sem demora. Não é mágica. É sistema.",
  cta: "Quero meu protocolo agora",
} as const;

export const idealForItems = [
  "Você já perdeu a conta de quantas caixas de antibiótico tomou este ano.",
  "Você já cancelou passeio, viagem ou encontro com medo da crise.",
  "Você já tentou cranberry, chá e antibiótico — e a infecção voltou.",
  "Você quer um plano claro, sem criar nada do zero.",
  "Você quer saber quando ir ao médico — sem milagre e sem enrolação.",
  "Você ama praticidade e leitura objetiva.",
];

export const whatYouGet = [
  {
    title: "PDF principal — Protocolo Blindada™",
    text: "Método B.A.R.R.E.I.R.A™ + 21 protocolos e estratégias para o dia a dia, no celular.",
  },
  {
    title: "Download em menos de 2 minutos",
    text: "Link imediato após o pagamento. Sem app, sem assinatura, sem espera de correio.",
  },
  {
    title: "Acesso vitalício + transparência",
    text: "O arquivo continua seu. Material educativo — não promete cura nem substitui o médico.",
  },
];

/** Checklist compacto da seção "Tudo o que você vai receber" (Protocolo Completo) */
export const offerStackChecklist = [
  "Protocolo Bexiga Blindada™ (PDF principal)",
  "Método B.A.R.R.E.I.R.A™",
  "365 estratégias + 21 protocolos",
  "Guia Alimentar",
  "Plano SOS Primeiros Sinais",
  "Kit Viagem Sem Medo",
  "Durma a Noite Toda",
  "Acesso vitalício",
] as const;

/** Grade 2 colunas — situações cobertas no material */
export const offerStackGrid = [
  "Primeiras 24 horas",
  "Hidratação prática",
  "Checklist de viagem",
  "Rotina noturna",
  "Sinais de alerta",
] as const;

export const offerStackCopy = {
  title: "Tudo o que você vai receber",
  badge: "Acesso imediato",
  cta: "Quero meu protocolo agora",
} as const;

export const bonusesSectionCopy = {
  title: "Você também recebe bônus exclusivos",
  lead: "Inclusos no Protocolo Completo — cada um com um entregável claro para usar no celular",
} as const;

export const bonusesGiftCopy = {
  badge: "Presente especial",
  title: "Compre agora e receba",
  highlight: "+ 4 bônus exclusivos:",
  freeToday: "Grátis hoje",
  footerPrefix: "Valor total dos bônus",
  footerSuffix: "tudo grátis hoje!",
} as const;

export const bonusDeliverables = [
  "Lista prática do que observar nas refeições — 1 guia objetivo.",
  "Checklist das primeiras horas quando os sinais aparecem.",
  "Checklist de 1 página: antes, durante e depois da viagem.",
  "Roteiro noturno simples para reduzir a vigilância no banheiro.",
] as const;

export const insidePreview = [
  {
    title: "Sumário do protocolo",
    caption: "Exemplo: capítulos e onde achar cada protocolo no PDF.",
  },
  {
    title: "Checklist SOS — 24 horas",
    caption: "Exemplo: o que organizar nas primeiras horas dos sinais.",
  },
  {
    title: "Sinais de alerta",
    caption: "Exemplo: quando o material manda você procurar o médico.",
  },
] as const;

export const afterPurchaseSteps = [
  {
    title: "1. Pague com segurança",
    text: "Escolha o Protocolo Essencial ou o Completo. Pagamento único — sem assinatura.",
  },
  {
    title: "2. Baixe no celular",
    text: "Após a confirmação, o PDF fica disponível para download imediato.",
  },
  {
    title: "3. Aplique o dia 1",
    text: "Abra o checklist SOS ou a rotina preventiva e comece pelo primeiro passo.",
  },
] as const;

/** TODO: substituir por prints reais de WhatsApp */
export const whatsappTestimonials = [
  {
    name: "Márcia",
    avatarKey: "marcia" as const,
    messages: [
      {
        text: "Menina, eu tô PASSADA com o SOS das primeiras horas 😮 Parecia que eu só entrava em pânico… agora eu abro o checklist e sei o que fazer.",
        time: "14:30",
      },
      {
        text: "Abri o plano das 24h no celular e segui passo a passo. Foi a primeira vez que não fiquei só no medo.",
        time: "14:31",
      },
      {
        text: "Não é milagre, é organização. Pela primeira vez senti que tinha um plano, não mais remédio solto 🙌",
        time: "14:33",
      },
    ],
  },
  {
    name: "Luciana",
    avatarKey: "luciana" as const,
    messages: [
      {
        text: "Gente, marquei um fim de semana SEM aquele cálculo mental de “e se voltar?” 🧳",
        time: "19:12",
      },
      {
        text: "O checklist de viagem valeu sozinho. Baixei no celular e consultei no aeroporto.",
        time: "19:13",
      },
      {
        text: "Tô amando esse protocolo! Tudo em um lugar só, sem ficar caçando dica em grupo 🤩",
        time: "19:15",
      },
    ],
  },
  {
    name: "Helena",
    avatarKey: "helena" as const,
    messages: [
      {
        text: "É direto, sem enrolação. Consigo consultar no celular sem me perder 📱",
        time: "10:04",
      },
      {
        text: "A parte dos sinais de alerta me deu segurança — sei quando agir em casa e quando ir ao médico.",
        time: "10:05",
      },
      {
        text: "A rotina de 30 dias tá salvando. Simples de seguir e não promete milagre.",
        time: "10:07",
      },
    ],
  },
  {
    name: "Patrícia",
    avatarKey: "patricia" as const,
    messages: [
      {
        text: "Depois de tantas infecções repetidas, eu só queria voltar a viver 😮‍💨",
        time: "16:02",
      },
      {
        text: "O protocolo me organizou — e a garantia de 7 dias me deu coragem pra tentar.",
        time: "16:03",
      },
      {
        text: "Hoje eu abro o PDF no celular e sei por onde começar. Sem enrolação.",
        time: "16:05",
      },
    ],
  },
  {
    name: "Sônia",
    avatarKey: "sonia" as const,
    messages: [
      {
        text: "O kit de viagem valeu sozinho ✈️",
        time: "11:20",
      },
      {
        text: "Marquei um fim de semana sem ficar calculando banheiro o tempo todo.",
        time: "11:21",
      },
      {
        text: "Checklist antes, durante e depois. Simples e direto. Recomendo demais!",
        time: "11:23",
      },
    ],
  },
  {
    name: "Renata",
    avatarKey: "renata" as const,
    messages: [
      {
        text: "Não é milagre. É organização. E era isso que faltava entre uma crise e outra.",
        time: "20:44",
      },
      {
        text: "As 365 estratégias parecem muita coisa, mas tá tudo separado por situação — eu acho fácil.",
        time: "20:45",
      },
      {
        text: "Finalmente parei de juntar dica de internet com chá aleatório 😅",
        time: "20:47",
      },
    ],
  },
  {
    name: "Cláudia",
    avatarKey: "claudia" as const,
    messages: [
      {
        text: "Eu já tinha desistido de “mais um chá”…",
        time: "13:08",
      },
      {
        text: "Ter um passo a passo claro me deu segurança pra agir sem culpa.",
        time: "13:09",
      },
      {
        text: "O SOS das primeiras horas mudou meu padrão. Menos pânico, mais plano 💚",
        time: "13:11",
      },
    ],
  },
  {
    name: "Andréa",
    avatarKey: "andrea" as const,
    messages: [
      {
        text: "O que mais me pegou foi saber quando ir ao médico.",
        time: "08:55",
      },
      {
        text: "Parece simples, mas ninguém tinha me dito com essa objetividade.",
        time: "08:56",
      },
      {
        text: "Rotina noturna + checklist médico. Tô consultando quase todo dia no celular 📱",
        time: "08:58",
      },
    ],
  },
] as const;

export const costOfWaiting = {
  title: "O verdadeiro custo de continuar esperando",
  body: "Praticamente nada — R$27 e vinte minutos de leitura, com garantia de 7 dias. O que você realmente tem a perder, continuando exatamente como está, é o próximo ano inteiro repetindo o mesmo ciclo de dor, vergonha e antibiótico que já te esgotou até aqui.",
} as const;

export const finalCopy = {
  h2: "Chega de aceitar isso como normal.",
  lead: "Baixe agora o Protocolo Bexiga Blindada™.",
  cta: "Quero o protocolo agora",
} as const;

export const upgradeBump = {
  title: "Por mais R$9,90 leve o Protocolo Completo + 4 bônus!",
  price: BUMP_PRICE,
  bullets: [
    "Produto principal: Protocolo Bexiga Blindada™",
    "Bônus 1 — Guia Alimentar",
    "Bônus 2 — Plano SOS Primeiros Sinais",
    "Bônus 3 — Kit Viagem Sem Medo",
    "Bônus 4 — Durma a Noite Toda",
  ],
};

/** Avatar keys alinhados aos arquivos em src/assets */
export const testimonialAvatarKeys: Record<string, string> = {
  Márcia: "marcia",
  Luciana: "luciana",
  Helena: "helena",
  Patrícia: "patricia",
  Sônia: "sonia",
  Renata: "renata",
  Cláudia: "claudia",
  Andréa: "andrea",
};

export function checkoutHref(
  plan: PlanId,
  bumpIds: readonly CheckoutBumpId[] = [],
) {
  const params = new URLSearchParams({ plan });
  const bumps = serializeBumpIds(bumpIds);
  if (bumps) params.set("bumps", bumps);
  return `/checkout?${params.toString()}`;
}

export function planTotal(
  plan: PlanId,
  bumpIds: readonly CheckoutBumpId[] = [],
) {
  return plans[plan].price + bumpsTotal(bumpIds);
}
