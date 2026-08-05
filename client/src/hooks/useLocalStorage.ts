import { useState, useCallback, useEffect } from "react";
import type { VendorScoreResult, ArchetypeLevel, TrilhaStep } from "@/types";

const STORAGE_KEYS = {
  USER: "vendorpass_user",
  DIAGNOSIS_ANSWERS: "vendorpass_diagnosis_answers",
  VENDOR_SCORE: "vendorpass_vendor_score",
  TRILHA_PROGRESS: "vendorpass_trilha_progress",
  CURRENT_STEP: "vendorpass_current_step",
  LEAD_PROGRESS: "vendorpass_lead_progress",
} as const;

// Generic localStorage helpers
function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently fail
  }
}

// Hook for persisting user session
export function useUserSession() {
  const [user, setUser] = useState(() => getItem(STORAGE_KEYS.USER));

  const saveUser = useCallback((user: unknown) => {
    setUser(user);
    setItem(STORAGE_KEYS.USER, user);
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    removeItem(STORAGE_KEYS.USER);
    // Also clear diagnosis data on logout
    removeItem(STORAGE_KEYS.DIAGNOSIS_ANSWERS);
    removeItem(STORAGE_KEYS.VENDOR_SCORE);
    removeItem(STORAGE_KEYS.TRILHA_PROGRESS);
    removeItem(STORAGE_KEYS.CURRENT_STEP);
  }, []);

  return { user, saveUser, clearUser };
}

// Hook for persisting diagnosis answers
export function useDiagnosisAnswers() {
  const [answers, setAnswers] = useState(() => getItem<Record<string, number>>(STORAGE_KEYS.DIAGNOSIS_ANSWERS) ?? {});
  const [currentStep, setCurrentStep] = useState(() => getItem<number>(STORAGE_KEYS.CURRENT_STEP) ?? 0);

  const saveAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      setItem(STORAGE_KEYS.DIAGNOSIS_ANSWERS, next);
      return next;
    });
  }, []);

  const saveCurrentStep = useCallback((step: number) => {
    setCurrentStep(step);
    setItem(STORAGE_KEYS.CURRENT_STEP, step);
  }, []);

  const resetDiagnosis = useCallback(() => {
    setAnswers({});
    setCurrentStep(0);
    removeItem(STORAGE_KEYS.DIAGNOSIS_ANSWERS);
    removeItem(STORAGE_KEYS.CURRENT_STEP);
    removeItem(STORAGE_KEYS.VENDOR_SCORE);
  }, []);

  const allAnswered = useCallback(
    (totalQuestions: number) => {
      return Object.keys(answers).length >= totalQuestions;
    },
    [answers]
  );

  return { answers, saveAnswer, currentStep, saveCurrentStep, resetDiagnosis, allAnswered };
}

// Hook for persisting vendor score result
export function useVendorScore() {
  const [score, setScore] = useState(() => getItem<VendorScoreResult>(STORAGE_KEYS.VENDOR_SCORE));

  const saveScore = useCallback((result: VendorScoreResult) => {
    setScore(result);
    setItem(STORAGE_KEYS.VENDOR_SCORE, result);
  }, []);

  const clearScore = useCallback(() => {
    setScore(null);
    removeItem(STORAGE_KEYS.VENDOR_SCORE);
  }, []);

  return { score, saveScore, clearScore };
}

// Hook for persisting trilha progress
export function useTrilhaProgress() {
  const [steps, setSteps] = useState(() => getItem<TrilhaStep[]>(STORAGE_KEYS.TRILHA_PROGRESS));

  const updateSteps = useCallback((newSteps: TrilhaStep[]) => {
    setSteps(newSteps);
    setItem(STORAGE_KEYS.TRILHA_PROGRESS, newSteps);
  }, []);

  const completeStep = useCallback((stepId: string) => {
    setSteps((prev) => {
      if (!prev) return prev;
      const updated = prev.map((s) =>
        s.id === stepId ? { ...s, completed: true } : s
      );
      // Unlock next step
      const completedIndex = updated.findIndex((s) => s.id === stepId);
      if (completedIndex >= 0 && completedIndex < updated.length - 1) {
        updated[completedIndex + 1] = { ...updated[completedIndex + 1], locked: false };
      }
      setItem(STORAGE_KEYS.TRILHA_PROGRESS, updated);
      return updated;
    });
  }, []);

  const resetTrilha = useCallback(() => {
    setSteps(null);
    removeItem(STORAGE_KEYS.TRILHA_PROGRESS);
  }, []);

  const getProgress = useCallback(() => {
    if (!steps) return { completed: 0, total: 0, percentage: 0 };
    const completed = steps.filter((s) => s.completed).length;
    return {
      completed,
      total: steps.length,
      percentage: Math.round((completed / steps.length) * 100),
    };
  }, [steps]);

  return { steps, updateSteps, completeStep, resetTrilha, getProgress };
}

// Hook for lead progress tracking
export function useLeadProgress() {
  const [progress, setProgress] = useState(() =>
    getItem<{ diagnosisDone: boolean; scoreViewed: boolean; trilhaStarted: boolean }>(STORAGE_KEYS.LEAD_PROGRESS) ?? {
      diagnosisDone: false,
      scoreViewed: false,
      trilhaStarted: false,
    }
  );

  const markDiagnosisDone = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, diagnosisDone: true };
      setItem(STORAGE_KEYS.LEAD_PROGRESS, next);
      return next;
    });
  }, []);

  const markScoreViewed = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, scoreViewed: true };
      setItem(STORAGE_KEYS.LEAD_PROGRESS, next);
      return next;
    });
  }, []);

  const markTrilhaStarted = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, trilhaStarted: true };
      setItem(STORAGE_KEYS.LEAD_PROGRESS, next);
      return next;
    });
  }, []);

  const clearProgress = useCallback(() => {
    setProgress({ diagnosisDone: false, scoreViewed: false, trilhaStarted: false });
    removeItem(STORAGE_KEYS.LEAD_PROGRESS);
  }, []);

  return { progress, markDiagnosisDone, markScoreViewed, markTrilhaStarted, clearProgress };
}
