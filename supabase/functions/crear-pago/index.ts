// Supabase Edge Function PUBLICA: el paciente ya eligió motivo y horario
// (pasos 1 y 2 del wizard) y ahora su correo (paso 3 — Flow lo exige para
// crear la orden). Acá se crea la reserva en estado "pendiente" y la orden
// de pago en Flow, y se devuelve el link al que hay que redirigir el
// navegador para pagar.
//
// Secretos requeridos: FLOW_API_KEY, FLOW_SECRET_KEY (FLOW_BASE_URL opcional)
// (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase automaticamente)
// Deploy: supabase functions deploy crear-pago --no-verify-jwt

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crearOrdenDePago } from "../_shared/flow.ts";

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

const PRECIO_SESION_CLP = 25000;
const SITE_URL = "https://psicoconsultores.vercel.app"; // TODO: actualizar si cambia el dominio
const FUNCTIONS_URL = Deno.env.get("SUPABASE_URL") + "/functions/v1";

const esEmailValido = (email: unknown) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 150;

const sanitize = (str: unknown, maxLen = 150) =>
  String(str ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"'`]/g, "")
    .trim()
    .slice(0, maxLen);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const { motivo, inicio, fin, email } = await req.json();
    const motivoLimpio = sanitize(motivo, 100);
    const emailLimpio = sanitize(email, 150);
    if (!motivoLimpio || !inicio || !fin) {
      return jsonResponse({ error: "Faltan datos (motivo, inicio, fin)" }, 400);
    }
    if (!esEmailValido(emailLimpio)) {
      return jsonResponse({ error: "Correo inválido" }, 400);
    }
    const inicioDate = new Date(inicio);
    const finDate = new Date(fin);
    if (isNaN(inicioDate.getTime()) || isNaN(finDate.getTime()) || inicioDate <= new Date()) {
      return jsonResponse({ error: "Horario inválido" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Re-chequea que nadie haya tomado ese horario justo ahora (reserva
    // confirmada, o pendiente reciente de otra persona).
    const limiteExpiracion = new Date(Date.now() - 15 * 60 * 1000);
    const { data: enConflicto } = await supabase
      .from("reservas")
      .select("id, estado, created_at")
      .eq("inicio", inicioDate.toISOString())
      .in("estado", ["pendiente", "confirmada"]);

    const ocupado = (enConflicto ?? []).some(
      (r) => r.estado === "confirmada" || new Date(r.created_at) > limiteExpiracion,
    );
    if (ocupado) {
      return jsonResponse({ error: "Ese horario ya no está disponible, elige otro." }, 409);
    }

    const { data: reserva, error: insertError } = await supabase
      .from("reservas")
      .insert([{ motivo: motivoLimpio, email: emailLimpio, inicio: inicioDate.toISOString(), fin: finDate.toISOString() }])
      .select()
      .single();
    if (insertError) throw insertError;

    const fechaLegible = inicioDate.toLocaleString("es-CL", {
      timeZone: "America/Santiago",
      dateStyle: "short",
      timeStyle: "short",
    });

    const { token, redirectUrl } = await crearOrdenDePago({
      commerceOrder: reserva.id,
      subject: `Sesión de psicoterapia — ${fechaLegible}`,
      amount: PRECIO_SESION_CLP,
      email: emailLimpio,
      urlConfirmation: `${FUNCTIONS_URL}/webhook-flow`,
      urlReturn: `${SITE_URL}/#reservar?reserva=${reserva.id}`,
    });

    await supabase.from("reservas").update({ flow_token: token }).eq("id", reserva.id);

    return jsonResponse({ reservaId: reserva.id, redirectUrl }, 200);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "No se pudo iniciar el pago" }, 500);
  }
});
