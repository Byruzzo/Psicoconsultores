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
    <div id="modalidad" className="h-full flex flex-col">
      <div className="text-center mb-8">
        <span className="glass-pill inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-lavender-600 dark:text-lavender-300 mb-4">
          Cómo atenderte
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
          Atención 100% online
        </h2>
      </div>

      <div className="glass-strong rounded-[2rem] p-8 flex flex-col gap-6 flex-1">
        <span className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-lavender-500 to-lavender-400 shadow-lavender-500/30">
          <Video className="w-8 h-8" />
        </span>
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
            Terapia Online
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
            Sesiones por videollamada desde donde estés, con la misma calidad que una sesión presencial.
          </p>
          <ul className="grid gap-y-3">
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
  );
};

export default Modalidades;
