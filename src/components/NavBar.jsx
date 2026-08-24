import React, { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  { label: "Inicio", id: "inicio" },
  { label: "Sobre mí", id: "sobre-mi" },
  { label: "Especialidades", id: "especialidades" },
  { label: "Modalidad", id: "modalidad" },
  { label: "Precios", id: "precios" },
  { label: "Reservar", id: "reservar" },
  { label: "Preguntas", id: "preguntas" },
];

const ThemeToggleButton = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      className={`relative flex items-center justify-center rounded-full transition-all ${className}`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out flex justify-center ${
          isScrolled ? "top-2 md:top-4" : "top-4 md:top-6"
        }`}
      >
        <div
          className={`
            relative flex items-center justify-between
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${
              isScrolled
                ? "w-[92%] md:w-[54%] glass-strong py-2 px-4 rounded-2xl"
                : "w-[88%] md:w-[62%] glass py-3 px-6 rounded-3xl"
            }
          `}
        >
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => scrollToSection("inicio")}
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-lavender-400 to-sage-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-lavender-500/20 group-hover:scale-105 transition-transform duration-300">
              CR
            </span>
            <span className="font-bold tracking-tight text-slate-800 dark:text-slate-100 leading-tight">
              Carla Ruz
              <span className="hidden sm:inline font-medium text-slate-500 dark:text-slate-400">
                {" "}
                · Psicóloga
              </span>
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-1 glass-pill p-1 rounded-full">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-full hover:bg-white/70 dark:hover:bg-slate-700/70 hover:text-lavender-600 dark:hover:text-lavender-300 transition-all duration-300"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggleButton className="p-2 text-slate-600 dark:text-slate-300 glass-pill hover:bg-white/80 dark:hover:bg-slate-700/80" />
            <button
              onClick={() => scrollToSection("reservar")}
              className="hidden md:block bg-gradient-to-r from-lavender-500 to-lavender-400 hover:from-lavender-600 hover:to-lavender-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-lavender-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Agendar hora
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-lavender-600 dark:hover:text-lavender-300 glass-pill rounded-lg transition-all"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-2xl font-bold text-slate-800 dark:text-slate-100 hover:text-lavender-600 dark:hover:text-lavender-300"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection("reservar")}
            className="px-8 py-4 bg-gradient-to-r from-lavender-500 to-lavender-400 text-white text-xl font-bold rounded-2xl shadow-xl shadow-lavender-500/20"
          >
            Agendar hora
          </button>

          <div className="flex items-center gap-4 pt-4">
            <ThemeToggleButton className="p-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
