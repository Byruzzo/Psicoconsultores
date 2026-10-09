import React, { useState, useEffect } from "react";
import { ShieldCheck, ExternalLink, FileCheck2, X, Download } from "lucide-react";

const N_REGISTRO = "656686";
const RUT = "19.184.909-4";
const CODIGO_VALIDACION = "POBU8Lqgh";

const RNPI_URL = "https://rnpi.superdesalud.gob.cl/";
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

const RegistroOficial = () => {
  const [mostrarCertificado, setMostrarCertificado] = useState(false);

  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-strong rounded-[2rem] p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            Registro Oficial en la Superintendencia de Salud
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl">
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

          <div className="mt-8 pt-6 border-t border-white/40 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-serif text-slate-400 dark:text-slate-500 select-none">Ψ</span>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">Ps. Carla Ruz Pardo</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Psicóloga Clínica</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{RUT}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">N°Reg: {N_REGISTRO}</p>
              </div>
            </div>

            <a
              href={RNPI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-lavender-600 dark:hover:text-lavender-300"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              Verificar código {CODIGO_VALIDACION} en RNPI
            </a>
          </div>
        </div>
      </div>

      {mostrarCertificado && <CertificadoModal onClose={() => setMostrarCertificado(false)} />}
    </section>
  );
};

export default RegistroOficial;
