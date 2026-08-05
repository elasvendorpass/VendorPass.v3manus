import type { DiagnosisStep, VendorScoreResult, TrilhaStep, MatchOpportunity, VendorKitResource } from "@/types";

// ============ DIAGNOSIS MOCK DATA ============
export const diagnosisSteps: DiagnosisStep[] = [
  {
    id: "step-financas",
    dimension: "financas",
    title: "Finanças",
    description: "Avalie a saúde financeira da sua empresa",
    questions: [
      {
        id: "f1",
        text: "Sua empresa possui demonstrações financeiras atualizadas (DRE, Balanço)?",
        options: [
          { value: 20, label: "Não temos nada organizado" },
          { value: 40, label: "Temos, mas estão desatualizadas" },
          { value: 60, label: "Estão atualizadas, mas sem análise detalhada" },
          { value: 80, label: "Temos relatórios completos com análise" },
          { value: 100, label: "Sistema completo com dashboard financeiro" },
        ],
      },
      {
        id: "f2",
        text: "Você consegue separar finanças pessoais das empresariais?",
        options: [
          { value: 20, label: "Tudo está misturado" },
          { value: 40, label: "Tento separar, mas às vezes misturo" },
          { value: 60, label: "Separo na maior parte do tempo" },
          { value: 80, label: "Separados com contas e cartões diferentes" },
          { value: 100, label: "Contabilidade completa com controle rigoroso" },
        ],
      },
      {
        id: "f3",
        text: "Sua empresa tem acesso a crédito/financiamento?",
        options: [
          { value: 20, label: "Nunca consegui crédito" },
          { value: 40, label: "Tento, mas não consigo aprovação" },
          { value: 60, label: "Tenho algumas linhas de crédito disponíveis" },
          { value: 80, label: "Crédito aprovado com limites adequados" },
          { value: 100, label: "Múltiplas linhas com condições favoráveis" },
        ],
      },
    ],
  },
  {
    id: "step-processos",
    dimension: "processos",
    title: "Processos",
    description: "Avalie a organização e eficiência dos seus processos",
    questions: [
      {
        id: "p1",
        text: "Seus processos operacionais estão documentados?",
        options: [
          { value: 20, label: "Não temos processos documentados" },
          { value: 40, label: "Alguns processos estão na cabeça da equipe" },
          { value: 60, label: "Processos principais documentados informalmente" },
          { value: 80, label: "Processos documentados e seguidos" },
          { value: 100, label: "Sistema de gestão com processos otimizados e auditáveis" },
        ],
      },
      {
        id: "p2",
        text: "Você possui certificações de qualidade ou compliance?",
        options: [
          { value: 20, label: "Nenhuma certificação" },
          { value: 40, label: "Estamos considerando começar" },
          { value: 60, label: "Temos certificações básicas" },
          { value: 80, label: "Certificações reconhecidas no setor" },
          { value: 100, label: "Múltiplas certificações com auditorias regulares" },
        ],
      },
      {
        id: "p3",
        text: "Sua equipe tem definido um organograma e funções claras?",
        options: [
          { value: 20, label: "Não temos estrutura definida" },
          { value: 40, label: "Sabemos mais ou menos quem faz o quê" },
          { value: 60, label: "Organograma básico definido" },
          { value: 80, label: "Estrutura clara com descrições de cargo" },
          { value: 100, label: "Organograma completo com KPIs por função" },
        ],
      },
    ],
  },
  {
    id: "step-vendas",
    dimension: "vendas",
    title: "Vendas",
    description: "Avalie sua capacidade comercial e de relacionamento",
    questions: [
      {
        id: "v1",
        text: "Você possui uma carteira de clientes ativa e diversificada?",
        options: [
          { value: 20, label: "Apenas alguns clientes informais" },
          { value: 40, label: "Poucos clientes, sem gestão de carteira" },
          { value: 60, label: "Carteira ativa com alguns clientes recorrentes" },
          { value: 80, label: "Base diversificada com gestão de relacionamento" },
          { value: 100, label: "Pipeline organizado com CRM e métricas de conversão" },
        ],
      },
      {
        id: "v2",
        text: "Você participa de licitações ou editais?",
        options: [
          { value: 20, label: "Nunca participei" },
          { value: 40, label: "Tentei, mas não entendo o processo" },
          { value: 60, label: "Participo de alguns editais locais" },
          { value: 80, label: "Participo regularmente com taxa de sucesso" },
          { value: 100, label: "Equipe especializada em licitações e contratos corporativos" },
        ],
      },
    ],
  },
  {
    id: "step-digital",
    dimension: "digital",
    title: "Digital",
    description: "Avalie sua presença e maturidade digital",
    questions: [
      {
        id: "d1",
        text: "Sua empresa tem presença digital (site, redes sociais)?",
        options: [
          { value: 20, label: "Não temos presença digital" },
          { value: 40, label: "Temos apenas redes sociais informais" },
          { value: 60, label: "Site básico e presença em redes sociais" },
          { value: 80, label: "Site profissional com conteúdo estratégico" },
          { value: 100, label: "Ecossistema digital completo com automação" },
        ],
      },
      {
        id: "d2",
        text: "Você utiliza ferramentas digitais para gestão (ERP, CRM)?",
        options: [
          { value: 20, label: "Uso apenas planilhas e papel" },
          { value: 40, label: "Algumas ferramentas gratuitas" },
          { value: 60, label: "Ferramentas básicas pagas" },
          { value: 80, label: "Sistema integrado de gestão" },
          { value: 100, label: "Stack tecnológica completa com integrações" },
        ],
      },
    ],
  },
  {
    id: "step-institucional",
    dimension: "institucional",
    title: "Institucional",
    description: "Avalie a estrutura jurídica e institucional da sua empresa",
    questions: [
      {
        id: "i1",
        text: "Sua empresa está regularmente constituída (CNPJ, alvarás)?",
        options: [
          { value: 20, label: "Informal, sem CNPJ" },
          { value: 40, label: "CNPJ ativo, mas sem alvarás" },
          { value: 60, label: "Constituída com documentação básica" },
          { value: 80, label: "Completa e em dia com todas as obrigações" },
          { value: 100, label: "Estrutura corporativa completa com governança" },
        ],
      },
      {
        id: "i2",
        text: "Você possui políticas de ESG ou diversidade?",
        options: [
          { value: 20, label: "Não temos nenhuma política formal" },
          { value: 40, label: "Temos intenção, mas nada formalizado" },
          { value: 60, label: "Políticas básicas de diversidade" },
          { value: 80, label: "ESG formal com relatórios" },
          { value: 100, label: "ESG completo com métricas e relatórios auditados" },
        ],
      },
    ],
  },
];

// ============ VENDOR SCORE MOCK ============
export function generateMockScore(): VendorScoreResult {
  const dimensions = [
    { dimension: "financas" as const, label: "Finanças", score: 62, weight: 0.25, gaps: ["Falta de análise de fluxo de caixa", "Contas pessoais misturadas"], recommendations: ["Implementar controle de fluxo de caixa", "Separar contas PJ e PF"] },
    { dimension: "processos" as const, label: "Processos", score: 45, weight: 0.20, gaps: ["Processos não documentados", "Falta de indicadores de qualidade"], recommendations: ["Documentar processos-chave", "Criar indicadores de qualidade"] },
    { dimension: "vendas" as const, label: "Vendas", score: 70, weight: 0.25, gaps: ["Sem CRM implementado", "Baixa participação em editais"], recommendations: ["Implementar CRM", "Participar de capacitação em licitações"] },
    { dimension: "digital" as const, label: "Digital", score: 55, weight: 0.15, gaps: ["Site desatualizado", "Sem automação de marketing"], recommendations: ["Atualizar presença digital", "Implementar automações"] },
    { dimension: "institucional" as const, label: "Institucional", score: 78, weight: 0.15, gaps: ["Falta relatório ESG", "Governança limitada"], recommendations: ["Criar relatório de diversidade", "Formalizar estrutura de governança"] },
  ];

  const overall = Math.round(dimensions.reduce((acc, d) => acc + d.score * d.weight, 0));

  let level: "semente" | "raiz" | "crescimento" | "escala" | "colheita";
  if (overall < 20) level = "semente";
  else if (overall < 40) level = "raiz";
  else if (overall < 60) level = "crescimento";
  else if (overall < 80) level = "escala";
  else level = "colheita";

  return {
    overall,
    dimensions,
    level,
    completedAt: new Date().toISOString(),
  };
}

// ============ TRILHA MOCK ============
export const trilhaSteps: TrilhaStep[] = [
  { id: "t1", level: "semente", title: "Organize suas finanças", description: "Separe contas pessoais e empresariais", dimension: "financas", xp: 50, completed: true, locked: false },
  { id: "t2", level: "semente", title: "Registre sua empresa", description: "Regularize CNPJ e documentação básica", dimension: "institucional", xp: 100, completed: true, locked: false },
  { id: "t3", level: "raiz", title: "Crie seu primeiro processo", description: "Documente o fluxo principal do seu negócio", dimension: "processos", xp: 100, completed: true, locked: false },
  { id: "t4", level: "raiz", title: "Presença digital mínima", description: "Crie perfil profissional nas redes sociais", dimension: "digital", xp: 75, completed: false, locked: false },
  { id: "t5", level: "crescimento", title: "Implemente CRM básico", description: "Organize sua carteira de clientes", dimension: "vendas", xp: 150, completed: false, locked: true },
  { id: "t6", level: "crescimento", title: "Fluxo de caixa projetado", description: "Crie projeções financeiras de 3 meses", dimension: "financas", xp: 150, completed: false, locked: true },
  { id: "t7", level: "escala", title: "Certificação de qualidade", description: "Obtenha certificação reconhecida no setor", dimension: "processos", xp: 200, completed: false, locked: true },
  { id: "t8", level: "escala", title: "Site profissional", description: "Lance site com SEO e conteúdo estratégico", dimension: "digital", xp: 200, completed: false, locked: true },
  { id: "t9", level: "colheita", title: "Relatório ESG", description: "Publique relatório de sustentabilidade", dimension: "institucional", xp: 300, completed: false, locked: true },
  { id: "t10", level: "colheita", title: "Pipeline de licitações", description: "Monte equipe especializada em contratos", dimension: "vendas", xp: 300, completed: false, locked: true },
];

// ============ MATCH ENGINE MOCK ============
export const matchOpportunities: MatchOpportunity[] = [
  {
    id: "opp-1",
    companyName: "Grupo TechBrasil",
    description: "Programa de fornecedoras de tecnologia para empresas de médio porte. Busca fornecedoras de TI com foco em inovação.",
    matchScore: 85,
    category: "Tecnologia",
    deadline: "2026-09-30",
    requirements: ["CNPJ ativo há 2+ anos", "Certificação de qualidade", "Faturamento mínimo R$500k/ano"],
  },
  {
    id: "opp-2",
    companyName: "Corporação Sustentável S.A.",
    description: "Edital para fornecedoras com práticas ESG comprovadas. Prioridade para empresas lideradas por mulheres.",
    matchScore: 72,
    category: "ESG / Sustentabilidade",
    deadline: "2026-10-15",
    requirements: ["Relatório ESG ou equivalente", "Política de diversidade", "CNPJ regular"],
  },
  {
    id: "opp-3",
    companyName: "Rede de Varejo Nacional",
    description: "Programa de inclusão de fornecedoras locais para cadeia de suprimentos de logística.",
    matchScore: 68,
    category: "Logística / Varejo",
    deadline: "2026-08-30",
    requirements: ["Capacidade de entrega", "Certificação de processos", "Seguro de responsabilidade"],
  },
];

// ============ VENDOR KIT MOCK ============
export const vendorKitResources: VendorKitResource[] = [
  { id: "vk-1", title: "Template de Fluxo de Caixa", description: "Planilha profissional para controle de entradas e saídas", type: "template", dimension: "financas", locked: false },
  { id: "vk-2", title: "Checklist de Formalização", description: "Passo a passo para regularizar sua empresa", type: "checklist", dimension: "institucional", locked: false },
  { id: "vk-3", title: "Guia de Processos Operacionais", description: "Como documentar e otimizar seus processos", type: "guide", dimension: "processos", locked: false },
  { id: "vk-4", title: "Kit de Licitação Básica", description: "Documentos e templates para participar de editais", type: "tool", dimension: "vendas", locked: false },
  { id: "vk-5", title: "Template de Relatório ESG", description: "Modelo para criação do seu primeiro relatório", type: "template", dimension: "institucional", locked: true },
  { id: "vk-6", title: "Guia de Presença Digital", description: "Como criar e manter um site profissional", type: "guide", dimension: "digital", locked: true },
  { id: "vk-7", title: "Checklist de Governança", description: "Estrutura básica de governança corporativa", type: "checklist", dimension: "institucional", locked: true },
  { id: "vk-8", title: "Planilha de CRM Básico", description: "Gestão simples de clientes e pipeline", type: "tool", dimension: "vendas", locked: true },
];

// ============ AUTH MOCK ============
export const mockUsers = {
  lead: {
    id: "user-lead-001",
    name: "Maria Silva",
    email: "maria@exemplo.com",
    status: "lead" as const,
    company: "Maria & Co. Consultoria",
    createdAt: "2026-07-01T00:00:00Z",
  },
  cliente: {
    id: "user-cliente-001",
    name: "Ana Souza",
    email: "ana@exemplo.com",
    status: "cliente" as const,
    company: "TechSolutions Ltda",
    createdAt: "2026-05-15T00:00:00Z",
  },
};
