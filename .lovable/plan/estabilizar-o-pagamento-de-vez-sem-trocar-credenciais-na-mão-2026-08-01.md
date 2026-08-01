# Estabilizar o pagamento de vez (sem trocar credenciais na mão)

## O que está acontecendo

O backend não está "caindo". O que quebra é um trecho de código do app: o arquivo `src/start.ts` voltou a registrar o middleware `attachSupabaseAuth`.

Esse middleware roda **no navegador** antes de qualquer chamada de servidor (inclusive a que cria o pagamento com cartão/PIX). Ele tenta inicializar o cliente do backend no navegador e, quando as variáveis públicas não estão presentes no build publicado, ele **lança um erro** — e a chamada de pagamento nem chega a sair. Daí:

- `Missing Supabase environment variable(s)...`
- `Não conseguimos carregar o pagamento com cartão agora.`

Ele foi removido antes, mas é um arquivo que a integração do Cloud reescreve, então voltou. Por isso "um pagamento dá certo e o próximo dá erro": depende de qual build está servindo.

O app **não tem login** — nenhuma função de servidor exige usuário autenticado. Ou seja, esse middleware não serve para nada aqui, só cria risco.

## Solução (permanente, sem intervenção manual)

1. **Middleware à prova de falha**
   Criar `src/lib/supabase-auth-safe.ts`: um middleware próprio que tenta anexar o token do usuário, mas dentro de `try/catch` e com import dinâmico. Se o cliente do backend não puder ser criado, ele simplesmente segue a chamada sem token — nunca derruba o checkout.

2. **`src/start.ts` passa a registrar só o middleware seguro**
   Substituir `attachSupabaseAuth` por `safeSupabaseAuth`, com comentário explícito no topo do arquivo explicando por que não se deve reintroduzir o middleware gerado.

3. **Rede de segurança no checkout**
   Em `src/routes/checkout.tsx` / `src/lib/payments.functions.ts`: se a criação do pagamento falhar por erro de inicialização do cliente do backend (não por recusa do cartão), tentar novamente uma vez antes de mostrar mensagem de erro. Erros reais de pagamento continuam aparecendo normalmente para a cliente. Assim, mesmo que o arquivo gerado volte no futuro, o pagamento não trava.

4. **Verificação automática**
   Ampliar `/api/public/health` para também reportar se o middleware problemático está registrado, e rodar teste end-to-end (Playwright) gerando PIX real + carregando o formulário de cartão antes de encerrar.

## Detalhes técnicos

- `src/integrations/supabase/auth-attacher.ts` e `client.ts` são gerados automaticamente e não serão editados.
- `client.ts` lança exceção no construtor quando faltam `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`; o import dinâmico dentro de `try/catch` isola essa exceção.
- O CSRF middleware (`createCsrfMiddleware`) e o `errorMiddleware` continuam registrados como estão.
- Nada muda na integração com o Mercado Pago, nas tabelas de pedidos ou na página `/acesso`.

Depois de aplicado, é preciso **publicar a atualização** para o site em produção pegar a correção.