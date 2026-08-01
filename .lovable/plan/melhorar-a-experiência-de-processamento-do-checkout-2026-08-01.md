# Melhorar a experiência de processamento do checkout

## Objetivo

Ajustar o feedback visual durante o processamento de pagamento no `/checkout`, mantendo a interface minimalista e adicionando uma confirmação de sucesso antes do redirecionamento para `/obrigado`.

## Escopo

1. **Botão de submit com spinner mais evidente**
   - Substituir o texto simples "Preparando pagamento…" por um botão que mostre um spinner animado + rótulo curto ("Processando…" / "Finalizando…").
   - O spinner deve ficar à esquerda do texto, centralizado, com opacidade reduzida no botão e cursor bloqueado (`disabled`).
   - Manter o botão visível e na posição atual do formulário (não usar overlay/tela cheia).

2. **Estado de sucesso breve para cartão aprovado**
   - Quando `createCardPayment` retornar `approved: true`, renderizar um card/estado de sucesso centralizado com ícone de check, título "Pagamento aprovado!" e subtítulo "Vamos liberar seu acesso agora.".
   - Aguardar ~1.5–2 segundos nesse estado antes de chamar `goToThankYou()`.
   - Durante esse delay, o botão/formulário fica oculto e o spinner/estado de sucesso ocupa o lugar da área de pagamento.

3. **Nenhuma mensagem calmante adicional**
   - Não adicionar textos explicativos extras do tipo "Não feche a página" ou "Isso leva só alguns segundos".
   - Manter a comunicação minimalista alinhada à estética atual (Apple/Stripe/Linear).

4. **Comportamento do PIX inalterado**
   - Após gerar o QR Code, continua exibindo o `PixPanel` normalmente.
   - O botão de submit continua com o spinner durante a geração do PIX.

## Arquivos envolvidos

- `src/routes/checkout.tsx` — estado `submitting`, estado de sucesso do cartão, renderização condicional e delay antes de `goToThankYou()`.
- `src/components/checkout/CardForm.tsx` — se necessário, garantir que o formulário respeite o estado `disabled` do pai durante o processamento.

## Validação

- Verificar visualmente que o botão exibe spinner animado ao clicar em "Finalizar pagamento" (PIX e cartão).
- Verificar que, após pagamento com cartão aprovado, aparece o estado de sucesso por ~1.5–2s antes de redirecionar para `/obrigado`.
- Confirmar que não há regressão no PIX (QR Code continua gerando e a página de obrigado continua funcionando).
