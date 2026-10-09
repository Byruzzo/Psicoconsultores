import React from "react";
import { GraduationCap, BookOpen, ClipboardCheck, Languages } from "lucide-react";

const capacitaciones = [
  {
    icon: GraduationCap,
    title: "Título Profesional de Psicóloga",
    institucion: "Universidad Central de Chile",
    desc: "Formación universitaria enfocada en la atención clínica de adultos, con énfasis en psicoterapia breve.",
  },
  {
    icon: BookOpen,
    title: "Diplomado en Psicopatología Infanto Juvenil",
    institucion: "Universidad de Chile",
    desc: "Profundización en la comprensión y abordaje de cuadros psicopatológicos en niños, niñas y adolescentes.",
  },
  {
    icon: ClipboardCheck,
    title: "Curso en Gestión en Calidad de Salud",
    institucion: "Universidad Adolfo Ibáñez",
    desc: "Herramientas de gestión, mejora continua y cumplimiento normativo aplicadas a procesos de salud.",
  },
  {
    icon: Languages,
    title: "Inglés Avanzado",
    institucion: "Dublin Cultural Institute",
    desc: "Disponibilidad para realizar sesiones de terapia en inglés.",
  },
];

const Capacitacion = () => {
  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="glass-pill inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-sage-600 dark:text-sage-300 mb-4">
            Formación
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Capacitación Profesional
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
          {capacitaciones.map(({ icon: Icon, title, institucion, desc }) => (
            <div key={title} className="glass rounded-3xl p-6 md:p-7">
              <div className="flex items-start gap-4 mb-3">
                <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lavender-400 to-sage-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-lavender-500/20">
                  <Icon className="w-6 h-6" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
                    {title}
                  </h3>
                  <span className="inline-block mt-1.5 text-[11px] font-bold tracking-wide uppercase text-lavender-600 dark:text-lavender-300">
                    {institucion}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Capacitacion;
