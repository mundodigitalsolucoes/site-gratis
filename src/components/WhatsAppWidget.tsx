import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { CONTACT, trackWhatsApp, whatsappLink } from "@/lib/analytics";

const portfolioProjects = [
  {
    title: "Embaixada da Pizza",
    niche: "Food / Pizzaria",
    type: "Site",
    url: "https://embaixadadapizza.com.br",
    image: "/embaixada.png",
    layout: "large",
    column: "left",
  },
  {
    title: "Eros Auto Center",
    niche: "Automotivo",
    type: "Site",
    url: "https://erosautocenter.com.br",
    image: "/eros.png",
    layout: "small",
    column: "left",
  },
  {
    title: "Guincho Rio Preto",
    niche: "Serviço local",
    type: "Site",
    url: "https://guinchoriopreto.com.br",
    image: "/guincho.png",
    layout: "small",
    column: "left",
  },
  {
    title: "Villa Rotisseria",
    niche: "Food / Rotisseria",
    type: "Site",
    url: "https://villarotisseria.com.br",
    image: "/villa.png",
    layout: "small",
    column: "left",
  },
  {
    title: "Cliente Embaixador",
    niche: "Promocional / Fidelização",
    type: "LP",
    url: "https://cliente.embaixadadapizza.com.br",
    image: "/embaixador.png",
    layout: "small",
    column: "right",
  },
  {
    title: "Copa Villa Rotisseria",
    niche: "Promocional / Copa do Mundo",
    type: "LP",
    url: "https://copa.villarotisseria.com.br",
    image: "/copa.png",
    layout: "small",
    column: "right",
  },
  {
    title: "Sauna Imperial",
    niche: "Saúde e bem-estar",
    type: "Site",
    url: "https://saunaimperial.com.br",
    image: "/sauna.png",
    layout: "large",
    column: "right",
  },
];

function portfolioCard(project: (typeof portfolioProjects)[number]) {
  const isLarge = project.layout === "large";
  const aspectRatio = isLarge ? "4 / 5" : "16 / 9";
  const imageFitClass = isLarge ? "object-cover object-top" : "object-contain object-center p-2 md:p-3";
  const cardBackground = isLarge ? "bg-white/[0.03]" : "bg-[#090b1f]";
  const overlayClass = isLarge
    ? "bg-gradient-to-t from-[#090b1f]/95 via-[#090b1f]/45 to-transparent"
    : "bg-gradient-to-t from-[#090b1f]/95 via-[#090b1f]/25 to-transparent";

  return `
    <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="group relative block overflow-hidden rounded-[28px] border border-white/10 ${cardBackground} shadow-[0_30px_80px_-40px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]" style="aspect-ratio: ${aspectRatio};">
      <img src="${project.image}" alt="${project.title}" loading="lazy" class="absolute inset-0 h-full w-full ${imageFitClass} opacity-85 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100" />
      <div class="absolute inset-0 ${overlayClass}"></div>
      <div class="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <div class="mb-3 flex flex-wrap gap-2">
          <span class="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">${project.type}</span>
          <span class="inline-flex rounded-full border border-[#6178DD]/35 bg-[#374B89]/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">${project.niche}</span>
        </div>
        <h3 class="text-xl md:text-2xl font-semibold text-white">${project.title}</h3>
        <p class="mt-1 text-xs md:text-sm text-white/65">${project.url.replace("https://", "")}</p>
        <div class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90 opacity-90 transition group-hover:translate-x-1">
          Ver projeto <span aria-hidden="true">→</span>
        </div>
      </div>
    </a>
  `;
}

function installRealPortfolio() {
  const section = document.querySelector<HTMLElement>("section#portfolio");
  if (!section || section.dataset.realPortfolio === "true") return;

  const leftCards = portfolioProjects.filter((project) => project.column === "left").map(portfolioCard).join("");
  const rightCards = portfolioProjects.filter((project) => project.column === "right").map(portfolioCard).join("");

  section.innerHTML = `
    <div class="mx-auto max-w-7xl px-6">
      <div class="mx-auto mb-16 max-w-3xl text-center">
        <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/60">
          ✦ Portfólio real
        </div>
        <h2 class="text-balance bg-gradient-to-br from-white via-white to-white/55 bg-clip-text text-4xl font-semibold leading-[1.05] text-transparent md:text-5xl lg:text-6xl">
          Projetos reais desenvolvidos pela Mundo Digital.
        </h2>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-white/60">
          Sites e landing pages criados para negócios locais, campanhas promocionais e geração de contatos qualificados.
        </p>
      </div>
      <div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 md:items-start">
        <div class="flex flex-col gap-6">
          ${leftCards}
        </div>
        <div class="flex flex-col gap-6 md:pt-0">
          ${rightCards}
        </div>
      </div>
    </div>
  `;

  section.dataset.realPortfolio = "true";
}

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    installRealPortfolio();
  }, []);

  const handleSend = (message?: string) => {
    trackWhatsApp("whatsapp_widget", { intent: message ? "preset" : "open_chat" });
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-[320px] rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10"
            role="dialog"
            aria-label="Atendimento via WhatsApp"
          >
            <div className="px-4 py-3 flex items-center gap-3 bg-[#075E54] text-white">
              <div className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#075E54]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">Mundo Digital</div>
                <div className="text-[11px] text-white/70">Online · responde em minutos</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="p-1.5 rounded-md hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#ECE5DD] p-4 space-y-3 text-[13px]">
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm text-[#111] max-w-[85%]">
                Olá! 👋 Quer garantir uma das últimas vagas da campanha
                <strong> &ldquo;Sua empresa ganha um site profissional&rdquo;</strong>?
                Fale com a gente agora!
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "Quero minha vaga",
                  "Tenho dúvidas sobre os planos",
                  "Quero ver exemplos",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(`Olá! ${q}.`)}
                    className="text-xs bg-white text-[#075E54] border border-[#075E54]/30 rounded-full px-3 py-1.5 hover:bg-[#075E54] hover:text-white transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSend()}
              className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white py-3 flex items-center justify-center gap-2 text-sm font-semibold transition"
            >
              <Send className="w-4 h-4" /> Iniciar conversa
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) trackWhatsApp("whatsapp_widget", { intent: "open_widget" });
        }}
        aria-label={open ? "Fechar WhatsApp" : `Falar no WhatsApp ${CONTACT.whatsappDisplay}`}
        className="group relative w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_15px_40px_-10px_rgba(37,211,102,0.7)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
        {open ? (
          <X className="w-6 h-6 relative" />
        ) : (
          <WaIcon className="w-7 h-7 relative" />
        )}
      </motion.button>
    </div>
  );
}

function WaIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M19.11 17.46c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.13-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34s-.96.94-.96 2.29.98 2.66 1.12 2.85c.13.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.56.58.66.21 1.25.18 1.73.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32zM16.03 4C9.39 4 4 9.39 4 16c0 2.11.56 4.16 1.6 5.97L4 28l6.18-1.62A12.02 12.02 0 0 0 16.03 28c6.64 0 12.03-5.39 12.03-12S22.67 4 16.03 4zm0 21.87a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.67.96.98-3.57-.24-.37a9.85 9.85 0 1 1 8.31 4.56z" />
    </svg>
  );
}
