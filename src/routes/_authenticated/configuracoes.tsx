import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, ShieldCheck, Users } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Trilha do Sabor" },
      { name: "description", content: "Configurações de acesso do sistema Trilha do Sabor." },
      { property: "og:title", content: "Configurações — Trilha do Sabor" },
      { property: "og:description", content: "Configurações de acesso do sistema Trilha do Sabor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const access = Route.useRouteContext();
  const isAdmin = access.role === "administrador";
  return (
    <AppShell>
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase text-muted-foreground">Administração</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Configurações</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Controle de acesso e preferências da equipe.</p>
      </header>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-border bg-surface p-5 shadow-sm">
          <ShieldCheck className="size-5 text-primary-ink" aria-hidden="true" />
          <h2 className="mt-3 font-semibold">Seu acesso</h2>
          <p className="mt-1 text-sm text-muted-foreground">Perfil: {access.role.replace("_", " ")}</p>
          <p className="mt-1 text-sm text-muted-foreground">Conta protegida por sessão individual.</p>
        </article>
        <article className="rounded-lg border border-border bg-surface p-5 shadow-sm">
          <Users className="size-5 text-primary-ink" aria-hidden="true" />
          <h2 className="mt-3 font-semibold">Usuários da equipe</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {isAdmin ? "Cadastre contas e atribua o perfil inicial de acesso." : "Somente administradores podem cadastrar ou alterar usuários."}
          </p>
          {isAdmin && <Button asChild className="mt-4"><Link to="/usuarios">Gerenciar usuários</Link></Button>}
        </article>
      </section>
      <section className="mt-4 rounded-lg border border-dashed border-border bg-surface/60 p-8 text-center">
        <Settings className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
        <h2 className="mt-3 font-semibold">Preferências operacionais</h2>
        <p className="mt-1 text-sm text-muted-foreground">Serão adicionadas nas próximas fases, sem dados fictícios.</p>
      </section>
    </AppShell>
  );
}