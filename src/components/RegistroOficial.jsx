import React from "react";
import { ShieldCheck, ExternalLink, FileCheck2 } from "lucide-react";

const N_REGISTRO = "656686";
const RUT = "19.184.909-4";
const CODIGO_VALIDACION = "POBU8Lqgh";

const RNPI_URL = "https://rnpi.superdesalud.gob.cl/";
const CERTIFICADO_URL = "/certificado-superintendencia.pdf";

const RegistroOficial = () => {
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

            <a
              href={CERTIFICADO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-sage-500 hover:bg-sage-600 text-white font-bold text-sm shadow-lg shadow-sage-500/25 transition-all"
            >
              Ver Certificado <ExternalLink className="w-4 h-4" />
            </a>
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
    </section>
  );
};

export default RegistroOficial;
