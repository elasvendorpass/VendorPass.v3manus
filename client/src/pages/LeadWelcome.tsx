import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Lock,
  BarChart3,
  Award,
  Package,
  Target,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { generateMockScore } from "@/data/mocks";
import { useAuth } from "@/contexts/AuthContext";

export default function LeadWelcome() {
  const { user } = useAuth();
  const score = generateMockScore();

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Welcome Header */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center">
          <Sparkles size={24} className="text-primary mx-auto mb-3" />
          <h1 className="text-xl font-bold text-foreground mb-2">
            Bem-vinda, {user?.name?.split(" ")[0] || "fornecedora"}!
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
            Seu diagnóstico está pronto. Veja seu Vendor Score™ e descubra como a Trilha VendorPass™ pode acelerar o desenvolvimento da sua empresa.
          </p>
          <Link
            href="/resultado"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:brightness-110 transition-all glow-primary"
          >
            Ver Meu Vendor Score™
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Score Preview */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <BarChart3 size={20} className="text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">{score.overall}</p>
            <p className="text-xs text-muted-foreground">Vendor Score™</p>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <TrendingUp size={20} className="text-growth mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">
              {score.dimensions.filter((d) => d.score >= 60).length}/5
            </p>
            <p className="text-xs text-muted-foreground">Dimensões saudáveis</p>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <Award size={20} className="text-energy mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground capitalize">{score.level}</p>
            <p className="text-xs text-muted-foreground">Arquétipo atual</p>
          </div>
        </div>

        {/* Locked Features */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Desbloqueie o potencial completo</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: Award,
                title: "Trilha VendorPass™",
                desc: "Jornada completa com 5 arquétipos e XP",
              },
              {
                icon: Package,
                title: "Vendor Kit™",
                desc: "Templates, checklists e guias práticos",
              },
              {
                icon: Target,
                title: "Match Engine™",
                desc: "Oportunidades de negócio personalizadas",
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-card border border-border/50 rounded-xl p-5 opacity-60 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/80" />
                <div className="relative">
                  <feature.icon size={20} className="text-muted-foreground mb-3" />
                  <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{feature.desc}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock size={12} />
                    <span>Bloqueado</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary/20 to-card rounded-2xl p-6 border border-primary/20 text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">Pronta para evoluir?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Desbloqueie a Trilha completa e tenha acesso a todas as ferramentas de desenvolvimento.
          </p>
          <button
            onClick={() => alert("Integração de pagamento (Stripe/Asaas) será implementada na próxima fase.")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:brightness-110 transition-all glow-primary"
          >
            Desbloquear Trilha Completa
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
