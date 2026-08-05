/**
 * Supabase database types for ELAS VendorPass™ v3
 * These types mirror the SQL schema in supabase-schema.sql
 */

// ============================================================
// User types
// ============================================================
export type UserStatus = 'lead' | 'cliente' | 'inativo';

export interface DatabaseUser {
  id: string;
  email: string;
  name: string | null;
  company_name: string | null;
  cnpj: string | null;
  status: UserStatus;
  phone: string | null;
  state: string | null;
  city: string | null;
  sector: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Archetype types
// ============================================================
export type Archetype = 'semente' | 'raiz' | 'crescimento' | 'escala' | 'colheita';

// ============================================================
// Diagnosis types
// ============================================================
export interface DatabaseDiagnosis {
  id: string;
  user_id: string;
  score_financas: number | null;
  score_processos: number | null;
  score_vendas: number | null;
  score_digital: number | null;
  score_institucional: number | null;
  score_total: number | null;
  archetype: Archetype | null;
  raw_answers: Record<string, unknown> | null;
  version: number;
  completed_at: string | null;
  created_at: string;
}

// ============================================================
// Vendor Score types
// ============================================================
export interface DimensionScore {
  score: number;
  weight: number;
  gaps: string[];
  summary: string;
}

export interface DatabaseVendorScore {
  id: string;
  user_id: string;
  diagnosis_id: string;
  financas: DimensionScore | null;
  processos: DimensionScore | null;
  vendas: DimensionScore | null;
  digital: DimensionScore | null;
  institucional: DimensionScore | null;
  score_total: number | null;
  weights: Record<string, number> | null;
  archetype: Archetype | null;
  summary: string | null;
  improvement_plan: string | null;
  created_at: string;
}

// ============================================================
// Trilha types
// ============================================================
export interface DatabaseTrilhaProgress {
  id: string;
  user_id: string;
  current_archetype: Archetype;
  total_xp: number;
  semente_completed: boolean;
  raiz_completed: boolean;
  crescimento_completed: boolean;
  escala_completed: boolean;
  colheita_completed: boolean;
  streak_days: number;
  last_active_at: string | null;
  certificates: Array<{
    id: string;
    archetype: Archetype;
    issued_at: string;
  }>;
  updated_at: string;
  created_at: string;
}

export interface DatabaseTrilhaStep {
  id: string;
  archetype: Archetype;
  step_number: number;
  title: string;
  description: string;
  xp_reward: number;
  content_json: Record<string, unknown> | null;
  is_completed: boolean;
}

// ============================================================
// Match Engine types
// ============================================================
export type MatchStatus = 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed';

export interface DatabaseMatch {
  id: string;
  user_id: string;
  company_name: string | null;
  opportunity_type: string | null;
  description: string | null;
  match_score: number | null;
  requirements: Record<string, unknown> | null;
  status: MatchStatus;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Vendor Kit types
// ============================================================
export type VendorKitCategory = 'template' | 'guia' | 'checklist' | 'video';

export interface DatabaseVendorKitItem {
  id: string;
  title: string;
  description: string | null;
  category: VendorKitCategory;
  archetype: Archetype | null;
  file_url: string | null;
  content_json: Record<string, unknown> | null;
  is_premium: boolean;
  created_at: string;
}

// ============================================================
// Impact types
// ============================================================
export interface DatabaseImpactMetric {
  id: string;
  period: string;
  total_vendors: number;
  total_vendors_female: number;
  avg_score: number;
  certifications_issued: number;
  matches_made: number;
  sectors_breakdown: Record<string, number> | null;
  states_breakdown: Record<string, number> | null;
  created_at: string;
}

// ============================================================
// Insert types (for creating new records)
// ============================================================
export type InsertUser = Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type InsertDiagnosis = Omit<DatabaseDiagnosis, 'id' | 'created_at'> & {
  id?: string;
};

export type InsertVendorScore = Omit<DatabaseVendorScore, 'id' | 'created_at'> & {
  id?: string;
};

export type InsertTrilhaProgress = Omit<DatabaseTrilhaProgress, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type InsertMatch = Omit<DatabaseMatch, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};
