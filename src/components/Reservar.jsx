import React from "react";
import { CreditCard, CalendarCheck, ArrowRight, Info } from "lucide-react";

// Placeholders — reemplazar por los links reales:
// - Links de pago: Mercado Pago (dashboard → Tu negocio → Cobros → Link de pago)
const MERCADOPAGO_LINK_INDIVIDUAL = "https://mpago.la/tu-link-sesion-individual";
const MERCADOPAGO_LINK_PAREJA = "https://mpago.la/tu-link-sesion-pareja";
const GOOGLE_CALENDAR_BOOKING_LINK = "https://calendar.app.google/Xo3LxzuAGjwUrocUA";

const planes = [
  {
    title: "Sesión Individual",
    price: "$XX.000",
    mercadoPagoLink: MERCADOPAGO_LINK_INDIVIDUAL,
    accent: "lavender",
  },
  {
    title: "Terapia de Pareja",
    price: "$XX.000",
    mercadoPagoLink: MERCADOPAGO_LINK_PAREJA,
    accent: "sage",
  },
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
            Pagá y elegí tu horario
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Dos pasos: primero pagás la sesión, después elegís el horario que más te acomode.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {planes.map((plan) => (
            <div key={plan.title} className="glass-strong rounded-[2rem] p-8">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">{plan.title}</h3>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">{plan.price}</p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                      plan.accent === "lavender" ? "bg-lavender-500" : "bg-sage-500"
                    }`}
                  >
                    1
                  </span>
                  <a
                    href={plan.mercadoPagoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 flex items-center justify-between gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all ${
                      plan.accent === "lavender"
                        ? "bg-gradient-to-r from-lavender-500 to-lavender-400 text-white shadow-lg shadow-lavender-500/25 hover:-translate-y-0.5"
                        : "bg-gradient-to-r from-sage-500 to-sage-400 text-white shadow-lg shadow-sage-500/25 hover:-translate-y-0.5"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Pagar con Mercado Pago
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </span>
                  <a
                    href={GOOGLE_CALENDAR_BOOKING_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-between gap-2 px-5 py-3.5 rounded-xl font-bold text-sm glass-pill text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4" /> Elegir horario
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-5 mt-8 flex items-start gap-3 max-w-2xl mx-auto">
          <Info className="w-5 h-5 text-lavender-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Reservá tu horario con el mismo nombre con el que pagaste, así queda fácil de
            verificar. Vas a recibir la invitación con el link de Google Meet directo a tu correo.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Reservar;
