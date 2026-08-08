import React from "react";
import { Quote } from "lucide-react";

const testimonios = [
  {
    texto:
      "Placeholder de testimonio. Aquí un paciente cuenta brevemente cómo le ayudó el proceso terapéutico.",
    nombre: "Paciente A.",
    detalle: "Terapia individual",
  },
  {
    texto:
      "Placeholder de testimonio. Un comentario sobre la cercanía y profesionalismo durante las sesiones.",
    nombre: "Paciente B.",
    detalle: "Terapia de pareja",
  },
  {
    texto:
      "Placeholder de testimonio. Sobre la comodidad de la modalidad online y la flexibilidad de horarios.",
    nombre: "Paciente C.",
    detalle: "Terapia individual",
  },
];

const Testimonios = () => {
  return (
    <section id="testimonios" className="relative py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="glass-pill inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-sage-600 dark:text-sage-300 mb-4">
            Testimonios
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Lo que dicen quienes ya se atendieron
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonios.map((t) => (
            <div key={t.nombre} className="glass rounded-3xl p-7 flex flex-col">
              <Quote className="w-8 h-8 text-lavender-300 dark:text-lavender-500/50 mb-4" />
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 flex-1">
                {t.texto}
              </p>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{t.nombre}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.detalle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonios;
