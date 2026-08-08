import React from "react";
import { GraduationCap, BadgeCheck, Clock } from "lucide-react";

const credenciales = [
  {
    icon: GraduationCap,
    label: "Universidad Placeholder",
    sub: "Lic. en Psicología",
  },
  {
    icon: BadgeCheck,
    label: "Registro N° 000000",
    sub: "Superintendencia de Salud",
  },
  {
    icon: Clock,
    label: "+X años",
    sub: "de experiencia clínica",
  },
];

const SobreMi = () => {
  return (
    <section id="sobre-mi" className="relative py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-16 items-center">
          <div className="relative mx-auto lg:mx-0 w-[220px] sm:w-[260px]">
            <div className="absolute w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full bg-sage-200/50 dark:bg-sage-500/10 blur-2xl -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="glass-strong aspect-square rounded-[2.5rem] flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-sage-300 via-sage-400 to-lavender-300 dark:from-sage-600 dark:via-sage-500 dark:to-lavender-600 flex items-center justify-center">
                <span className="text-white text-6xl font-extrabold opacity-90 select-none">
                  CR
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <span className="glass-pill inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-lavender-600 dark:text-lavender-300">
              Sobre mí
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Carla Ruz, Psicóloga
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Texto de biografía placeholder. Aquí va una presentación breve
              sobre el enfoque terapéutico, la trayectoria profesional y la
              forma de trabajo con los pacientes. Se puede mencionar el
              modelo teórico utilizado, la población con la que se trabaja
              (adultos, adolescentes) y qué hace distinto el acompañamiento
              que ofrece.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              {credenciales.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="glass rounded-2xl p-4 flex flex-col gap-2">
                  <span className="w-9 h-9 rounded-full bg-lavender-100 dark:bg-lavender-500/20 text-lavender-600 dark:text-lavender-300 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreMi;
