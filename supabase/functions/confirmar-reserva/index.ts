// Supabase Edge Function PUBLICA: paso 4 del wizard, después de volver del
// pago. Solo si la reserva ya quedó "confirmada" por el webhook de Mercado
// Pago se guardan nombre/email y se crea el evento en el Google Calendar de
// Carla con Meet, invitando al paciente.
//
// Secretos requeridos: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
// (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase automaticamente)
// Deploy: supabase functions deploy confirmar-reserva --no-verify-jwt

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crearEventoConMeet } from "../_shared/google-calendar.ts";

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

const esEmailValido = (email: string) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 150;

const sanitize = (str: unknown, maxLen = 150) =>
  String(str ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"'`]/g, "")
    .trim()
    .slice(0, maxLen);

const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const { reservaId, nombre, email } = await req.json();
    const nombreLimpio = sanitize(nombre, 100);
    const emailLimpio = sanitize(email, 150);
    if (!reservaId || !nombreLimpio || !esEmailValido(emailLimpio)) {
      return jsonResponse({ error: "Faltan datos o el correo no es válido" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // El webhook de MP puede tardar unos segundos en llegar: reintenta
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
    if (reserva.estado === "cancelada") {
      return jsonResponse({ error: "El pago no se aprobó, la reserva fue cancelada." }, 402);
    }
    if (reserva.estado !== "confirmada") {
      return jsonResponse({ error: "El pago todavía no se confirma, intenta en unos segundos." }, 202);
    }

    if (!reserva.calendar_event_id) {
      const { eventId, meetLink } = await crearEventoConMeet({
        summary: `Sesión de psicoterapia — ${nombreLimpio}`,
        description: `Motivo de consulta: ${reserva.motivo}`,
        startISO: reserva.inicio,
        endISO: reserva.fin,
        attendeeEmail: emailLimpio,
      });
      await supabase
        .from("reservas")
        .update({ nombre: nombreLimpio, email: emailLimpio, calendar_event_id: eventId })
        .eq("id", reservaId);
      return jsonResponse({ ok: true, meetLink, inicio: reserva.inicio }, 200);
    }

    return jsonResponse({ ok: true, inicio: reserva.inicio }, 200);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "No se pudo confirmar la reserva" }, 500);
  }
});
