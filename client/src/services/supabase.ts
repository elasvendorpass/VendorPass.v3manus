/**
 * Supabase Services Layer — ELAS VendorPass™ v3
 * 
 * Integration layer between the frontend and Supabase.
 * When Supabase credentials are configured, it uses the real database.
 * When not configured (dev/prototype mode), it falls back to mock data.
 */

import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type {
  DatabaseUser,
  DatabaseDiagnosis,
  DatabaseVendorScore,
  DatabaseTrilhaProgress,
  DatabaseMatch,
  DatabaseVendorKitItem,
  DatabaseImpactMetric,
  DatabaseTrilhaStep,
  Archetype,
} from "@/lib/supabase-types";
import type { DimensionScore, VendorScoreResult, ArchetypeLevel } from "@/types";
import { diagnosisSteps, generateMockScore, matchOpportunities, vendorKitResources, trilhaSteps as mockTrilhaSteps } from "@/data/mocks";

// ============================================================
// AuthService — Supabase Auth + mock fallback
// ============================================================
export const AuthService = {
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string; user?: DatabaseUser }> {
    if (!isSupabaseConfigured()) {
      return AuthService._mockSignIn(email, password);
    }

    const sb = getSupabaseClient()!;
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

    const { data: profile } = await sb
      .from("users")
      .select("*")
      .eq("id", data.user!.id)
      .single();

    return { success: true, user: profile as DatabaseUser };
  },

  async signUp(email: string, password: string, metadata?: { name?: string; company_name?: string; cnpj?: string }): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    const sb = getSupabaseClient()!;
    const { error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { name: metadata?.name } },
    });

    if (error) return { success: false, error: error.message };

    const { error: profileError } = await sb.from("users").insert({
      email,
      name: metadata?.name || null,
      company_name: metadata?.company_name || null,
      cnpj: metadata?.cnpj || null,
      status: "lead",
    });

    if (profileError) return { success: false, error: profileError.message };
    return { success: true };
  },

  async signOut(): Promise<void> {
    if (!isSupabaseConfigured()) return;
    await getSupabaseClient()!.auth.signOut();
  },

  async getCurrentUser(): Promise<{ user: DatabaseUser | null; session: boolean }> {
    if (!isSupabaseConfigured()) {
      return { user: null, session: false };
    }

    const sb = getSupabaseClient()!;
    const { data: sessionData } = await sb.auth.getSession();
    const { data: { user: authUser } } = await sb.auth.getUser();
    const session = sessionData?.session;
    if (!session || !authUser) return { user: null, session: false };

    const { data: profile } = await sb
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    return { user: profile as DatabaseUser, session: true };
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 600));
      return { success: true, message: "Se existir uma conta com este e-mail, enviaremos as instruções de recuperação." };
    }

    const { error } = await getSupabaseClient()!.auth.resetPasswordForEmail(email);
    if (error) return { success: false, message: error.message };
    return { success: true, message: "Se existir uma conta com este e-mail, enviaremos as instruções de recuperação." };
  },

  // Mock fallback
  _mockSignIn: async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const emailLower = email.toLowerCase();

    let user: DatabaseUser;
    if (emailLower.includes("lead") || emailLower.includes("maria")) {
      user = {
        id: "mock-lead-001",
        email: emailLower,
        name: "Maria Silva",
        company_name: "MS Consultoria",
        cnpj: "12345678000199",
        status: "lead",
        phone: "(11) 99999-0001",
        state: "SP",
        city: "São Paulo",
        sector: "Consultoria",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else if (emailLower.includes("cliente") || emailLower.includes("ana")) {
      user = {
        id: "mock-cliente-001",
        email: emailLower,
        name: "Ana Oliveira",
        company_name: "Ana Tech Solutions",
        cnpj: "98765432000111",
        status: "cliente",
        phone: "(21) 99999-0002",
        state: "RJ",
        city: "Rio de Janeiro",
        sector: "Tecnologia",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      user = {
        id: "mock-new-" + Date.now(),
        email: emailLower,
        name: emailLower.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        company_name: null,
        cnpj: null,
        status: "lead",
        phone: null,
        state: null,
        city: null,
        sector: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    return { success: true, user };
  },
};

// ============================================================
// DiagnosisService
// ============================================================
export const DiagnosisService = {
  getSteps: () => diagnosisSteps,

  calculateScore: (answers: Record<string, number>): VendorScoreResult => {
    const result = generateMockScore();
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

  async saveDiagnosis(
    userId: string,
    answers: Record<string, number>,
    scoreResult: VendorScoreResult
  ): Promise<DatabaseDiagnosis | null> {
    if (!isSupabaseConfigured()) return null;

    const dimScore = (dim: string): number | null =>
      scoreResult.dimensions.find((d: DimensionScore) => d.dimension === dim)?.score ?? null;

    const sb = getSupabaseClient()!;
    const { data, error } = await sb
      .from("diagnoses")
      .insert({
        user_id: userId,
        score_financas: dimScore("financas"),
        score_processos: dimScore("processos"),
        score_vendas: dimScore("vendas"),
        score_digital: dimScore("digital"),
        score_institucional: dimScore("institucional"),
        score_total: scoreResult.overall,
        archetype: scoreResult.level,
        raw_answers: answers,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving diagnosis:", error);
      return null;
    }
    return data as DatabaseDiagnosis;
  },

  async getUserDiagnoses(userId: string): Promise<DatabaseDiagnosis[]> {
    if (!isSupabaseConfigured()) return [];

    const { data } = await getSupabaseClient()!
      .from("diagnoses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return (data as DatabaseDiagnosis[]) || [];
  },
};

// ============================================================
// VendorScoreService
// ============================================================
export const VendorScoreService = {
  async saveScore(
    userId: string,
    diagnosisId: string,
    scoreResult: VendorScoreResult
  ): Promise<DatabaseVendorScore | null> {
    if (!isSupabaseConfigured()) return null;

    const buildDimensionJson = (dim: DimensionScore) => ({
      score: dim.score,
      weight: dim.weight,
      gaps: dim.gaps,
      summary: dim.recommendations[0] || "",
    });

    const weights: Record<string, number> = {};
    scoreResult.dimensions.forEach((d: DimensionScore) => {
      weights[d.dimension] = d.weight;
    });

    const sb = getSupabaseClient()!;
    const { data, error } = await sb
      .from("vendor_scores")
      .insert({
        user_id: userId,
        diagnosis_id: diagnosisId,
        financas: buildDimensionJson(scoreResult.dimensions.find((d: DimensionScore) => d.dimension === "financas")!),
        processos: buildDimensionJson(scoreResult.dimensions.find((d: DimensionScore) => d.dimension === "processos")!),
        vendas: buildDimensionJson(scoreResult.dimensions.find((d: DimensionScore) => d.dimension === "vendas")!),
        digital: buildDimensionJson(scoreResult.dimensions.find((d: DimensionScore) => d.dimension === "digital")!),
        institucional: buildDimensionJson(scoreResult.dimensions.find((d: DimensionScore) => d.dimension === "institucional")!),
        score_total: scoreResult.overall,
        weights,
        archetype: scoreResult.level,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving vendor score:", error);
      return null;
    }
    return data as DatabaseVendorScore;
  },

  async getLatestScore(userId: string): Promise<DatabaseVendorScore | null> {
    if (!isSupabaseConfigured()) return null;

    const { data } = await getSupabaseClient()!
      .from("vendor_scores")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return (data as DatabaseVendorScore) || null;
  },
};

// ============================================================
// MatchService
// ============================================================
export const MatchService = {
  async getOpportunities(userId?: string): Promise<DatabaseMatch[] | typeof matchOpportunities> {
    if (!isSupabaseConfigured() || !userId) {
      await new Promise((r) => setTimeout(r, 500));
      return matchOpportunities;
    }

    const { data } = await getSupabaseClient()!
      .from("matches")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return (data as DatabaseMatch[]) || [];
  },

  async updateMatchStatus(matchId: string, status: DatabaseMatch["status"]): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    const { error } = await getSupabaseClient()!
      .from("matches")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", matchId);

    return !error;
  },
};

// ============================================================
// VendorKitService
// ============================================================
export const VendorKitService = {
  async getResources(archetype?: Archetype): Promise<DatabaseVendorKitItem[] | typeof vendorKitResources> {
    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 400));
      return vendorKitResources;
    }

    const sb = getSupabaseClient()!;
    let query = sb.from("vendor_kit_items").select("*");
    if (archetype) {
      query = query.or(`archetype.eq.${archetype},archetype.is.null`);
    }
    query = query.order("created_at", { ascending: false });

    const { data } = await query;
    return (data as DatabaseVendorKitItem[]) || [];
  },
};

// ============================================================
// TrilhaService
// ============================================================
export const TrilhaService = {
  async getSteps(archetype?: Archetype): Promise<DatabaseTrilhaStep[] | typeof mockTrilhaSteps> {
    if (!isSupabaseConfigured()) {
      return mockTrilhaSteps;
    }

    const sb = getSupabaseClient()!;
    let query = sb.from("trilha_steps").select("*").order("step_number", { ascending: true });
    if (archetype) {
      query = query.eq("archetype", archetype);
    }

    const { data } = await query;
    return (data as DatabaseTrilhaStep[]) || mockTrilhaSteps;
  },

  async getProgress(userId: string): Promise<DatabaseTrilhaProgress | null> {
    if (!isSupabaseConfigured()) return null;

    const { data } = await getSupabaseClient()!
      .from("trilha_progress")
      .select("*")
      .eq("user_id", userId)
      .single();

    return (data as DatabaseTrilhaProgress) || null;
  },

  async upsertProgress(userId: string, updates: Partial<DatabaseTrilhaProgress>): Promise<DatabaseTrilhaProgress | null> {
    if (!isSupabaseConfigured()) return null;

    const sb = getSupabaseClient()!;
    const { data, error } = await sb
      .from("trilha_progress")
      .upsert(
        {
          user_id: userId,
          current_archetype: updates.current_archetype || "semente",
          total_xp: updates.total_xp || 0,
          streak_days: updates.streak_days || 0,
          last_active_at: new Date().toISOString(),
          ...updates,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Error upserting trilha progress:", error);
      return null;
    }
    return data as DatabaseTrilhaProgress;
  },

  async completeStep(userId: string, _stepId: string, _archetype: Archetype, xpReward: number): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { data: current } = await getSupabaseClient()!
      .from("trilha_progress")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!current) return false;

    const newXp = (current.total_xp || 0) + xpReward;

    const { error } = await getSupabaseClient()!
      .from("trilha_progress")
      .update({ total_xp: newXp, last_active_at: new Date().toISOString() })
      .eq("user_id", userId);

    return !error;
  },
};

// ============================================================
// ImpactService
// ============================================================
export const ImpactService = {
  async getLatestMetrics(): Promise<DatabaseImpactMetric | null> {
    if (!isSupabaseConfigured()) return null;

    const { data } = await getSupabaseClient()!
      .from("impact_metrics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return (data as DatabaseImpactMetric) || null;
  },
};
