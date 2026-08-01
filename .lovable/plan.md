# Corrigir "Pagamento com cartão indisponível no momento"

## Situação atual

O checkout já oferece **somente PIX e cartão de crédito** — não há boleto nem outro meio. Isso permanece como está.

O aviso "Pagamento com cartão indisponível no momento" aparece porque o formulário de cartão só habilita quando recebe a chave pública do Mercado Pago, e essa chave é buscada no servidor **depois** que a página carrega. Enquanto a resposta não chega — ou se ela falha no site publicado — o formulário assume que o cartão está indisponível e mostra o aviso. No ambiente de desenvolvimento a chave chega normalmente, então o problema é de carregamento/estado, não de ausência de credencial.

## O que vai ser feito

1. **Entregar a chave junto com a página**: a chave pública passa a vir no carregamento da rota `/checkout` (loader), em vez de ser buscada depois. O formulário de cartão já nasce pronto, sem janela de "indisponível".
2. **Aviso só quando for verdade**: enquanto a chave estiver carregando, o formulário mostra um estado neutro de carregamento. A mensagem de indisponibilidade só aparece se a busca realmente falhar ou a credencial estiver vazia.
3. **Nova tentativa automática**: se a primeira busca falhar, o checkout tenta de novo antes de bloquear o cartão, e exibe um botão "Tentar de novo" em vez de um beco sem saída.
4. **Erro claro no envio**: se alguém clicar em Finalizar pagamento com o cartão sem a chave, a mensagem explica e sugere pagar no PIX, em vez de falhar silenciosamente.
5. **Verificação no site publicado**: depois do ajuste, confirmo no ambiente publicado que a aba Cartão abre com os campos, detecta a bandeira e lista as parcelas, e que o PIX continua gerando QR Code.

## Detalhes técnicos

- `src/routes/checkout.tsx`: `getPaymentConfig` migra para o `loader` da rota (server function pública, sem auth — segura para prerender), consumido via `Route.useLoaderData()`; remove o `useEffect` + `useState("")` da chave. Mantém fallback client-side com uma retentativa se o loader retornar vazio.
- `src/components/checkout/CardForm.tsx`: nova prop `status: "loading" | "ready" | "unavailable"`; o `useEffect` que seta `sdkError` a partir de `!publicKey` é substituído por essa prop, eliminando o falso negativo. Skeleton nos campos durante `loading`.
- `src/lib/payments.functions.ts` — `getPaymentConfig` passa a retornar também `available: boolean` para o cliente distinguir "sem credencial" de "falha de rede".
- Sem mudança de schema, de RLS ou do fluxo de PIX/webhook.
