// Supabase Edge Function PUBLICA: Flow llama acá (urlConfirmation) cada vez
// que cambia el estado de un pago, mandando un "token" por POST. Nunca
// confiamos en el payload a ciegas -- siempre se vuelve a consultar el pago
// contra la API oficial de Flow (payment/getStatus) usando ese token, y
// recién con esa respuesta se decide si la reserva queda confirmada.
//
// Secretos requeridos: FLOW_API_KEY, FLOW_SECRET_KEY (FLOW_BASE_URL opcional)
// (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase automaticamente)
// Deploy: supabase functions deploy webhook-flow --no-verify-jwt
// Esta URL ya se manda automáticamente como "urlConfirmation" desde
// crear-pago; no hace falta configurarla a mano en Flow.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { obtenerEstadoPago, FLOW_STATUS } from "../_shared/flow.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });

  try {
    let token: string | null = null;
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      token = String(form.get("token") ?? "") || null;
    } else {
      try {
        const body = await req.json();
        token = body?.token ?? null;
      } catch {
        /* body vacío o no-JSON, se ignora */
      }
    }

    if (!token) return new Response("ok", { status: 200, headers: CORS_HEADERS });

    const { status, commerceOrder } = await obtenerEstadoPago(token);
    if (!commerceOrder) return new Response("ok", { status: 200, headers: CORS_HEADERS });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (status === FLOW_STATUS.PAGADA) {
      await supabase
        .from("reservas")
        .update({ estado: "confirmada", flow_order: String(token) })
        .eq("id", commerceOrder)
        .eq("estado", "pendiente"); // no pisa una ya confirmada/cancelada
    } else if (status === FLOW_STATUS.RECHAZADA || status === FLOW_STATUS.ANULADA) {
      await supabase
        .from("reservas")
        .update({ estado: "cancelada", flow_order: String(token) })
        .eq("id", commerceOrder)
        .eq("estado", "pendiente");
    }
    // status PENDIENTE: se deja como estaba, Flow volverá a avisar.

    return new Response("ok", { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error(err);
    // Igual respondemos 200: si devolvemos error, Flow reintenta en bucle.
    return new Response("ok", { status: 200, headers: CORS_HEADERS });
  }
});
