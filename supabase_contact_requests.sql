-- Ejecutar en el SQL Editor de tu proyecto de Supabase (Psicoconsultores).
-- Crea la tabla donde se guardan las solicitudes de contacto del formulario
-- y la protege con Row Level Security: cualquiera puede insertar (enviar el
-- formulario), pero solo un usuario autenticado (tú, desde el dashboard de
-- Supabase o un panel propio) puede leerlas.

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  contacto text not null,
  mensaje text
);

alter table public.contact_requests enable row level security;

create policy "Cualquiera puede enviar una solicitud"
  on public.contact_requests
  for insert
  to anon
  with check (true);

create policy "Solo usuarios autenticados pueden leer solicitudes"
  on public.contact_requests
  for select
  to authenticated
  using (true);
