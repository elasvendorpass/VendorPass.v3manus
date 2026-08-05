import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Lock, Star, Award, Flame, ArrowRight, RotateCcw } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useTrilhaProgress, useLeadProgress } from "@/hooks/useLocalStorage";
import { trilhaSteps } from "@/data/mocks";
import { useAccessLevel } from "@/hooks/useAccessLevel";
import { toast } from "sonner";
import type { ArchetypeLevel, TrilhaStep } from "@/types";

const archetypeConfig: Record<ArchetypeLevel, { name: string; emoji: string; color: string; bg: string }> = {
  semente: { name: "Semente", emoji: "🌱", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  raiz: { name: "Raiz", emoji: "🌿", color: "text-green-500", bg: "bg-green-500/10 border-green-500/20" },
  crescimento: { name: "Crescimento", emoji: "🌳", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  escala: { name: "Escala", emoji: "🏢", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  colheita: { name: "Colheita", emoji: "🏆", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
};

const levelOrder: ArchetypeLevel[] = ["semente", "raiz", "crescimento", "escala", "colheita"];

export default function Trilha() {
  const [selectedLevel, setSelectedLevel] = useState<ArchetypeLevel>("semente");
  const accessLevel = useAccessLevel();
  const isCliente = accessLevel === "cliente";

  // LocalStorage hooks
  const { steps, updateSteps, completeStep, resetTrilha, getProgress } = useTrilhaProgress();
  const { markTrilhaStarted } = useLeadProgress();

  // Initialize persisted steps or use mock data
  const [trilhaData, setTrilhaData] = useState<TrilhaStep[]>(() => {
    if (steps) return steps;
    // First visit — use mock data and persist it
    return trilhaSteps;
  });

  // Persist on first load
  useEffect(() => {
    if (!steps) {
      updateSteps(trilhaSteps);
    }
    markTrilhaStarted();
  }, []);

  const xpTotal = trilhaData.filter((s) => s.completed).reduce((acc, s) => acc + s.xp, 0);
  const streakDays = 7;
  const progress = getProgress();

  const stepsByLevel = trilhaData.filter((s) => s.level === selectedLevel);

  const handleComplete = useCallback((step: TrilhaStep) => {
    if (!step.completed && !step.locked && isCliente) {
      completeStep(step.id);
      setTrilhaData((prev) => {
        const updated = prev.map((s) => {
          if (s.id === step.id) return { ...s, completed: true };
          return s;
        });
        // Unlock next step
        const idx = updated.findIndex((s) => s.id === step.id);
        if (idx >= 0 && idx < updated.length - 1) {
          updated[idx + 1] = { ...updated[idx + 1], locked: false };
        }
        return updated;
      });
      toast.success(`${step.title} concluída! +${step.xp} XP`);
    } else if (step.locked) {
      toast.error("Complete as etapas anteriores para desbloquear.");
    }
  }, [isCliente, completeStep]);

  const handleReset = useCallback(() => {
    if (window.confirm("Deseja reiniciar toda a trilha? Seu progresso será perdido.")) {
      resetTrilha();
      setTrilhaData(trilhaSteps);
      toast.info("Trilha reiniciada.");
    }
  }, [resetTrilha]);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Trilha VendorPass™</h1>
            <p className="text-sm text-muted-foreground">Sua jornada de desenvolvimento empresarial.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-energy" />
              <span className="text-sm font-semibold text-foreground">{xpTotal} XP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame size={14} className="text-energy" />
              <span className="text-sm font-semibold text-foreground">{streakDays} dias</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors p-1"
              title="Reiniciar trilha"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">Progresso Geral</span>
            <span className="text-xs text-primary font-semibold">{progress.percentage}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-growth"
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            {progress.completed} de {progress.total} etapas concluídas
          </p>
        </div>

        {/* Archetype Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {levelOrder.map((level) => {
            const config = archetypeConfig[level];
            const isActive = selectedLevel === level;
            const levelSteps = trilhaData.filter((s) => s.level === level);
            const levelCompleted = levelSteps.filter((s) => s.completed).length;
            return (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap ${
                  isActive ? config.bg + " border-current" : "border-border/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{config.emoji}</span>
                <span className="text-xs font-medium">{config.name}</span>
                <span className="text-[10px] text-muted-foreground">({levelCompleted}/{levelSteps.length})</span>
              </button>
            );
          })}
        </div>

        {/* Steps for selected level */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLevel}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {stepsByLevel.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border/50">
                <Award size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Nenhuma etapa neste nível ainda.</p>
              </div>
            ) : (
              stepsByLevel.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`bg-card border border-border/50 rounded-xl p-5 glow-card ${
                    step.locked ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Status indicator */}
                    <div className="mt-1">
                      {step.completed ? (
                        <CheckCircle2 size={20} className="text-growth" />
                      ) : step.locked ? (
                        <Lock size={20} className="text-muted-foreground" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-border flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                          +{step.xp} XP
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {step.dimension.charAt(0).toUpperCase() + step.dimension.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    {!step.locked && !step.completed && isCliente && (
                      <button
                        onClick={() => handleComplete(step)}
                        className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 transition-all"
                      >
                        Concluir <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress across levels */}
        <div className="bg-card border border-border/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Progresso por Nível</h3>
          <div className="space-y-3">
            {levelOrder.map((level) => {
              const levelSteps = trilhaData.filter((s) => s.level === level);
              const completed = levelSteps.filter((s) => s.completed).length;
              const total = levelSteps.length;
              const pct = total > 0 ? (completed / total) * 100 : 0;
              const config = archetypeConfig[level];
              return (
                <div key={level} className="flex items-center gap-3">
                  <span className="text-lg">{config.emoji}</span>
                  <span className="text-xs font-medium text-foreground w-24">{config.name}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">{completed}/{total}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
