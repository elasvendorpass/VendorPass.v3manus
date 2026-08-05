import { motion } from "framer-motion";
import { User, Bell, Shield, LogOut } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessLevel } from "@/hooks/useAccessLevel";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Configuracoes() {
  const { user, logout } = useAuth();
  const accessLevel = useAccessLevel();
  const [, navigate] = useLocation();

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-2xl"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Configurações</h1>
          <p className="text-sm text-muted-foreground">Gerencie sua conta e preferências.</p>
        </div>

        {/* Profile */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <User size={18} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Perfil</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome</label>
              <input
                defaultValue={user?.name || ""}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">E-mail</label>
              <input
                defaultValue={user?.email || ""}
                disabled
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Empresa</label>
              <input
                defaultValue={user?.company || ""}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Status</label>
              <div className="px-3 py-2 text-sm bg-secondary rounded-lg text-muted-foreground capitalize">
                {accessLevel}
              </div>
            </div>
          </div>

          <button
            onClick={() => toast.success("Perfil atualizado!")}
            className="text-xs font-medium text-primary hover:text-primary/80 px-4 py-2 rounded-lg bg-primary/10 transition-colors"
          >
            Salvar alterações
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-energy" />
            <h2 className="text-sm font-semibold text-foreground">Notificações</h2>
          </div>

          <div className="space-y-3">
            {["Novas oportunidades no Match Engine™", "Conclusão de etapas da Trilha", "Relatórios semanais de progresso"].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-sm text-foreground/80">{item}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-muted peer-checked:bg-primary rounded-full peer-focus:ring-2 peer-focus:ring-primary/50 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-growth" />
            <h2 className="text-sm font-semibold text-foreground">Segurança</h2>
          </div>

          <button
            onClick={() => toast.info("Funcionalidade em desenvolvimento.")}
            className="text-xs font-medium text-foreground/80 hover:text-foreground px-3 py-2 rounded-lg border border-border hover:border-primary/30 transition-all"
          >
            Alterar senha
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate("/");
            toast.success("Até logo!");
          }}
          className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 px-4 py-2 rounded-lg border border-destructive/20 hover:bg-destructive/10 transition-all"
        >
          <LogOut size={16} />
          Sair da conta
        </button>
      </motion.div>
    </DashboardLayout>
  );
}
