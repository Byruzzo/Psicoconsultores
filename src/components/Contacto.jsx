import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

const WHATSAPP_NUMBER = "56900000000"; // Placeholder — reemplazar por el número real de Carla

const sanitize = (str, maxLen = 300) => {
  if (!str) return "";
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"'`]/g, "")
    .trim()
    .slice(0, maxLen);
};

const Contacto = () => {
  const [form, setForm] = useState({ nombre: "", contacto: "", mensaje: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nombre = sanitize(form.nombre, 100);
    const contacto = sanitize(form.contacto, 100);
    const mensaje = sanitize(form.mensaje, 400);

    if (!nombre || !contacto) {
      setError("Completa tu nombre y un medio de contacto.");
      return;
    }

    setIsSubmitting(true);

    // Queda como respaldo en la base de datos aunque la persona no
    // termine de enviar el WhatsApp. Si Supabase no está configurado
    // todavía (ver .env.example), `supabase` es null y se omite.
    if (supabase) {
      const { error: dbError } = await supabase
        .from("contact_requests")
        .insert([{ nombre, contacto, mensaje: mensaje || null }]);
      if (dbError) console.error("Error guardando la solicitud:", dbError);
    }

    const texto = `Hola Carla, soy ${nombre} (${contacto}).${mensaje ? ` ${mensaje}` : " Quisiera agendar una hora de terapia."}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    setIsSubmitting(false);
  };

  const inputClass =
    "w-full px-5 py-4 bg-white/60 dark:bg-slate-800/60 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-lavender-400 focus:ring-4 focus:ring-lavender-100 dark:focus:ring-lavender-900/30 outline-none transition-all font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500";

  return (
    <section id="contacto" className="relative py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="glass-pill inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-lavender-600 dark:text-lavender-300 mb-4">
            Contacto
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Demos el primer paso
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Escríbeme y coordinamos tu primera sesión.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_1.2fr] gap-6 md:gap-8">
          <div className="glass rounded-[2rem] p-8 space-y-6">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-full bg-lavender-100 dark:bg-lavender-500/20 text-lavender-600 dark:text-lavender-300 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </span>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Correo</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">contacto@placeholder.cl</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-full bg-sage-100 dark:bg-sage-500/20 text-sage-600 dark:text-sage-300 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </span>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">WhatsApp</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">+56 9 0000 0000</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-full bg-lavender-100 dark:bg-lavender-500/20 text-lavender-600 dark:text-lavender-300 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Ubicación</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Dirección placeholder, Santiago</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-strong rounded-[2rem] p-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                maxLength={100}
                className={inputClass}
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">
                Correo o WhatsApp
              </label>
              <input
                type="text"
                name="contacto"
                maxLength={100}
                className={inputClass}
                placeholder="correo@mail.com o +56912345678"
                value={form.contacto}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">
                Mensaje <span className="text-slate-400 dark:text-slate-500 font-normal">(opcional)</span>
              </label>
              <textarea
                name="mensaje"
                rows="3"
                maxLength={400}
                className={inputClass + " resize-none"}
                placeholder="Cuéntame brevemente qué te gustaría trabajar..."
                value={form.mensaje}
                onChange={handleChange}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-lavender-500 to-lavender-400 hover:from-lavender-600 hover:to-lavender-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-lavender-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  Enviar por WhatsApp <Send className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-center text-slate-400 dark:text-slate-500 text-xs">
              Se abrirá WhatsApp con tu mensaje precargado.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
