# Corrigir de vez o erro de Supabase no pagamento

## O que encontrei

O problema **não está no Mercado Pago**. A integração (Checkout Transparente, PIX + cartão, tokenização, webhook) está de acordo com a documentação que você enviou.

A falha é a mesma regressão de antes, e ela voltou: o arquivo `src/start.ts` está **de novo** registrando o middleware gerado `attachSupabaseAuth`:

```text
functionMiddleware: [attachSupabaseAuth, safeSupabaseAuth]
```

Esse middleware roda no navegador antes de **toda** chamada de servidor (inclusive criar PIX e pagar com cartão) e inicializa o cliente do backend. Quando as variáveis públicas não estão no build publicado, ele lança:

`Missing Supabase environment variable(s): SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY`

e o checkout mostra "Não conseguimos carregar o pagamento com cartão agora". Como depende de qual build está servindo, dá certo numa tentativa e erra na seguinte.

O `safeSupabaseAuth` (tolerante a falhas) continua lá, mas ele roda **depois** — o gerado quebra antes.

## Correção

1. **Remover `attachSupabaseAuth`** do import e do array `functionMiddleware` em `src/start.ts`, deixando apenas `safeSupabaseAuth`.
2. **Blindar contra a regressão voltar**: como esse arquivo é reescrito pela integração do Cloud, mover a lista de middlewares para um módulo próprio (`src/lib/start-middleware.ts`) que filtra qualquer middleware vindo do auth-attacher gerado. Assim, mesmo que a integração reintroduza o import, ele não é registrado.
3. **Health check**: `/api/public/health` passa a reportar `checkout_middleware: "erro"` se o middleware gerado estiver registrado — hoje ele só confirma que o seguro existe, por isso a regressão passou despercebida.
4. **Verificação end-to-end** (Playwright) no preview e no site publicado: gerar PIX real com QR Code e carregar o formulário de cartão com bandeira/parcelas, sem nenhum erro de Supabase no console.

## Fora de escopo

- Nada muda no fluxo do Mercado Pago, nas credenciais, nas tabelas de pedidos ou na página `/acesso`.
- Não é necessário trocar credenciais manualmente.

Depois de aplicado é preciso **publicar** para a produção pegar a correção.
