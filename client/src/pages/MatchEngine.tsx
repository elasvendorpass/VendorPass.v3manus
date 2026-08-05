import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Building2, Calendar, ArrowRight, Lock, Sparkles, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { MatchService } from "@/services";
import { useAccessLevel } from "@/hooks/useAccessLevel";
import { toast } from "sonner";
import type { MatchOpportunity } from "@/types";

export default function MatchEngine() {
  const [opportunities, setOpportunities] = useState<MatchOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const accessLevel = useAccessLevel();
  const isCliente = accessLevel === "cliente";

  useEffect(() => {
    if (isCliente) {
      MatchService.getOpportunities().then((data) => {
        setOpportunities(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [isCliente]);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Match Engine™</h1>
          <p className="text-sm text-muted-foreground">
            Oportunidades de negócios compatíveis com o perfil da sua empresa.
          </p>
        </div>

        {!isCliente ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border/50">
            <Lock size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-foreground mb-2">Match Engine™ bloqueado</p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Esta funcionalidade está disponível apenas para clientes da Trilha VendorPass™.
              Desbloqueie para acessar oportunidades reais de negócio.
            </p>
          </div>
        ) : loading ? (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground">Carregando oportunidades...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Match Score Summary */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
              <Sparkles size={18} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">{opportunities.length} oportunidades encontradas</p>
                <p className="text-xs text-muted-foreground">Baseado no seu Vendor Score™ e perfil empresarial</p>
              </div>
            </div>

            {opportunities.map((opp, i) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-xl p-5 glow-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{opp.companyName}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {opp.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">{opp.matchScore}%</span>
                    <p className="text-[10px] text-muted-foreground">compatibilidade</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4">{opp.description}</p>

                {/* Requirements */}
                <div className="mb-4">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Requisitos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.requirements.map((req) => (
                      <span key={req} className="text-[10px] px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    <span>Prazo: {new Date(opp.deadline).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <button
                    onClick={() => toast.info("Funcionalidade em desenvolvimento. Em breve!")}
                    className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                  >
                    Explorar <ExternalLink size={10} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
