-- La policy de "contact_requests" dejaba leer (y el código del Panel permite
-- borrar) las solicitudes a CUALQUIER usuario autenticado, no solo a Carla.
-- Como el proyecto tiene habilitados los registros públicos en Supabase Auth
-- (Authentication → Settings → "Allow new users to sign up"), cualquier
-- persona podía crearse una cuenta, confirmar su correo, y leer todos los
-- nombres/correos/mensajes del formulario de contacto.
--
-- Esto agrega una tabla "admins" (sin ningún acceso público, ni siquiera de
-- lectura) y restringe las policies de contact_requests a los correos que
-- figuran ahí.

create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;
-- A propósito no hay ninguna policy para anon/authenticated: nadie puede
-- leer ni escribir esta tabla desde el navegador, solo con la service role
-- key (ej: para agregar un admin nuevo a mano desde el SQL Editor).

drop policy if exists "Solo usuarios autenticados pueden leer solicitudes" on public.contact_requests;

create policy "Solo admins pueden leer solicitudes"
  on public.contact_requests for select
  to authenticated
  using (exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'));

-- No existía ninguna policy de DELETE (el botón "Eliminar" del Panel no
-- podía borrar nada, para nadie); se agrega acá, también restringida a admins.
create policy "Solo admins pueden borrar solicitudes"
  on public.contact_requests for delete
  to authenticated
  using (exists (select 1 from public.admins a where a.email = auth.jwt() ->> 'email'));

-- TODO Xavier/Carla: confirmar que este es el correo con el que va a entrar
-- al Panel (el mismo con el que se registre/inicie sesión en /panel) y
-- borrar o agregar filas acá si hace falta.
insert into public.admins (email) values ('psiconsultoresruz@gmail.com')
  on conflict (email) do nothing;
