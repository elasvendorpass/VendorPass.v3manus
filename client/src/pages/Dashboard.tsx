import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  BarChart3,
  Target,
  Award,
  Package,
  TrendingUp,
  Lock,
  ArrowRight,
  Zap,
  Flame,
  CheckCircle2,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAccessLevel } from "@/hooks/useAccessLevel";
import { generateMockScore, trilhaSteps } from "@/data/mocks";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function Dashboard() {
  const accessLevel = useAccessLevel();
  const score = generateMockScore();
  const isCliente = accessLevel === "cliente";

  const xpTotal = trilhaSteps.filter((s) => s.completed).reduce((acc, s) => acc + s.xp, 0);
  const completedSteps = trilhaSteps.filter((s) => s.completed).length;
  const streakDays = 7;

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
        <motion.div variants={fadeInUp}>
          <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Acompanhe sua evolução e acesse suas ferramentas.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={fadeInUp} className="bg-card border border-border/50 rounded-xl p-4 glow-card">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground">Vendor Score™</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{score.overall}</p>
            <p className="text-[10px] text-muted-foreground">de 100</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-card border border-border/50 rounded-xl p-4 glow-card">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-energy" />
              <span className="text-xs text-muted-foreground">XP Total</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{xpTotal}</p>
            <p className="text-[10px] text-muted-foreground">pontos acumulados</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-card border border-border/50 rounded-xl p-4 glow-card">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={16} className="text-energy" />
              <span className="text-xs text-muted-foreground">Streak</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{streakDays}</p>
            <p className="text-[10px] text-muted-foreground">dias consecutivos</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-card border border-border/50 rounded-xl p-4 glow-card">
            <div className="flex items-center gap-2 mb-2">
              <Award size={16} className="text-growth" />
              <span className="text-xs text-muted-foreground">Concluídos</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{completedSteps}/{trilhaSteps.length}</p>
            <p className="text-[10px] text-muted-foreground">passos da trilha</p>
          </motion.div>
        </motion.div>

        {/* Quick Access Grid */}
        <motion.div variants={fadeInUp}>
          <h2 className="text-lg font-semibold text-foreground mb-4">Acesso Rápido</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/resultado">
              <div className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all glow-card cursor-pointer group">
                <BarChart3 size={20} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-semibold text-foreground mb-1">Meu Score</h3>
                <p className="text-xs text-muted-foreground">Ver resultados e gaps</p>
                <ArrowRight size={14} className="text-muted-foreground mt-3 group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link href="/trilha">
              <div className={`bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all glow-card cursor-pointer group ${!isCliente ? "opacity-50" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <Award size={20} className={isCliente ? "text-growth" : "text-muted-foreground"} />
                  {!isCliente && <Lock size={14} className="text-muted-foreground" />}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Trilha</h3>
                <p className="text-xs text-muted-foreground">Evoluir na jornada</p>
                <ArrowRight size={14} className="text-muted-foreground mt-3 group-hover:text-growth transition-colors" />
              </div>
            </Link>

            <Link href="/vendor-kit">
              <div className={`bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all glow-card cursor-pointer group ${!isCliente ? "opacity-50" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <Package size={20} className={isCliente ? "text-primary" : "text-muted-foreground"} />
                  {!isCliente && <Lock size={14} className="text-muted-foreground" />}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Vendor Kit™</h3>
                <p className="text-xs text-muted-foreground">Templates e recursos</p>
                <ArrowRight size={14} className="text-muted-foreground mt-3 group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link href="/match-engine">
              <div className={`bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all glow-card cursor-pointer group ${!isCliente ? "opacity-50" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <Target size={20} className={isCliente ? "text-energy" : "text-muted-foreground"} />
                  {!isCliente && <Lock size={14} className="text-muted-foreground" />}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Match Engine™</h3>
                <p className="text-xs text-muted-foreground">Oportunidades para você</p>
                <ArrowRight size={14} className="text-muted-foreground mt-3 group-hover:text-energy transition-colors" />
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeInUp}>
          <h2 className="text-lg font-semibold text-foreground mb-4">Atividade Recente</h2>
          <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
            {[
              { action: "Concluiu 'Organize suas finanças'", xp: "+50 XP", time: "2 dias atrás", icon: CheckCircle2, color: "text-growth" },
              { action: "Novo diagnóstico realizado", xp: "", time: "5 dias atrás", icon: TrendingUp, color: "text-primary" },
              { action: "Streak de 7 dias alcançado", xp: "+25 XP", time: "1 dia atrás", icon: Flame, color: "text-energy" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                <item.icon size={16} className={item.color} />
                <span className="text-sm text-foreground/80 flex-1">{item.action}</span>
                {item.xp && <span className="text-xs font-medium text-energy">{item.xp}</span>}
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
