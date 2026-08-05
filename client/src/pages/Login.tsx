import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  company: z.string().min(2, "Nome da empresa é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

const forgotSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;
type ForgotForm = z.infer<typeof forgotSchema>;

export default function Login() {
  const [, navigate] = useLocation();
  const { login, register, forgotPassword, user } = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.status === "cliente") {
        navigate("/dashboard");
      } else {
        navigate("/resultado");
      }
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", company: "", password: "", confirmPassword: "" },
  });

  const forgotForm = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    const result = await login(data.email, data.password);
    setIsLoading(false);
    if (result.success) {
      toast.success("Bem-vinda de volta!");
      // Check user status for redirect
      const currentUser = useAuth().user;
      if (currentUser?.status === "cliente") {
        navigate("/dashboard");
      } else {
        navigate("/resultado");
      }
    } else {
      toast.error(result.error || "Erro ao fazer login");
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    const result = await register(data.email, data.password, data.name, data.company);
    setIsLoading(false);
    if (result.success) {
      toast.success("Conta criada! Redirecionando para o diagnóstico...");
      navigate("/diagnostico");
    } else {
      toast.error(result.error || "Erro ao criar conta");
    }
  };

  const onForgot = async (data: ForgotForm) => {
    setIsLoading(true);
    const result = await forgotPassword(data.email);
    setIsLoading(false);
    toast.success(result.message);
    setMode("login");
  };

  // If user is logged in, show a loading state while redirecting
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 ambient-bg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ambient-bg">
      {/* Back to Home */}
      <Link
        href="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors z-50"
      >
        <ArrowLeft size={16} />
        Início
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/manus-storage/LogoVendorPass_4e26839d.png" alt="VP" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground">
            Elas VendorPass<span className="text-primary ml-0.5">™</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" && "Acesse sua conta"}
            {mode === "register" && "Crie sua conta"}
            {mode === "forgot" && "Recupere sua senha"}
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl">
          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-4"
              >
                {/* Email */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">E-mail</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      {...loginForm.register("email")}
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Senha</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      {...loginForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-input border border-border rounded-lg pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50 glow-primary flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {isLoading ? "Entrando..." : "Entrar"}
                </button>

                {/* Register link */}
                <p className="text-center text-xs text-muted-foreground">
                  Ainda não tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Criar conta
                  </button>
                </p>

                {/* Test profiles hint */}
                <div className="pt-3 border-t border-border/50">
                  <p className="text-[10px] text-muted-foreground/60 text-center mb-2">Perfis de teste:</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => { loginForm.setValue("email", "lead@exemplo.com"); loginForm.setValue("password", "123456"); }}
                      className="text-[10px] px-2 py-1 rounded bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      Perfil Lead
                    </button>
                    <button
                      type="button"
                      onClick={() => { loginForm.setValue("email", "cliente@exemplo.com"); loginForm.setValue("password", "123456"); }}
                      className="text-[10px] px-2 py-1 rounded bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      Perfil Cliente
                    </button>
                  </div>
                </div>
              </motion.form>
            )}

            {mode === "register" && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={registerForm.handleSubmit(onRegister)}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome completo</label>
                  <input
                    {...registerForm.register("name")}
                    placeholder="Seu nome"
                    className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">E-mail</label>
                  <input
                    {...registerForm.register("email")}
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Empresa</label>
                  <input
                    {...registerForm.register("company")}
                    placeholder="Nome da sua empresa"
                    className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  {registerForm.formState.errors.company && (
                    <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.company.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Senha</label>
                  <input
                    {...registerForm.register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Confirmar senha</label>
                  <input
                    {...registerForm.register("confirmPassword")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50 glow-primary flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {isLoading ? "Criando conta..." : "Criar conta e iniciar diagnóstico"}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  Já tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Entrar
                  </button>
                </p>
              </motion.form>
            )}

            {mode === "forgot" && (
              <motion.form
                key="forgot"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={forgotForm.handleSubmit(onForgot)}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">E-mail</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      {...forgotForm.register("email")}
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                  {forgotForm.formState.errors.email && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {forgotForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50 glow-primary flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {isLoading ? "Enviando..." : "Enviar instruções"}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  Lembrou da senha?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Voltar ao login
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground/40 mt-6">
          © 2026 ELAS VendorPass™. Plataforma de demonstração.
        </p>
      </motion.div>
    </div>
  );
}
