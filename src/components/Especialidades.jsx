import React from "react";
import { Brain, CloudRain, HeartHandshake, Sparkles, HeartCrack, Waves } from "lucide-react";

const especialidades = [
  {
    icon: Brain,
    title: "Ansiedad",
    desc: "Manejo de crisis, preocupación excesiva y pensamientos rumiantes.",
  },
  {
    icon: CloudRain,
    title: "Depresión",
    desc: "Acompañamiento en procesos de ánimo bajo y pérdida de motivación.",
  },
  {
    icon: HeartHandshake,
    title: "Terapia de pareja",
    desc: "Comunicación, conflictos y reconstrucción del vínculo.",
  },
  {
    icon: Sparkles,
    title: "Autoestima",
    desc: "Fortalecimiento de la relación contigo mismo/a y tus límites.",
  },
  {
    icon: HeartCrack,
    title: "Duelo",
    desc: "Acompañamiento en procesos de pérdida y cierre de etapas.",
  },
  {
    icon: Waves,
    title: "Estrés",
    desc: "Herramientas para la sobrecarga laboral y emocional del día a día.",
  },
];

const Especialidades = () => {
  return (
    <section id="especialidades" className="relative py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="glass-pill inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-sage-600 dark:text-sage-300 mb-4">
            Áreas de trabajo
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Especialidades
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Un espacio de escucha profesional para distintos momentos de tu vida.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {especialidades.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass rounded-3xl p-6 md:p-7 hover:-translate-y-1 hover:glass-strong transition-all duration-300"
            >
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lavender-400 to-sage-400 text-white flex items-center justify-center mb-4 shadow-md shadow-lavender-500/20">
                <Icon className="w-6 h-6" />
              </span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1.5">
                {title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Especialidades;
