# Webhooks

## Cakto → Meta CAPI + GA4

Endpoint público de produção:

```txt
https://site.mundodigitalsolucoes.com.br/api/webhooks/cakto
```

Este endpoint recebe webhooks da Cakto e dispara o evento `Purchase` para:

- Meta Conversions API
- GA4 Measurement Protocol

## Variáveis de ambiente necessárias

Configure estas variáveis no ambiente do Coolify. Não versionar tokens reais no código.

```env
META_PIXEL_ID=
META_CAPI_ACCESS_TOKEN=
GA4_MEASUREMENT_ID=
GA4_API_SECRET=
CAKTO_WEBHOOK_SECRET=
```

## Eventos Cakto usados

O handler normaliza o payload recebido e considera como eventos de compra os webhooks relacionados a:

- Compra aprovada
- Assinatura criada
- Assinatura renovada

Também aceita variações comuns de status/evento como `approved`, `aprovado`, `paid`, `pago`, `renewed` e `renovada`.

## Teste do endpoint GET

```bash
curl -i https://site.mundodigitalsolucoes.com.br/api/webhooks/cakto
```

Resposta esperada:

```json
{ "ok": true, "endpoint": "cakto-webhook" }
```

## Teste do webhook POST

Exemplo com segredo no header:

```bash
curl -i -X POST https://site.mundodigitalsolucoes.com.br/api/webhooks/cakto \
  -H "content-type: application/json" \
  -H "x-cakto-webhook-secret: $CAKTO_WEBHOOK_SECRET" \
  -d '{
    "event": "compra aprovada",
    "status": "aprovado",
    "email": "cliente@example.com",
    "phone": "17999999999",
    "value": 4790,
    "currency": "BRL",
    "product_name": "Site Profissional",
    "order_id": "pedido_teste_001",
    "transaction_id": "transacao_teste_001"
  }'
```

Resposta esperada, quando o payload for aceito:

```json
{
  "ok": true,
  "event_id": "cakto_transacao_teste_001",
  "meta": "processed",
  "ga4": "processed"
}
```

Se as variáveis da Meta ou do GA4 estiverem ausentes, o handler registra aviso nos logs e retorna o processamento como aceito sem expor tokens.

## Logs no Coolify

Buscar por estes prefixos nos logs da aplicação:

```txt
[cakto-webhook] Webhook received
[cakto-webhook] Normalized Cakto event
[cakto-webhook] Meta CAPI error
[cakto-webhook] GA4 Measurement Protocol error
```

Os logs mascaram dados sensíveis como e-mail e telefone e não exibem tokens reais.
