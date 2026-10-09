import React, { useEffect, useState } from "react";
import { CalendarCheck, MessagesSquare, TrendingUp } from "lucide-react";

const pasos = [
  {
    icon: CalendarCheck,
    title: "Agenda tu hora",
    desc: "Elegí tu horario en el calendario y confirmá tu sesión con el pago.",
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

// Transform de cada tarjeta según su posición relativa a la que está
// adelante (0 = adelante, 1 = atrás-derecha, 2 = atrás-izquierda).
const estilosPorPosicion = [
  { zIndex: 30, opacity: 1, transform: "translate(-50%, -50%) scale(1) rotate(0deg)" },
  {
    zIndex: 20,
    opacity: 0.85,
    transform: "translate(calc(-50% + 78px), calc(-50% + 26px)) scale(0.92) rotate(7deg)",
  },
  {
    zIndex: 10,
    opacity: 0.6,
    transform: "translate(calc(-50% - 78px), calc(-50% + 40px)) scale(0.85) rotate(-7deg)",
  },
];

const Proceso = () => {
  const [frente, setFrente] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrente((f) => (f + 1) % pasos.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

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

        <div className="relative h-[400px] sm:h-[420px] max-w-sm mx-auto">
          {pasos.map(({ icon: Icon, title, desc }, i) => {
            const posicion = (i - frente + pasos.length) % pasos.length;
            const estilo = estilosPorPosicion[posicion];
            return (
              <button
                key={title}
                onClick={() => setFrente(i)}
                aria-label={`Ver paso ${i + 1}: ${title}`}
                className={`glass-strong absolute top-1/2 left-1/2 w-[260px] sm:w-[290px] rounded-[2.5rem] p-7 sm:p-8 text-center flex flex-col items-center transition-all duration-700 ease-out cursor-pointer ${
                  posicion === 0 ? "animate-[float_6s_ease-in-out_infinite]" : ""
                }`}
                style={estilo}
              >
                <span className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lavender-400 to-sage-400 text-white flex items-center justify-center mb-5 shadow-lg shadow-lavender-500/25 relative shrink-0">
                  <Icon className="w-7 h-7" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 text-lavender-600 dark:text-lavender-300 text-xs font-extrabold flex items-center justify-center border border-lavender-200 dark:border-lavender-500/30">
                    {i + 1}
                  </span>
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {pasos.map((_, i) => (
            <button
              key={i}
              onClick={() => setFrente(i)}
              aria-label={`Ir al paso ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === frente ? "w-6 bg-lavender-500" : "w-2 bg-lavender-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Proceso;
