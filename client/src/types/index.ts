export type UserStatus = "lead" | "cliente";

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  company: string;
  createdAt: string;
}

export interface DiagnosisStep {
  id: string;
  dimension: Dimension;
  title: string;
  description: string;
  questions: DiagnosisQuestion[];
}

export interface DiagnosisQuestion {
  id: string;
  text: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  value: number;
  label: string;
}

export type Dimension = "financas" | "processos" | "vendas" | "digital" | "institucional";

export interface DimensionScore {
  dimension: Dimension;
  label: string;
  score: number;
  weight: number;
  gaps: string[];
  recommendations: string[];
}

export interface VendorScoreResult {
  overall: number;
  dimensions: DimensionScore[];
  level: ArchetypeLevel;
  completedAt: string;
}

export type ArchetypeLevel = "semente" | "raiz" | "crescimento" | "escala" | "colheita";

export interface TrilhaStep {
  id: string;
  level: ArchetypeLevel;
  title: string;
  description: string;
  dimension: Dimension;
  xp: number;
  completed: boolean;
  locked: boolean;
}

export interface MatchOpportunity {
  id: string;
  companyName: string;
  description: string;
  matchScore: number;
  category: string;
  deadline: string;
  requirements: string[];
}

export interface VendorKitResource {
  id: string;
  title: string;
  description: string;
  type: "template" | "checklist" | "guide" | "tool";
  dimension: Dimension;
  locked: boolean;
}
