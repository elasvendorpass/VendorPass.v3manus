import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardCheck,
  GraduationCap,
  Target,
  BarChart3,
  Settings,
  Package,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessLevel } from "@/hooks/useAccessLevel";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, access: "lead" },
  { href: "/vendor-kit", label: "Vendor Kit™", icon: Package, access: "cliente" },
  { href: "/trilha", label: "Trilha VendorPass™", icon: GraduationCap, access: "cliente" },
  { href: "/match-engine", label: "Match Engine™", icon: Target, access: "cliente" },
  { href: "/resultado", label: "Meu Score", icon: ClipboardCheck, access: "lead" },
  { href: "/impacto", label: "Painel de Impacto", icon: BarChart3, access: "cliente" },
  { href: "/configuracoes", label: "Configurações", icon: Settings, access: "lead" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const accessLevel = useAccessLevel();

  const filteredItems = navItems.filter((item) => {
    if (item.access === "cliente") return accessLevel === "cliente";
    return true;
  });

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-40 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 h-16 px-4 border-b border-sidebar-border">
        <img
          src="/manus-storage/LogoVendorPass_4e26839d.png"
          alt="VP"
          className="w-9 h-9 shrink-0"
        />
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-foreground truncate">
            Elas VendorPass<span className="text-primary ml-0.5">™</span>
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User & Collapse */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        {!collapsed && user && (
          <div className="px-2 py-2">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </motion.aside>
  );
}
