import React from "react";
import { Check, Info } from "lucide-react";

const planes = [
  {
    title: "Sesión Individual",
    price: "$XX.000",
    desc: "Sesión de 50 minutos, online o presencial.",
    features: ["Boleta reembolsable en Isapre", "Agenda flexible", "Seguimiento entre sesiones"],
    highlight: false,
  },
  {
    title: "Terapia de Pareja",
    price: "$XX.000",
    desc: "Sesión de 60 minutos, online o presencial.",
    features: ["Boleta reembolsable en Isapre", "Espacio neutral y guiado", "Herramientas prácticas"],
    highlight: true,
  },
];

const Precios = () => {
  return (
    <section id="precios" className="relative py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="glass-pill inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-lavender-600 dark:text-lavender-300 mb-4">
            Valores
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Precios de sesión
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Valores referenciales — se confirman al agendar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {planes.map((plan) => (
            <div
              key={plan.title}
              className={`rounded-[2rem] p-8 flex flex-col ${
                plan.highlight
                  ? "glass-strong ring-1 ring-lavender-300/60 dark:ring-lavender-500/30"
                  : "glass"
              }`}
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                {plan.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{plan.desc}</p>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
                {plan.price}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-sage-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  const el = document.getElementById("contacto");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`w-full py-3.5 rounded-2xl font-bold transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-r from-lavender-500 to-lavender-400 text-white shadow-lg shadow-lavender-500/25 hover:-translate-y-0.5"
                    : "glass-pill text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-700/80"
                }`}
              >
                Agendar hora
              </button>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-5 mt-8 flex items-start gap-3 max-w-2xl mx-auto">
          <Info className="w-5 h-5 text-lavender-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Las sesiones pueden ser reembolsadas según el plan de tu Isapre. Consulta
            tu porcentaje de cobertura antes de agendar.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Precios;
