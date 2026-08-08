import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  LogOut,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Inbox,
  Loader2,
  Trash2,
  KeyRound,
  ArrowLeft,
  Lock,
} from "lucide-react";

const inputClass =
  "w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-lavender-400 focus:ring-4 focus:ring-lavender-100 dark:focus:ring-lavender-900/30 outline-none transition-all font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500";

const esEmailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const tiempoRelativo = (fechaISO) => {
  const diffMs = Date.now() - new Date(fechaISO).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "ahora mismo";
  if (min < 60) return `hace ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias < 30) return `hace ${dias} d`;
  return new Date(fechaISO).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });
};

export default function Panel() {
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [recuperando, setRecuperando] = useState(!!location.state?.recovery);

  useEffect(() => {
    if (!supabase) {
      setCargandoSesion(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCargandoSesion(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((evento, s) => {
      setSession(s);
      if (evento === "PASSWORD_RECOVERY") setRecuperando(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabase) {
    return (
      <AuthShell icon={<AlertCircle size={26} />} title="Supabase no está configurado" subtitle="Falta VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.">
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
          Sin esas variables el panel no puede conectarse a la base de datos.
        </p>
      </AuthShell>
    );
  }

  if (cargandoSesion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-lavender-50 via-white to-sage-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
        <Loader2 className="animate-spin text-lavender-500" size={32} />
      </div>
    );
  }
  if (recuperando) return <NuevaContraseña onListo={() => setRecuperando(false)} />;
  return session ? <Tablero session={session} /> : <Login />;
}

function AuthShell({ icon, title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lavender-400 via-lavender-300 to-sage-300 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 px-4">
      <div className="w-full max-w-md glass-strong rounded-[2rem] p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto bg-lavender-100 dark:bg-lavender-500/20 rounded-2xl flex items-center justify-center mb-4 text-lavender-600 dark:text-lavender-300">
            {icon}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [modoRecuperar, setModoRecuperar] = useState(false);

  const entrar = async () => {
    setError("");
    setCargando(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setError("Correo o contraseña incorrectos.");
    setCargando(false);
  };

  if (modoRecuperar) return <RecuperarContraseña onVolver={() => setModoRecuperar(false)} />;

  return (
    <AuthShell icon={<Lock size={26} />} title="Panel" subtitle="Ingresa para ver las solicitudes de contacto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Correo</label>
          <input
            type="email"
            className={inputClass}
            placeholder="carla@placeholder.cl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
            autoFocus
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Contraseña</label>
            <button
              type="button"
              onClick={() => setModoRecuperar(true)}
              className="text-xs font-semibold text-lavender-600 dark:text-lavender-300 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <input
            type="password"
            className={inputClass}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <button
          onClick={entrar}
          disabled={cargando || !email || !password}
          className="w-full py-3.5 bg-gradient-to-r from-lavender-500 to-lavender-400 text-white font-bold rounded-xl shadow-lg shadow-lavender-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all"
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </div>
    </AuthShell>
  );
}

function RecuperarContraseña({ onVolver }) {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const enviar = async () => {
    if (!esEmailValido(email.trim())) {
      setError("Ingresa un correo válido.");
      return;
    }
    setError("");
    setEnviando(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + "/",
    });
    setEnviando(false);
    if (error) setError("No se pudo enviar el correo. Intenta nuevamente en unos minutos.");
    else setEnviado(true);
  };

  return (
    <AuthShell
      icon={<KeyRound size={26} />}
      title="Restablecer contraseña"
      subtitle="Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña."
    >
      {enviado ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3 bg-sage-50 dark:bg-sage-500/10 text-sage-700 dark:text-sage-300 rounded-xl p-4 text-sm font-medium">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <span>Si el correo existe, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja (y spam).</span>
          </div>
          <button
            onClick={onVolver}
            className="w-full flex items-center justify-center gap-2 py-3.5 glass-pill text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all"
          >
            <ArrowLeft size={16} /> Volver a ingresar
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Correo</label>
            <input
              type="email"
              className={inputClass}
              placeholder="carla@placeholder.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviar()}
              autoFocus
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          <button
            onClick={enviar}
            disabled={enviando || !email.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-lavender-500 to-lavender-400 text-white font-bold rounded-xl shadow-lg shadow-lavender-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {enviando ? "Enviando..." : "Enviar enlace"}
          </button>
          <button
            onClick={onVolver}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <ArrowLeft size={14} /> Volver a ingresar
          </button>
        </div>
      )}
    </AuthShell>
  );
}

function NuevaContraseña({ onListo }) {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [listo, setListo] = useState(false);

  const guardar = async () => {
    setError("");
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setGuardando(true);
    const { error } = await supabase.auth.updateUser({ password });
    setGuardando(false);
    if (error) setError("No se pudo actualizar la contraseña. Intenta nuevamente.");
    else setListo(true);
  };

  return (
    <AuthShell icon={<KeyRound size={26} />} title="Crea tu nueva contraseña" subtitle="Elige una contraseña nueva para tu cuenta.">
      {listo ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3 bg-sage-50 dark:bg-sage-500/10 text-sage-700 dark:text-sage-300 rounded-xl p-4 text-sm font-medium">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <span>Tu contraseña se actualizó correctamente.</span>
          </div>
          <button
            onClick={onListo}
            className="w-full py-3.5 bg-gradient-to-r from-lavender-500 to-lavender-400 text-white font-bold rounded-xl shadow-lg shadow-lavender-500/25 transition-all"
          >
            Continuar al panel
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nueva contraseña</label>
            <input type="password" className={inputClass} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Confirmar contraseña</label>
            <input
              type="password"
              className={inputClass}
              placeholder="••••••••"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && guardar()}
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          <button
            onClick={guardar}
            disabled={guardando || !password || !confirmar}
            className="w-full py-3.5 bg-gradient-to-r from-lavender-500 to-lavender-400 text-white font-bold rounded-xl shadow-lg shadow-lavender-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {guardando ? "Guardando..." : "Guardar contraseña"}
          </button>
        </div>
      )}
    </AuthShell>
  );
}

function Tablero({ session }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [borrandoId, setBorrandoId] = useState(null);

  const cargar = async () => {
    setCargando(true);
    setError("");
    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError("No se pudieron cargar las solicitudes.");
    else setSolicitudes(data);
    setCargando(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta solicitud? No se puede deshacer.")) return;
    setBorrandoId(id);
    const { error } = await supabase.from("contact_requests").delete().eq("id", id);
    if (!error) setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    setBorrandoId(null);
  };

  const filtradas = solicitudes.filter((s) => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return true;
    return (
      s.nombre?.toLowerCase().includes(q) ||
      s.contacto?.toLowerCase().includes(q) ||
      s.mensaje?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-50 via-white to-sage-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <header className="glass sticky top-0 z-20 rounded-none">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-lavender-400 to-sage-400 flex items-center justify-center text-white font-bold text-sm">
              CR
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-100">Panel de solicitudes</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-xs text-slate-400 dark:text-slate-500">{session.user.email}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre, contacto o mensaje..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className={inputClass + " pl-11"}
            />
          </div>
          <button
            onClick={cargar}
            disabled={cargando}
            className="flex items-center justify-center gap-2 px-5 py-3 glass-pill rounded-xl text-slate-700 dark:text-slate-200 font-semibold hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all disabled:opacity-60"
          >
            <RefreshCw size={16} className={cargando ? "animate-spin" : ""} /> Refrescar
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm font-medium mb-4">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {cargando ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-lavender-500" size={28} />
          </div>
        ) : filtradas.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <Inbox className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={40} />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {solicitudes.length === 0 ? "Todavía no hay solicitudes." : "Sin resultados para tu búsqueda."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtradas.map((s) => {
              const esEmail = esEmailValido(s.contacto || "");
              return (
                <div key={s.id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{s.nombre}</p>
                      <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                        <Calendar size={12} /> {tiempoRelativo(s.created_at)}
                      </span>
                    </div>
                    <a
                      href={esEmail ? `mailto:${s.contacto}` : `tel:${s.contacto}`}
                      className="flex items-center gap-1.5 text-sm text-lavender-600 dark:text-lavender-300 hover:underline mb-2 w-fit"
                    >
                      {esEmail ? <Mail size={14} /> : <Phone size={14} />} {s.contacto}
                    </a>
                    {s.mensaje && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.mensaje}</p>
                    )}
                  </div>
                  <button
                    onClick={() => eliminar(s.id)}
                    disabled={borrandoId === s.id}
                    aria-label="Eliminar solicitud"
                    className="shrink-0 self-end sm:self-start p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                  >
                    {borrandoId === s.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
