# ELAS VendorPass™ v3

> **AI Supplier Development Intelligence**

A primeira plataforma que mede a maturidade empresarial de fornecedoras e as prepara para integrar cadeias corporativas, programas de Supply Diversity e ESG.

---

## O que é

O VendorPass é um SaaS que:
- Realiza diagnóstico empresarial de 5 dimensões (Finanças, Processos, Vendas, Digital, Institucional)
- Gera um **Vendor Score™** visual com radar chart e gaps identificadas
- Oferece uma **Trilha de Crescimento** gamificada em 5 níveis (Semente → Raiz → Crescimento → Escala → Colheita)
- Conecta fornecedoras a oportunidades corporativas via **Match Engine™**
- Acompanha impacto em métricas de Supply Diversity

## Stack Técnica

- **Frontend:** React 19 + TypeScript + Vite 7
- **UI:** Tailwind CSS 4 + shadcn/ui + Framer Motion
- **Charts:** Recharts
- **Formulários:** React Hook Form + Zod
- **Banco de Dados:** Supabase (PostgreSQL) ou localStorage (modo demo)
- **Deploy:** GitHub Pages ou Vercel

## Como Rodar Localmente

```bash
pnpm install
pnpm dev
```

## Deploy no GitHub Pages

```bash
cp vite.config.gh-pages.ts vite.config.ts
pnpm build
```

Ou use o GitHub Actions workflow (`.github/workflows/deploy.yml`).

## Deploy no Vercel

Configure no dashboard do Vercel:
- **Build Command:** `pnpm build`
- **Output Directory:** `dist/public`
- **Install Command:** `pnpm install`

## Supabase Integration

Para ativar autenticação real e banco de dados:

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute o `supabase-schema.sql` no editor SQL
3. Configure as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

Sem Supabase, o app funciona 100% em modo demo (localStorage).

## Arquitetura do Funil

```
Aquisição (Tally / Parcerias)
    ↓
Diagnóstico Gratuito (5 dimensões)
    ↓
Vendor Score™ (resultado + gaps)
    ↓
Trilha de Crescimento (gamificação)
    ↓
Match Engine™ (oportunidades)
    ↓
Supply Diversity Dashboard
```

---

© 2026 ELAS VendorPass™ — Todos os direitos reservados.
