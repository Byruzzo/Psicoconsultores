import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Landing from "./pages/Landing";
import Privacidad from "./pages/Privacidad";
import CookieConsent from "./components/CookieConsent";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsent />
      <Analytics />
    </>
  );
}

export default App;
