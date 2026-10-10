// Supabase Edge Function PUBLICA: paso 4 del wizard, después de volver del
// pago. Nombre, teléfono y correo ya se guardaron en el paso 3 (antes de
// pagar), así que este paso es 100% automático: solo recibe el reservaId
// (de la URL de retorno de Flow) y, si el pago ya quedó "confirmada" por el
// webhook, crea el evento en el Google Calendar de Carla con Meet,
// invitando al paciente. El frontend lo llama solo, sin pedirle nada más a
// la persona.
//
// Secretos requeridos: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
// (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase automaticamente)
// Deploy: supabase functions deploy confirmar-reserva --no-verify-jwt

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crearEventoConMeet } from "../_shared/google-calendar.ts";
import { obtenerEstadoPago, FLOW_STATUS } from "../_shared/flow.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });

const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const { reservaId } = await req.json();
    if (!reservaId) return jsonResponse({ error: "Falta reservaId" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // El webhook de Flow puede tardar unos segundos en llegar: reintenta
    // brevemente antes de rendirse.
    let reserva = null;
    for (let intento = 0; intento < 6; intento++) {
      const { data, error } = await supabase.from("reservas").select("*").eq("id", reservaId).single();
      if (error) throw error;
      reserva = data;
      if (reserva.estado === "confirmada" || reserva.estado === "cancelada") break;
      await esperar(2000);
    }

    if (!reserva) return jsonResponse({ error: "Reserva no encontrada" }, 404);

    // El webhook de Flow puede no llegar nunca (ej: la persona anula el
    // pago y vuelve, sin completar ningún cobro -- Flow puede dejar la
    // orden como "pendiente" indefinidamente en ese caso, nunca manda
    // webhook). Esta función solo se llama cuando la persona ya volvió del
    // checkout de Flow (al cargar la página, o al tocar "Intentar de
    // nuevo"), así que si seguimos "pendiente" después de esperar, se
    // consulta el estado real contra la API de Flow: cualquier cosa que no
    // sea "pagada" en este punto se trata como pago no realizado, y se
    // libera la hora en vez de dejar a la persona esperando indefinidamente.
    if (reserva.estado === "pendiente" && reserva.flow_token) {
      try {
        const { status } = await obtenerEstadoPago(reserva.flow_token);
        const { data: actualizada } = await supabase
          .from("reservas")
          .update({ estado: status === FLOW_STATUS.PAGADA ? "confirmada" : "cancelada" })
          .eq("id", reservaId)
          .eq("estado", "pendiente")
          .select()
          .single();
        if (actualizada) reserva = actualizada;
      } catch (err) {
        console.error("No se pudo consultar el estado del pago en Flow:", err);
      }
    }

    if (reserva.estado === "cancelada") {
      return jsonResponse({ error: "El pago no fue efectuado. Tu hora fue liberada." }, 402);
    }
    if (reserva.estado !== "confirmada") {
      return jsonResponse({ error: "El pago todavía no se confirma, intenta en unos segundos." }, 202);
    }
    if (!reserva.email || !reserva.nombre) {
      return jsonResponse({ error: "Faltan datos de la reserva" }, 400);
    }

    if (!reserva.calendar_event_id) {
      const { eventId, meetLink } = await crearEventoConMeet({
        summary: `Sesión de psicoterapia — ${reserva.nombre}`,
        description: `Motivo de consulta: ${reserva.motivo}\nTeléfono: ${reserva.telefono ?? "—"}`,
        startISO: reserva.inicio,
        endISO: reserva.fin,
        attendeeEmail: reserva.email,
      });
      await supabase.from("reservas").update({ calendar_event_id: eventId }).eq("id", reservaId);
      return jsonResponse({ ok: true, meetLink, inicio: reserva.inicio, email: reserva.email, nombre: reserva.nombre }, 200);
    }

    return jsonResponse({ ok: true, inicio: reserva.inicio, email: reserva.email, nombre: reserva.nombre }, 200);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "No se pudo confirmar la reserva" }, 500);
  }
});
