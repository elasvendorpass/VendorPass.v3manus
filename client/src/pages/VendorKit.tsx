import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckSquare,
  BookOpen,
  Wrench,
  Lock,
  Download,
  Filter,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { vendorKitResources } from "@/data/mocks";
import { useAccessLevel } from "@/hooks/useAccessLevel";
import { toast } from "sonner";
import type { VendorKitResource } from "@/types";

const typeIcons = {
  template: FileText,
  checklist: CheckSquare,
  guide: BookOpen,
  tool: Wrench,
};

const typeColors = {
  template: "text-primary",
  checklist: "text-growth",
  guide: "text-energy",
  tool: "text-blue-400",
};

const dimensionLabels: Record<string, string> = {
  financas: "Finanças",
  processos: "Processos",
  vendas: "Vendas",
  digital: "Digital",
  institucional: "Institucional",
};

export default function VendorKit() {
  const [filter, setFilter] = useState<string>("all");
  const accessLevel = useAccessLevel();
  const isCliente = accessLevel === "cliente";

  const resources = isCliente
    ? vendorKitResources.map((r) => ({ ...r, locked: false }))
    : vendorKitResources;

  const filtered = filter === "all" ? resources : resources.filter((r) => r.dimension === filter);

  const handleDownload = (resource: VendorKitResource) => {
    if (resource.locked) {
      toast.error("Desbloqueie a Trilha completa para acessar este recurso.");
      return;
    }
    toast.success(`"${resource.title}" pronto para download!`);
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Vendor Kit™</h1>
          <p className="text-sm text-muted-foreground">Templates, checklists e guias para acelerar seu desenvolvimento.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-muted-foreground" />
          {["all", "financas", "processos", "vendas", "digital", "institucional"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Todos" : dimensionLabels[f]}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resource, i) => {
            const Icon = typeIcons[resource.type];
            const iconColor = typeColors[resource.type];
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-card border border-border/50 rounded-xl p-5 glow-card ${resource.locked ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-secondary/50`}>
                    <Icon size={18} className={iconColor} />
                  </div>
                  {resource.locked && <Lock size={14} className="text-muted-foreground" />}
                </div>

                <h3 className="text-sm font-semibold text-foreground mb-1">{resource.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                    {dimensionLabels[resource.dimension]}
                  </span>
                  <button
                    onClick={() => handleDownload(resource)}
                    className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                  >
                    {resource.locked ? (
                      <>
                        <Lock size={10} /> Bloqueado
                      </>
                    ) : (
                      <>
                        <Download size={10} /> Baixar
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
