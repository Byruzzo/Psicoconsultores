-- Ejecutar en el SQL Editor de tu proyecto de Supabase (Psicoconsultores),
-- DESPUÉS de supabase_contact_requests.sql.
-- Agrega el permiso que falta para poder borrar solicitudes desde el panel
-- de administración (/panel): solo un usuario logueado puede hacerlo.

create policy "Solo usuarios autenticados pueden borrar solicitudes"
  on public.contact_requests
  for delete
  to authenticated
  using (true);
