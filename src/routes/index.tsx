import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  Check, X, ArrowRight, Sparkles, Shield, Zap, Globe, MessageCircle, MapPin,
  Search, Smartphone, HeadphonesIcon, Wrench, ChevronDown, Star, TrendingUp,
  Lock, Award, Clock, Phone, Mail, Flame,
} from "lucide-react";
const Instagram = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const Facebook = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2C16.5 4.1 15.5 4 14.4 4c-2.3 0-3.9 1.4-3.9 4v2.8H8v3.2h2.5V22h3z"/></svg>
);
const Linkedin = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zM7.6 8h4.37v1.91h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.48 3.04 5.48 7v8.45h-4.56v-7.49c0-1.79-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.97V22H7.6V8z"/></svg>
);
import logoNeg from "@/assets/logo-negativa.png.asset.json";
import { CONTACT, trackCta, trackWhatsApp, whatsappLink, type CtaLocation } from "@/lib/analytics";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mundo Digital — Sua empresa ganha um site profissional" },
      {
        name: "description",
        content:
          "Receba um site profissional em até 3 dias úteis e pague apenas pela hospedagem premium. SEO Local, SSL, WhatsApp e 12 meses de manutenção inclusos.",
      },
      { property: "og:title", content: "Sua empresa ganha um site profissional — Mundo Digital" },
      { property: "og:description", content: "Site pronto em 3 dias. Pague só pela hospedagem premium. Restam 7 vagas." },
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
  id, eyebrow, title, subtitle, children, className = "",
}: {
  id?: string; eyebrow?: string; title?: React.ReactNode; subtitle?: React.ReactNode;
  children: React.ReactNode; className?: string;
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
              <p className="mt-6 text-lg text-[color:var(--muted-foreground)] text-pretty">{subtitle}</p>
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
  href = "#oferta",
  className = "",
  cta = "primary_cta",
  location = "hero",
  external,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  cta?: string;
  location?: CtaLocation;
  external?: boolean;
}) {
  const isExternal = external ?? /^https?:|^mailto:|^tel:/.test(href);
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={() => {
        trackCta({ cta, location, destination: href });
        if (href.includes("wa.me")) trackWhatsApp(location, { cta });
      }}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold tracking-wide text-white transition-all hover:scale-[1.02] active:scale-[0.98] glow ${className}`}
      style={{ background: "linear-gradient(135deg, #4F63C9 0%, #374B89 60%, #2F3453 100%)" }}
    >
      <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "linear-gradient(135deg, #6178DD 0%, #4258A0 60%, #374069 100%)" }} />
      <span className="relative">{children}</span>
      <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-1" />
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
      className="inline-flex items-center justify-center gap-2 rounded-xl glass px-7 py-4 text-sm font-semibold tracking-wide text-white/90 transition-all hover:bg-white/10">
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
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #374B89 0%, transparent 60%)" }} />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #4F63C9 0%, transparent 60%)" }} />
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

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="glass-strong rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <img src={logoNeg.url} alt="Mundo Digital Soluções" className="h-7 md:h-8 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
            <a href="#beneficios" className="hover:text-white transition-colors">Benefícios</a>
            <a href="#portfolio" className="hover:text-white transition-colors">Portfólio</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
            <a href="#oferta" className="hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <PrimaryButton cta="nav_quero_vaga" location="nav" className="!px-5 !py-2.5 !text-xs">Quero minha vaga</PrimaryButton>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <section ref={ref} className="relative pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden">
      <motion.div style={{ y, opacity }} className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full glass-strong px-4 py-1.5 text-xs font-semibold tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-white/90">Restam apenas 7 vagas disponíveis</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 pulse-dot" />
          </div>
        </motion.div>

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
          Receba seu site pronto em até <strong className="text-white">3 dias úteis</strong> e pague apenas pela hospedagem premium.
          Sem taxa de criação. Sem implantação. Sem burocracia.
        </motion.p>

        <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <PrimaryButton cta="hero_quero_vaga" location="hero">Quero minha vaga</PrimaryButton>
          <GhostButton cta="hero_ver_exemplos" location="hero">Ver exemplos</GhostButton>
        </motion.div>

        <motion.ul {...fadeUp} transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/70">
          {["SEO Local Incluso", "SSL Premium", "Widget WhatsApp", "12 Meses de Manutenção", "Garantia de 7 Dias"].map((it) => (
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

        {/* Vacancy bar */}
        <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-14 mx-auto max-w-2xl">
          <VacancyBar />
        </motion.div>
      </motion.div>
    </section>
  );
}

function DeviceShowcase() {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* glow */}
      <div className="absolute inset-x-0 -bottom-10 h-40 blur-3xl opacity-60"
        style={{ background: "radial-gradient(ellipse at center, #4F63C9, transparent 60%)" }} />

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

function VacancyBar() {
  return (
    <div className="glass-strong rounded-2xl p-5">
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-white/80 font-medium">93 de 100 vagas preenchidas</span>
        <span className="text-orange-300 font-semibold">Restam 7</span>
      </div>
      <div className="relative h-2.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "93%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: "linear-gradient(90deg, #4F63C9, #f97316)" }}
        >
          <div className="absolute inset-0 animate-shimmer rounded-full" />
        </motion.div>
      </div>
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
      title={<>Quanto custa <span className="gradient-text-accent">NÃO</span> ter um site?</>}
    >
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="relative rounded-3xl p-8 border border-red-400/20 bg-red-500/[0.04]">
          <div className="text-xs font-semibold uppercase tracking-wider text-red-300 mb-4">Sem site</div>
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
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl p-8 border border-emerald-400/20 bg-emerald-500/[0.05] glow">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-4">Com site profissional</div>
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
    { icon: Search, t: "Não aparece nas pesquisas", d: "Quando pesquisam por você no Google, o concorrente aparece primeiro." },
    { icon: Shield, t: "Não transmite confiança", d: "Sem um site, sua marca parece amadora aos olhos do cliente." },
    { icon: TrendingUp, t: "Perde clientes diariamente", d: "Orçamentos vão embora sem que você sequer perceba." },
    { icon: Smartphone, t: "Depende só do Instagram", d: "Algoritmo decide quem te vê. Você não tem controle." },
    { icon: Globe, t: "Sem presença digital", d: "Empresa profissional precisa de endereço digital próprio." },
  ];
  return (
    <Section
      eyebrow="O Problema"
      title={<>Seu concorrente está recebendo<br/>contatos que <span className="gradient-text-accent">poderiam ser seus.</span></>}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <motion.div key={it.t} {...fadeUp} transition={{ duration: 0.55, delay: i * 0.06 }}
            className="group rounded-2xl glass p-6 hover:bg-white/[0.06] transition-all hover:-translate-y-1">
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
      title={<>Transforme sua presença digital em uma <span className="gradient-text-accent">máquina de contatos.</span></>}
    >
      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {steps.map((s, i) => (
            <motion.div key={s.label} {...fadeUp} transition={{ duration: 0.55, delay: i * 0.1 }}
              className="relative">
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
    { icon: Zap, t: "Hospedagem Premium", d: "Carregamento ultrarrápido e estável." },
    { icon: Lock, t: "SSL Premium", d: "Cadeado verde. Confiança total." },
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
      title={<>O que você recebe<br/><span className="gradient-text-accent">para crescer de verdade.</span></>}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <motion.div key={it.t} {...fadeUp} transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
            className="group relative rounded-2xl glass p-7 overflow-hidden hover:-translate-y-1 transition-all">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"
              style={{ background: "radial-gradient(circle, #4F63C9, transparent 70%)" }} />
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
    { title: "Clínica Odontológica", tag: "Saúde", grad: "from-cyan-500/30 to-blue-600/30", h: "md:row-span-2" },
    { title: "Restaurante Premium", tag: "Gastronomia", grad: "from-orange-500/30 to-pink-600/30", h: "" },
    { title: "Construtora Regional", tag: "Engenharia", grad: "from-emerald-500/30 to-teal-600/30", h: "" },
    { title: "Studio de Estética", tag: "Beleza", grad: "from-fuchsia-500/30 to-rose-600/30", h: "md:row-span-2" },
    { title: "Escritório de Advocacia", tag: "Jurídico", grad: "from-amber-500/30 to-orange-600/30", h: "" },
    { title: "Consultoria Financeira", tag: "Finanças", grad: "from-indigo-500/30 to-violet-600/30", h: "" },
  ];
  return (
    <Section id="portfolio" eyebrow="Portfólio" title="Projetos que geram resultado." subtitle="Cases reais de empresas que multiplicaram seus contatos com um site profissional.">
      <div className="grid md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
        {items.map((it, i) => (
          <motion.div key={it.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.06 }}
            className={`group relative rounded-2xl overflow-hidden glass cursor-pointer ${it.h}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${it.grad}`} />
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70 mb-1">{it.tag}</div>
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

function HowItWorksSection() {
  const steps = [
    { n: "01", t: "Escolha seu plano", d: "Mensal ou à vista. Você decide o melhor para sua empresa." },
    { n: "02", t: "Efetue o pagamento", d: "Cartão, Pix ou boleto. Ambiente 100% seguro." },
    { n: "03", t: "Envie sua logo e imagens", d: "Recebemos seu material e iniciamos a produção." },
    { n: "04", t: "Receba em até 3 dias úteis", d: "Site profissional pronto, no ar e otimizado." },
    { n: "05", t: "Comece a receber contatos", d: "WhatsApp, formulário e Google trabalhando por você." },
  ];
  return (
    <Section id="como-funciona" eyebrow="Como Funciona" title="Do briefing ao site no ar em 5 passos.">
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent md:-translate-x-px" />
        <div className="space-y-8">
          {steps.map((s, i) => (
            <motion.div key={s.n} {...fadeUp} transition={{ duration: 0.55, delay: i * 0.06 }}
              className={`relative flex md:items-center gap-6 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
              <div className="relative shrink-0 z-10">
                <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center font-display font-semibold text-white shadow-lg">{s.n}</div>
              </div>
              <div className={`flex-1 rounded-2xl glass p-6 ${i % 2 === 1 ? "md:text-right" : ""}`}>
                <h3 className="text-xl font-semibold text-white">{s.t}</h3>
                <p className="mt-1.5 text-white/65">{s.d}</p>
              </div>
              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Bonus / value stack ---------- */

function BonusSection() {
  const items = [
    ["Site Profissional", 997],
    ["SEO Local Inicial", 297],
    ["12 Meses de Manutenção", 597],
    ["SSL Premium", 97],
    ["Widget WhatsApp", 97],
    ["Google Maps", 97],
    ["Formulário Inteligente", 197],
    ["Configuração Técnica", 297],
  ] as const;
  const total = items.reduce((a, [, v]) => a + v, 0);
  return (
    <Section eyebrow="Valor Real" title={<>Você recebe <span className="gradient-text-accent">tudo isso incluso.</span></>}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {items.map(([t, v], i) => (
          <motion.div key={t} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.04 }}
            className="rounded-2xl glass p-5 flex flex-col gap-2">
            <Check className="w-5 h-5 text-emerald-400" />
            <div className="text-sm font-medium text-white">{t}</div>
            <div className="mt-auto text-xs text-white/50 line-through">R$ {v.toLocaleString("pt-BR")}</div>
          </motion.div>
        ))}
      </div>

      <motion.div {...fadeUp}
        className="mt-10 mx-auto max-w-2xl rounded-3xl glass-strong p-8 text-center glow">
        <div className="text-sm uppercase tracking-wider text-white/60">Valor Total</div>
        <div className="mt-2 text-5xl md:text-6xl font-display font-semibold line-through decoration-red-400/70 decoration-[3px]">
          R$ {total.toLocaleString("pt-BR")}
        </div>
        <div className="mt-3 text-emerald-300 font-semibold">Você não paga nada disso. Apenas hospedagem premium.</div>
      </motion.div>
    </Section>
  );
}

/* ---------- Offer ---------- */

function OfferSection() {
  const planA = ["Hospedagem Premium", "SSL", "Suporte", "Manutenção", "Widget WhatsApp", "Atualizações"];
  return (
    <Section id="oferta" eyebrow="Planos" title="Escolha o plano ideal para sua empresa." subtitle="Sem fidelidade. Cancele quando quiser. Garantia incondicional de 7 dias.">
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
        {/* highlighted */}
        <motion.div {...fadeUp}
          className="relative rounded-3xl p-[1.5px] order-2 md:order-1"
          style={{ background: "linear-gradient(135deg, #6178DD, #2F3453)" }}>
          <div className="rounded-[22px] bg-[#1a1e3a] p-8 h-full flex flex-col">
            <div className="inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
              style={{ background: "linear-gradient(135deg, #4F63C9, #374B89)" }}>
              <Star className="w-3 h-3" /> Mais escolhido
            </div>
            <div className="mt-5">
              <div className="text-sm text-white/60">Assinatura Mensal</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-5xl md:text-6xl font-display font-semibold gradient-text">R$ 47,90</span>
                <span className="text-white/60">/mês</span>
              </div>
            </div>
            <ul className="mt-6 space-y-3 text-white/85">
              {planA.map((i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center"><Check className="w-3 h-3 text-emerald-300" /></span>
                  {i}
                </li>
              ))}
            </ul>
            <PrimaryButton
              cta="offer_monthly_assinar"
              location="offer_monthly"
              href={whatsappLink("Olá! Quero assinar o plano mensal (R$ 47,90/mês) e garantir minha vaga.")}
              className="mt-8 w-full"
            >
              Quero assinar
            </PrimaryButton>
            <div className="mt-3 text-center text-xs text-white/50">Sem fidelidade · Cancele quando quiser</div>
          </div>
        </motion.div>

        {/* secondary */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl glass p-8 flex flex-col order-1 md:order-2">
          <div className="inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-400/30">
            <Award className="w-3 h-3" /> Melhor custo benefício
          </div>
          <div className="mt-5">
            <div className="text-sm text-white/60">Pagamento à vista (12 meses)</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-5xl md:text-6xl font-display font-semibold gradient-text">R$ 397</span>
            </div>
            <div className="mt-2 inline-block rounded-md bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-2 py-1">
              Economize R$ 177,80
            </div>
          </div>
          <ul className="mt-6 space-y-3 text-white/85">
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-400" /> Tudo do plano mensal</li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-400" /> 12 meses garantidos</li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-400" /> Pagamento único e simples</li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-400" /> Prioridade no suporte</li>
          </ul>
          <a href="#"
            className="mt-auto pt-8">
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl glass-strong px-7 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all">
              Quero economizar <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </motion.div>
      </div>
    </Section>
  );
}

/* ---------- Guarantee ---------- */

function GuaranteeSection() {
  return (
    <Section>
      <motion.div {...fadeUp} className="relative mx-auto max-w-4xl rounded-3xl glass-strong p-10 md:p-14 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(ellipse at top, #4F63C9, transparent 60%)" }} />
        <div className="relative">
          <div className="mx-auto w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center shadow-xl mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold gradient-text">Garantia Incondicional de 7 Dias</h2>
          <p className="mt-5 text-lg text-white/75 max-w-2xl mx-auto text-pretty">
            Receba seu site. Teste. Se não gostar, devolvemos <strong className="text-white">100% do valor pago</strong>. Sem burocracia. Sem perguntas.
          </p>
        </div>
      </motion.div>
    </Section>
  );
}

/* ---------- FAQ ---------- */

function FAQSection() {
  const faqs = [
    ["O domínio está incluso?", "Você pode usar um domínio próprio (recomendado) ou utilizar um subdomínio gratuito enquanto registra o seu. Ajudamos no processo."],
    ["Posso cancelar quando quiser?", "Sim. Não temos fidelidade. Você cancela quando quiser pelo painel ou direto com o suporte."],
    ["Qual o prazo de entrega?", "Entregamos seu site em até 3 dias úteis após o envio do material (logo, textos e imagens)."],
    ["Posso usar meu domínio atual?", "Sim. Cuidamos de toda a configuração técnica do seu domínio existente sem custo adicional."],
    ["O site aparece no Google?", "Sim. Aplicamos SEO local inicial, schema markup e otimizações técnicas para indexação rápida."],
    ["Posso solicitar alterações?", "Sim. Durante os 12 meses de manutenção, você solicita ajustes de texto, imagens e pequenas alterações."],
    ["Como funciona a manutenção?", "Atualizações de segurança, backups, monitoramento e ajustes contínuos durante todo o período do plano."],
    ["O pagamento é seguro?", "Utilizamos a Asaas, processadora regulada pelo Banco Central. Ambiente 100% seguro e criptografado."],
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" eyebrow="FAQ" title="Perguntas frequentes.">
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <motion.div key={q} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.03 }}
              className="rounded-2xl glass overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left">
                <span className="font-semibold text-white">{q}</span>
                <ChevronDown className={`w-5 h-5 text-white/60 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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

function FinalCTA() {
  return (
    <Section className="!pb-32">
      <motion.div {...fadeUp} className="relative mx-auto max-w-5xl rounded-[32px] p-[1.5px]"
        style={{ background: "linear-gradient(135deg, #6178DD, #2F3453 60%, #374B89)" }}>
        <div className="relative rounded-[30px] bg-[#161937] p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-40"
            style={{ background: "radial-gradient(circle, #4F63C9, transparent 60%)" }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full glass-strong px-4 py-1.5 text-xs font-semibold tracking-wider uppercase">
              <Clock className="w-3.5 h-3.5 text-orange-400" /> Última chamada
            </div>
            <h2 className="mt-6 text-4xl md:text-6xl font-semibold gradient-text text-balance leading-[1.05]">
              Garanta uma das últimas vagas disponíveis.
            </h2>
            <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto text-pretty">
              Quando as 100 vagas forem preenchidas, esta campanha será encerrada.
            </p>
            <div className="mt-8 mx-auto max-w-xl">
              <VacancyBar />
            </div>
            <div className="mt-8 flex justify-center">
              <PrimaryButton className="!px-9 !py-5 !text-base">Quero minha vaga</PrimaryButton>
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
            Soluções em Marketing e Vendas. Tecnologia, autoridade e crescimento previsível para empresas que querem ir além.
          </p>
          <p className="mt-6 font-display text-xl text-white/90">
            Crescimento previsível não é sorte. <span className="gradient-text-accent">É método.</span>
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">Contato</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> (00) 0000-0000</li>
            <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contato@mundodigital.com.br</li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">Redes</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2 hover:text-white cursor-pointer"><Instagram className="w-4 h-4" /> Instagram</li>
            <li className="flex items-center gap-2 hover:text-white cursor-pointer"><Facebook className="w-4 h-4" /> Facebook</li>
            <li className="flex items-center gap-2 hover:text-white cursor-pointer"><Linkedin className="w-4 h-4" /> LinkedIn</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <span>© {new Date().getFullYear()} Mundo Digital Soluções. Todos os direitos reservados.</span>
        <span>CNPJ · Política de Privacidade · Termos de Uso</span>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */

function Landing() {
  return (
    <main className="relative min-h-screen text-white overflow-x-clip">
      <BackgroundFX />
      <Nav />
      <Hero />
      <ContrastSection />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <PortfolioSection />
      <HowItWorksSection />
      <BonusSection />
      <OfferSection />
      <GuaranteeSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
