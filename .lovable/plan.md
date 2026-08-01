# Upgrade do Essencial por R$9,90 (total R$19,90)

## Problema
No modal de upgrade, ao aceitar "+R$9,90", o funil manda a pessoa para o plano **Completo a R$27** — e não para R$10 + R$9,90 = **R$19,90**.

## O que muda
Aceitar o upgrade passa a levar para o checkout com o **Essencial (R$10) + item de upgrade (R$9,90) = R$19,90**, já com os 4 bônus inclusos. Quem compra o Completo direto no card de preços continua pagando R$27.

## Detalhes técnicos
1. `src/components/landing/offer-data.ts`
   - Novo id de order bump `"upgrade-completo"` (preço 9,90, valor de comparação 168) na lista `checkoutBumps`, marcado como item de upgrade para não aparecer como bump avulso na lista normal do checkout.
2. `src/components/landing-v2/OrderBumpModals.tsx`
   - Botão "SIM! QUERO O PROTOCOLO COMPLETO" passa a navegar para `/checkout?plan=basico&bumps=upgrade-completo` (em vez de `plan=completo`), com o valor correto no evento AddToCart (19,90).
3. Checkout (`src/routes/checkout.tsx`, `CheckoutHero`, `CheckoutOrderSummary`)
   - Exibir o upgrade como linha própria no resumo ("Upgrade Protocolo Completo + 4 bônus — R$9,90") e listar os 4 bônus como inclusos quando o upgrade estiver presente.
   - Filtrar o upgrade da grade de order bumps opcionais (ele não é escolhível ali).
4. Total do servidor: `planTotal`/`amountFor` já somam `bumpsTotal`, então o valor cobrado no Mercado Pago (PIX e cartão) e o `total_cents` gravado no pedido saem automaticamente como R$19,90 — sem alterar a lógica de pagamento.

## Verificação
- Fluxo "Quero o Essencial" → aceitar upgrade → checkout mostra R$19,90.
- "Não, obrigada" continua em R$10; card do Completo continua em R$27.
- Bumps opcionais (Intimidade, Calendário, Cranberry) continuam somando corretamente por cima.
