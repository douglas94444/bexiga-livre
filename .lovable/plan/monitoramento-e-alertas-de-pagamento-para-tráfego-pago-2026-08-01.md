# Monitoramento e alertas de pagamento para tráfego pago

## O que já existe hoje

- `/api/public/health` — retorna `ok` ou `degradado` e checa app, banco, credenciais Mercado Pago e middleware de checkout.
- Logs do servidor — erros de `console.error` no checkout, webhook e chamadas ao Mercado Pago são enviados aos logs do Worker.
- Tabela `public.orders` — guarda status (`iniciado`, `aprovado`, `recusado`, `pendente`, `estornado`), meio de pagamento, valor e IDs do Mercado Pago.
- Health check já detecta se o middleware `safeSupabaseAuth` sumiu e se as credenciais do Mercado Pago estão presentes.

## O que falta para você detectar erros rapidamente

Hoje não há uma forma centralizada de saber, em tempo real, se um pagamento falhou para uma cliente. Você precisa abrir logs ou consultar o banco manualmente. O plano abaixo cria:

1. Endpoint de métricas de checkout (`/api/public/checkout-metrics`)
2. Página interna de acompanhamento de pedidos (`/admin/pedidos`) protegida por um segredo simples
3. Alertas automáticos para Discord/Slack ou e-mail quando houver falhas de pagamento
4. Dashboard de resumo no health check com contagem de pedidos e taxa de recusa

## Implementação

### 1. Endpoint de métricas de checkout

Criar `src/routes/api/public/checkout-metrics.ts` com uma server route `GET` que retorna, em JSON, sem dados pessoais:

```text
- total_orders_24h
- approved_orders_24h
- rejected_orders_24h
- pending_orders_24h
- failure_rate_24h
- last_order_at
- payment_method_split (pix vs card)
```

Esse endpoint pode ser consultado a qualquer momento e usado por um monitor externo (UptimeRobot, Pingdom, etc).

### 2. Página de acompanhamento de pedidos

Criar `src/routes/admin/pedidos.tsx` com uma server route `GET` que exibe uma tabela simples dos últimos 50 pedidos, ordenados do mais recente.

- Proteção por uma senha de ambiente (`ADMIN_SECRET`) enviada via query string `?secret=...` ou header.
- Colunas: data, status, meio de pagamento, valor, nome (mascarado), e-mail (mascarado), ID do pedido, ID do pagamento MP.
- Sem acesso a dados sensíveis completos (CPF/telefone não aparecem).
- Caso `ADMIN_SECRET` não esteja configurado, a rota responde 404 para não revelar a existência da página.

### 3. Alertas automáticos de falha

Criar `src/lib/alerting.server.ts` com uma função `sendPaymentAlert` que envia uma mensagem quando ocorre:

- Erro de comunicação com Mercado Pago (rede, timeout, 5xx)
- Pedido criado mas pagamento recusado pelo MP
- Webhook recebe notificação de pagamento recusado/estornado
- Múltiplos pedidos `iniciado` sem conversão por mais de X minutos

Destinos suportados (configuráveis por segredos):

- Discord via webhook URL
- Slack via webhook URL
- E-mail via provedor SMTP (Resend, SendGrid, etc.) — opcional, depende de configuração

A função será chamada em pontos estratégicos:

- `src/lib/payments.server.ts` dentro de `mpFetch` quando houver erro de rede ou status >= 500
- `src/lib/payments.functions.ts` quando `createCardPayment` retornar recusado
- `src/routes/api/public/mercadopago-webhook.ts` quando notificação indicar `rejected` ou `cancelled`

### 4. Melhoria no health check

Adicionar em `/api/public/health`:

- Verificação de quantos pedidos `iniciado` existem nos últimos 30 minutos (indica possível falha no checkout)
- Verificação se `MERCADOPAGO_WEBHOOK_SECRET` está configurado
- Taxa de rejeição nos últimos 60 minutos (alerta se > 60%)

Não expor dados pessoais, apenas contadores e status.

### 5. Logs e onde acessar

Documentar para você:

- Health check: `https://protocolobexigablindada.lovable.app/api/public/health`
- Métricas: `https://protocolobexigablindada.lovable.app/api/public/checkout-metrics`
- Logs do servidor: disponíveis via ferramenta de logs do Lovable (server-function-logs)
- Banco: pode consultar `SELECT status, COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '24 hours' GROUP BY status`

## Resultado esperado

Você vai conseguir:

- Saber se o checkout está saudável em 5 segundos (health check)
- Ver quantos pedidos foram aprovados/recusados nas últimas horas sem escrever SQL
- Receber alerta imediato no Discord/Slack quando houver instabilidade no pagamento
- Consultar os últimos pedidos em uma página protegida, sem expor dados sensíveis

## Fora do escopo

- Painel administrativo completo com filtros avançados
- Integração com provedor de e-mail transacional (pode ser feito depois)
- Análise detalhada de funil de conversão (isso fica no Meta Ads)
