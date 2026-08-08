import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Landing from "./pages/Landing";
import Privacidad from "./pages/Privacidad";
import Panel from "./pages/Panel";
import CookieConsent from "./components/CookieConsent";
import { supabase } from "./lib/supabase";

function App() {
  const navigate = useNavigate();

  // El enlace de recuperación de contraseña de Supabase llega al dominio raíz
  // (para no chocar con el hash del HashRouter). Cuando detecta el token de
  // recuperación, redirige al panel para mostrar el formulario de nueva contraseña.
  useEffect(() => {
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/panel", { replace: true, state: { recovery: true } });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsent />
      <Analytics />
    </>
  );
}

export default App;
