import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startLogin } from "@/const";

export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8 relative overflow-hidden">
      <header className="w-full max-w-7xl flex justify-between items-center py-spacing-lg px-spacing-xl absolute top-0 z-10">
        <h1 className="text-3xl font-bold text-primary">VendorPass™</h1>
        <div className="flex gap-spacing-md">
          <Button onClick={startLogin} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-md">
            Entrar
          </Button>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center text-center max-w-3xl mt-spacing-4xl z-10">
        <h2 className="text-5xl font-extrabold leading-tight mb-spacing-xl text-white">
          Inteligência para o <span className="text-primary">Desenvolvimento de Fornecedores</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-spacing-3xl">
          Mede, desenvolve e acelera a maturidade empresarial de fornecedores, preparando-as para integrar cadeias corporativas, programas de Diversidade de Fornecimento e ESG.
        </p>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-spacing-2xl py-spacing-lg rounded-lg shadow-lg">
          Iniciar Diagnóstico Gratuito
        </Button>
      </main>

      {/* Animação de fundo sutil */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(106,13,205,0.15)_0%,transparent_70%)] animate-[pulse_10s_infinite_alternate]"></div>

      <section className="w-full max-w-7xl mt-spacing-4xl grid grid-cols-1 md:grid-cols-3 gap-spacing-2xl z-10">
        <Card className="bg-card text-card-foreground p-spacing-xl rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Diagnóstico Inteligente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Avalie sua empresa em 5 dimensões chave e receba seu Vendor Score™.</p>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground p-spacing-xl rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Trilhas de Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Acelere sua maturidade empresarial com trilhas personalizadas.</p>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground p-spacing-xl rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Match Engine™</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Conecte-se a oportunidades de negócio que impulsionam seu crescimento.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
