import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Diagnostico from "./pages/Diagnostico";
import Resultado from "./pages/Resultado";
import Dashboard from "./pages/Dashboard";
import LeadWelcome from "./pages/LeadWelcome";
import VendorKit from "./pages/VendorKit";
import Trilha from "./pages/Trilha";
import MatchEngine from "./pages/MatchEngine";
import Impacto from "./pages/Impacto";
import Configuracoes from "./pages/Configuracoes";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/diagnostico" component={Diagnostico} />
      <Route path="/resultado" component={Resultado} />

      {/* Authenticated routes — protected by ProtectedRoute */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/lead-welcome">
        <ProtectedRoute>
          <LeadWelcome />
        </ProtectedRoute>
      </Route>

      <Route path="/vendor-kit">
        <ProtectedRoute requireCliente>
          <VendorKit />
        </ProtectedRoute>
      </Route>

      <Route path="/trilha">
        <ProtectedRoute requireCliente>
          <Trilha />
        </ProtectedRoute>
      </Route>

      <Route path="/match-engine">
        <ProtectedRoute requireCliente>
          <MatchEngine />
        </ProtectedRoute>
      </Route>

      <Route path="/impacto">
        <ProtectedRoute>
          <Impacto />
        </ProtectedRoute>
      </Route>

      <Route path="/configuracoes">
        <ProtectedRoute>
          <Configuracoes />
        </ProtectedRoute>
      </Route>

      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
