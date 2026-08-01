# Área de acesso para quem já comprou

Nova página `/acesso` onde o cliente informa **e-mail + CPF ou telefone** usados na compra e recebe a lista de downloads do pedido dele.

## Como funciona

1. Cliente abre `/acesso` e preenche e-mail e (CPF ou telefone).
2. O servidor procura um pedido **pago** com esse e-mail e confere o segundo dado (CPF ou telefone, comparando só os dígitos).
3. Encontrando: mostra o que ele comprou (plano, bônus e ofertas adicionais) e os botões de download — a mesma lista da página de obrigado.
4. Não encontrando: mensagem neutra ("não localizamos um pedido pago com esses dados"), com link para o suporte e para o checkout.

Se o pedido não tiver CPF nem telefone salvos, a verificação usa apenas o e-mail para aquele pedido — caso contrário o cliente ficaria sem acesso.

## Onde aparece o link

- Botão "Já comprei? Acessar meu material" na página `/obrigado`.
- Link discreto no rodapé da landing page.

## Detalhes técnicos

- `src/lib/access.functions.ts`: server function pública `findOrderAccess` com validação Zod (e-mail obrigatório, documento opcional com mínimo de dígitos). Usa o cliente admin carregado dentro do handler para ler `orders` (a tabela é fechada por RLS de propósito) e retorna **apenas** `{ plan, bumps, total_cents, paid_at }` — nenhum dado pessoal volta ao navegador.
- Consulta: status pago (`aprovado`/`approved`/`paid`) + e-mail normalizado (lowercase/trim); comparação de CPF/telefone feita no servidor sobre os dígitos.
- Proteção contra tentativa em massa: atraso fixo por requisição e limite simples por e-mail; mensagem de erro sempre idêntica.
- `src/routes/acesso.tsx`: rota pública com `head()` próprio (`noindex`), formulário com `useMutation` sobre `useServerFn`, estados de carregando/erro, reaproveitando a listagem de downloads extraída da `/obrigado` para um componente compartilhado `src/components/access/DeliverablesList.tsx`.
- Sem envio de e-mail e sem login — nenhuma dependência nova e nenhuma mudança no banco.

## Observação importante

Os PDFs continuam em `public/`, então quem tiver a URL direta ainda baixa sem passar pela verificação. É um portão de conveniência, não uma proteção real. Para fechar de verdade, o passo seguinte é mover os arquivos para storage privado com links assinados (já descrito em `docs/delivery-gate.md`) — posso fazer isso depois.