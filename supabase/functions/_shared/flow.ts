// Helper compartido para hablar con la API REST de Flow (flow.cl).
// Documentación: https://www.flow.cl/docs/api.html
//
// Secretos requeridos:
//   FLOW_API_KEY, FLOW_SECRET_KEY
//   FLOW_BASE_URL (opcional) — por defecto apunta a sandbox. Para pasar a
//   producción, cambiar a https://www.flow.cl/api (sandbox es
//   https://sandbox.flow.cl/api).

const DEFAULT_BASE_URL = "https://sandbox.flow.cl/api";

function getBaseUrl(): string {
  return Deno.env.get("FLOW_BASE_URL") || DEFAULT_BASE_URL;
}

async function firmar(params: Record<string, string | number>): Promise<string> {
  const secretKey = Deno.env.get("FLOW_SECRET_KEY");
  if (!secretKey) throw new Error("FLOW_SECRET_KEY no configurado");

  const claves = Object.keys(params).sort();
  const toSign = claves.map((k) => `${k}${params[k]}`).join("");

  const keyData = new TextEncoder().encode(secretKey);
  const msgData = new TextEncoder().encode(toSign);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Crea una orden de pago y devuelve la URL a la que hay que redirigir al
// pagador (url + "?token=" + token, como indica la doc de Flow).
export async function crearOrdenDePago(opts: {
  commerceOrder: string;
  subject: string;
  amount: number;
  email: string;
  urlConfirmation: string;
  urlReturn: string;
}): Promise<{ token: string; redirectUrl: string }> {
  const apiKey = Deno.env.get("FLOW_API_KEY");
  if (!apiKey) throw new Error("FLOW_API_KEY no configurado");

  const params: Record<string, string | number> = {
    apiKey,
    commerceOrder: opts.commerceOrder,
    subject: opts.subject,
    currency: "CLP",
    amount: opts.amount,
    email: opts.email,
    urlConfirmation: opts.urlConfirmation,
    urlReturn: opts.urlReturn,
  };
  const s = await firmar(params);

  const body = new URLSearchParams({ ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])), s });

  const resp = await fetch(`${getBaseUrl()}/payment/create`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(`Flow rechazó la orden: ${resp.status} ${JSON.stringify(data)}`);
  }
  return { token: data.token, redirectUrl: `${data.url}?token=${data.token}` };
}

// Estados posibles de PaymentStatus.status según la doc de Flow:
// 1 pendiente de pago, 2 pagada, 3 rechazada, 4 anulada.
export const FLOW_STATUS = { PENDIENTE: 1, PAGADA: 2, RECHAZADA: 3, ANULADA: 4 } as const;

export async function obtenerEstadoPago(token: string): Promise<{
  status: number;
  commerceOrder: string;
  flowOrder: number;
}> {
  const apiKey = Deno.env.get("FLOW_API_KEY");
  if (!apiKey) throw new Error("FLOW_API_KEY no configurado");

  const params: Record<string, string> = { apiKey, token };
  const s = await firmar(params);

  const url = `${getBaseUrl()}/payment/getStatus?${new URLSearchParams({ ...params, s })}`;
  const resp = await fetch(url);
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(`Flow rechazó la consulta de estado: ${resp.status} ${JSON.stringify(data)}`);
  }
  return { status: data.status, commerceOrder: data.commerceOrder, flowOrder: data.flowOrder };
}
