import { createHash, timingSafeEqual } from "node:crypto";

type JsonRecord = Record<string, unknown>;

type NormalizedCaktoEvent = {
  eventName: string;
  status?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  value: number;
  currency: string;
  productName: string;
  planName?: string;
  orderId?: string;
  transactionId?: string;
  subscriptionId?: string;
  dataId?: string;
  fbc?: string;
  fbp?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  eventId: string;
};

type RequestClientContext = {
  clientIpAddress?: string;
  clientUserAgent?: string;
};

const ENDPOINT_NAME = "cakto-webhook";
const SITE_URL = "https://site.mundodigitalsolucoes.com.br/";
const META_API_VERSION = "v20.0";
const EXTERNAL_REQUEST_TIMEOUT_MS = 8_000;

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init?.headers ?? {}),
    },
  });
}

function getEnv(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

function safeHeaderNames(headers: Headers): string[] {
  return [...headers.keys()].filter(Boolean).sort();
}

function mask(value?: string) {
  if (!value) return undefined;
  if (value.length <= 8) return "***";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findValue(input: unknown, keys: string[], maxDepth = 6): unknown {
  const wantedKeys = new Set(keys.map(normalizeKey));

  function walk(value: unknown, depth: number): unknown {
    if (depth > maxDepth || value == null) return undefined;

    if (Array.isArray(value)) {
      for (const item of value) {
        const found = walk(item, depth + 1);
        if (found !== undefined) return found;
      }
      return undefined;
    }

    if (!isRecord(value)) return undefined;

    for (const [key, child] of Object.entries(value)) {
      if (wantedKeys.has(normalizeKey(key)) && child !== undefined && child !== null && child !== "") {
        return child;
      }
    }

    for (const child of Object.values(value)) {
      const found = walk(child, depth + 1);
      if (found !== undefined) return found;
    }

    return undefined;
  }

  return walk(input, 0);
}

function getPathValue(input: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!isRecord(current)) return undefined;
    const exact = current[segment];
    if (exact !== undefined) return exact;

    const normalizedSegment = normalizeKey(segment);
    const matchingKey = Object.keys(current).find((key) => normalizeKey(key) === normalizedSegment);
    return matchingKey ? current[matchingKey] : undefined;
  }, input);
}

function firstValue(input: unknown, paths: string[]): unknown {
  for (const path of paths) {
    const value = path.includes(".") ? getPathValue(input, path) : findValue(input, [path]);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function firstString(input: unknown, paths: string[]) {
  return asString(firstValue(input, paths));
}

function asString(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return String(value);
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value
      .replace(/\s/g, "")
      .replace(/^R\$/i, "")
      .replace(/\./g, "")
      .replace(",", ".");
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function normalizeMoney(value: unknown) {
  const parsed = asNumber(value);
  if (parsed === undefined) return 0;

  // Cakto and gateways commonly send BRL cents for checkout values.
  // Examples: 4790 => 47.90, 39700 => 397.00.
  if (Number.isInteger(parsed) && parsed > 1_000) {
    return Number((parsed / 100).toFixed(2));
  }

  return Number(parsed.toFixed(2));
}

function normalizeEmail(email?: string) {
  return email?.trim().toLowerCase();
}

function normalizePhone(phone?: string) {
  const digits = phone?.replace(/\D/g, "");
  return digits || undefined;
}

function normalizeHeaderValue(value?: string | null) {
  return value?.trim() || undefined;
}

function getClientIpAddress(headers: Headers) {
  const cloudflareIp = normalizeHeaderValue(headers.get("cf-connecting-ip"));
  if (cloudflareIp) return cloudflareIp;

  const forwardedFor = normalizeHeaderValue(headers.get("x-forwarded-for"));
  const firstForwardedIp = forwardedFor
    ?.split(",")
    .map((ip) => ip.trim())
    .find(Boolean);
  if (firstForwardedIp) return firstForwardedIp;

  return normalizeHeaderValue(headers.get("x-real-ip"));
}

function getRequestClientContext(request: Request): RequestClientContext {
  return {
    clientIpAddress: getClientIpAddress(request.headers),
    clientUserAgent: normalizeHeaderValue(request.headers.get("user-agent")),
  };
}

function sha256(value?: string) {
  if (!value) return undefined;
  return createHash("sha256").update(value).digest("hex");
}

function stableHash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function timingSafeCompare(a?: string, b?: string) {
  if (!a || !b) return false;
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

function getSecretCandidates(request: Request, payload: unknown) {
  const url = new URL(request.url);
  const authorization = request.headers.get("authorization") ?? undefined;
  const bearer = authorization?.toLowerCase().startsWith("bearer ")
    ? authorization.slice(7).trim()
    : undefined;

  return [
    request.headers.get("x-cakto-signature"),
    request.headers.get("x-cakto-secret"),
    request.headers.get("x-cakto-webhook-secret"),
    request.headers.get("x-webhook-secret"),
    request.headers.get("webhook-secret"),
    request.headers.get("x-signature"),
    bearer,
    url.searchParams.get("secret"),
    url.searchParams.get("webhook_secret"),
    asString(findValue(payload, ["webhook_secret", "webhookSecret", "secret", "signature"])),
  ].filter(Boolean) as string[];
}

function validateWebhookSecret(request: Request, payload: unknown) {
  const expectedSecret = getEnv("CAKTO_WEBHOOK_SECRET");
  if (!expectedSecret) {
    return { ok: false as const, status: 500, message: "CAKTO_WEBHOOK_SECRET is not configured" };
  }

  const candidates = getSecretCandidates(request, payload);
  const matched = candidates.some((candidate) => timingSafeCompare(candidate, expectedSecret));

  return matched
    ? { ok: true as const }
    : {
        ok: false as const,
        status: 401,
        message: "Invalid webhook secret",
      };
}

function normalizeCaktoPayload(payload: unknown, rawBody: string): NormalizedCaktoEvent {
  const eventName =
    firstString(payload, ["data.event", "event", "event_name", "eventName", "event_type", "eventType", "type"]) ??
    "cakto_webhook";

  const status = firstString(payload, [
    "data.status",
    "status",
    "payment_status",
    "paymentStatus",
    "order_status",
    "orderStatus",
  ]);
  const customerName = firstString(payload, [
    "data.customer.name",
    "data.subscription.customer.name",
    "customer_name",
    "customerName",
    "buyer_name",
    "buyerName",
    "name",
  ]);
  const email = normalizeEmail(
    firstString(payload, [
      "data.customer.email",
      "data.subscription.customer.email",
      "customer_email",
      "customerEmail",
      "buyer_email",
      "buyerEmail",
      "email",
    ]),
  );
  const phone = normalizePhone(
    firstString(payload, [
      "data.customer.phone",
      "data.subscription.customer.phone",
      "customer_phone",
      "customerPhone",
      "buyer_phone",
      "buyerPhone",
      "whatsapp",
      "telefone",
      "phone",
    ]),
  );
  const value = normalizeMoney(firstValue(payload, ["data.amount", "data.subscription.amount", "amount", "value"]));
  const currency = firstString(payload, ["data.currency", "currency", "moeda"]) ?? "BRL";
  const productName =
    firstString(payload, ["data.product.name", "product_name", "productName", "product", "produto", "item_name", "itemName"]) ??
    "Site Profissional + Hospedagem Premium";
  const planName = firstString(payload, [
    "data.offer.name",
    "data.subscription.offer",
    "offer_name",
    "offerName",
    "plan_name",
    "planName",
    "plano",
    "oferta",
  ]);
  const orderId = firstString(payload, [
    "order_id",
    "orderId",
    "pedido_id",
    "pedidoId",
    "sale_id",
    "saleId",
    "checkout_id",
    "checkoutId",
  ]);
  const dataId = firstString(payload, ["data.id"]);
  const dataRefId = firstString(payload, ["data.refId"]);
  const transactionId =
    dataId ?? dataRefId ?? firstString(payload, ["transaction_id", "transactionId", "order_id", "orderId"]);
  const subscriptionId = firstString(payload, ["data.subscription.id", "subscription_id", "subscriptionId", "assinatura_id", "assinaturaId"]);
  const fbc = firstString(payload, ["data.fbc", "fbc"]);
  const fbp = firstString(payload, ["data.fbp", "fbp"]);
  const utmSource = firstString(payload, ["data.utm_source", "utm_source", "utmSource"]);
  const utmMedium = firstString(payload, ["data.utm_medium", "utm_medium", "utmMedium"]);
  const utmCampaign = firstString(payload, ["data.utm_campaign", "utm_campaign", "utmCampaign"]);
  const utmContent = firstString(payload, ["data.utm_content", "utm_content", "utmContent"]);
  const utmTerm = firstString(payload, ["data.utm_term", "utm_term", "utmTerm"]);
  const stableId = dataId ?? transactionId ?? orderId ?? subscriptionId ?? stableHash(rawBody).slice(0, 24);

  return {
    eventName,
    status,
    customerName,
    email,
    phone,
    value,
    currency: currency.toUpperCase(),
    productName,
    planName,
    orderId,
    transactionId,
    subscriptionId,
    dataId,
    fbc,
    fbp,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    eventId: `cakto_${stableId}`,
  };
}

function isPurchaseEvent(event: NormalizedCaktoEvent) {
  const haystack = `${event.eventName} ${event.status ?? ""}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return [
    "purchaseapproved",
    "purchase approved",
    "compra aprovada",
    "approved",
    "aprovado",
    "paid",
    "pago",
    "renovada",
    "renewed",
  ].some((term) => haystack.includes(term));
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = EXTERNAL_REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function sendMetaPurchase(event: NormalizedCaktoEvent, clientContext: RequestClientContext) {
  const pixelId = getEnv("META_PIXEL_ID");
  const accessToken = getEnv("META_CAPI_ACCESS_TOKEN");

  if (!pixelId || !accessToken) {
    console.warn("[cakto-webhook] Meta CAPI env vars missing", {
      hasPixelId: Boolean(pixelId),
      hasAccessToken: Boolean(accessToken),
    });
    return { skipped: true, reason: "missing_env" };
  }

  const userData: JsonRecord = {};
  const emailHash = sha256(event.email);
  const phoneHash = sha256(event.phone);
  if (emailHash) userData.em = [emailHash];
  if (phoneHash) userData.ph = [phoneHash];
  if (event.fbc) userData.fbc = event.fbc;
  if (event.fbp) userData.fbp = event.fbp;
  if (clientContext.clientIpAddress) userData.client_ip_address = clientContext.clientIpAddress;
  if (clientContext.clientUserAgent) userData.client_user_agent = clientContext.clientUserAgent;

  const customData: JsonRecord = {
    value: event.value,
    currency: event.currency || "BRL",
    content_name: event.planName ? `${event.productName} - ${event.planName}` : event.productName,
    order_id: event.transactionId ?? event.orderId ?? event.subscriptionId ?? event.eventId,
  };
  if (event.utmSource) customData.utm_source = event.utmSource;
  if (event.utmMedium) customData.utm_medium = event.utmMedium;
  if (event.utmCampaign) customData.utm_campaign = event.utmCampaign;
  if (event.utmContent) customData.utm_content = event.utmContent;
  if (event.utmTerm) customData.utm_term = event.utmTerm;

  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        action_source: "website",
        event_source_url: SITE_URL,
        user_data: userData,
        custom_data: customData,
      },
    ],
  };

  const url = `https://graph.facebook.com/${META_API_VERSION}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`;
  const response = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const responseBody = await response.text().catch(() => "");
    throw new Error(`Meta CAPI failed with ${response.status}: ${responseBody.slice(0, 500)}`);
  }

  return response.json().catch(() => ({ ok: true }));
}

function buildGa4ClientId(event: NormalizedCaktoEvent) {
  const base = event.transactionId ?? event.orderId ?? event.subscriptionId ?? event.eventId;
  const hash = stableHash(base);
  const first = Number.parseInt(hash.slice(0, 8), 16);
  const second = Number.parseInt(hash.slice(8, 16), 16);
  return `${first}.${second}`;
}

async function sendGa4Purchase(event: NormalizedCaktoEvent) {
  const measurementId = getEnv("GA4_MEASUREMENT_ID");
  const apiSecret = getEnv("GA4_API_SECRET");

  if (!measurementId || !apiSecret) {
    console.warn("[cakto-webhook] GA4 env vars missing", {
      hasMeasurementId: Boolean(measurementId),
      hasApiSecret: Boolean(apiSecret),
    });
    return { skipped: true, reason: "missing_env" };
  }

  const transactionId = event.dataId ?? event.transactionId ?? event.orderId ?? event.subscriptionId ?? event.eventId;
  const body = {
    client_id: buildGa4ClientId(event),
    user_id: event.email ? stableHash(event.email).slice(0, 32) : undefined,
    events: [
      {
        name: "purchase",
        params: {
          transaction_id: transactionId,
          value: event.value,
          currency: event.currency || "BRL",
          affiliation: "Cakto",
          items: [
            {
              item_id: event.subscriptionId ?? event.orderId ?? event.transactionId ?? event.eventId,
              item_name: event.planName ? `${event.productName} - ${event.planName}` : event.productName,
              price: event.value,
              quantity: 1,
            },
          ],
        },
      },
    ],
  };

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`;
  const response = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const responseBody = await response.text().catch(() => "");
    throw new Error(`GA4 Measurement Protocol failed with ${response.status}: ${responseBody.slice(0, 500)}`);
  }

  return { ok: true };
}

export async function handleCaktoWebhookRequest(request: Request) {
  if (request.method === "GET") {
    return jsonResponse({ ok: true, endpoint: ENDPOINT_NAME });
  }

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const clientContext = getRequestClientContext(request);
  const rawBody = await request.text();
  let payload: unknown;

  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    console.warn("[cakto-webhook] Invalid JSON body", {
      headerNames: safeHeaderNames(request.headers),
      bodyLength: rawBody.length,
    });
    return jsonResponse({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  console.info("[cakto-webhook] Webhook received", {
    headerNames: safeHeaderNames(request.headers),
    contentLength: rawBody.length,
    hasClientIpAddress: Boolean(clientContext.clientIpAddress),
    hasClientUserAgent: Boolean(clientContext.clientUserAgent),
  });

  const secretValidation = validateWebhookSecret(request, payload);
  if (!secretValidation.ok) {
    console.warn("[cakto-webhook] Secret validation failed", {
      status: secretValidation.status,
      headerNames: safeHeaderNames(request.headers),
    });
    return jsonResponse({ ok: false, error: secretValidation.message }, { status: secretValidation.status });
  }

  const normalizedEvent = normalizeCaktoPayload(payload, rawBody);

  console.info("[cakto-webhook] Normalized Cakto event", {
    eventName: normalizedEvent.eventName,
    status: normalizedEvent.status,
    value: normalizedEvent.value,
    currency: normalizedEvent.currency,
    productName: normalizedEvent.productName,
    planName: normalizedEvent.planName,
    orderId: normalizedEvent.orderId,
    transactionId: normalizedEvent.transactionId,
    subscriptionId: normalizedEvent.subscriptionId,
    eventId: normalizedEvent.eventId,
    email: mask(normalizedEvent.email),
    phone: mask(normalizedEvent.phone),
    hasClientIpAddress: Boolean(clientContext.clientIpAddress),
    hasClientUserAgent: Boolean(clientContext.clientUserAgent),
    hasFbc: Boolean(normalizedEvent.fbc),
    hasFbp: Boolean(normalizedEvent.fbp),
    utm_campaign: normalizedEvent.utmCampaign,
  });

  if (!isPurchaseEvent(normalizedEvent)) {
    console.info("[cakto-webhook] Event accepted but skipped for Purchase tracking", {
      eventName: normalizedEvent.eventName,
      status: normalizedEvent.status,
      eventId: normalizedEvent.eventId,
      transactionId: normalizedEvent.transactionId,
      subscriptionId: normalizedEvent.subscriptionId,
    });
    return jsonResponse({ ok: true, skipped: true, reason: "not_purchase_event" });
  }

  const [metaResult, ga4Result] = await Promise.allSettled([
    sendMetaPurchase(normalizedEvent, clientContext),
    sendGa4Purchase(normalizedEvent),
  ]);

  if (metaResult.status === "rejected") {
    console.error("[cakto-webhook] Meta CAPI error", metaResult.reason);
  }

  if (ga4Result.status === "rejected") {
    console.error("[cakto-webhook] GA4 Measurement Protocol error", ga4Result.reason);
  }

  return jsonResponse({
    ok: true,
    event_id: normalizedEvent.eventId,
    meta: metaResult.status === "fulfilled" ? "processed" : "failed_logged",
    ga4: ga4Result.status === "fulfilled" ? "processed" : "failed_logged",
  });
}
