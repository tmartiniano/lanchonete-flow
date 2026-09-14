# Plano de segurança e autenticação — Trilha do Sabor

## Objetivo

Usar exclusivamente o Supabase externo já vinculado ao projeto e implantar a base de identidade, perfis, permissões e auditoria antes de liberar qualquer área funcional.

Nenhuma alteração será aplicada ao banco até a aprovação deste plano. A conexão já está ativa; a inspeção atual não encontrou tabelas públicas tipadas nem políticas RLS existentes.

## Decisões confirmadas

- Perfis: `administrador`, `gerente`, `operador_caixa` e `cozinha`.
- O perfil ficará em tabela própria (`user_roles`), separado de `profiles`.
- Thiago será criado manualmente em **Supabase → Authentication → Users**, com senha provisória definida fora do código e com e-mail já confirmado.
- Bloqueio: 5 falhas consecutivas geram 15 minutos; novos grupos geram 30, 60, 120 minutos e assim por diante, limitado a 24 horas. Um login bem-sucedido zera a progressão.
- Cadastro público e confirmação obrigatória de e-mail ficarão desativados.
- A interface e todas as mensagens permanecerão em português do Brasil.

## Migration 1 — perfis, papéis e autorização

Esta migration cria os quatro papéis, mantém papéis fora de `profiles`, concede apenas os privilégios necessários e ativa RLS em todas as tabelas.

```sql
create type public.app_role as enum (
  'administrador',
  'gerente',
  'operador_caixa',
  'cozinha'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  active boolean not null default true,
  must_change_password boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  granted_by uuid references auth.users(id) on delete set null,
  granted_at timestamptz not null default now(),
  unique (user_id)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

revoke all on function public.has_role(uuid, public.app_role) from public;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

create policy "Usuário consulta o próprio perfil"
on public.profiles for select to authenticated
using (id = auth.uid());

create policy "Administrador consulta todos os perfis"
on public.profiles for select to authenticated
using (public.has_role(auth.uid(), 'administrador'));

create policy "Usuário consulta o próprio papel"
on public.user_roles for select to authenticated
using (user_id = auth.uid());

create policy "Administrador consulta todos os papéis"
on public.user_roles for select to authenticated
using (public.has_role(auth.uid(), 'administrador'));
```

Não haverá escrita direta pelo navegador em `profiles` ou `user_roles`. Criação, alteração, ativação e troca de papel passarão por funções de servidor que validam o administrador e usam a chave privilegiada somente no servidor.

## Migration 2 — bloqueios e auditoria

```sql
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
using (public.has_role(auth.uid(), 'administrador'));

create or replace function public.prevent_audit_log_mutation()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  raise exception 'Registros de auditoria são imutáveis';
end;
$$;

create trigger audit_logs_append_only
before update or delete on public.audit_logs
for each row execute function public.prevent_audit_log_mutation();
```

`auth_login_security` não terá acesso para usuários anônimos ou autenticados. E-mails serão normalizados e convertidos em SHA-256 no servidor; senhas, tokens e links mágicos nunca serão gravados nos logs.

## Configuração do Supabase

Após as migrations:

1. Desativar **Allow new users to sign up**.
2. Desativar a exigência de confirmação de e-mail.
3. Manter e-mail/senha e link mágico ativos.
4. Configurar URLs permitidas para login, link mágico e recuperação.
5. Confirmar o envio de e-mails de autenticação no projeto externo; para produção, configurar SMTP/domínio próprio no Supabase.
6. Manter rotação de refresh token e proteção contra reutilização ativas.

Essas configurações são do Supabase Auth e não pertencem às migrations SQL.

## Primeiro administrador

1. Você cria `thiago@tlmtecnologia.com` no painel do Supabase com a senha provisória, marcando o e-mail como confirmado.
2. Depois, um comando de dados separado — nunca uma migration e nunca contendo a senha — associa o usuário existente:

```sql
insert into public.profiles (id, full_name, must_change_password)
select id, 'Thiago', true
from auth.users
where lower(email) = lower('thiago@tlmtecnologia.com')
on conflict (id) do update
set full_name = excluded.full_name,
    must_change_password = true,
    updated_at = now();

insert into public.user_roles (user_id, role)
select id, 'administrador'::public.app_role
from auth.users
where lower(email) = lower('thiago@tlmtecnologia.com')
on conflict (user_id) do update
set role = excluded.role;
```

Antes de executar, será validado que existe exatamente um usuário com esse e-mail e que ainda não há outro administrador. Nenhuma senha será solicitada ou armazenada pelo aplicativo.

## Aplicação e controles de acesso

- Criar a área protegida usando o guard oficial do projeto e proteger Dashboard, Produtos, Categorias, Clientes, Pedidos, Pagamentos, Relatórios e Configurações.
- Implementar login por e-mail/senha por função de servidor, para aplicar bloqueio e auditoria antes de autenticar.
- Implementar link mágico, solicitação de recuperação e a página pública `/reset-password`.
- Após o primeiro login com senha provisória, permitir acesso somente à página de troca de senha. A função protegida altera a senha e somente depois remove `must_change_password`.
- Criar função administrativa para cadastrar usuários. Ela valida a sessão e o papel `administrador`, cria o usuário já confirmado, atribui o papel escolhido, marca troca obrigatória e registra auditoria.
- Gerentes, operadores de caixa e cozinha não poderão cadastrar usuários nem alterar papéis.
- No modelo atual, esses três papéis verão apenas o próprio perfil e papel; permissões sobre produtos, pedidos e demais tabelas serão adicionadas quando essas tabelas existirem.
- O cabeçalho refletirá a sessão e oferecerá saída segura, limpando dados protegidos antes de voltar ao login.

## Bloqueio progressivo e auditoria

- Falhas são contadas por identificador de e-mail normalizado e hash, com resposta genérica para não revelar contas existentes.
- Na 5ª falha: 15 minutos. A cada novo grupo de cinco falhas após o desbloqueio: 30, 60, 120, 240, 480, 960 e máximo de 1.440 minutos.
- Login bem-sucedido zera tentativas e nível de bloqueio.
- Toda função protegida também verificará `active`, `must_change_password` e bloqueio atual; assim, obter um token diretamente não concede acesso às áreas do sistema.
- Serão auditados: sucesso, falha, bloqueio, saída, link mágico, recuperação, troca de senha, criação/alteração de usuário e troca de papel.
- Logs serão somente de acréscimo: usuários comuns não inserem, alteram ou apagam; administradores apenas consultam.

## Validação antes da entrega

- Executar linter e varredura de segurança após aplicar as migrations.
- Testar as quatro matrizes de papel e confirmar negação de acesso entre competências.
- Testar cadastro público bloqueado, criação por administrador e rejeição para demais papéis.
- Testar senha provisória, troca obrigatória, recuperação e link mágico.
- Testar 5 falhas, bloqueios de 15/30/60 minutos e reinício após sucesso.
- Confirmar ausência de senha, token e chave privada no navegador, repositório, mensagens e auditoria.
- Validar todas as telas em português do Brasil, computador, tablet e celular.

## Ordem de execução após aprovação

1. Aplicar Migration 1.
2. Aplicar Migration 2.
3. Configurar o Supabase Auth.
4. Você cria Thiago no painel com a senha provisória.
5. Validar e associar Thiago como primeiro administrador.
6. Implementar os fluxos de autenticação, bloqueio, auditoria e administração.
7. Executar a matriz de testes e a revisão de segurança.

Nenhuma tabela de produtos, categorias, clientes, pedidos, pagamentos ou relatórios será criada nesta etapa.
