-- Renombra las columnas de pago de la tabla reservas: se reemplaza
-- Mercado Pago por Flow como procesador de pago.
alter table public.reservas rename column mp_preference_id to flow_token;
alter table public.reservas rename column mp_payment_id to flow_order;
