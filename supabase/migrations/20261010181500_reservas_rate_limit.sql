-- Antes de esto, cualquiera podía golpear "crear-pago" sin límite y crear
-- reservas "pendiente" para todos los horarios disponibles, sin pagar
-- nunca, bloqueando la agenda para pacientes reales (cada "pendiente"
-- ocupa el horario por 15 minutos, pero nada impedía repetirlo sin fin).
-- Se agrega una columna para la IP de quien crea la reserva, usada desde
-- la Edge Function para limitar cuántas reservas "pendiente" puede abrir
-- una misma persona/IP en poco tiempo.
alter table public.reservas add column if not exists creador_ip text;
