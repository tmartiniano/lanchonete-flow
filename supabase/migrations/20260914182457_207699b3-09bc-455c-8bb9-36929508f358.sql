create policy "Somente serviço acessa bloqueios"
on public.auth_login_security
for all
to service_role
using (true)
with check (true);