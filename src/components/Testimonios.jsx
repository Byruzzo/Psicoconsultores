import React from "react";
import { Quote } from "lucide-react";

// Comentarios de ejemplo (placeholder) — reemplazar por testimonios reales
// de pacientes, con su autorización, antes de publicar el sitio.
const testimonios = [
  {
    texto: "Sentí mucha cercanía desde la primera sesión, me ayudó a ordenar lo que estaba viviendo.",
    nombre: "Javiera M.",
    detalle: "Terapia individual",
  },
  {
    texto: "Pude trabajar el estrés del trabajo con herramientas prácticas para el día a día.",
    nombre: "Tomás R.",
    detalle: "Terapia individual",
  },
  {
    texto: "La modalidad online hizo mucho más fácil mantener la constancia en el proceso.",
    nombre: "Camila S.",
    detalle: "Terapia individual",
  },
  {
    texto: "Profesional y muy empática, me sentí escuchado en todo momento.",
    nombre: "Matías F.",
    detalle: "Terapia individual",
  },
  {
    texto: "Me ayudó a entender patrones que venía repitiendo hace años.",
    nombre: "Antonia V.",
    detalle: "Terapia individual",
  },
  {
    texto: "Agendar y tener la sesión por videollamada fue simple y cómodo.",
    nombre: "Benjamín L.",
    detalle: "Terapia individual",
  },
  {
    texto: "Un espacio donde realmente pude bajar la guardia y avanzar.",
    nombre: "Francisca P.",
    detalle: "Terapia individual",
  },
  {
    texto: "Un proceso breve y enfocado, justo lo que necesitaba.",
    nombre: "Diego A.",
    detalle: "Terapia individual",
  },
  {
    texto: "Me ayudó a manejar la ansiedad con herramientas que uso hasta hoy.",
    nombre: "Valentina C.",
    detalle: "Terapia individual",
  },
  {
    texto: "Horarios flexibles y un trato siempre cercano y profesional.",
    nombre: "Ignacio H.",
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
      </div>

      <div className="max-w-[100vw] overflow-x-auto px-4 sm:px-6 lg:px-8 [scrollbar-width:thin] snap-x snap-mandatory">
        <div className="flex gap-5 w-max mx-auto pb-4">
          {testimonios.map((t, i) => (
            <div
              key={`${t.nombre}-${i}`}
              className="glass rounded-3xl p-7 flex flex-col w-[280px] shrink-0 snap-start"
            >
              <Quote className="w-8 h-8 text-lavender-300 dark:text-lavender-500/50 mb-4" />
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 flex-1 text-sm">
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
