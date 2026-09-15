import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ShieldPlus } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTeamUser } from "@/lib/auth.functions";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export const Route = createFileRoute("/_authenticated/usuarios")({
  beforeLoad: ({ context }) => {
    if (context.role !== "administrador") throw redirect({ to: "/configuracoes" });
  },
  head: () => ({ meta: [
    { title: "Usuários — Trilha do Sabor" },
    { name: "description", content: "Cadastro administrativo de usuários da equipe." },
    { property: "og:title", content: "Usuários — Trilha do Sabor" },
    { property: "og:description", content: "Cadastro administrativo de usuários da equipe." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: UsersPage,
});

const roleLabels: Record<AppRole, string> = {
  administrador: "Administrador",
  gerente: "Gerente",
  operador_caixa: "Operador de caixa",
  cozinha: "Cozinha",
};

function UsersPage() {
  const createUser = useServerFn(createTeamUser);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("operador_caixa");
  const [message, setMessage] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setTemporaryPassword("");
    try {
      const result = await createUser({ data: { fullName, email, role } });
      if (!result.ok) return setMessage(result.message);
      setTemporaryPassword(result.temporaryPassword);
      setMessage("Usuário cadastrado. Entregue a senha provisória por um canal seguro; ela não será exibida novamente.");
      setFullName("");
      setEmail("");
    } catch {
      setMessage("Não foi possível cadastrar o usuário. Verifique sua permissão e tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase text-muted-foreground">Acesso administrativo</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Cadastrar usuário</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">A conta será criada ativa, com e-mail confirmado e troca obrigatória da senha provisória.</p>
      </header>
      <section className="mt-6 max-w-xl rounded-lg border border-border bg-surface p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2"><ShieldPlus className="size-5 text-primary-ink" aria-hidden="true" /><h2 className="font-semibold">Novo integrante</h2></div>
        <form className="mt-5 space-y-4" onSubmit={submit}>
          <div className="space-y-2"><Label htmlFor="nome">Nome</Label><Input id="nome" value={fullName} onChange={(event) => setFullName(event.target.value)} required minLength={2} maxLength={120} /></div>
          <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
          <div className="space-y-2"><Label htmlFor="perfil">Perfil</Label><Select value={role} onValueChange={(value) => setRole(value as AppRole)}><SelectTrigger id="perfil" className="min-h-11"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(roleLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
          {message && <p role="status" className="text-sm leading-6 text-muted-foreground">{message}</p>}
          {temporaryPassword && <div className="rounded-md border border-primary/30 bg-primary/10 p-3"><p className="text-xs font-medium text-primary-ink">Senha provisória</p><output className="mt-1 block break-all font-mono text-sm" aria-label="Senha provisória gerada">{temporaryPassword}</output></div>}
          <Button className="min-h-11 w-full" disabled={busy}>{busy ? "Cadastrando…" : "Cadastrar usuário"}</Button>
        </form>
      </section>
    </AppShell>
  );
}