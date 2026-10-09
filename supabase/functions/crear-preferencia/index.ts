// Supabase Edge Function PUBLICA: el paciente ya eligió motivo y horario
// (pasos 1 y 2 del wizard). Acá se crea la reserva en estado "pendiente" y
// la preferencia de pago de Mercado Pago (Checkout Pro), y se devuelve el
// link al que hay que redirigir al navegador para pagar.
//
// Secretos requeridos: MP_ACCESS_TOKEN
// (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase automaticamente)
// Deploy: supabase functions deploy crear-preferencia --no-verify-jwt

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

const sanitize = (str: unknown, maxLen = 100) =>
  String(str ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"'`]/g, "")
    .trim()
    .slice(0, maxLen);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const { motivo, inicio, fin } = await req.json();
    const motivoLimpio = sanitize(motivo, 100);
    if (!motivoLimpio || !inicio || !fin) {
      return jsonResponse({ error: "Faltan datos (motivo, inicio, fin)" }, 400);
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
      .insert([{ motivo: motivoLimpio, inicio: inicioDate.toISOString(), fin: finDate.toISOString() }])
      .select()
      .single();
    if (insertError) throw insertError;

    const mpAccessToken = Deno.env.get("MP_ACCESS_TOKEN");
    if (!mpAccessToken) throw new Error("MP_ACCESS_TOKEN no configurado");

    const fechaLegible = inicioDate.toLocaleString("es-CL", {
      timeZone: "America/Santiago",
      dateStyle: "short",
      timeStyle: "short",
    });

    const prefResp = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mpAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            title: `Sesión de psicoterapia — ${fechaLegible}`,
            quantity: 1,
            unit_price: PRECIO_SESION_CLP,
            currency_id: "CLP",
          },
        ],
        external_reference: reserva.id,
        notification_url: `${FUNCTIONS_URL}/webhook-mp`,
        back_urls: {
          success: `${SITE_URL}/#reservar?reserva=${reserva.id}&pago=ok`,
          failure: `${SITE_URL}/#reservar?reserva=${reserva.id}&pago=error`,
          pending: `${SITE_URL}/#reservar?reserva=${reserva.id}&pago=pendiente`,
        },
        auto_return: "approved",
      }),
    });
    if (!prefResp.ok) {
      throw new Error(`Mercado Pago rechazó la preferencia: ${prefResp.status} ${await prefResp.text()}`);
    }
    const pref = await prefResp.json();

    await supabase.from("reservas").update({ mp_preference_id: pref.id }).eq("id", reserva.id);

    return jsonResponse({ reservaId: reserva.id, initPoint: pref.init_point }, 200);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "No se pudo iniciar el pago" }, 500);
  }
});
