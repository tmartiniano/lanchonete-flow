import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acesso da equipe — Ponto de Apoio" },
      { name: "description", content: "Tela de acesso da equipe da lanchonete." },
      { property: "og:title", content: "Acesso da equipe — Ponto de Apoio" },
      { property: "og:description", content: "Tela de acesso da equipe da lanchonete." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-2 rounded-md text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="size-4" />
          Voltar ao painel
        </Link>
        <section className="rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              P
            </span>
            <div>
              <h1 className="font-semibold">Acesso da equipe</h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Ponto de Apoio
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-primary-ink">
            <LockKeyhole className="mr-2 inline size-4" />
            Login visual. A autenticação será ativada na próxima fase.
          </div>
          <form className="mt-6 space-y-4" onSubmit={(event) => event.preventDefault()}>
            <label className="block text-sm font-medium" htmlFor="email">
              E-mail
            </label>
            <Input id="email" type="email" placeholder="nome@empresa.com.br" disabled />
            <label className="block text-sm font-medium" htmlFor="senha">
              Senha
            </label>
            <Input id="senha" type="password" placeholder="••••••••" disabled />
            <Button type="submit" className="w-full" disabled>
              Entrar no painel
            </Button>
          </form>
          <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
            Nenhuma credencial é coletada ou armazenada nesta etapa.
          </p>
        </section>
      </div>
    </main>
  );
}
