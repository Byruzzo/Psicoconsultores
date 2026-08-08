import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "psico_cookie_consent";

// Helper para leer el consentimiento desde cualquier parte de la app.
// Ej: if (getCookieConsent()?.analytics) { cargarGoogleAnalytics(); }
export function getCookieConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(prefs) {
  const payload = { ...prefs, date: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* almacenamiento no disponible */
  }
  return payload;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    if (!getCookieConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
    setVisible(false);
  };

  const rejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
    setVisible(false);
  };

  const savePreferences = () => {
    saveConsent({ necessary: true, ...prefs });
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6"
      style={{ animation: "fadeIn 0.4s ease-out" }}
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-2xl sm:p-6">
        <div className="flex items-start gap-3">
          <div className="hidden shrink-0 sm:block">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-100 dark:bg-lavender-500/20 text-lavender-500">
              <Cookie size={20} />
            </span>
          </div>

          <div className="flex-1">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Usamos cookies
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
              Utilizamos cookies para que la página funcione correctamente y,
              con tu permiso, para medir su uso y mejorar tu experiencia. Puedes
              aceptar todas, rechazarlas o elegir cuáles permitir. Más detalles
              en nuestra{" "}
              <a
                href="/#/privacidad"
                className="font-medium text-lavender-600 dark:text-lavender-300 underline underline-offset-2 hover:text-lavender-700 dark:hover:text-lavender-200"
              >
                política de privacidad
              </a>
              .
            </p>

            {showConfig && (
              <div className="mt-4 space-y-3 rounded-xl bg-gray-50 dark:bg-slate-800 p-4">
                <Toggle
                  label="Necesarias"
                  description="Imprescindibles para el funcionamiento del sitio. Siempre activas."
                  checked
                  disabled
                />
                <Toggle
                  label="Analíticas"
                  description="Nos ayudan a entender cómo se usa la página."
                  checked={prefs.analytics}
                  onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                />
                <Toggle
                  label="Marketing"
                  description="Permiten mostrar contenido y campañas más relevantes."
                  checked={prefs.marketing}
                  onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
                />
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={acceptAll}
                className="rounded-full bg-lavender-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-lavender-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 focus-visible:ring-offset-2"
              >
                Aceptar todo
              </button>
              <button
                onClick={rejectAll}
                className="rounded-full border border-gray-300 dark:border-slate-600 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-300 transition hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2"
              >
                Rechazar
              </button>
              {showConfig ? (
                <button
                  onClick={savePreferences}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-lavender-600 dark:text-lavender-300 transition hover:text-lavender-700 dark:hover:text-lavender-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 focus-visible:ring-offset-2"
                >
                  Guardar preferencias
                </button>
              ) : (
                <button
                  onClick={() => setShowConfig(true)}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-slate-400 transition hover:text-gray-900 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2"
                >
                  Personalizar
                </button>
              )}
            </div>
          </div>

          <button
            onClick={rejectAll}
            aria-label="Cerrar y rechazar cookies opcionales"
            className="shrink-0 rounded-full p-1 text-gray-400 dark:text-slate-500 transition hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-600 dark:hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, description, checked, disabled, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-lavender-500" : "bg-gray-300 dark:bg-slate-600"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 focus-visible:ring-offset-2`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
