import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  X,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Globe,
  MessageCircle,
  MapPin,
  Search,
  Smartphone,
  HeadphonesIcon,
  Wrench,
  ChevronDown,
  TrendingUp,
  Lock,
  Award,
  Phone,
  Mail,
  Send,
} from "lucide-react";
const Instagram = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const Facebook = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2C16.5 4.1 15.5 4 14.4 4c-2.3 0-3.9 1.4-3.9 4v2.8H8v3.2h2.5V22h3z" />
  </svg>
);
const Linkedin = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zM7.6 8h4.37v1.91h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.48 3.04 5.48 7v8.45h-4.56v-7.49c0-1.79-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.97V22H7.6V8z" />
  </svg>
);
import logoNeg from "@/assets/logo-negativa.png.asset.json";
import {
  CONTACT,
  siteProfessionalWhatsAppLink,
  trackCta,
  trackLeadFormSubmit,
  trackWhatsApp,
  whatsappLink,
  type CtaLocation,
  type LeadFormData,
} from "@/lib/analytics";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mundo Digital — Sua empresa ganha um site profissional" },
      {
        name: "description",
        content:
          "Receba um site profissional em até 3 dias úteis e pague apenas pela hospedagem profissional. SEO Local, SSL, WhatsApp e 12 meses de manutenção inclusos.",
      },
      { property: "og:title", content: "Sua empresa ganha um site profissional — Mundo Digital" },
      {
        property: "og:description",
        content: "Site profissional para sua empresa com atendimento personalizado pelo WhatsApp.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Mundo Digital Soluções",
          slogan: "Crescimento previsível não é sorte. É método.",
          url: "/",
        }),
      },
    ],
  }),
  component: Landing,
});

/* ---------- Reusable bits ---------- */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative py-24 md:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        {(eyebrow || title || subtitle) && (
          <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center mb-16">
            {eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-[color:var(--muted-foreground)] mb-5">
                <Sparkles className="w-3.5 h-3.5" /> {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold gradient-text text-balance leading-[1.05]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-6 text-lg text-[color:var(--muted-foreground)] text-pretty">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

function PrimaryButton({
  children,
  href = "#lead-form",
  className = "",
  cta = "primary_cta",
  location = "hero",
  external,
  onOpenLeadForm,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  cta?: string;
  location?: CtaLocation;
  external?: boolean;
  onOpenLeadForm?: (location: CtaLocation, cta: string) => void;
}) {
  const buttonClass = `group relative inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold tracking-wide text-white transition-all hover:scale-[1.02] active:scale-[0.98] glow ${className}`;
  const content = (
    <>
      <span
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "linear-gradient(135deg, #6178DD 0%, #4258A0 60%, #374069 100%)" }}
      />
      <span className="relative">{children}</span>
      <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-1" />
    </>
  );

  if (onOpenLeadForm) {
    return (
      <button
        type="button"
        onClick={() => onOpenLeadForm(location, cta)}
        className={buttonClass}
        style={{ background: "linear-gradient(135deg, #4F63C9 0%, #374B89 60%, #2F3453 100%)" }}
      >
        {content}
      </button>
    );
  }

  const isExternal = external ?? /^https?:|^mailto:|^tel:/.test(href);
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={() => trackCta({ cta, location, destination: href })}
      className={buttonClass}
      style={{ background: "linear-gradient(135deg, #4F63C9 0%, #374B89 60%, #2F3453 100%)" }}
    >
      {content}
    </a>
  );
}

function GhostButton({
  children,
  href = "#portfolio",
  cta = "ghost_cta",
  location = "hero",
}: {
  children: React.ReactNode;
  href?: string;
  cta?: string;
  location?: CtaLocation;
}) {
  const isExternal = /^https?:|^mailto:|^tel:/.test(href);
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={() => trackCta({ cta, location, destination: href })}
      className="inline-flex items-center justify-center gap-2 rounded-xl glass px-7 py-4 text-sm font-semibold tracking-wide text-white/90 transition-all hover:bg-white/10"
    >
      {children}
    </a>
  );
}

/* ---------- Background decoration ---------- */

function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* glow blobs */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #374B89 0%, transparent 60%)" }}
      />
      <div
        className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #4F63C9 0%, transparent 60%)" }}
      />
      {/* particles */}
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/40"
          style={{
            top: `${(i * 37) % 100}%`,
            left: `${(i * 53) % 100}%`,
            opacity: 0.2 + ((i * 7) % 5) / 10,
            animation: `float ${5 + (i % 6)}s ease-in-out infinite`,
            animationDelay: `${(i % 5) * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Nav ---------- */

function Nav({ onOpenLeadForm }: { onOpenLeadForm: (location: CtaLocation, cta: string) => void }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="glass-strong rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <img src={logoNeg.url} alt="Mundo Digital Soluções" className="h-7 md:h-8 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
            <a href="#beneficios" className="hover:text-white transition-colors">
              Benefícios
            </a>
            <a href="#portfolio" className="hover:text-white transition-colors">
              Portfólio
            </a>
            <a href="#como-funciona" className="hover:text-white transition-colors">
              Como funciona
            </a>

            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>
          <PrimaryButton
            cta="nav_site_profissional"
            location="nav"
            onOpenLeadForm={onOpenLeadForm}
            className="!px-5 !py-2.5 !text-xs"
          >
            Quero meu Site Profissional
          </PrimaryButton>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero({
  onOpenLeadForm,
}: {
  onOpenLeadForm: (location: CtaLocation, cta: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <section ref={ref} className="relative pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden">
      <motion.div style={{ y, opacity }} className="mx-auto max-w-7xl px-6">
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 text-center text-5xl md:text-7xl lg:text-[88px] font-semibold tracking-[-0.03em] leading-[0.98] text-balance"
        >
          <span className="gradient-text">Sua empresa ganha</span>
          <br />
          <span className="gradient-text-accent">um site profissional.</span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-7 mx-auto max-w-2xl text-center text-lg md:text-xl text-white/70 text-pretty"
        >
          Receba seu site pronto em até <strong className="text-white">3 dias úteis</strong> e pague
          apenas pela hospedagem profissional. Sem taxa de criação. Sem implantação. Sem burocracia.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <PrimaryButton
            cta="hero_site_profissional"
            location="hero"
            onOpenLeadForm={onOpenLeadForm}
          >
            Quero meu Site Profissional
          </PrimaryButton>
          <GhostButton cta="hero_ver_exemplos" location="hero">
            Ver exemplos
          </GhostButton>
        </motion.div>

        <motion.ul
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/70"
        >
          {[
            "SEO Local Incluso",
            "SSL Profissional",
            "Widget WhatsApp",
            "12 Meses de Manutenção",
            "Atendimento Personalizado",
          ].map((it) => (
            <li key={it} className="inline-flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" /> {it}
            </li>
          ))}
        </motion.ul>

        {/* Device mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 md:mt-20"
        >
          <DeviceShowcase />
        </motion.div>
      </motion.div>
    </section>
  );
}

function DeviceShowcase() {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* glow */}
      <div
        className="absolute inset-x-0 -bottom-10 h-40 blur-3xl opacity-60"
        style={{ background: "radial-gradient(ellipse at center, #4F63C9, transparent 60%)" }}
      />

      {/* Notebook */}
      <div className="relative mx-auto rounded-[28px] glass-strong p-3 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)]">
        <div className="rounded-[18px] overflow-hidden bg-gradient-to-br from-[#1d2240] to-[#0f1226] border border-white/10">
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
            <div className="mx-auto text-[11px] text-white/40 font-mono">suaempresa.com.br</div>
          </div>
          <div className="grid md:grid-cols-[1fr_280px] gap-0">
            <div className="p-8 md:p-12">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online agora
              </div>
              <div className="mt-4 h-7 w-3/4 rounded-md bg-white/10" />
              <div className="mt-3 h-7 w-1/2 rounded-md bg-white/10" />
              <div className="mt-5 h-3 w-full rounded-md bg-white/5" />
              <div className="mt-2 h-3 w-5/6 rounded-md bg-white/5" />
              <div className="mt-2 h-3 w-2/3 rounded-md bg-white/5" />
              <div className="mt-6 flex gap-2">
                <div className="h-9 w-28 rounded-lg gradient-brand" />
                <div className="h-9 w-24 rounded-lg bg-white/10" />
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-3 p-6 border-l border-white/5 bg-white/[0.02]">
              <div className="h-24 rounded-xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10" />
              <div className="h-24 rounded-xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10" />
              <div className="h-24 rounded-xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10" />
            </div>
          </div>
        </div>
        {/* Hinge */}
        <div className="mx-auto mt-3 h-1.5 w-1/3 rounded-full bg-white/10" />
      </div>

      {/* Floating phone */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-10 -right-2 md:-right-10 w-[150px] md:w-[200px] rounded-[28px] glass-strong p-2 shadow-2xl rotate-6"
      >
        <div className="rounded-[20px] overflow-hidden bg-gradient-to-b from-[#1d2240] to-[#0f1226] border border-white/10 aspect-[9/19] p-3 flex flex-col gap-2">
          <div className="h-2 w-12 rounded-full bg-white/10 mx-auto" />
          <div className="mt-2 h-16 rounded-lg gradient-brand" />
          <div className="h-2 w-3/4 rounded bg-white/10" />
          <div className="h-2 w-1/2 rounded bg-white/10" />
          <div className="mt-auto h-9 rounded-lg bg-emerald-500/80 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Floating tablet */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-6 -left-4 md:-left-12 w-[180px] md:w-[230px] rounded-[20px] glass-strong p-2 shadow-2xl -rotate-6 hidden sm:block"
      >
        <div className="rounded-[14px] overflow-hidden bg-gradient-to-b from-[#1d2240] to-[#0f1226] border border-white/10 aspect-[4/3] p-3 flex flex-col gap-2">
          <div className="h-2 w-2/3 rounded bg-white/10" />
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="h-12 rounded-lg bg-white/5" />
            <div className="h-12 rounded-lg gradient-brand" />
            <div className="h-12 rounded-lg gradient-brand" />
            <div className="h-12 rounded-lg bg-white/5" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- Contrast: cost of NOT having a site ---------- */

function ContrastSection() {
  const cons = [
    "Não aparece no Google",
    "Passa menos credibilidade",
    "Perde orçamentos diariamente",
    "Depende apenas das redes sociais",
    "Não captura leads 24h por dia",
  ];
  const pros = [
    "Encontrado no Google",
    "Mais autoridade",
    "Mais contatos",
    "Mais oportunidades",
    "WhatsApp integrado",
  ];
  return (
    <Section
      eyebrow="O Custo da Invisibilidade"
      title={
        <>
          Quanto custa <span className="gradient-text-accent">NÃO</span> ter um site?
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <motion.div
          {...fadeUp}
          className="relative rounded-3xl p-8 border border-red-400/20 bg-red-500/[0.04]"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-red-300 mb-4">
            Sem site
          </div>
          <ul className="space-y-4">
            {cons.map((c) => (
              <li key={c} className="flex items-start gap-3 text-white/80">
                <span className="mt-0.5 inline-flex w-6 h-6 rounded-lg bg-red-500/15 items-center justify-center shrink-0">
                  <X className="w-3.5 h-3.5 text-red-300" />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl p-8 border border-emerald-400/20 bg-emerald-500/[0.05] glow"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-4">
            Com site profissional
          </div>
          <ul className="space-y-4">
            {pros.map((c) => (
              <li key={c} className="flex items-start gap-3 text-white/90">
                <span className="mt-0.5 inline-flex w-6 h-6 rounded-lg bg-emerald-500/15 items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  );
}

/* ---------- Problem ---------- */

function ProblemSection() {
  const items = [
    {
      icon: Search,
      t: "Não aparece nas pesquisas",
      d: "Quando pesquisam por você no Google, o concorrente aparece primeiro.",
    },
    {
      icon: Shield,
      t: "Não transmite confiança",
      d: "Sem um site, sua marca parece amadora aos olhos do cliente.",
    },
    {
      icon: TrendingUp,
      t: "Perde clientes diariamente",
      d: "Orçamentos vão embora sem que você sequer perceba.",
    },
    {
      icon: Smartphone,
      t: "Depende só do Instagram",
      d: "Algoritmo decide quem te vê. Você não tem controle.",
    },
    {
      icon: Globe,
      t: "Sem presença digital",
      d: "Empresa profissional precisa de endereço digital próprio.",
    },
  ];
  return (
    <Section
      eyebrow="O Problema"
      title={
        <>
          Seu concorrente está recebendo
          <br />
          contatos que <span className="gradient-text-accent">poderiam ser seus.</span>
        </>
      }
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <motion.div
            key={it.t}
            {...fadeUp}
            transition={{ duration: 0.55, delay: i * 0.06 }}
            className="group rounded-2xl glass p-6 hover:bg-white/[0.06] transition-all hover:-translate-y-1"
          >
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:gradient-brand transition-all">
              <it.icon className="w-5 h-5 text-white/80" />
            </div>
            <h3 className="text-lg font-semibold text-white">{it.t}</h3>
            <p className="mt-1.5 text-sm text-white/60">{it.d}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Solution flow ---------- */

function SolutionSection() {
  const steps = [
    { icon: Search, label: "Google", sub: "Cliente pesquisa" },
    { icon: Globe, label: "Site", sub: "Encontra você" },
    { icon: MessageCircle, label: "WhatsApp", sub: "Inicia conversa" },
    { icon: Award, label: "Cliente", sub: "Compra de você" },
  ];
  return (
    <Section
      eyebrow="A Solução"
      title={
        <>
          Transforme sua presença digital em uma{" "}
          <span className="gradient-text-accent">máquina de contatos.</span>
        </>
      }
    >
      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.label}
              {...fadeUp}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="relative"
            >
              <div className="rounded-2xl glass-strong p-6 text-center">
                <div className="mx-auto w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mb-4 shadow-lg">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-base font-semibold text-white">{s.label}</div>
                <div className="text-xs text-white/60 mt-1">{s.sub}</div>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-white/30 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Benefits ---------- */

function BenefitsSection() {
  const items = [
    { icon: Globe, t: "Site Profissional Responsivo", d: "Perfeito em mobile, tablet e desktop." },
    { icon: Search, t: "SEO Local Inicial", d: "Otimizado para sua cidade e bairro." },
    { icon: Zap, t: "Hospedagem Profissional", d: "Carregamento ultrarrápido e estável." },
    { icon: Lock, t: "SSL Profissional", d: "Cadeado verde. Confiança total." },
    { icon: MessageCircle, t: "Widget WhatsApp", d: "Cliente fala com você em 1 clique." },
    { icon: MapPin, t: "Google Maps Integrado", d: "Apareça na busca local." },
    { icon: Sparkles, t: "Formulário Inteligente", d: "Capta leads 24h por dia." },
    { icon: HeadphonesIcon, t: "Suporte Técnico", d: "Equipe dedicada para sua marca." },
    { icon: Wrench, t: "12 Meses de Manutenção", d: "Atualizações e melhorias inclusas." },
  ];
  return (
    <Section
      id="beneficios"
      eyebrow="Tudo Incluso"
      title={
        <>
          O que você recebe
          <br />
          <span className="gradient-text-accent">para crescer de verdade.</span>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <motion.div
            key={it.t}
            {...fadeUp}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
            className="group relative rounded-2xl glass p-7 overflow-hidden hover:-translate-y-1 transition-all"
          >
            <div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"
              style={{ background: "radial-gradient(circle, #4F63C9, transparent 70%)" }}
            />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-5 shadow-md">
                <it.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">{it.t}</h3>
              <p className="mt-2 text-sm text-white/60">{it.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Portfolio ---------- */

function PortfolioSection() {
  const items = [
    {
      title: "Clínica Odontológica",
      tag: "Saúde",
      grad: "from-cyan-500/30 to-blue-600/30",
      h: "md:row-span-2",
    },
    {
      title: "Restaurante Gourmet",
      tag: "Gastronomia",
      grad: "from-orange-500/30 to-pink-600/30",
      h: "",
    },
    {
      title: "Construtora Regional",
      tag: "Engenharia",
      grad: "from-emerald-500/30 to-teal-600/30",
      h: "",
    },
    {
      title: "Studio de Estética",
      tag: "Beleza",
      grad: "from-fuchsia-500/30 to-rose-600/30",
      h: "md:row-span-2",
    },
    {
      title: "Escritório de Advocacia",
      tag: "Jurídico",
      grad: "from-amber-500/30 to-orange-600/30",
      h: "",
    },
    {
      title: "Consultoria Financeira",
      tag: "Finanças",
      grad: "from-indigo-500/30 to-violet-600/30",
      h: "",
    },
  ];
  return (
    <Section
      id="portfolio"
      eyebrow="Portfólio"
      title="Projetos que geram resultado."
      subtitle="Cases reais de empresas que multiplicaram seus contatos com um site profissional."
    >
      <div className="grid md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            {...fadeUp}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            className={`group relative rounded-2xl overflow-hidden glass cursor-pointer ${it.h}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${it.grad}`} />
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70 mb-1">
                {it.tag}
              </div>
              <div className="text-lg font-semibold text-white">{it.title}</div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                Ver projeto <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- How it works ---------- */

function HowItWorksSection({
  onOpenLeadForm,
}: {
  onOpenLeadForm: (location: CtaLocation, cta: string) => void;
}) {
  const steps = [
    {
      n: "01",
      t: "Diagnóstico com um especialista",
      d: "Conversamos para entender seu negócio, seus objetivos e o que sua empresa precisa para crescer no ambiente digital.",
    },
    {
      n: "02",
      t: "Entendemos seu negócio",
      d: "Analisamos sua empresa, seu público, seus produtos ou serviços e as oportunidades da sua presença digital.",
    },
    {
      n: "03",
      t: "Montamos um projeto personalizado",
      d: "Planejamos um site alinhado à realidade da sua empresa, sem soluções genéricas ou modelos que não representam seu negócio.",
    },
    {
      n: "04",
      t: "Criamos seu site profissional",
      d: "Desenvolvemos um site moderno, rápido, responsivo e preparado para apresentar sua empresa e gerar novas oportunidades.",
    },
    {
      n: "05",
      t: "Você paga apenas a hospedagem",
      d: "Você não paga pela criação do site. Investe apenas na hospedagem profissional necessária para manter seu projeto seguro e disponível na internet.",
    },
  ];
  return (
    <Section
      id="como-funciona"
      eyebrow="Como Funciona"
      title="É extremamente simples"
      subtitle="Entendemos seu negócio e criamos um projeto personalizado para sua empresa."
    >
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent md:-translate-x-px" />
        <div className="space-y-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              {...fadeUp}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className={`relative flex md:items-center gap-6 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="relative shrink-0 z-10">
                <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center font-display font-semibold text-white shadow-lg">
                  {s.n}
                </div>
              </div>
              <div className={`flex-1 rounded-2xl glass p-6 ${i % 2 === 1 ? "md:text-right" : ""}`}>
                <h3 className="text-xl font-semibold text-white">{s.t}</h3>
                <p className="mt-1.5 text-white/65">{s.d}</p>
              </div>
              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <PrimaryButton
            cta="how_site_profissional"
            location="how_it_works"
            onOpenLeadForm={onOpenLeadForm}
          >
            Quero meu Site Profissional
          </PrimaryButton>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Bonus / value stack ---------- */

function BonusSection({
  onOpenLeadForm,
}: {
  onOpenLeadForm: (location: CtaLocation, cta: string) => void;
}) {
  const items = [
    "Análise de como sua empresa aparece na internet",
    "Avaliação da presença no Google",
    "Identificação de pontos que podem estar afastando clientes",
    "Oportunidades de melhoria na comunicação",
    "Recomendações de marketing digital",
    "Orientação sobre os próximos passos para fortalecer sua presença online",
  ];
  return (
    <Section
      eyebrow="Bônus exclusivo"
      title="Consultoria com análise completa da sua presença digital"
      subtitle="Além do desenvolvimento do site, sua empresa recebe uma consultoria para identificar oportunidades de melhoria na presença digital e no marketing."
    >
      <div className="mx-auto max-w-4xl rounded-3xl glass-strong p-8 md:p-10">
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-3 text-white/80">
              <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" /> <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-white/70">
          Você recebe uma visão mais clara do cenário atual da sua empresa e das ações que podem
          gerar melhores resultados.
        </p>
        <div className="mt-8 flex justify-center">
          <PrimaryButton cta="bonus_diagnostico" location="bonus" onOpenLeadForm={onOpenLeadForm}>
            Quero solicitar meu diagnóstico
          </PrimaryButton>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Offer ---------- */

/* ---------- Guarantee ---------- */

/* ---------- FAQ ---------- */

function FAQSection() {
  const faqs = [
    [
      "O site é realmente gratuito?",
      "Você não paga pela criação do site. O investimento é referente à hospedagem profissional necessária para manter o projeto online, seguro e disponível.",
    ],
    [
      "Por que preciso conversar com um especialista?",
      "Cada empresa possui objetivos, públicos e necessidades diferentes. A conversa inicial permite entender seu negócio e montar um projeto mais adequado à sua realidade.",
    ],
    [
      "O projeto é igual para todas as empresas?",
      "Não. Cada projeto é planejado de acordo com a empresa, seus produtos ou serviços, público e objetivos.",
    ],
    [
      "O domínio está incluso?",
      "O domínio não está incluso. Caso sua empresa ainda não tenha um domínio, nossa equipe poderá orientar sobre o registro.",
    ],
    [
      "O que acontece depois que envio meus dados?",
      "Você será direcionado para o WhatsApp da Mundo Digital Soluções, onde a Madu iniciará o atendimento e organizará os próximos passos com nossa equipe.",
    ],
    [
      "Posso usar meu domínio atual?",
      "Sim. Nossa equipe poderá orientar a configuração técnica do seu domínio existente durante o projeto.",
    ],
    [
      "O site aparece no Google?",
      "Sim. Aplicamos SEO local inicial, schema markup e otimizações técnicas para ajudar na indexação.",
    ],
    [
      "Posso solicitar alterações?",
      "Sim. Os próximos passos e ajustes necessários são organizados durante o atendimento com a equipe.",
    ],
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" eyebrow="FAQ" title="Perguntas frequentes.">
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={q}
              {...fadeUp}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="rounded-2xl glass overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left"
              >
                <span className="font-semibold text-white">{q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-white/60 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-6 text-white/70 text-pretty">{a}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------- Final CTA ---------- */

function FinalCTA({
  onOpenLeadForm,
}: {
  onOpenLeadForm: (location: CtaLocation, cta: string) => void;
}) {
  return (
    <Section className="!pb-32">
      <motion.div
        {...fadeUp}
        className="relative mx-auto max-w-5xl rounded-[32px] p-[1.5px]"
        style={{ background: "linear-gradient(135deg, #6178DD, #2F3453 60%, #374B89)" }}
      >
        <div className="relative rounded-[30px] bg-[#161937] p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-semibold gradient-text text-balance leading-[1.05]">
              Vamos conversar sobre o seu projeto?
            </h2>
            <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto text-pretty">
              Cada empresa possui necessidades diferentes. Por isso, primeiro entendemos seu negócio
              e depois montamos um projeto personalizado para sua realidade.
            </p>
            <div className="mt-8 flex justify-center">
              <PrimaryButton
                cta="final_site_profissional"
                location="final_cta"
                onOpenLeadForm={onOpenLeadForm}
                className="!px-9 !py-5 !text-base"
              >
                Quero meu Site Profissional
              </PrimaryButton>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <img src={logoNeg.url} alt="Mundo Digital Soluções" className="h-9 w-auto" />
          <p className="mt-5 max-w-sm text-sm text-white/60">
            Soluções em Marketing e Vendas. Tecnologia, autoridade e crescimento previsível para
            empresas que querem ir além.
          </p>
          <p className="mt-6 font-display text-xl text-white/90">
            Crescimento previsível não é sorte.{" "}
            <span className="gradient-text-accent">É método.</span>
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">
            Contato
          </div>
          <ul className="space-y-3 text-sm text-white/70">
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsApp("footer", { cta: "footer_whatsapp" })}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp {CONTACT.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={`tel:+${CONTACT.whatsappNumber}`}
                onClick={() =>
                  trackCta({ cta: "footer_phone", location: "footer", destination: "tel" })
                }
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" /> {CONTACT.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                onClick={() =>
                  trackCta({ cta: "footer_email", location: "footer", destination: "email" })
                }
                className="flex items-center gap-2 hover:text-white transition-colors break-all"
              >
                <Mail className="w-4 h-4 shrink-0" /> {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">
            Redes
          </div>
          <ul className="space-y-3 text-sm text-white/70">
            <li>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackCta({
                    cta: "footer_instagram",
                    location: "footer",
                    destination: "instagram",
                  })
                }
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            </li>
            <li>
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackCta({ cta: "footer_facebook", location: "footer", destination: "facebook" })
                }
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" /> Facebook
              </a>
            </li>
            <li>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackCta({ cta: "footer_linkedin", location: "footer", destination: "linkedin" })
                }
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <span>
          © {new Date().getFullYear()} Mundo Digital Soluções. Todos os direitos reservados.
        </span>
        <span>CNPJ · Política de Privacidade · Termos de Uso</span>
      </div>
    </footer>
  );
}

/* ---------- Lead capture modal ---------- */

type LeadFormErrors = Partial<Record<keyof LeadFormData | "consent" | "submit", string>>;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function maskBrazilianPhone(value: string) {
  const digits = onlyDigits(value);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function LeadCaptureModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [form, setForm] = useState({
    nome: "",
    whatsapp: "",
    empresa: "",
    produtoServico: "",
    consent: false,
  });
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => firstFieldRef.current?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open, onOpenChange]);

  const validate = () => {
    const next: LeadFormErrors = {};
    if (!form.nome.trim()) next.nome = "Informe seu nome.";
    if (onlyDigits(form.whatsapp).length < 10) next.whatsapp = "Informe um WhatsApp com DDD.";
    if (!form.empresa.trim()) next.empresa = "Informe o nome da empresa.";
    if (!form.produtoServico.trim()) next.produtoServico = "Informe o que sua empresa oferece.";
    if (!form.consent) next.consent = "É necessário concordar com o atendimento pelo WhatsApp.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("idle");
    if (!validate()) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    const leadData = {
      nome: form.nome.trim(),
      empresa: form.empresa.trim(),
      produtoServico: form.produtoServico.trim(),
      whatsapp: form.whatsapp.trim(),
    };
    trackLeadFormSubmit();
    trackWhatsApp("lead_form", { cta: "lead_form_submit", destination: "whatsapp" });
    const url = siteProfessionalWhatsAppLink(leadData);
    setStatus("success");
    window.setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      onOpenChange(false);
      setStatus("idle");
    }, 120);
  };

  if (!open) return null;

  const isLoading = status === "loading";
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Fechar formulário"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-form-title"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-[#161937] p-6 shadow-2xl md:p-8"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Fechar"
          className="absolute right-4 top-4 rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="pr-10">
          <h2 id="lead-form-title" className="text-2xl font-semibold gradient-text">
            Conte um pouco sobre o seu negócio
          </h2>
          <p className="mt-2 text-sm text-white/65">
            Preencha os dados abaixo para iniciarmos seu atendimento personalizado.
          </p>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <FieldError id="submit-error" message={errors.submit} />
          <div>
            <label htmlFor="lead-name" className="mb-2 block text-sm font-medium text-white">
              Nome
            </label>
            <input
              ref={firstFieldRef}
              id="lead-name"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Seu nome"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-[#6178DD]"
              aria-invalid={Boolean(errors.nome)}
              aria-describedby="lead-name-error"
            />
            <FieldError id="lead-name-error" message={errors.nome} />
          </div>
          <div>
            <label htmlFor="lead-whatsapp" className="mb-2 block text-sm font-medium text-white">
              WhatsApp
            </label>
            <input
              id="lead-whatsapp"
              type="tel"
              inputMode="tel"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: maskBrazilianPhone(e.target.value) })}
              placeholder="(00) 00000-0000"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-[#6178DD]"
              aria-invalid={Boolean(errors.whatsapp)}
              aria-describedby="lead-whatsapp-error"
            />
            <FieldError id="lead-whatsapp-error" message={errors.whatsapp} />
          </div>
          <div>
            <label htmlFor="lead-company" className="mb-2 block text-sm font-medium text-white">
              Empresa
            </label>
            <input
              id="lead-company"
              value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              placeholder="Nome da sua empresa"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-[#6178DD]"
              aria-invalid={Boolean(errors.empresa)}
              aria-describedby="lead-company-error"
            />
            <FieldError id="lead-company-error" message={errors.empresa} />
          </div>
          <div>
            <label htmlFor="lead-product" className="mb-2 block text-sm font-medium text-white">
              Produto ou serviço
            </label>
            <textarea
              id="lead-product"
              value={form.produtoServico}
              onChange={(e) => setForm({ ...form, produtoServico: e.target.value })}
              placeholder="O que sua empresa oferece?"
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-[#6178DD]"
              aria-invalid={Boolean(errors.produtoServico)}
              aria-describedby="lead-product-error"
            />
            <FieldError id="lead-product-error" message={errors.produtoServico} />
          </div>
          <div>
            <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/75">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-white/20"
              />
              Concordo em ser atendido pelo WhatsApp para receber informações sobre o projeto.
            </label>
            <FieldError id="lead-consent-error" message={errors.consent} />
          </div>
          <p className="text-xs text-white/45">
            Seus dados serão utilizados apenas para iniciar seu atendimento e apresentar informações
            sobre o projeto.
          </p>
          {status === "success" && (
            <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              Dados validados. Abrindo o WhatsApp...
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold tracking-wide text-white transition-all disabled:cursor-not-allowed disabled:opacity-70"
            style={{ background: "linear-gradient(135deg, #4F63C9 0%, #374B89 60%, #2F3453 100%)" }}
          >
            {isLoading ? "Preparando atendimento..." : "Continuar no WhatsApp"}
            <Send className="h-4 w-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-red-300">
      {message}
    </p>
  );
}

/* ---------- Page ---------- */

function Landing() {
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const openLeadForm = (location: CtaLocation, cta: string) => {
    trackCta({ cta, location, destination: "lead_form" });
    setLeadFormOpen(true);
  };

  return (
    <main className="relative min-h-screen text-white overflow-x-clip">
      <BackgroundFX />
      <Nav onOpenLeadForm={openLeadForm} />
      <Hero onOpenLeadForm={openLeadForm} />
      <ContrastSection />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <PortfolioSection />
      <HowItWorksSection onOpenLeadForm={openLeadForm} />
      <BonusSection onOpenLeadForm={openLeadForm} />
      <FAQSection />
      <FinalCTA onOpenLeadForm={openLeadForm} />
      <Footer />
      <LeadCaptureModal open={leadFormOpen} onOpenChange={setLeadFormOpen} />
      <WhatsAppWidget />
    </main>
  );
}
