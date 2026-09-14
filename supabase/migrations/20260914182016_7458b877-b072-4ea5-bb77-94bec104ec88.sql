create schema if not exists app_private;
revoke all on schema app_private from public, anon;
grant usage on schema app_private to authenticated, service_role;

create or replace function app_private.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

revoke all on function app_private.has_role(uuid, public.app_role) from public, anon;
grant execute on function app_private.has_role(uuid, public.app_role) to authenticated, service_role;

alter policy "Administrador consulta todos os perfis"
on public.profiles
using (app_private.has_role(auth.uid(), 'administrador'));

alter policy "Administrador consulta todos os papéis"
on public.user_roles
using (app_private.has_role(auth.uid(), 'administrador'));

drop function public.has_role(uuid, public.app_role);