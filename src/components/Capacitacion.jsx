import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Languages,
  ShieldCheck,
  ExternalLink,
  X,
  Download,
} from "lucide-react";

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

const CERTIFICADO_IMG = "/certificado-superintendencia.png";
const CERTIFICADO_PDF = "/certificado-superintendencia.pdf";

const CertificadoModal = ({ onClose }) => {
  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-[1.5rem] w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/40 dark:border-white/10 shrink-0">
          <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Certificado de Inscripción — Superintendencia de Salud
          </p>
          <div className="flex items-center gap-2">
            <a
              href={CERTIFICADO_PDF}
              download
              className="flex items-center gap-1.5 text-xs font-semibold text-lavender-600 dark:text-lavender-300 hover:underline px-2 py-1"
            >
              <Download className="w-3.5 h-3.5" /> Descargar PDF
            </a>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-2 sm:p-4">
          <img
            src={CERTIFICADO_IMG}
            alt="Certificado de Inscripción en el Registro Nacional de Prestadores Individuales de Salud"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

const Capacitacion = () => {
  const [mostrarCertificado, setMostrarCertificado] = useState(false);

  return (
    <section className="relative py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-strong rounded-[2rem] p-6 md:p-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
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

          <div className="mt-10 pt-8 border-t border-white/40 dark:border-white/10">
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Registro Oficial en la Superintendencia de Salud
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl text-sm">
              Profesional inscrita en el Registro Nacional de Prestadores de Salud de la
              Superintendencia de Salud de Chile.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="w-14 h-14 rounded-2xl bg-lavender-100 dark:bg-lavender-500/20 text-lavender-600 dark:text-lavender-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </span>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">
                    Superintendencia de Salud
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Gobierno de Chile</p>
                </div>
              </div>

              <button
                onClick={() => setMostrarCertificado(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-sage-500 hover:bg-sage-600 text-white font-bold text-sm shadow-lg shadow-sage-500/25 transition-all"
              >
                Ver Certificado <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {mostrarCertificado && <CertificadoModal onClose={() => setMostrarCertificado(false)} />}
    </section>
  );
};

export default Capacitacion;
