import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const questions = [
    {
      question: "¿Es mi primera vez en terapia, qué debo esperar?",
      answer:
        "La primera sesión es un espacio para conocernos: te cuento cómo trabajo y tú me cuentas qué te trae a terapia. No hay que prepararse de una forma especial, solo llegar con la disposición de conversar.",
    },
    {
      question: "¿Qué tan confidencial es todo lo que converso?",
      answer:
        "Todo lo que se conversa en sesión está protegido por el secreto profesional. La única excepción es el riesgo de vida propio o de terceros, según establece la normativa vigente.",
    },
    {
      question: "¿Cuánto dura cada sesión y con qué frecuencia son?",
      answer:
        "Las sesiones individuales duran 50 minutos y las de pareja 60 minutos. La frecuencia habitual es semanal, aunque se puede ajustar según el proceso y la disponibilidad.",
    },
    {
      question: "¿La atención online es igual de efectiva que la presencial?",
      answer:
        "Sí. La evidencia muestra que la telepsicología tiene resultados comparables a la atención presencial para la mayoría de los procesos terapéuticos, siempre que se cuente con privacidad y buena conexión.",
    },
    {
      question: "¿Puedo usar mi Isapre o seguro complementario?",
      answer:
        "Se entrega boleta de honorarios que puedes reembolsar directamente con tu Isapre o seguro complementario, según el porcentaje de cobertura que corresponda a tu plan.",
    },
  ];

  return (
    <section id="preguntas" className="relative py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="glass-pill inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-lavender-600 dark:text-lavender-300 mb-4">
            Preguntas frecuentes
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Resolvemos tus dudas
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Si tienes otra pregunta, escríbeme directamente.
          </p>
        </div>
        <div className="space-y-4">
          {questions.map((item, index) => {
            const active = activeIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                  active ? "glass-strong" : "glass"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span
                    className={`font-bold text-lg ${
                      active
                        ? "text-lavender-600 dark:text-lavender-300"
                        : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 shrink-0 ml-4 ${
                      active
                        ? "bg-gradient-to-br from-lavender-500 to-lavender-400 text-white"
                        : "bg-white/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {active ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    active ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-white/40 dark:border-white/5 pt-4">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
