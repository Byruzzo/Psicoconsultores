import React, { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";

// Botón flotante que acompaña el scroll para que agendar una hora esté
// siempre a mano. Aparece después del Hero (ya pasó el botón grande de
// "Agendar mi hora") y se oculta mientras la sección de reserva está a la
// vista, para no taparla ni duplicarse con sus propios botones.
const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const heroEl = document.getElementById("inicio");
      const reservarEl = document.getElementById("reservar");

      const pasoElHero = window.scrollY > (heroEl?.offsetHeight ?? 500) * 0.6;

      let dentroDeReservar = false;
      if (reservarEl) {
        const rect = reservarEl.getBoundingClientRect();
        dentroDeReservar = rect.top < window.innerHeight * 0.6 && rect.bottom > 0;
      }

      setVisible(pasoElHero && !dentroDeReservar);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      onClick={() => document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth", block: "start" })}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 z-40 flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-lavender-500 to-lavender-400 text-white font-bold text-sm shadow-xl shadow-lavender-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <CalendarCheck className="w-4 h-4" />
      Agenda aquí
    </button>
  );
};

export default FloatingCTA;
