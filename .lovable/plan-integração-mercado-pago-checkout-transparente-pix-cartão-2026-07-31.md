# Integração Mercado Pago — Checkout Transparente (PIX + Cartão)

O pagamento acontece dentro do próprio site, sem redirecionar. Duas formas: PIX (QR Code e copia e cola na tela) e cartão de crédito (dados digitados no site e tokenizados pelo Mercado Pago — o site nunca guarda o número do cartão).

## Como vai funcionar para a cliente

**PIX**
1. Preenche os dados, escolhe PIX e clica em Finalizar pagamento.
2. A tela mostra o QR Code, o código copia e cola e um contador de expiração (30 min).
3. A página verifica o pagamento sozinha; assim que o banco confirma, ela é levada automaticamente para a página de obrigado com o download liberado.

**Cartão**
1. Escolhe cartão: aparecem os campos (número, nome impresso, validade, CVV) e o seletor de parcelas com os valores calculados pelo Mercado Pago.
2. Clica em Finalizar pagamento; a aprovação normalmente é imediata e ela vai direto para a página de obrigado.
3. Se o cartão for recusado, aparece a mensagem exata do motivo (saldo, CVV, dados incorretos) e ela pode tentar de novo sem perder o formulário.

## Credenciais necessárias

Preciso de duas chaves do painel do Mercado Pago (Suas integrações > Credenciais):
- **Access Token** (privado, fica só no servidor) — guardado com segurança como segredo.
- **Public Key** (pública, pode ficar no código) — usada para tokenizar o cartão no navegador.

Começamos com as chaves de teste e trocamos pelas de produção quando você aprovar. Sem elas nada é cobrado de verdade.

## Detalhes técnicos

1. **SDK e libs**: pacote `mercadopago` no servidor + MercadoPago.js V2 carregado por `<script>` no `__root.tsx` para tokenização do cartão e detecção de bandeira.
2. **Server functions** em `src/lib/payments.functions.ts` (chave secreta nunca vai ao cliente):
   - `createPixPayment` — `POST /v1/payments` com `payment_method_id: "pix"`, payer (nome, sobrenome, e-mail, CPF) e `external_reference` = id do pedido; retorna QR base64, código copia e cola e expiração.
   - `createCardPayment` — recebe `token`, `payment_method_id`, `issuer_id`, `installments`; cria o pagamento e retorna `status`/`status_detail`.
   - `getPaymentStatus` — consulta por id, usada no polling do PIX.
   - Valor **recalculado no servidor** a partir de `plan` + `bumpIds` (nunca confia no total enviado pelo cliente), com a mesma validação Zod já existente.
   - Header `X-Idempotency-Key` por tentativa para evitar cobrança duplicada.
3. **Banco**: migração adicionando em `orders` as colunas `mp_payment_id`, `status_detail` e `paid_at`, com índice em `mp_payment_id`. O pedido é gravado antes de criar o pagamento e atualizado pelo servidor. Leitura de status só via server function (RLS segue sem SELECT público).
4. **Webhook**: rota `src/routes/api/public/mercadopago-webhook.ts` que recebe as notificações, valida a assinatura (`x-signature` HMAC com o secret do webhook), consulta o pagamento e atualiza `orders.status` para `aprovado`/`recusado`/`pendente`. Depois de criada eu te passo a URL para colar no painel do Mercado Pago, junto com o pedido do secret de assinatura.
5. **UI do checkout** (`src/routes/checkout.tsx` + novos componentes em `src/components/checkout/`):
   - `CardForm` com máscaras, bandeira detectada e parcelas vindas da API do MP.
   - `PixPanel` com QR, botão copiar, contador e polling a cada 4s (encerra em 30 min).
   - Estados de carregando/erro/aprovado; botão bloqueado durante o envio.
6. **Pixel**: mantém `AddPaymentInfo` no envio; `Purchase` continua na `/obrigado`, agora alcançada apenas com pagamento aprovado (o bypass de dev permanece só em desenvolvimento).
7. `src/lib/mercadopago.ts` (stub atual) é substituído pela integração real.

## Fora do escopo

Boleto, assinatura recorrente, reembolso pelo site e envio automático de e-mail com o PDF — dá para fazer depois.