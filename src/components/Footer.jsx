import React from "react";
import { Mail, MapPin, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="relative pt-16 pb-8 border-t border-white/40 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-lavender-400 to-sage-400 flex items-center justify-center text-white font-bold text-xs">
                CR
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Carla Ruz
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Psicoterapia individual y de pareja, online y presencial, con un
              enfoque cercano y profesional.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Navegación</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <button onClick={() => scrollTo("sobre-mi")} className="hover:text-lavender-600 dark:hover:text-lavender-300 transition-colors">
                  Sobre mí
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("especialidades")} className="hover:text-lavender-600 dark:hover:text-lavender-300 transition-colors">
                  Especialidades
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("precios")} className="hover:text-lavender-600 dark:hover:text-lavender-300 transition-colors">
                  Precios
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("reservar")} className="hover:text-lavender-600 dark:hover:text-lavender-300 transition-colors">
                  Reservar hora
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("preguntas")} className="hover:text-lavender-600 dark:hover:text-lavender-300 transition-colors">
                  Preguntas frecuentes
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href="/#/privacidad" className="hover:text-lavender-600 dark:hover:text-lavender-300 transition-colors">
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 mb-6">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-lavender-500" />
                contacto@placeholder.cl
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-lavender-500" />
                Santiago, Chile
              </li>
            </ul>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-lavender-600 dark:hover:text-lavender-300 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-lavender-600 dark:hover:text-lavender-300 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/40 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © {currentYear} Carla Ruz · Psicóloga. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
