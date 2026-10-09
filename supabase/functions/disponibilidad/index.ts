// Supabase Edge Function PUBLICA: devuelve los horarios libres de Carla
// para los próximos dias, cruzando:
//   1. La disponibilidad semanal fija (configurada acá abajo).
//   2. Lo que ya está ocupado en su Google Calendar real (freeBusy).
//   3. Las reservas "pendiente" recientes (<15 min) y "confirmada" en
//      nuestra propia tabla (para no ofrecer un horario que alguien ya
//      está pagando en este momento).
//
// Secretos requeridos: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
// (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase automaticamente)
// Deploy: supabase functions deploy disponibilidad --no-verify-jwt

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getBusyPeriods, santiagoWallTimeToUTC } from "../_shared/google-calendar.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });

// TODO: confirmar con Carla si estos bloques son correctos (hoy: lunes y
// miércoles 18-21h en punto, sábado 10-12h). getDay(): 0=domingo..6=sábado.
const DISPONIBILIDAD_SEMANAL: Record<number, string[]> = {
  1: ["18:00", "19:00", "20:00", "21:00"], // Lunes
  3: ["18:00", "19:00", "20:00", "21:00"], // Miércoles
  6: ["10:00", "11:00", "12:00"], // Sábado
};
const DURACION_MINUTOS = 45;
const DIAS_A_MOSTRAR = 21; // tres semanas hacia adelante
const MINUTOS_EXPIRACION_PENDIENTE = 15;

function seSuperponen(aInicio: Date, aFin: Date, bInicio: Date, bFin: Date) {
  return aInicio < bFin && bInicio < aFin;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== "GET") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const ahora = new Date();
    const hasta = new Date(ahora.getTime() + DIAS_A_MOSTRAR * 24 * 60 * 60 * 1000);

    // 1. Ocupado en Google Calendar.
    const busy = await getBusyPeriods(ahora.toISOString(), hasta.toISOString());
    const busyPeriods = busy.map((b) => ({ inicio: new Date(b.start), fin: new Date(b.end) }));

    // 2. Reservas propias que ya ocupan un horario (confirmadas, o
    //    pendientes recientes que todavía pueden convertirse en pago).
    const limiteExpiracion = new Date(ahora.getTime() - MINUTOS_EXPIRACION_PENDIENTE * 60 * 1000);
    const { data: reservas, error } = await supabase
      .from("reservas")
      .select("inicio, fin, estado, created_at")
      .gte("inicio", ahora.toISOString())
      .lte("inicio", hasta.toISOString())
      .in("estado", ["pendiente", "confirmada"]);
    if (error) throw error;

    const reservasOcupan = (reservas ?? []).filter(
      (r) => r.estado === "confirmada" || new Date(r.created_at) > limiteExpiracion,
    );

    // 3. Genera los bloques de la disponibilidad semanal fija y descarta
    //    los que se superponen con algo ocupado.
    const dias: { fecha: string; horarios: string[] }[] = [];
    for (let i = 0; i < DIAS_A_MOSTRAR; i++) {
      const dia = new Date(ahora.getTime() + i * 24 * 60 * 60 * 1000);
      const horariosDelDia = DISPONIBILIDAD_SEMANAL[dia.getDay()];
      if (!horariosDelDia) continue;

      const horariosLibres: string[] = [];
      for (const horaTexto of horariosDelDia) {
        const [hh, mm] = horaTexto.split(":").map(Number);
        const inicio = santiagoWallTimeToUTC(
          dia.getFullYear(),
          dia.getMonth() + 1,
          dia.getDate(),
          hh,
          mm,
        );
        if (inicio <= ahora) continue; // no ofrecer horarios ya pasados
        const fin = new Date(inicio.getTime() + DURACION_MINUTOS * 60 * 1000);

        const ocupado =
          busyPeriods.some((b) => seSuperponen(inicio, fin, b.inicio, b.fin)) ||
          reservasOcupan.some((r) =>
            seSuperponen(inicio, fin, new Date(r.inicio), new Date(r.fin)),
          );
        if (!ocupado) horariosLibres.push(inicio.toISOString());
      }

      if (horariosLibres.length > 0) {
        dias.push({
          fecha: `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, "0")}-${String(dia.getDate()).padStart(2, "0")}`,
          horarios: horariosLibres,
        });
      }
    }

    return jsonResponse({ duracionMinutos: DURACION_MINUTOS, dias }, 200);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "No se pudo calcular la disponibilidad" }, 500);
  }
});
