// Helper compartido para hablar con la Google Calendar API usando el
// refresh token de la cuenta de Carla (OAuth2 de usuario, no Service Account
// -- su cuenta es Gmail normal, no Workspace).
//
// Secretos requeridos (ver supabase secrets set):
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const CALENDAR_ID = "primary"; // el calendario principal de la cuenta duena del refresh token

export async function getGoogleAccessToken(): Promise<string> {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Faltan GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN");
  }

  const resp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!resp.ok) {
    throw new Error(`No se pudo refrescar el token de Google: ${resp.status} ${await resp.text()}`);
  }
  const data = await resp.json();
  return data.access_token as string;
}

// Devuelve los intervalos ocupados del calendario entre timeMin y timeMax (ISO 8601).
export async function getBusyPeriods(
  timeMin: string,
  timeMax: string,
): Promise<{ start: string; end: string }[]> {
  const accessToken = await getGoogleAccessToken();
  const resp = await fetch(`${CALENDAR_API}/freeBusy`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: CALENDAR_ID }] }),
  });
  if (!resp.ok) {
    throw new Error(`freeBusy falló: ${resp.status} ${await resp.text()}`);
  }
  const data = await resp.json();
  return data.calendars?.[CALENDAR_ID]?.busy ?? [];
}

// Crea el evento con Google Meet e invita al paciente. Devuelve el id del
// evento y el link de Meet.
export async function crearEventoConMeet(opts: {
  summary: string;
  description: string;
  startISO: string;
  endISO: string;
  attendeeEmail: string;
}): Promise<{ eventId: string; meetLink: string | null }> {
  const accessToken = await getGoogleAccessToken();
  const requestId = crypto.randomUUID();

  const resp = await fetch(
    `${CALENDAR_API}/calendars/${CALENDAR_ID}/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: opts.summary,
        description: opts.description,
        start: { dateTime: opts.startISO },
        end: { dateTime: opts.endISO },
        attendees: [{ email: opts.attendeeEmail }],
        conferenceData: {
          createRequest: {
            requestId,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      }),
    },
  );
  if (!resp.ok) {
    throw new Error(`No se pudo crear el evento: ${resp.status} ${await resp.text()}`);
  }
  const data = await resp.json();
  return {
    eventId: data.id as string,
    meetLink: data.hangoutLink ?? null,
  };
}

// --- Utilidad de zona horaria ---
// Convierte una fecha/hora "de pared" en America/Santiago (ej. 2026-10-12 18:00)
// a un Date UTC correcto, sin depender de que el runtime tenga el offset
// hardcodeado (Chile cambia de horario de verano a estándar durante el año).
export function santiagoWallTimeToUTC(year: number, month: number, day: number, hour: number, minute: number): Date {
  const TIME_ZONE = "America/Santiago";
  // Partimos de un Date asumiendo UTC y medimos cuánto se corre al formatearlo
  // en la zona horaria de Chile; con eso corregimos una sola vez (suficiente
  // porque el offset es constante en el rango de minutos que nos separa).
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(dtf.formatToParts(guess).map((p) => [p.type, p.value]));
  const asIfLocal = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) === 24 ? 0 : Number(parts.hour),
    Number(parts.minute),
  );
  const diffMs = guess.getTime() - asIfLocal;
  return new Date(guess.getTime() + diffMs);
}
