import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound, Link2, LockKeyhole } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { requestMagicLink, requestPasswordReset, signInWithPassword } from "@/lib/auth.functions";

type AccessMode = "password" | "magic" | "recovery";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    reason: typeof search["reason"] === "string" ? search["reason"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Acesso da equipe — Trilha do Sabor" },
      { name: "description", content: "Acesso seguro da equipe ao sistema Trilha do Sabor." },
      { property: "og:title", content: "Acesso da equipe — Trilha do Sabor" },
      { property: "og:description", content: "Acesso seguro da equipe ao sistema Trilha do Sabor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

const modeCopy = {
  password: { title: "Acesso da equipe", description: "Entre com seu e-mail e senha.", action: "Entrar no painel" },
  magic: { title: "Link mágico", description: "Receba um link de acesso no seu e-mail.", action: "Enviar link de acesso" },
  recovery: { title: "Recuperar senha", description: "Receba as instruções para criar uma nova senha.", action: "Enviar recuperação" },
} satisfies Record<AccessMode, { title: string; description: string; action: string }>;

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const login = useServerFn(signInWithPassword);
  const magicLink = useServerFn(requestMagicLink);
  const passwordReset = useServerFn(requestPasswordReset);
  const [mode, setMode] = useState<AccessMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(search.reason === "unauthorized" ? "Sua conta não possui acesso ativo. Procure um administrador." : "");
  const [isError, setIsError] = useState(Boolean(search.reason));
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (mode === "password") {
        const result = await login({ data: { email, password } });
        if (!result.ok) {
          setIsError(true);
          setMessage(result.message);
          return;
        }
        const { error } = await supabase.auth.setSession({
          access_token: result.accessToken,
          refresh_token: result.refreshToken,
        });
        if (error) {
          setIsError(true);
          setMessage("Não foi possível iniciar a sessão. Tente novamente.");
          return;
        }
        navigate({ to: result.mustChangePassword ? "/trocar-senha" : "/dashboard" });
        return;
      }

      const redirectTo = mode === "magic"
        ? `${window.location.origin}/dashboard`
        : `${window.location.origin}/reset-password`;
      const result = mode === "magic"
        ? await magicLink({ data: { email, redirectTo } })
        : await passwordReset({ data: { email, redirectTo } });
      setIsError(false);
      setMessage(result.message);
    } catch {
      setIsError(true);
      setMessage("O serviço de acesso está indisponível no momento. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  const copy = modeCopy[mode];
  return (
    <main className="grid min-h-screen place-items-center bg-background p-4">
      <section className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">T</span>
          <div>
            <h1 className="font-semibold">{copy.title}</h1>
            <p className="font-mono text-[10px] uppercase text-muted-foreground">Trilha do Sabor</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{copy.description}</p>

        <div className="mt-5 grid grid-cols-3 gap-1 rounded-md bg-muted p-1" aria-label="Forma de acesso">
          {([
            ["password", LockKeyhole, "Senha"],
            ["magic", Link2, "Link mágico"],
            ["recovery", KeyRound, "Recuperar"],
          ] as const).map(([value, Icon, label]) => (
            <Button key={value} type="button" variant={mode === value ? "outline" : "ghost"} className="h-auto min-h-11 px-2 text-xs" onClick={() => { setMode(value); setMessage(""); }}>
              <Icon aria-hidden="true" /> {label}
            </Button>
          ))}
        </div>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="nome@empresa.com.br" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          {mode === "password" && (
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
          )}
          {message && <p role="status" className={isError ? "text-sm text-destructive" : "text-sm text-primary-ink"}>{message}</p>}
          <Button type="submit" className="min-h-11 w-full" disabled={busy}>{busy ? "Aguarde…" : copy.action}</Button>
        </form>
        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">O cadastro de contas é realizado somente por administradores.</p>
      </section>
    </main>
  );
}