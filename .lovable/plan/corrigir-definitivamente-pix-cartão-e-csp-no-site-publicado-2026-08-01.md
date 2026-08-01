# Corrigir definitivamente PIX, cartão e CSP no site publicado

## Diagnóstico confirmado

- O endpoint publicado de saúde está respondendo `ok` para aplicação, banco e credenciais do Mercado Pago. Portanto, as credenciais do servidor estão disponíveis.
- `src/start.ts` contém um comentário dizendo que o middleware `attachSupabaseAuth` não deve ser registrado neste app sem login, mas o código atual o registra em `functionMiddleware`.
- Esse middleware inicializa o cliente do backend no navegador antes de cada Server Function. No bundle publicado, isso gera exatamente o erro de variáveis ausentes mostrado no console e impede `getPaymentConfig`, PIX e cartão.
- A CSP atual permite parte dos domínios do Mercado Pago e Meta, mas os logs mostram requisições adicionais bloqueadas. Esses bloqueios serão tratados separadamente, sem mascarar a falha principal de pagamento.

## Implementação

1. **Remover a dependência indevida do cliente do backend no checkout**
   - Remover `attachSupabaseAuth` de `src/start.ts` e deixar `functionMiddleware` vazio, preservando os middlewares de erro e CSRF.
   - Não alterar os clientes gerados do Lovable Cloud.
   - Manter PIX, cartão, consulta de status e acesso do comprador como Server Functions públicas, pois nenhuma delas exige sessão de usuário.

2. **Blindar a arquitetura contra regressão**
   - Confirmar que nenhum caminho do checkout importa ou inicializa o cliente de navegador do backend.
   - Manter banco e credenciais apenas no servidor (`payments.server.ts` / cliente administrativo), sem depender de variáveis `VITE_*` para processar pagamentos.
   - Ajustar o health check, se necessário, para continuar refletindo o caminho real usado por PIX e cartão.

3. **Corrigir a CSP com lista mínima de provedores**
   - Capturar os hosts exatos usados pelo SDK do Mercado Pago no fluxo de cartão e liberar somente os necessários em `connect-src`, `frame-src` e `form-action`.
   - Separar os bloqueios do Meta Pixel dos bloqueios do checkout: liberar apenas endpoints legítimos e estáveis necessários ao Pixel, evitando curingas amplos para hosts genéricos de nuvem.
   - Preservar `default-src 'self'`, `frame-ancestors 'none'`, bloqueio de objetos e demais proteções existentes.

4. **Validar no fluxo que importa**
   - Verificar que `/checkout` recebe a chave pública e renderiza os campos de cartão sem a mensagem de indisponibilidade.
   - Preencher dados válidos e testar a criação de um PIX real até a exibição do QR Code/código copia e cola.
   - Testar a tokenização do cartão e confirmar que a chamada chega ao servidor; evitar uma cobrança real aprovada durante o teste.
   - Confirmar que o endpoint de saúde permanece `200`, que não há erro de variáveis do backend no navegador e que não restam bloqueios CSP relacionados ao Mercado Pago.
   - Validar também o site publicado após a atualização, pois o erro relatado ocorre no bundle publicado.

## Resultado esperado

PIX e cartão deixam de depender da inicialização do cliente de autenticação no navegador, continuam usando as credenciais seguras do servidor e funcionam no site publicado; a CSP permite apenas as comunicações legítimas necessárias ao Mercado Pago e ao Meta Pixel.