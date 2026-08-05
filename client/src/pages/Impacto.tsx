import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart3, TrendingUp, Users, Globe, Lock } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAccessLevel } from "@/hooks/useAccessLevel";

const sectorData = [
  { name: "Tecnologia", value: 28 },
  { name: "Saúde", value: 18 },
  { name: "Educação", value: 15 },
  { name: "Serviços", value: 22 },
  { name: "Indústria", value: 12 },
  { name: "Outros", value: 5 },
];

const monthlyData = [
  { month: "Jan", fornecedoras: 45 },
  { month: "Fev", fornecedoras: 62 },
  { month: "Mar", fornecedoras: 78 },
  { month: "Abr", fornecedoras: 95 },
  { month: "Mai", fornecedoras: 120 },
  { month: "Jun", fornecedoras: 148 },
  { month: "Jul", fornecedoras: 185 },
  { month: "Ago", fornecedoras: 210 },
];

const COLORS = ["#7C3AED", "#34D399", "#F59E0B", "#A78BFA", "#6EE7B7", "#FBBF24"];

export default function Impacto() {
  const accessLevel = useAccessLevel();
  const isCliente = accessLevel === "cliente";

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Painel de Impacto</h1>
          <p className="text-sm text-muted-foreground">
            Dados agregados sobre Supply Diversity e desenvolvimento de fornecedoras.
          </p>
        </div>

        {!isCliente ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border/50">
            <Lock size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-foreground mb-2">Painel bloqueado</p>
            <p className="text-xs text-muted-foreground">Disponível apenas para clientes ativos.</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Fornecedoras diagnosticadas", value: "2.547", icon: Users, color: "text-primary" },
                { label: "Taxa de evolução", value: "73%", icon: TrendingUp, color: "text-growth" },
                { label: "Sectores atendidos", value: "12", icon: Globe, color: "text-energy" },
                { label: "Score médio", value: "58/100", icon: BarChart3, color: "text-blue-400" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border/50 rounded-xl p-4 glow-card"
                >
                  <stat.icon size={16} className={stat.color} />
                  <p className="text-xl font-bold text-foreground mt-2">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border/50 rounded-xl p-5"
              >
                <h3 className="text-sm font-semibold text-foreground mb-4">Fornecedoras Diagnosticadas (2026)</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 285)" />
                      <XAxis dataKey="month" tick={{ fill: "oklch(0.65 0.02 285)", fontSize: 11 }} />
                      <YAxis tick={{ fill: "oklch(0.65 0.02 285)", fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.18 0.025 285)",
                          border: "1px solid oklch(0.25 0.02 285)",
                          borderRadius: "8px",
                          color: "oklch(0.87 0.01 285)",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="fornecedoras" fill="oklch(0.55 0.25 285)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Sector Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border/50 rounded-xl p-5"
              >
                <h3 className="text-sm font-semibold text-foreground mb-4">Distribuição por Setor</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        stroke="none"
                      >
                        {sectorData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.18 0.025 285)",
                          border: "1px solid oklch(0.25 0.02 285)",
                          borderRadius: "8px",
                          color: "oklch(0.87 0.01 285)",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sectorData.map((sector, i) => (
                    <div key={sector.name} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-[10px] text-muted-foreground">{sector.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
