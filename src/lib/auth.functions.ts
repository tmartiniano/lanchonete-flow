import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];
type AuditEvent = Database["public"]["Enums"]["audit_event"];

const emailSchema = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const passwordSchema = z.string().min(8).max(128);
const roles = ["administrador", "gerente", "operador_caixa", "cozinha"] as const;

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("A conexão com o Supabase não está configurada.");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
}

async function identifierHash(email: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function audit(
  event: AuditEvent,
  outcome: string,
  options: { actor?: string; target?: string; details?: Record<string, string | number | boolean> } = {},
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("audit_logs").insert({
    event,
    outcome,
    actor_user_id: options.actor ?? null,
    target_user_id: options.target ?? null,
    details: options.details ?? {},
  });
}

export const signInWithPassword = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ email: emailSchema, password: z.string().min(1).max(128) }).parse(input))
  .handler(async ({ data }) => {
    const hash = await identifierHash(data.email);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: security } = await supabaseAdmin
      .from("auth_login_security")
      .select("failed_attempts, lock_level, locked_until")
      .eq("identifier_hash", hash)
      .maybeSingle();

    if (security?.locked_until && new Date(security.locked_until).getTime() > Date.now()) {
      await audit("account_locked", "negado", { details: { identifier_hash: hash } });
      return { ok: false as const, message: "Acesso temporariamente bloqueado. Tente novamente mais tarde." };
    }

    const client = publicClient();
    const { data: authData, error } = await client.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !authData.session || !authData.user) {
      const attempts = (security?.failed_attempts ?? 0) + 1;
      const shouldLock = attempts >= 5;
      const nextLevel = shouldLock ? (security?.lock_level ?? 0) + 1 : (security?.lock_level ?? 0);
      const minutes = Math.min(15 * 2 ** Math.max(0, nextLevel - 1), 1440);
      const lockedUntil = shouldLock ? new Date(Date.now() + minutes * 60_000).toISOString() : null;
      await supabaseAdmin.from("auth_login_security").upsert({
        identifier_hash: hash,
        failed_attempts: shouldLock ? 0 : attempts,
        lock_level: nextLevel,
        locked_until: lockedUntil,
        last_failed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      await audit(shouldLock ? "account_locked" : "login_failure", "negado", {
        details: { identifier_hash: hash, ...(shouldLock ? { lock_minutes: minutes } : {}) },
      });
      return {
        ok: false as const,
        message: shouldLock
          ? `Acesso bloqueado por ${minutes} minutos após cinco tentativas incorretas.`
          : "E-mail ou senha inválidos.",
      };
    }

    const [{ data: profile }, { data: roleRow }] = await Promise.all([
      supabaseAdmin.from("profiles").select("full_name, active, must_change_password").eq("id", authData.user.id).maybeSingle(),
      supabaseAdmin.from("user_roles").select("role").eq("user_id", authData.user.id).maybeSingle(),
    ]);

    if (!profile?.active || !roleRow) {
      await audit("login_failure", "conta_inativa_ou_sem_perfil", { target: authData.user.id });
      return { ok: false as const, message: "Acesso não autorizado. Procure um administrador." };
    }

    await supabaseAdmin.from("auth_login_security").upsert({
      identifier_hash: hash,
      user_id: authData.user.id,
      failed_attempts: 0,
      lock_level: 0,
      locked_until: null,
      last_failed_at: null,
      updated_at: new Date().toISOString(),
    });
    await audit("login_success", "sucesso", { actor: authData.user.id });

    return {
      ok: true as const,
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      mustChangePassword: profile.must_change_password,
    };
  });

export const requestMagicLink = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ email: emailSchema, redirectTo: z.string().url() }).parse(input))
  .handler(async ({ data }) => {
    const client = publicClient();
    await client.auth.signInWithOtp({
      email: data.email,
      options: { shouldCreateUser: false, emailRedirectTo: data.redirectTo },
    });
    await audit("magic_link_requested", "solicitado", { details: { identifier_hash: await identifierHash(data.email) } });
    return { ok: true, message: "Se o e-mail estiver cadastrado, o link de acesso será enviado." };
  });

export const requestPasswordReset = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ email: emailSchema, redirectTo: z.string().url() }).parse(input))
  .handler(async ({ data }) => {
    const client = publicClient();
    await client.auth.resetPasswordForEmail(data.email, { redirectTo: data.redirectTo });
    await audit("password_reset_requested", "solicitado", { details: { identifier_hash: await identifierHash(data.email) } });
    return { ok: true, message: "Se o e-mail estiver cadastrado, as instruções serão enviadas." };
  });

export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: profile }, { data: roleRow }] = await Promise.all([
      context.supabase.from("profiles").select("full_name, active, must_change_password").eq("id", context.userId).maybeSingle(),
      context.supabase.from("user_roles").select("role").eq("user_id", context.userId).maybeSingle(),
    ]);
    if (!profile?.active || !roleRow) return { authorized: false as const };
    return { authorized: true as const, userId: context.userId, profile, role: roleRow.role };
  });

export const changePassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ currentPassword: z.string().max(128).optional(), password: passwordSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const payload: { password: string; current_password?: string } = { password: data.password };
    if (data.currentPassword) payload.current_password = data.currentPassword;
    const { error } = await context.supabase.auth.updateUser(payload);
    if (error) return { ok: false as const, message: "Não foi possível alterar a senha. Verifique os dados informados." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("profiles").update({ must_change_password: false }).eq("id", context.userId);
    await audit("password_changed", "sucesso", { actor: context.userId, target: context.userId });
    return { ok: true as const };
  });

export const logLogout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await audit("logout", "sucesso", { actor: context.userId });
    return { ok: true as const };
  });

export const createTeamUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ fullName: z.string().trim().min(2).max(120), email: emailSchema, role: z.enum(roles) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: callerRole } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).maybeSingle();
    if (callerRole?.role !== "administrador") throw new Error("Apenas administradores podem cadastrar usuários.");

    const bytes = crypto.getRandomValues(new Uint8Array(12));
    const temporaryPassword = `${Array.from(bytes, (value) => value.toString(36)).join("")}Aa1!`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: temporaryPassword,
      email_confirm: true,
    });
    if (error || !created.user) return { ok: false as const, message: "Não foi possível cadastrar o usuário." };

    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: created.user.id,
      full_name: data.fullName,
      must_change_password: true,
    });
    const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
      user_id: created.user.id,
      role: data.role as AppRole,
      granted_by: context.userId,
    });
    if (profileError || roleError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      return { ok: false as const, message: "O cadastro não foi concluído. Nenhum usuário foi mantido." };
    }
    await audit("admin_user_created", "sucesso", {
      actor: context.userId,
      target: created.user.id,
      details: { role: data.role },
    });
    return { ok: true as const, temporaryPassword };
  });
