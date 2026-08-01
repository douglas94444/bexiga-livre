# Corrigir "pagamento com cartão indisponível" no site publicado

## Diagnóstico (reproduzido no site publicado)

Abrindo `/checkout` direto pelo link, o cartão funciona. O erro aparece quando a pessoa **clica no botão da oferta** e vai para o checkout sem recarregar a página. Nesse caminho, todas as chamadas ao servidor falham **antes de sair do navegador** (nenhuma requisição chega a ser enviada).

Causa: há um middleware global de autenticação registrado em `src/start.ts` que, a cada chamada ao servidor, inicializa o cliente do backend no navegador. No build publicado faltam as variáveis públicas do backend, então esse cliente quebra e derruba a chamada — foi exatamente o que apareceu 3 vezes no console (`Missing Supabase environment variable(s)`), uma por tentativa (carregamento + 2 retentativas), terminando em "Não conseguimos carregar o pagamento com cartão agora".

Efeito colateral do mesmo problema: gerar PIX e finalizar o cartão também falham nesse fluxo de navegação interna.

O aplicativo **não usa login em lugar nenhum** — nenhuma função do servidor exige autenticação — portanto esse middleware é desnecessário e serve apenas como ponto de falha.

## Correções

1. **Remover o middleware de autenticação das chamadas do cliente** (`src/start.ts`), mantendo os middlewares de erro e CSRF. Isso elimina a dependência das variáveis públicas no navegador e faz cartão e PIX voltarem a funcionar.
2. **Blindar o checkout**: se a configuração de pagamento vier vazia, exibir mensagem sugerindo o PIX, mantendo o botão "Tentar de novo" já existente.
3. **CSP**: liberar `https://cdn.gpteng.co` em `font-src` para limpar o aviso de fonte bloqueada (os bloqueios de `frame-src`/`form-action` vêm de scripts de terceiros do editor/pixel e não afetam o pagamento).
4. **Meta Pixel duplicado**: o `init` está rodando mais de uma vez; adicionar guarda para inicializar o pixel apenas uma vez.
5. **Republicar** e revalidar no ar: clicar em "Quero o Completo" → checkout → aba Cartão deve mostrar os campos, e o PIX deve gerar QR Code.

## Fora de escopo

Não vou mexer nas credenciais do Mercado Pago — já estão configuradas e a chave pública chega corretamente ao checkout no carregamento direto.