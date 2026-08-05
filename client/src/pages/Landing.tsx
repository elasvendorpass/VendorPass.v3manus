import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  BarChart3,
  Award,
  Target,
  Leaf,
  Shield,
  TrendingUp,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

import { useLocation } from "wouter";

const TRANSPARENT_LOGO = "/manus-storage/logo-transparent_906e40e3.png";
const TRANSPARENT_LOGO_LARGE = "/manus-storage/logo-transparent-large_f1f7e0f5.png";
const OFFICIAL_LOGO = TRANSPARENT_LOGO_LARGE;

// Navbar Component
function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#plataforma", label: "Plataforma" },
    { href: "#score", label: "Vendor Score™" },
    { href: "#trilha", label: "Trilha" },
    { href: "#diversidade", label: "Supply Diversity" },
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-primary/5"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <button onClick={() => scrollTo("#hero")} className="flex items-center gap-2.5 no-underline">
          <img src={TRANSPARENT_LOGO} alt="Elas VendorPass" className="w-9 h-9 object-contain" />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Elas VendorPass<span className="text-primary ml-0.5">™</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 px-3 py-2"
          >
            Entrar
          </Link>
          <Link
            href="/diagnostico"
            className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:brightness-110 transition-all duration-200 glow-primary"
          >
            Diagnóstico Grátis
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border p-4 space-y-3"
        >
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2 w-full text-left"
            >
              {link.label}
            </button>
          ))}
          <Link
            href="/login"
            className="block text-sm font-medium text-muted-foreground py-2"
            onClick={() => setMobileOpen(false)}
          >
            Entrar
          </Link>
          <Link
            href="/diagnostico"
            className="block text-sm font-semibold bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-center glow-primary"
            onClick={() => setMobileOpen(false)}
          >
            Diagnóstico Grátis
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}

export default function Landing() {
  const [, navigate] = useLocation();

  // Handle GitHub Pages SPA redirect
  React.useEffect(() => {
    const path = sessionStorage.getItem('redirectPath');
    if (path && path !== '/' && path !== '/vendor-growth-compass/') {
      navigate(path.replace('/vendor-growth-compass', ''));
      sessionStorage.removeItem('redirectPath');
    }
  }, [navigate]);

  return (
    <div className="ambient-bg">
      {/* Navbar */}
      <LandingNavbar />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-growth/10 rounded-full blur-3xl" />

        <div className="container relative z-10 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8"
          >
            {/* Official Logo - Large and Expressive */}
            <motion.div variants={fadeInUp} className="w-full flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl scale-150" />
                <img
                  src={TRANSPARENT_LOGO}
                  alt="Elas VendorPass Logo"
                  className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain drop-shadow-[0_0_60px_rgba(139,92,246,0.3)]"
                />
              </div>
            </motion.div>

            {/* Subtitle Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary tracking-wide">AI Supplier Development Intelligence</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15]">
              Meça. Desenvolva.{" "}
              <span className="text-gradient">Acelere.</span>
            </motion.h1>

            {/* Description */}
            <motion.p variants={fadeInUp} className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              A primeira plataforma que mede a maturidade empresarial de fornecedoras e as prepara para integrar cadeias corporativas, programas de Supply Diversity e ESG.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/diagnostico"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-semibold text-sm hover:brightness-110 transition-all duration-200 glow-primary"
              >
                Iniciar Diagnóstico Grátis
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3.5 rounded-xl font-medium text-sm hover:bg-secondary transition-all duration-200"
              >
                Entrar
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={fadeInUp} className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-growth border-2 border-background flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-white">{String.fromCharCode(64 + i)}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-foreground font-medium">+2.500</span> fornecedoras diagnosticadas
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="plataforma" className="py-24 relative">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pilares da Plataforma
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
              Seis dimensões integradas que transformam dados em inteligência acionável para o desenvolvimento da sua fornecedora.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Brain, title: "Inteligência Artificial", desc: "Diagnóstico empresarial alimentado por IA que analisa 5 dimensões da sua operação." },
              { icon: BarChart3, title: "Vendor Score™", desc: "Score de 0 a 100 que mede sua maturidade empresarial de forma objetiva e acionável." },
              { icon: Award, title: "Trilha VendorPass™", desc: "Jornada gamificada com 5 arquétipos: Semente → Raiz → Crescimento → Escala → Colheita." },
              { icon: Target, title: "Match Engine™", desc: "Conecta fornecedoras a oportunidades reais em cadeias corporativas e editais." },
              { icon: Leaf, title: "Supply Diversity & ESG", desc: "Prepara sua empresa para programas de diversidade e requisitos de sustentabilidade." },
              { icon: Shield, title: "Business Readiness", desc: "Garante que sua empresa está pronta para competir em qualquer licitação ou edital." },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="glow-card group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon size={20} className="text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vendor Score Section */}
      <section id="score" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <img
                src="/manus-storage/vendor-score-visual_23ce6667.png"
                alt="Vendor Score Radar"
                className="rounded-2xl border border-border/30 max-w-sm mx-auto"
              />
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-growth/10 border border-growth/20">
                <BarChart3 size={14} className="text-growth" />
                <span className="text-xs font-medium text-growth">Vendor Score™</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Seu Score. Suas Gaps.{" "}
                <span className="text-gradient">Seu Plano.</span>
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                O Vendor Score™ avalia sua empresa em 5 dimensões críticas — Finanças, Processos, Vendas, Digital e Institucional — e gera um plano de evolução personalizado.
              </p>

              <div className="space-y-3">
                {["Diagnóstico em menos de 5 minutos", "Resultado instantâneo com radar visual", "Recomendações acionáveis por dimensão", "Comparação com benchmarks do setor"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-growth shrink-0" />
                    <span className="text-sm text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold text-sm hover:brightness-110 transition-all glow-primary"
              >
                Descobrir Meu Score
                <ChevronRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trilha Section */}
      <section id="trilha" className="py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trilha VendorPass™
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
              Uma jornada gamificada que acompanha o crescimento da sua empresa em 5 estágios evolutivos.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
          >
            {[
              { name: "Semente", icon: "🌱", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/30" },
              { name: "Raiz", icon: "🌿", color: "from-green-600/20 to-green-600/5", border: "border-green-600/30" },
              { name: "Crescimento", icon: "🌳", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30" },
              { name: "Escala", icon: "🏢", color: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/30" },
              { name: "Colheita", icon: "🏆", color: "from-primary/20 to-primary/5", border: "border-primary/30" },
            ].map((archetype, i) => (
              <motion.div
                key={archetype.name}
                variants={fadeInUp}
                className={`relative p-6 rounded-2xl bg-gradient-to-b ${archetype.color} border ${archetype.border} text-center`}
              >
                <span className="text-3xl mb-3 block">{archetype.icon}</span>
                <p className="text-sm font-semibold text-foreground">{archetype.name}</p>
                <p className="text-xs text-muted-foreground mt-1">Nível {i + 1}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Supply Diversity Section */}
      <section id="diversidade" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-growth/5 to-transparent" />
        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-growth/10 border border-growth/20 mb-6">
              <Leaf size={14} className="text-growth" />
              <span className="text-xs font-medium text-growth">Supply Diversity & ESG</span>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Preparamos você para o{" "}
              <span className="text-gradient">mercado que valoriza</span> diversidade
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-muted-foreground leading-relaxed mb-8">
              Grandes corporações buscam ativamente fornecedoras diversas. O VendorPass™ coloca sua empresa no radar dessas oportunidades e garante que você esteja pronta quando a porta abrir.
            </motion.p>

            <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4 text-center">
              {[
                { num: "67%", label: "das Fortune 500 têm programas de Supply Diversity" },
                { num: "R$ 48Bi", label: "em compras de fornecedoras diversas no Brasil" },
                { num: "3x", label: "mais chances de aprovação com Vendor Score™ alto" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl bg-card border border-border/50">
                  <p className="text-2xl font-bold text-primary mb-1">{stat.num}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="relative rounded-3xl bg-gradient-to-br from-primary/20 via-card to-primary/10 border border-primary/20 p-12 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-growth/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Pronta para descobrir seu potencial?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground max-w-lg mx-auto mb-8">
                Em 5 minutos você descobre o Vendor Score™ da sua empresa e recebe um plano personalizado de evolução.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/diagnostico"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:brightness-110 transition-all glow-primary"
                >
                  Iniciar Diagnóstico Grátis
                  <TrendingUp size={16} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={TRANSPARENT_LOGO} alt="Elas VendorPass" className="w-10 h-10 object-contain" />
              <span className="text-sm font-semibold text-foreground">
                Elas VendorPass<span className="text-primary ml-0.5">™</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 ELAS VendorPass™. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
