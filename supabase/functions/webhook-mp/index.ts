// Supabase Edge Function PUBLICA: Mercado Pago llama acá cada vez que
// cambia el estado de un pago. Nunca confiamos en el payload del webhook a
// ciegas -- siempre se vuelve a consultar el pago contra la API oficial de
// MP usando el id que llega, y recién con esa respuesta se decide si la
// reserva queda confirmada.
//
// Secretos requeridos: MP_ACCESS_TOKEN
// (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase automaticamente)
// Deploy: supabase functions deploy webhook-mp --no-verify-jwt
// Configurar esta URL como "notification_url" en Mercado Pago (ya se manda
// automáticamente desde crear-preferencia, esto es solo documentación).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });

  try {
    const url = new URL(req.url);
    // MP manda el id tanto por query string (?data.id=...&type=payment) como
    // en el body, según la integración. Cubrimos ambos casos.
    let paymentId = url.searchParams.get("data.id") || url.searchParams.get("id");
    if (!paymentId && req.method === "POST") {
      try {
        const body = await req.json();
        paymentId = body?.data?.id ?? null;
      } catch {
        /* body vacío o no-JSON, se ignora */
      }
    }

    if (!paymentId) {
      // MP a veces manda pings de prueba sin id -- respondemos 200 para que
      // no reintente indefinidamente, pero no hacemos nada.
      return new Response("ok", { status: 200, headers: CORS_HEADERS });
    }

    const mpAccessToken = Deno.env.get("MP_ACCESS_TOKEN");
    if (!mpAccessToken) throw new Error("MP_ACCESS_TOKEN no configurado");

    const pagoResp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpAccessToken}` },
    });
    if (!pagoResp.ok) {
      console.error("No se pudo consultar el pago", paymentId, pagoResp.status);
      return new Response("ok", { status: 200, headers: CORS_HEADERS });
    }
    const pago = await pagoResp.json();
    const reservaId = pago.external_reference;
    if (!reservaId) return new Response("ok", { status: 200, headers: CORS_HEADERS });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (pago.status === "approved") {
      await supabase
        .from("reservas")
        .update({ estado: "confirmada", mp_payment_id: String(pago.id) })
        .eq("id", reservaId)
        .eq("estado", "pendiente"); // no pisa una ya confirmada/cancelada
    } else if (["rejected", "cancelled"].includes(pago.status)) {
      await supabase
        .from("reservas")
        .update({ estado: "cancelada", mp_payment_id: String(pago.id) })
        .eq("id", reservaId)
        .eq("estado", "pendiente");
    }
    // status "pending"/"in_process": se deja como estaba, MP volverá a avisar.

    return new Response("ok", { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error(err);
    // Igual respondemos 200: si devolvemos error, MP reintenta en bucle.
    return new Response("ok", { status: 200, headers: CORS_HEADERS });
  }
});
