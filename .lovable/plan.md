## Protocolo Bexiga Livre™ — Landing Page premium

Página única em `/` (substituindo o placeholder), mobile-first, estética Apple/Stripe/Calm: muito espaço em branco, teal sóbrio, cartões suaves, animações discretas.

### Direção visual (fixa, conforme briefing)
- Paleta em tokens semânticos no `src/styles.css` (oklch): primária `#0F766E`, secundária `#14B8A6`, fundo `#FFFFFF`, cards `#F8FAFC`, texto `#111827`, cinza `#64748B`, hover `#115E59`.
- Tipografia Inter (carregada via `<link>` no `__root.tsx`), escala: H1 48px (mobile 34px), subtítulo 22px, corpo 18px, alta legibilidade 40+.
- Raio generoso (16–24px), sombras muito leves, sem gradientes chamativos, sem cara de infoproduto.

### Estrutura da página (na ordem)
1. **Hero** duas colunas — headline emocional ("O pior da infecção urinária não é a dor. É viver esperando que ela volte."), subheadline, CTA verde, 4 selos (educativo / acesso imediato / R$27 / garantia 7 dias). Direita: imagem gerada de mulher madura sorrindo caminhando na praia — leveza e liberdade, nunca doença.
2. **Antes → Protocolo → Depois** — linha do tempo emocional de transformação (o diferencial pedido), empilhada no mobile.
3. **"Você não sofre apenas com uma infecção"** — 4 cards: viajar, dormir, intimidade, sair; ícones/ilustrações premium em linha fina.
4. **"Você já tentou de tudo"** — timeline vertical (água, antibiótico, cranberry, chá, promessas → a infecção volta) fechando com "O problema nunca foi falta de esforço. Foi falta de um plano."
5. **Conheça o Protocolo** — mockup premium (visual de protocolo clínico moderno, não ebook) + texto: não promete cura, não substitui médico, organiza o que deveria ter sido ensinado na primeira infecção.
6. **Método L.I.V.R.E.** — 5 cards elegantes (Liberdade, Informação, Vigilância, Rotina, Estratégias).
7. **O que você recebe hoje** — 7 cards, cada um parecendo produto independente (Protocolo, Guia Alimentar, Plano SOS, Kit Viagem, Durma a Noite Toda, Plano 30 Dias, Checklist).
8. **Imagine sua rotina daqui a alguns meses** — seção emocional com imagens (dormindo, viajando, café, passeio), vendendo identidade.
9. **Por que é diferente** — comparação Internet (disperso → confusão) vs Protocolo (plano, checklist, rotina, método).
10. **FAQ** — accordion shadcn com as 6 perguntas do briefing.
11. **Oferta** — R$47 riscado → R$27, pagamento único, garantia de 7 dias, botão grande.
12. **CTA final** — "Chega de organizar sua vida em torno do medo da próxima crise." + botão "QUERO VOLTAR A VIVER".
13. **Rodapé discreto** com aviso legal (conteúdo educativo, não substitui orientação médica).

### Detalhes técnicos
- TanStack Start + React + Tailwind v4 + shadcn/ui (accordion, button, card) + Framer Motion apenas para fade/slide sutis no scroll (`whileInView`, uma vez, respeitando `prefers-reduced-motion`).
- Componentes separados em `src/components/landing/*` (Hero, BeforeAfter, FearCards, TriedEverything, ProtocolIntro, MethodLivre, Deliverables, FutureRoutine, Comparison, Faq, Offer, FinalCta, Footer).
- Imagens geradas (hero, mockup do protocolo, cena de rotina), servidas como assets otimizados com `loading="lazy"` fora da primeira dobra.
- SEO: `head()` próprio na rota `/` com title/description/og/twitter, H1 único, HTML semântico, alt em todas as imagens, JSON-LD de Product/FAQPage.
- Sem backend: todos os CTAs apontam para uma constante `CHECKOUT_URL` (placeholder `#` até você informar o link de pagamento) — troca em um só lugar.

### O que preciso de você depois
O link do checkout para plugar nos botões.
