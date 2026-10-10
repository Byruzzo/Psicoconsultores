// Supabase Edge Function PUBLICA: es el "urlReturn" que le pasamos a Flow al
// crear la orden de pago. Flow redirige acá al pagador con un POST (no GET)
// cuando termina o cancela el pago -- el sitio es estático (Vercel) y no
// acepta POST en una ruta cualquiera, así que esta función recibe ese POST,
// identifica la reserva por el token de Flow, y hace un redirect 302 (GET)
// de vuelta al sitio con el id de la reserva en el hash, que es lo que
// entiende el wizard en Reservar.jsx.
//
// (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase automaticamente)
// Deploy: supabase functions deploy volver-pago --no-verify-jwt

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const SITE_URL = "https://psicoconsultores.vercel.app"; // TODO: actualizar si cambia el dominio

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });

  let token: string | null = null;
  try {
    if (req.method === "POST") {
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
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
    } else {
      const url = new URL(req.url);
      token = url.searchParams.get("token");
    }
  } catch (err) {
    console.error(err);
  }

  // Importante: el hash tiene que resolver a la ruta "/" (la que
  // efectivamente existe en el HashRouter) -- "#reservar?..." no matchea
  // ninguna ruta y el catch-all del router redirige a "/" borrando el
  // query antes de que Reservar.jsx llegue a leerlo.
  let destino = `${SITE_URL}/#/`;

  if (token) {
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      const { data: reserva } = await supabase
        .from("reservas")
        .select("id")
        .eq("flow_token", token)
        .single();
      if (reserva) destino = `${SITE_URL}/#/?reserva=${reserva.id}`;
    } catch (err) {
      console.error(err);
    }
  }

  return new Response(null, {
    status: 302,
    headers: { ...CORS_HEADERS, Location: destino },
  });
});
