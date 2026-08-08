import React from "react";
import { Video, MapPin, Check } from "lucide-react";

const modalidades = [
  {
    icon: Video,
    title: "Terapia Online",
    accent: "lavender",
    desc: "Sesiones por videollamada desde donde estés, con la misma calidad que una sesión presencial.",
    bullets: [
      "Plataforma segura y confidencial",
      "Sin traslados, mismo horario",
      "Ideal para agendas ocupadas",
    ],
  },
  {
    icon: MapPin,
    title: "Terapia Presencial",
    accent: "sage",
    desc: "Un espacio cómodo y privado para quienes prefieren la atención cara a cara.",
    bullets: [
      "Consulta particular (dirección placeholder)",
      "Ambiente cálido y confidencial",
      "Fácil acceso y estacionamiento",
    ],
  },
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
            Elige la modalidad que prefieras
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {modalidades.map(({ icon: Icon, title, desc, bullets, accent }) => (
            <div key={title} className="glass-strong rounded-[2rem] p-8 md:p-10">
              <span
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg ${
                  accent === "lavender"
                    ? "bg-gradient-to-br from-lavender-500 to-lavender-400 shadow-lavender-500/30"
                    : "bg-gradient-to-br from-sage-500 to-sage-400 shadow-sage-500/30"
                }`}
              >
                <Icon className="w-7 h-7" />
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
                {title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{desc}</p>
              <ul className="space-y-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        accent === "lavender" ? "text-lavender-500" : "text-sage-500"
                      }`}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Modalidades;
