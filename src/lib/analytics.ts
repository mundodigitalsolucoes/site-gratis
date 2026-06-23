// Lightweight analytics dispatcher: fires events to GTM dataLayer, GA4 (gtag),
// Meta Pixel (fbq) and Microsoft Clarity when available. Safe no-op on SSR.

export type CtaLocation =
  | "nav"
  | "hero"
  | "offer_monthly"
  | "offer_annual"
  | "final_cta"
  | "whatsapp_widget"
  | "footer"
  | "portfolio"
  | (string & {});

export interface CtaEventParams {
  cta: string;
  location: CtaLocation;
  destination?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
    window.gtag?.("event", name, params);
    window.fbq?.("trackCustom", name, params);
    window.clarity?.("event", name);
  } catch {
    /* ignore */
  }
}

export function trackCta(params: CtaEventParams) {
  trackEvent("cta_click", params);
}

export function trackWhatsApp(location: CtaLocation, extra: Record<string, unknown> = {}) {
  trackEvent("whatsapp_click", { location, ...extra });
  // Meta standard event
  if (typeof window !== "undefined") {
    try {
      window.fbq?.("track", "Contact", { location, ...extra });
    } catch {
      /* ignore */
    }
  }
}

// Brand contact info — single source of truth
export const CONTACT = {
  whatsappNumber: "5517992822597",
  whatsappDisplay: "(17) 99282-2597",
  email: "contato@mundodigitalsolucoes.com.br",
  instagram: "https://www.instagram.com/mundodigital.solucoes",
  facebook: "https://www.facebook.com/MundoDigitalSolucoesOFC",
  linkedin: "https://www.linkedin.com/in/mudo-digital-solu%C3%A7%C3%B5es-834653263/",
} as const;

export function whatsappLink(
  message = "Olá! Quero garantir minha vaga e receber meu site profissional.",
) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${text}`;
}
