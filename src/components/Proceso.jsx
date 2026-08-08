import React from "react";
import { CalendarCheck, MessagesSquare, TrendingUp } from "lucide-react";

const pasos = [
  {
    icon: CalendarCheck,
    title: "Agenda tu hora",
    desc: "Escríbeme por WhatsApp o completa el formulario de contacto para coordinar día y horario.",
  },
  {
    icon: MessagesSquare,
    title: "Primera sesión",
    desc: "Conversamos sobre lo que te trae a terapia y definimos juntos los objetivos del proceso.",
  },
  {
    icon: TrendingUp,
    title: "Plan terapéutico",
    desc: "Avanzamos con sesiones periódicas, revisando tu progreso y ajustando el enfoque cuando sea necesario.",
  },
];

const Proceso = () => {
  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="glass-pill inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-sage-600 dark:text-sage-300 mb-4">
            Proceso
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Así trabajamos juntos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-lavender-300 via-sage-300 to-lavender-300 dark:from-lavender-500/30 dark:via-sage-500/30 dark:to-lavender-500/30" />
          {pasos.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative glass rounded-3xl p-7 text-center flex flex-col items-center">
              <span className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lavender-400 to-sage-400 text-white flex items-center justify-center mb-5 shadow-lg shadow-lavender-500/25 text-xl font-extrabold relative">
                <Icon className="w-7 h-7" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 text-lavender-600 dark:text-lavender-300 text-xs font-extrabold flex items-center justify-center border border-lavender-200 dark:border-lavender-500/30">
                  {i + 1}
                </span>
              </span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Proceso;
