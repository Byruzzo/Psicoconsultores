import React from "react";
import { Landmark, Mail, Info, ExternalLink } from "lucide-react";

// Horario de reservas de Google Calendar (se incrusta en la página).
const GOOGLE_CALENDAR_BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3LTrhsV1ZbUERxxuw-6y6HGnY61PJmEUpN0f9eNy4cX_armVzCKcUIerNt8KSPCewBorx38IDu";
const GOOGLE_CALENDAR_EMBED_SRC = `${GOOGLE_CALENDAR_BOOKING_URL}?gv=true`;

const CONTACT_EMAIL = "psiconsultoresruz@gmail.com";

const CUENTA = {
  banco: "Banco de Chile",
  tipo: "Cuenta FAN",
  numero: "00-002-08262-82",
  rut: "19.184.909-4",
  nombre: "Carla Ruz Pardo",
};

const planes = [
  { title: "Sesión Individual", price: "$25.000" },
  { title: "Terapia de Pareja", price: "$XX.000" },
];

const Reservar = () => {
  return (
    <section id="reservar" className="relative py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="glass-pill inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-lavender-600 dark:text-lavender-300 mb-4">
            Reservar hora
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Elegí tu horario y confirmá con el pago
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Dos pasos: primero elegís el horario que más te acomode, después confirmás con el pago.
          </p>
        </div>

        {/* Paso 1: agenda incrustada */}
        <div className="glass-strong rounded-[2rem] p-4 sm:p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-lavender-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Elegí tu horario</h3>
            </div>
            <a
              href={GOOGLE_CALENDAR_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-lavender-600 dark:text-lavender-300 hover:underline"
            >
              Abrir en una pestaña nueva <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/50 dark:border-white/10 bg-white dark:bg-slate-900">
            <iframe
              src={GOOGLE_CALENDAR_EMBED_SRC}
              title="Selecciona un horario para tu sesión"
              width="100%"
              height="600"
              style={{ border: 0 }}
            />
          </div>
        </div>

        {/* Paso 2: pago para confirmar */}
        <div className="glass-strong rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-xs shrink-0">
              2
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Confirmá tu sesión con el pago</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {planes.map((plan) => (
              <div key={plan.title} className="glass rounded-2xl p-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{plan.title}</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Landmark className="w-5 h-5 text-lavender-500" />
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Datos para transferencia</p>
            </div>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex justify-between sm:block">
                <dt className="text-slate-500 dark:text-slate-400">Banco</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">{CUENTA.banco}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-slate-500 dark:text-slate-400">Tipo de cuenta</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">{CUENTA.tipo}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-slate-500 dark:text-slate-400">N° de cuenta</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">{CUENTA.numero}</dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-slate-500 dark:text-slate-400">RUT</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">{CUENTA.rut}</dd>
              </div>
              <div className="flex justify-between sm:block sm:col-span-2">
                <dt className="text-slate-500 dark:text-slate-400">Nombre</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100">{CUENTA.nombre}</dd>
              </div>
            </dl>
          </div>

          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Comprobante de transferencia")}`}
            className="mt-4 flex items-center justify-between gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-lavender-500 to-lavender-400 text-white shadow-lg shadow-lavender-500/25 hover:-translate-y-0.5 transition-all"
          >
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> Enviar comprobante por correo
            </span>
          </a>
        </div>

        <div className="glass rounded-2xl p-5 mt-8 flex items-start gap-3 max-w-2xl mx-auto">
          <Info className="w-5 h-5 text-lavender-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Tu hora queda confirmada al enviar el comprobante de la transferencia. Mandalo junto
            con el horario que elegiste a {CONTACT_EMAIL}.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Reservar;
