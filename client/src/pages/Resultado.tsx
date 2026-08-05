import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { ArrowRight, Lock, CheckCircle2, Target, TrendingUp, Sparkles, RotateCcw } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessLevel } from "@/hooks/useAccessLevel";
import { useVendorScore, useLeadProgress } from "@/hooks/useLocalStorage";
import { VendorScoreService } from "@/services/supabase";
import { generateMockScore } from "@/data/mocks";
import type { VendorScoreResult } from "@/types";
import { toast } from "sonner";

const archetypeInfo = {
  semente: { name: "Semente", emoji: "🌱", color: "text-amber-400", desc: "Sua empresa está no início. Hora de plantar as bases." },
  raiz: { name: "Raiz", emoji: "🌿", color: "text-green-500", desc: "As raízes estão se formando. Continue fortalecendo." },
  crescimento: { name: "Crescimento", emoji: "🌳", color: "text-emerald-400", desc: "Sua empresa está crescendo com potencial real." },
  escala: { name: "Escala", emoji: "🏢", color: "text-violet-400", desc: "Pronta para escalar e entrar em grandes cadeias." },
  colheita: { name: "Colheita", emoji: "🏆", color: "text-primary", desc: "Excelência empresarial. Referência no mercado." },
};

export default function Resultado() {
  const [location, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const accessLevel = useAccessLevel();
  const { score, saveScore } = useVendorScore();
  const { markScoreViewed } = useLeadProgress();
  const [localScore, setLocalScore] = useState<VendorScoreResult | null>(score);

  useEffect(() => {
    if (score) {
      setLocalScore(score);
      markScoreViewed();
    } else {
      // Try to fetch from Supabase first if authenticated
      if (isAuthenticated && user) {
        VendorScoreService.getLatestScore(user.id).then((dbScore) => {
          if (dbScore) {
            // Convert DB score to frontend type
            const converted: VendorScoreResult = {
              overall: dbScore.score_total || 50,
              level: (dbScore.archetype || "raiz") as VendorScoreResult["level"],
              completedAt: dbScore.created_at || new Date().toISOString(),
              dimensions: [
                {
                  dimension: "financas",
                  label: "Gestão Financeira",
                  score: (dbScore.financas as any)?.score || 50,
                  weight: (dbScore.weights as any)?.financas || 0.25,
                  gaps: (dbScore.financas as any)?.gaps || [],
                  recommendations: [(dbScore.financas as any)?.summary || ""] as string[],
                },
                {
                  dimension: "processos",
                  label: "Processos Operacionais",
                  score: (dbScore.processos as any)?.score || 50,
                  weight: (dbScore.weights as any)?.processos || 0.20,
                  gaps: (dbScore.processos as any)?.gaps || [],
                  recommendations: [(dbScore.processos as any)?.summary || ""] as string[],
                },
                {
                  dimension: "vendas",
                  label: "Comercial e Vendas",
                  score: (dbScore.vendas as any)?.score || 50,
                  weight: (dbScore.weights as any)?.vendas || 0.25,
                  gaps: (dbScore.vendas as any)?.gaps || [],
                  recommendations: [(dbScore.vendas as any)?.summary || ""] as string[],
                },
                {
                  dimension: "digital",
                  label: "Presença Digital",
                  score: (dbScore.digital as any)?.score || 50,
                  weight: (dbScore.weights as any)?.digital || 0.15,
                  gaps: (dbScore.digital as any)?.gaps || [],
                  recommendations: [(dbScore.digital as any)?.summary || ""] as string[],
                },
                {
                  dimension: "institucional",
                  label: "Institucional e Legal",
                  score: (dbScore.institucional as any)?.score || 50,
                  weight: (dbScore.weights as any)?.institucional || 0.15,
                  gaps: (dbScore.institucional as any)?.gaps || [],
                  recommendations: [(dbScore.institucional as any)?.summary || ""] as string[],
                },
              ],
            };
            setLocalScore(converted);
            saveScore(converted);
            markScoreViewed();
          } else {
            // Fallback to mock if no persisted score
            const mock = generateMockScore();
            setLocalScore(mock);
            saveScore(mock);
          }
        });
      } else {
        // Fallback to mock if not authenticated
        const mock = generateMockScore();
        setLocalScore(mock);
        saveScore(mock);
      }
    }
  }, []);

  const handleRetry = () => {
    if (window.confirm("Deseja refazer o diagnóstico? O score atual será substituído.")) {
      navigate("/diagnostico");
    }
  };

  const wrapInLayout = !location.includes("/resultado?embed");

  const content = (
    <div className="min-h-screen bg-background ambient-bg">
      {!localScore ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Calculando seu resultado...</p>
        </div>
      ) : (
        <>
          {/* Archetype Card */}
          <div className="container pt-8 pb-4 max-w-2xl mx-auto">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{archetypeInfo[localScore.level].emoji}</div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Arquétipo: {archetypeInfo[localScore.level].name}
                </h1>
                <p className="text-sm text-muted-foreground">{archetypeInfo[localScore.level].desc}</p>
              </div>

              {/* Overall Score */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="hsl(var(--primary))"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: 0, strokeDashoffset: 251.2 }}
                      animate={{ strokeDasharray: 251.2, strokeDashoffset: 251.2 - (251.2 * localScore.overall) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-foreground">{localScore.overall}</span>
                      <span className="text-sm text-muted-foreground block">/ 100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={localScore.dimensions.map((d) => ({
                    subject: d.label.split(" ").slice(-1)[0],
                    score: d.score,
                  }))}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Dimension Bars */}
              <div className="space-y-3">
                {localScore.dimensions.map((dim) => (
                  <div key={dim.dimension} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-32 shrink-0">{dim.label}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-growth rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${dim.score}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground w-8 text-right">{dim.score}</span>
                  </div>
                ))}
              </div>

              {/* Gaps & Recommendations */}
              <div className="mt-6 pt-6 border-t border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Target size={14} className="text-primary" />
                  Gaps Identificados & Recomendações
                </h3>
                <div className="space-y-2">
                  {localScore.dimensions.map((dim) => (
                    dim.gaps.length > 0 && (
                      <div key={dim.dimension} className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-xs font-medium text-primary mb-1">{dim.label}</p>
                        {dim.gaps.map((gap, i) => (
                          <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <ArrowRight size={10} className="mt-0.5 shrink-0" />
                            {gap}
                          </p>
                        ))}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lead CTA */}
          {accessLevel === "lead" && (
            <div className="container pb-8 max-w-2xl mx-auto">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                <Sparkles size={24} className="text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold text-foreground mb-2">Desbloqueie sua Trilha de Crescimento</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Como cliente Elas VendorPass™, você terá acesso à Trilha personalizada, Vendor Kit completo e Match Engine.
                </p>
                <button
                  onClick={() => toast.info("Em breve! Integração com pagamento será disponibilizada.")}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:brightness-110 transition-all glow-primary"
                >
                  <Lock size={14} />
                  Desbloquear Acesso Completo
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Retry */}
          <div className="container pb-8 max-w-2xl mx-auto text-center">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw size={14} />
              Refazer diagnóstico
            </button>
          </div>
        </>
      )}
    </div>
  );

  if (!wrapInLayout || !isAuthenticated) return content;
  return <DashboardLayout>{content}</DashboardLayout>;
}
