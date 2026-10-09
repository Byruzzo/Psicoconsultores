import React from "react";
import { Video, Check } from "lucide-react";

const bullets = [
  "Plataforma segura y confidencial",
  "Sin traslados, desde cualquier lugar de Chile",
  "Ideal para agendas ocupadas",
  "Misma calidad que una sesión presencial",
];

const Modalidades = () => {
  return (
    <section id="modalidad" className="relative py-20 md:py-28">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lavender-100/40 dark:bg-lavender-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="glass-pill inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-lavender-600 dark:text-lavender-300 mb-4">
            Cómo atenderte
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Atención 100% online
          </h2>
        </div>

        <div className="glass-strong rounded-[2rem] p-8 md:p-10 grid sm:grid-cols-[auto_1fr] gap-8 items-center">
          <span className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-lavender-500 to-lavender-400 shadow-lavender-500/30 mx-auto sm:mx-0">
            <Video className="w-8 h-8" />
          </span>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 text-center sm:text-left">
              Terapia Online
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-5 leading-relaxed text-center sm:text-left">
              Sesiones por videollamada desde donde estés, con la misma calidad que una sesión presencial.
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-lavender-500" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Modalidades;
