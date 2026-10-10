import React from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import SobreMi from "../components/SobreMi";
import Capacitacion from "../components/Capacitacion";
import Especialidades from "../components/Especialidades";
import Modalidades from "../components/Modalidades";
import Precios from "../components/Precios";
import Reservar from "../components/Reservar";
import Testimonios from "../components/Testimonios";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import FloatingCTA from "../components/FloatingCTA";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-lavender-50 via-white to-sage-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <NavBar />
      <Hero />
      <SobreMi />
      <Capacitacion />
      <Especialidades />
      <section className="relative py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
          <Modalidades />
          <Precios />
        </div>
      </section>
      <Reservar />
      <Testimonios />
      <FAQ />
      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Landing;
