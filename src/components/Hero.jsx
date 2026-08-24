import React from "react";
import { Video, MapPin, ShieldCheck, Clock3, ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "56900000000"; // Placeholder — reemplazar por el número real de Carla
const WHATSAPP_MESSAGE = "Hola Carla, quisiera agendar una hora de terapia.";

const HeroAvatar = () => (
  <div className="relative w-full flex items-center justify-center">
    <div className="absolute w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-br from-lavender-200/60 to-sage-200/60 dark:from-lavender-500/10 dark:to-sage-500/10 blur-2xl -z-10" />

    <div className="glass-strong relative w-[240px] h-[300px] sm:w-[280px] sm:h-[350px] md:w-[320px] md:h-[400px] rounded-[2.5rem] overflow-hidden animate-[float_6s_ease-in-out_infinite]">
      <div className="w-full h-full bg-gradient-to-br from-lavender-300 via-lavender-400 to-sage-300 dark:from-lavender-600 dark:via-lavender-500 dark:to-sage-600 flex items-center justify-center">
        <span className="text-white text-7xl md:text-8xl font-extrabold tracking-tight opacity-90 select-none">
          CR
        </span>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/30 to-transparent">
        <p className="text-white font-semibold text-sm">Foto profesional próximamente</p>
      </div>
    </div>

    <div className="glass absolute -bottom-4 -left-2 sm:left-4 md:-left-6 rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-lg">
      <span className="w-9 h-9 rounded-full bg-sage-100 dark:bg-sage-500/20 text-sage-600 dark:text-sage-300 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </span>
      <div className="leading-tight">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">100% confidencial</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">Secreto profesional</p>
      </div>
    </div>
  </div>
);

const Hero = () => {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <section
      id="inicio"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-48 lg:pb-32 overflow-hidden"
    >
      {/* Blobs de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[420px] h-[420px] bg-lavender-200/50 dark:bg-lavender-500/10 rounded-full blur-3xl -z-10 animate-[blobMove_18s_ease-in-out_infinite]" />
      <div className="absolute top-[10%] right-[-10%] w-[380px] h-[380px] bg-sage-200/50 dark:bg-sage-500/10 rounded-full blur-3xl -z-10 animate-[blobMove_22s_ease-in-out_infinite]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-center">
          <div className="text-left space-y-6 md:space-y-8">
            <div className="flex flex-wrap gap-2">
              <span className="glass-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-lavender-600 dark:text-lavender-300">
                <Video className="w-3.5 h-3.5" /> Atención Online
              </span>
              <span className="glass-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-sage-600 dark:text-sage-300">
                <MapPin className="w-3.5 h-3.5" /> Atención Presencial
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Un espacio para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender-500 to-sage-500">
                entenderte
              </span>{" "}
              y sentirte mejor.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-lg">
              Psicoterapia individual para adultos, con un enfoque cercano y
              profesional. Sesiones online o presenciales, adaptadas a tu
              ritmo y tus necesidades.
            </p>

            <div className="pt-2 md:pt-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-center">
                <button
                  onClick={() => {
                    const el = document.getElementById("reservar");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-lavender-500 to-lavender-400 hover:from-lavender-600 hover:to-lavender-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-lavender-500/30 transition-all transform hover:-translate-y-1 hover:scale-[1.02] flex items-center justify-center gap-3 animate-[pulseGlow_2.5s_ease-in-out_infinite]"
                >
                  Agendar mi hora
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById("sobre-mi");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="px-6 md:px-7 py-3 md:py-4 glass-pill text-slate-600 dark:text-slate-300 font-medium text-sm md:text-base rounded-2xl hover:text-slate-800 dark:hover:text-slate-100 transition-all flex items-center justify-center gap-2"
                >
                  Conocer más
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pl-1">
                <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <Clock3 className="w-4 h-4 text-lavender-500" />
                  Sesiones de 50 minutos
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-lavender-600 dark:text-lavender-300 hover:underline"
                >
                  ¿Preguntas? Escribime por WhatsApp
                </a>
              </div>
            </div>
          </div>

          <HeroAvatar />
        </div>
      </div>
    </section>
  );
};

export default Hero;
