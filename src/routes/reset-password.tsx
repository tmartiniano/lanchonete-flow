import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Redefinir senha — Trilha do Sabor" },
    { name: "description", content: "Defina uma nova senha para acessar o Trilha do Sabor." },
    { property: "og:title", content: "Redefinir senha — Trilha do Sabor" },
    { property: "og:description", content: "Defina uma nova senha para acessar o Trilha do Sabor." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8 || password !== confirm) {
      setMessage("Use ao menos 8 caracteres e confirme a mesma senha.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setMessage("O link expirou ou não é válido. Solicite uma nova recuperação.");
    navigate({ to: "/dashboard" });
  }

  return <main className="grid min-h-screen place-items-center bg-background p-4">
    <section className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
      <KeyRound className="size-8 text-primary-ink" aria-hidden="true" />
      <h1 className="mt-4 text-2xl font-bold">Redefinir senha</h1>
      <p className="mt-2 text-sm text-muted-foreground">Escolha uma senha nova para sua conta.</p>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <div className="space-y-2"><Label htmlFor="nova-senha">Nova senha</Label><Input id="nova-senha" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} /></div>
        <div className="space-y-2"><Label htmlFor="confirmar-senha">Confirmar senha</Label><Input id="confirmar-senha" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} /></div>
        {message && <p role="alert" className="text-sm text-destructive">{message}</p>}
        <Button className="w-full" disabled={busy}>{busy ? "Salvando…" : "Salvar nova senha"}</Button>
      </form>
    </section>
  </main>;
}
