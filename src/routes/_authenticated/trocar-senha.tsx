import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/lib/auth.functions";

export const Route = createFileRoute("/_authenticated/trocar-senha")({
  head: () => ({ meta: [
    { title: "Trocar senha — Trilha do Sabor" },
    { name: "description", content: "Troca obrigatória da senha provisória." },
    { property: "og:title", content: "Trocar senha — Trilha do Sabor" },
    { property: "og:description", content: "Troca obrigatória da senha provisória." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const run = useServerFn(changePassword);
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8 || password !== confirm) return setMessage("Use ao menos 8 caracteres e confirme a mesma senha.");
    setBusy(true);
    const result = await run({ data: { currentPassword, password } });
    setBusy(false);
    if (!result.ok) return setMessage(result.message);
    navigate({ to: "/dashboard" });
  }

  return <main className="grid min-h-screen place-items-center bg-background p-4">
    <section className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
      <ShieldCheck className="size-8 text-primary-ink" aria-hidden="true" />
      <h1 className="mt-4 text-2xl font-bold">Crie sua senha definitiva</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Sua senha provisória precisa ser trocada antes de acessar o sistema.</p>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <div className="space-y-2"><Label htmlFor="senha-atual">Senha provisória</Label><Input id="senha-atual" type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /></div>
        <div className="space-y-2"><Label htmlFor="senha-nova">Nova senha</Label><Input id="senha-nova" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} /></div>
        <div className="space-y-2"><Label htmlFor="senha-confirmacao">Confirmar nova senha</Label><Input id="senha-confirmacao" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} /></div>
        {message && <p role="alert" className="text-sm text-destructive">{message}</p>}
        <Button className="w-full" disabled={busy}>{busy ? "Salvando…" : "Trocar senha e continuar"}</Button>
      </form>
    </section>
  </main>;
}
