import type { DiagnosisStep, VendorScoreResult } from "@/types";
import { diagnosisSteps, generateMockScore } from "@/data/mocks";

// ============ AuthService ============
export const AuthService = {
  login: async (email: string, password: string) => {
    // Mock — delega para AuthContext via hook
    await new Promise((r) => setTimeout(r, 800));
    return { success: true, data: { email } };
  },
  forgotPassword: async (_email: string) => {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, message: "Se existir uma conta com este e-mail, enviaremos as instruções de recuperação." };
  },
};

// ============ DiagnosisService ============
export const DiagnosisService = {
  getSteps: (): DiagnosisStep[] => diagnosisSteps,

  calculateScore: (answers: Record<string, number>): VendorScoreResult => {
    const result = generateMockScore();
    // Ajustar scores baseado nas respostas
    const dimAnswers: Record<string, number[]> = {};
    Object.entries(answers).forEach(([qid, value]) => {
      const stepId = qid.split("_")[0];
      if (!dimAnswers[stepId]) dimAnswers[stepId] = [];
      dimAnswers[stepId].push(value);
    });

    const dimMap: Record<string, string> = {
      "step-financas": "financas",
      "step-processos": "processos",
      "step-vendas": "vendas",
      "step-digital": "digital",
      "step-institucional": "institucional",
    };

    result.dimensions.forEach((dim) => {
      const stepKey = Object.entries(dimMap).find(([, v]) => v === dim.dimension)?.[0];
      if (stepKey && dimAnswers[stepKey]) {
        const avg = Math.round(dimAnswers[stepKey].reduce((a, b) => a + b, 0) / dimAnswers[stepKey].length);
        dim.score = Math.min(100, Math.max(0, avg));
      }
    });

    const overall = Math.round(result.dimensions.reduce((acc, d) => acc + d.score * d.weight, 0));
    result.overall = overall;

    if (overall < 20) result.level = "semente";
    else if (overall < 40) result.level = "raiz";
    else if (overall < 60) result.level = "crescimento";
    else if (overall < 80) result.level = "escala";
    else result.level = "colheita";

    return result;
  },
};

// ============ MatchService ============
export const MatchService = {
  getOpportunities: async () => {
    await new Promise((r) => setTimeout(r, 500));
    const { matchOpportunities } = await import("@/data/mocks");
    return matchOpportunities;
  },
};

// ============ VendorKitService ============
export const VendorKitService = {
  getResources: async (unlocked: boolean = false) => {
    await new Promise((r) => setTimeout(r, 400));
    const { vendorKitResources } = await import("@/data/mocks");
    if (unlocked) return vendorKitResources.map((r) => ({ ...r, locked: false }));
    return vendorKitResources;
  },
};

// ============ PaymentService ============
export const PaymentService = {
  simulateCheckout: async (plan: string) => {
    await new Promise((r) => setTimeout(r, 2000));
    return {
      success: true,
      plan,
      transactionId: "vp_" + Date.now(),
      message: "Pagamento simulado com sucesso! (Em produção, integrar Stripe/Asaas)",
    };
  },
};
