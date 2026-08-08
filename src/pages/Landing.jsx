import React from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import SobreMi from "../components/SobreMi";
import Especialidades from "../components/Especialidades";
import Modalidades from "../components/Modalidades";
import Proceso from "../components/Proceso";
import Precios from "../components/Precios";
import Testimonios from "../components/Testimonios";
import FAQ from "../components/FAQ";
import Contacto from "../components/Contacto";
import Footer from "../components/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-lavender-50 via-white to-sage-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <NavBar />
      <Hero />
      <SobreMi />
      <Especialidades />
      <Modalidades />
      <Proceso />
      <Precios />
      <Testimonios />
      <FAQ />
      <Contacto />
      <Footer />
    </div>
  );
};

export default Landing;
