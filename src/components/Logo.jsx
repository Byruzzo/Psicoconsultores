import React from "react";

// Marca de Psicoconsultores: círculo con gradiente lavanda→salvia (mismo
// lenguaje visual que el resto del sitio) y el símbolo Ψ (psi), estándar de
// psicología. Se usa en NavBar, Footer y como pieza destacada del Hero.
const Logo = ({ className = "w-9 h-9", textClassName = "text-sm" }) => (
  <span
    className={`${className} rounded-xl bg-gradient-to-br from-lavender-400 to-sage-400 flex items-center justify-center text-white font-bold shadow-md shadow-lavender-500/20 shrink-0`}
  >
    <span className={`${textClassName} font-serif leading-none`}>Ψ</span>
  </span>
);

export default Logo;
