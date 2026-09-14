create type public.audit_event as enum (
  'login_success',
  'login_failure',
  'account_locked',
  'logout',
  'magic_link_requested',
  'password_reset_requested',
  'password_changed',
  'admin_user_created',
  'admin_user_updated',
  'admin_role_changed'
);

create table public.auth_login_security (
  identifier_hash text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  failed_attempts integer not null default 0,
  lock_level integer not null default 0,
  locked_until timestamptz,
  last_failed_at timestamptz,
  updated_at timestamptz not null default now()
);

grant all on public.auth_login_security to service_role;
alter table public.auth_login_security enable row level security;

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  event public.audit_event not null,
  actor_user_id uuid references auth.users(id) on delete set null,
  target_user_id uuid references auth.users(id) on delete set null,
  outcome text not null,
  ip_address inet,
  user_agent text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

grant select on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;

create policy "Somente administrador consulta auditoria"
on public.audit_logs for select to authenticated
using (app_private.has_role(auth.uid(), 'administrador'));

create or replace function app_private.prevent_audit_log_mutation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  raise exception 'Registros de auditoria são imutáveis';
end;
$$;

revoke all on function app_private.prevent_audit_log_mutation() from public, anon, authenticated;

create trigger audit_logs_append_only
before update or delete on public.audit_logs
for each row execute function app_private.prevent_audit_log_mutation();