-- Ejecutar en el SQL Editor de tu proyecto de Supabase (Psicoconsultores).
-- Tabla de reservas: une el horario elegido, el motivo de consulta y el
-- estado del pago de Mercado Pago. El paciente nunca lee ni escribe esta
-- tabla directamente — todo pasa por las Edge Functions (que usan la
-- service role key, con permisos completos). anon no tiene ningún permiso
-- directo sobre ella.

create table if not exists public.reservas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text,
  email text,
  motivo text not null,
  inicio timestamptz not null,
  fin timestamptz not null,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'confirmada', 'expirada', 'cancelada')),
  mp_preference_id text,
  mp_payment_id text,
  calendar_event_id text
);

create index if not exists reservas_inicio_idx on public.reservas (inicio);
create index if not exists reservas_estado_idx on public.reservas (estado);

alter table public.reservas enable row level security;
-- Sin policies para anon/authenticated a propósito: todo el acceso pasa por
-- las Edge Functions con la service role key, nunca directo desde el navegador.
