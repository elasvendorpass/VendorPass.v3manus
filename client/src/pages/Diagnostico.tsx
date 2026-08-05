import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { DiagnosisService, VendorScoreService } from "@/services/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useDiagnosisAnswers, useVendorScore, useLeadProgress } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

export default function Diagnostico() {
  const [, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const steps = DiagnosisService.getSteps();

  // Use localStorage hooks for persistence (also syncs to Supabase when available)
  const { answers, saveAnswer, currentStep, saveCurrentStep, resetDiagnosis } = useDiagnosisAnswers();
  const { saveScore } = useVendorScore();
  const { markDiagnosisDone } = useLeadProgress();

  const [isCalculating, setIsCalculating] = useState(false);

  const step = steps[currentStep] ?? steps[0];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleAnswer = useCallback((questionId: string, value: number) => {
    saveAnswer(questionId, value);
  }, [saveAnswer]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      saveCurrentStep(currentStep + 1);
    } else {
      // Calculate score and save to Supabase if authenticated
      setIsCalculating(true);
      setTimeout(async () => {
        const score = DiagnosisService.calculateScore(answers);
        saveScore(score);
        markDiagnosisDone();

        // Save to Supabase if user is authenticated
        if (isAuthenticated && user) {
          try {
            const diagnosis = await DiagnosisService.saveDiagnosis(user.id, answers, score);
            if (diagnosis) {
              await VendorScoreService.saveScore(user.id, diagnosis.id, score);
            }
          } catch (err) {
            console.error("Error saving to Supabase:", err);
            // Don't block navigation on save error
          }
        }

        setIsCalculating(false);
        toast.success("Diagnóstico concluído!");
        navigate("/resultado");
      }, 2000);
    }
  }, [currentStep, steps.length, answers, navigate, saveCurrentStep, saveScore, markDiagnosisDone, isAuthenticated, user]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      saveCurrentStep(currentStep - 1);
    } else if (!isAuthenticated) {
      navigate("/login");
    }
  }, [currentStep, isAuthenticated, navigate, saveCurrentStep]);

  const handleReset = useCallback(() => {
    if (window.confirm("Deseja reiniciar o diagnóstico? Todas as respostas serão perdidas.")) {
      resetDiagnosis();
      toast.info("Diagnóstico reiniciado.");
    }
  }, [resetDiagnosis]);

  const isStepComplete = step?.questions.every((q) => answers[q.id] !== undefined) ?? false;

  return (
    <div className="min-h-screen bg-background ambient-bg">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container flex items-center justify-between h-14">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            {currentStep === 0 && !isAuthenticated ? "Voltar" : "Anterior"}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Passo {currentStep + 1} de {steps.length}
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              title="Reiniciar diagnóstico"
            >
              Reiniciar
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted/50">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-growth"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container pt-28 pb-12 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!isCalculating ? (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span className="text-xs font-medium text-primary">{step.dimension.toUpperCase()}</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{step.title}</h2>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {step.questions.map((question, qIndex) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qIndex * 0.1 }}
                  >
                    <p className="text-sm font-medium text-foreground mb-3">{question.text}</p>
                    <div className="space-y-2">
                      {question.options.map((option) => {
                        const isSelected = answers[question.id] === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleAnswer(question.id, option.value)}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm ${
                              isSelected
                                ? "bg-primary/15 border-primary/50 text-foreground"
                                : "bg-card border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-card"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? "border-primary bg-primary" : "border-border"
                              }`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                              </span>
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Next button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!isStepComplete}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed glow-primary"
                >
                  {currentStep < steps.length - 1 ? "Próximo" : "Ver Resultado"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="calculating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
            >
              <Loader2 size={32} className="animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Calculando seu Vendor Score™...</p>
              <p className="text-xs text-muted-foreground/60">Analisando 5 dimensões empresariais</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
