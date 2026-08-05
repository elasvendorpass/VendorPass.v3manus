import { Link } from "wouter";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "#plataforma", label: "Plataforma" },
    { href: "#score", label: "Vendor Score™" },
    { href: "#trilha", label: "Trilha" },
    { href: "#diversidade", label: "Supply Diversity" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <img
            src="/manus-storage/LogoVendorPass_4e26839d.png"
            alt="VendorPass"
            className="w-10 h-10"
          />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Elas VendorPass<span className="text-primary ml-0.5">™</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
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
            <a
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
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
