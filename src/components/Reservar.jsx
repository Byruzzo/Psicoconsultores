import React, { useState, useEffect, useCallback } from "react";
import {
  Brain,
  CloudRain,
  BriefcaseBusiness,
  Sparkles,
  HeartCrack,
  Waves,
  HelpCircle,
  Stethoscope,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Video as VideoIcon,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const PRECIO_SESION = "$100"; // TODO: volver a "$25.000" después de probar el pago real
const DURACION_TEXTO = "45 minutos";

const MOTIVOS = [
  { id: "ansiedad", icon: Brain, label: "Ansiedad" },
  { id: "animo", icon: CloudRain, label: "Trastornos del ánimo" },
  { id: "estres-laboral", icon: BriefcaseBusiness, label: "Estrés Laboral / Burnout" },
  { id: "autoestima", icon: Sparkles, label: "Autoestima" },
  { id: "duelo", icon: HeartCrack, label: "Duelo" },
  { id: "estres-postraumatico", icon: Waves, label: "Estrés Post Traumático" },
  { id: "diagnostico", icon: Stethoscope, label: "Quiero un diagnóstico" },
  { id: "tratamiento", icon: HelpCircle, label: "Soy paciente en tratamiento" },
];

const FUNCTIONS_URL = supabase ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1` : null;

const esEmailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const esTelefonoValido = (v) => /^(\+?56)?[0-9]{8,12}$/.test(v.replace(/[\s\-()]/g, ""));

const formatearDia = (fechaISO) => {
  const d = new Date(`${fechaISO}T12:00:00`); // mediodía para evitar saltos de huso horario
  const texto = d.toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" });
  return texto.charAt(0).toUpperCase() + texto.slice(1).replace(".", "");
};

const formatearHora = (horarioISO) =>
  new Date(horarioISO).toLocaleTimeString("es-CL", {
    timeZone: "America/Santiago",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const PasoHeader = ({ paso }) => {
  const pasos = ["Motivo", "Horario", "Pago", "Confirmación"];
  return (
    <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
      {pasos.map((label, i) => {
        const n = i + 1;
        const activo = n === paso;
        const completo = n < paso;
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  completo
                    ? "bg-sage-500 text-white"
                    : activo
                      ? "bg-lavender-500 text-white"
                      : "bg-white/60 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500"
                }`}
              >
                {completo ? <CheckCircle2 className="w-4 h-4" /> : n}
              </span>
              <span
                className={`text-xs font-semibold hidden sm:inline ${
                  activo ? "text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {label}
              </span>
            </div>
            {n < pasos.length && <span className="w-6 h-px bg-slate-200 dark:bg-slate-700" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Reservar = () => {
  const [paso, setPaso] = useState(1);
  const [motivo, setMotivo] = useState(null);
  const [dias, setDias] = useState(null);
  const [diaActivo, setDiaActivo] = useState(null);
  const [horario, setHorario] = useState(null); // { inicio, fin }
  const [cargandoDisponibilidad, setCargandoDisponibilidad] = useState(false);
  const [cargandoPago, setCargandoPago] = useState(false);
  const [reservaId, setReservaId] = useState(null);
  const [errorPago, setErrorPago] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [errorConfirmar, setErrorConfirmar] = useState("");
  const [resultado, setResultado] = useState(null); // { meetLink, email, nombre }

  const confirmarReserva = useCallback(
    async (id) => {
      if (!FUNCTIONS_URL || !id) return;
      setConfirmando(true);
      setErrorConfirmar("");
      try {
        const resp = await fetch(`${FUNCTIONS_URL}/confirmar-reserva`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reservaId: id }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || "No se pudo confirmar la reserva");
        setResultado(data);
      } catch (err) {
        setErrorConfirmar(err.message || "No se pudo confirmar. Si ya pagaste, escribinos por correo.");
      } finally {
        setConfirmando(false);
      }
    },
    [],
  );

  // Al volver de Flow, la URL trae #reservar?reserva=... (Flow no manda el
  // resultado en la url). El paso 4 es automático: confirma solo, sin
  // pedirle nada más a la persona (nombre/teléfono/correo ya se guardaron
  // en el paso 3, antes de pagar).
  useEffect(() => {
    const hash = window.location.hash;
    const qIndex = hash.indexOf("?");
    if (qIndex === -1) return;
    const params = new URLSearchParams(hash.slice(qIndex + 1));
    const reserva = params.get("reserva");
    if (reserva) {
      setReservaId(reserva);
      setPaso(4);
      confirmarReserva(reserva);
    }
  }, [confirmarReserva]);

  const cargarDisponibilidad = useCallback(async () => {
    if (!FUNCTIONS_URL) return;
    setCargandoDisponibilidad(true);
    try {
      const resp = await fetch(`${FUNCTIONS_URL}/disponibilidad`);
      const data = await resp.json();
      setDias(data.dias ?? []);
      setDiaActivo(data.dias?.[0]?.fecha ?? null);
    } catch {
      setDias([]);
    } finally {
      setCargandoDisponibilidad(false);
    }
  }, []);

  useEffect(() => {
    if (paso === 2 && dias === null) cargarDisponibilidad();
  }, [paso, dias, cargarDisponibilidad]);

  const irAPagar = async () => {
    if (!FUNCTIONS_URL || !horario) return;
    if (!nombre.trim() || nombre.trim().length < 2) {
      setErrorPago("Ingresá tu nombre completo.");
      return;
    }
    if (!esTelefonoValido(telefono)) {
      setErrorPago("Ingresá un teléfono válido (ej: +56912345678).");
      return;
    }
    if (!esEmailValido(email)) {
      setErrorPago("Ingresá un correo válido.");
      return;
    }
    if (!aceptaTerminos) {
      setErrorPago("Tenés que aceptar el uso de tus datos para continuar.");
      return;
    }
    setCargandoPago(true);
    setErrorPago("");
    try {
      const resp = await fetch(`${FUNCTIONS_URL}/crear-pago`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motivo: motivo.label,
          inicio: horario.inicio,
          fin: horario.fin,
          nombre,
          telefono,
          email,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "No se pudo iniciar el pago");
      window.location.href = data.redirectUrl;
    } catch (err) {
      setErrorPago(err.message || "No se pudo iniciar el pago. Intenta de nuevo.");
      setCargandoPago(false);
    }
  };

  const inputClass =
    "w-full px-5 py-4 bg-white/60 dark:bg-slate-800/60 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-lavender-400 focus:ring-4 focus:ring-lavender-100 dark:focus:ring-lavender-900/30 outline-none transition-all font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500";

  const diaSeleccionado = dias?.find((d) => d.fecha === diaActivo);

  return (
    <section id="reservar" className="relative py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="glass-pill inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-lavender-600 dark:text-lavender-300 mb-4">
            Reservar hora
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Agenda tu sesión
          </h2>
        </div>

        <PasoHeader paso={paso} />

        <div className="glass-strong rounded-[2rem] p-6 md:p-10">
          {/* Paso 1: motivo */}
          {paso === 1 && (
            <div className="animate-[fadeIn_0.3s_ease-in-out]">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                ¿Qué te gustaría trabajar?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Si no estás seguro/a, elegí una de las últimas dos opciones.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MOTIVOS.map((m) => {
                  const Icon = m.icon;
                  const activo = motivo?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMotivo(m)}
                      className={`rounded-2xl p-4 text-center flex flex-col items-center gap-2 border-2 transition-all ${
                        activo
                          ? "border-lavender-400 bg-lavender-50/60 dark:bg-lavender-500/10"
                          : "border-transparent glass hover:border-lavender-200 dark:hover:border-lavender-800"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${activo ? "text-lavender-600 dark:text-lavender-300" : "text-slate-500 dark:text-slate-400"}`}
                      />
                      <span
                        className={`text-xs font-semibold leading-tight ${activo ? "text-lavender-700 dark:text-lavender-200" : "text-slate-700 dark:text-slate-300"}`}
                      >
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPaso(2)}
                disabled={!motivo}
                className="mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-gradient-to-r from-lavender-500 to-lavender-400 text-white shadow-lg shadow-lavender-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Paso 2: horario */}
          {paso === 2 && (
            <div className="animate-[fadeIn_0.3s_ease-in-out]">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                ¿Qué horario te acomoda?
              </h3>

              <div className="glass rounded-2xl p-4 flex items-center gap-3 mb-6">
                <img
                  src="/carla.jpg"
                  alt="Carla Ruz Pardo"
                  className="w-12 h-12 rounded-full object-cover object-top shrink-0"
                />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Carla Ruz Pardo</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <VideoIcon className="w-3 h-3" /> Online · {DURACION_TEXTO}
                  </p>
                </div>
              </div>

              {cargandoDisponibilidad ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-7 h-7 animate-spin text-lavender-500" />
                </div>
              ) : !dias || dias.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                  No hay horarios disponibles por ahora. Escribinos por correo para coordinar.
                </p>
              ) : (
                <>
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-4 [scrollbar-width:thin]">
                    {dias.map((d) => (
                      <button
                        key={d.fecha}
                        onClick={() => {
                          setDiaActivo(d.fecha);
                          setHorario(null);
                        }}
                        className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          diaActivo === d.fecha
                            ? "bg-lavender-500 text-white"
                            : "glass-pill text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {formatearDia(d.fecha)}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {diaSeleccionado?.horarios.map((h) => (
                      <button
                        key={h}
                        onClick={() => setHorario({ inicio: h, fin: new Date(new Date(h).getTime() + 45 * 60 * 1000).toISOString() })}
                        className={`py-3 rounded-xl text-sm font-bold transition-all ${
                          horario?.inicio === h
                            ? "bg-lavender-500 text-white"
                            : "glass-pill text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-700/80"
                        }`}
                      >
                        {formatearHora(h)}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={() => setPaso(1)}
                  className="px-5 py-4 rounded-2xl glass-pill text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
                <button
                  onClick={() => setPaso(3)}
                  disabled={!horario}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-gradient-to-r from-lavender-500 to-lavender-400 text-white shadow-lg shadow-lavender-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Continuar <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: tus datos y pago */}
          {paso === 3 && (
            <div className="animate-[fadeIn_0.3s_ease-in-out]">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                Tus datos y el pago
              </h3>

              <div className="glass rounded-2xl p-5 space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Motivo</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{motivo?.label}</span>
                </div>
                {horario && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Horario</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {formatearDia(horario.inicio.slice(0, 10))} · {formatearHora(horario.inicio)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-white/40 dark:border-white/10">
                  <span className="text-slate-500 dark:text-slate-400">Total a pagar</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-lg">{PRECIO_SESION}</span>
                </div>
              </div>

              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">
                    Nombre completo
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Tu nombre y apellido"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className={inputClass}
                      placeholder="+56912345678"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="tucorreo@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 ml-1">
                  Al correo te va a llegar el link de Meet apenas se confirme el pago.
                </p>
                <label className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    className="mt-0.5"
                  />
                  Acepto que mis datos se usen para coordinar esta sesión.
                </label>
              </div>

              {errorPago && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {errorPago}
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPaso(2)}
                  disabled={cargandoPago}
                  className="px-5 py-4 rounded-2xl glass-pill text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
                <button
                  onClick={irAPagar}
                  disabled={cargandoPago}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-gradient-to-r from-lavender-500 to-lavender-400 text-white shadow-lg shadow-lavender-500/25 disabled:opacity-60 transition-all"
                >
                  {cargandoPago ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Redirigiendo a Flow...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" /> Pagar y continuar
                    </>
                  )}
                </button>
              </div>
              <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-4">
                Vas a pagar en el sitio seguro de Flow. Al volver, tu hora queda confirmada sola.
              </p>
            </div>
          )}

          {/* Paso 4: confirmación automática */}
          {paso === 4 && (
            <div className="animate-[fadeIn_0.3s_ease-in-out] text-center py-6">
              {resultado ? (
                <>
                  <div className="w-16 h-16 mx-auto bg-sage-100 dark:bg-sage-500/20 rounded-full flex items-center justify-center text-sage-600 dark:text-sage-300 mb-5">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                    ¡Hora confirmada, {resultado.nombre?.split(" ")[0] || ""}!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                    Te mandamos la invitación con el link de Google Meet a {resultado.email}.
                  </p>
                  {resultado.meetLink && (
                    <a
                      href={resultado.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-full bg-sage-500 hover:bg-sage-600 text-white font-bold text-sm transition-all"
                    >
                      <VideoIcon className="w-4 h-4" /> Ver link de Meet
                    </a>
                  )}
                </>
              ) : errorConfirmar ? (
                <>
                  <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-5">
                    <AlertCircle className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                    No pudimos confirmar
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-5">{errorConfirmar}</p>
                  {reservaId && (
                    <button
                      onClick={() => confirmarReserva(reservaId)}
                      disabled={confirmando}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lavender-500 hover:bg-lavender-600 text-white font-bold text-sm transition-all disabled:opacity-60"
                    >
                      {confirmando ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Intentar de nuevo
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Loader2 className="w-9 h-9 animate-spin text-lavender-500 mx-auto mb-5" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    Confirmando tu sesión...
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Estamos verificando tu pago y agendando el Meet. Esto toma unos segundos.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reservar;
