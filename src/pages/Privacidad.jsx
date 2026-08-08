import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ULTIMA_ACTUALIZACION = "8 de agosto de 2026";

export default function Privacidad() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-lavender-50 via-white to-sage-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-lavender-600 dark:text-lavender-300 transition hover:text-lavender-700 dark:hover:text-lavender-200"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
          Última actualización: {ULTIMA_ACTUALIZACION}
        </p>

        <div className="mt-8 space-y-8 text-gray-700 dark:text-slate-300">
          <Section title="1. Quién soy">
            <p>
              Carla Ruz (en adelante, “yo” o “la psicóloga”) es la responsable
              de este sitio web y de la atención psicológica que en él se
              ofrece. Esta política explica qué datos personales recopilo a
              través del sitio, con qué finalidad y cuáles son tus derechos.
            </p>
            <p>
              Para cualquier consulta sobre tus datos puedes escribirme a{" "}
              <a href="mailto:contacto@placeholder.cl" className="link">
                contacto@placeholder.cl
              </a>
              .
            </p>
          </Section>

          <Section title="2. Qué datos recopilo">
            <p>Cuando completas el formulario de contacto del sitio, recopilo:</p>
            <ul>
              <li>Nombre.</li>
              <li>Correo electrónico o número de teléfono.</li>
              <li>El mensaje que decidas escribir.</li>
            </ul>
            <p>
              Al enviarlo, además de guardarse de forma segura, se abre
              WhatsApp con un mensaje precargado que puedes enviar para
              contactarme directamente por ese medio.
            </p>
            <p>
              Si me escribes directamente por correo o WhatsApp, recibo la
              información de contacto y el contenido de tu mensaje.
            </p>
          </Section>

          <Section title="3. Para qué uso tus datos">
            <ul>
              <li>Para contactarte y coordinar tu atención.</li>
              <li>Para responder tus consultas y dar seguimiento.</li>
              <li>
                Con tu consentimiento, para medir el uso del sitio y
                mejorarlo (ver sección 6).
              </li>
            </ul>
            <p>No vendo tus datos personales ni los comparto con terceros con fines publicitarios.</p>
          </Section>

          <Section title="4. Confidencialidad clínica">
            <p>
              Todo lo que se conversa en el marco de una sesión de terapia
              está protegido por el secreto profesional. La única excepción
              es el riesgo de vida propio o de terceros, conforme a la
              normativa vigente en Chile.
            </p>
          </Section>

          <Section title="5. Base legal del tratamiento">
            <p>
              Trato tus datos sobre la base de tu <strong>consentimiento</strong>,
              que entregas al contactarme, y conforme a la Ley N° 21.719 sobre
              protección de datos personales. Puedes retirar tu consentimiento
              en cualquier momento (ver sección 8).
            </p>
          </Section>

          <Section title="6. Cookies">
            <p>
              El sitio usa cookies estrictamente necesarias para su
              funcionamiento y, solo con tu permiso, cookies analíticas. Al
              ingresar puedes aceptarlas, rechazarlas o personalizarlas desde
              el aviso de cookies. Puedes cambiar tu elección borrando los
              datos del sitio en tu navegador.
            </p>
          </Section>

          <Section title="7. Proveedores">
            <p>Para operar el sitio trabajo con:</p>
            <ul>
              <li>
                <strong>Vercel</strong> — alojamiento del sitio web y
                analítica de uso agregada y anónima.
              </li>
              <li>
                <strong>Supabase</strong> — almacenamiento seguro de las
                solicitudes de contacto.
              </li>
              <li>
                <strong>WhatsApp / Meta</strong> — canal de contacto directo,
                sujeto a su propia política de privacidad.
              </li>
            </ul>
          </Section>

          <Section title="8. Tus derechos">
            <p>
              De acuerdo con la Ley N° 21.719, puedes ejercer en cualquier
              momento tus derechos de:
            </p>
            <ul>
              <li><strong>Acceso</strong>: saber qué datos tuyos tengo.</li>
              <li><strong>Rectificación</strong>: corregir datos inexactos.</li>
              <li><strong>Cancelación / supresión</strong>: solicitar que elimine tus datos.</li>
              <li><strong>Oposición</strong>: oponerte a determinados tratamientos.</li>
              <li><strong>Portabilidad</strong>: recibir tus datos en un formato estructurado.</li>
            </ul>
            <p>
              Para ejercerlos, escríbeme a{" "}
              <a href="mailto:contacto@placeholder.cl" className="link">
                contacto@placeholder.cl
              </a>
              . Responderé en los plazos que establece la ley.
            </p>
          </Section>

          <Section title="9. Conservación de los datos">
            <p>
              Conservo tus datos solo mientras sean necesarios para las
              finalidades descritas, para el registro clínico correspondiente,
              o mientras exista una obligación legal de mantenerlos. Luego se
              eliminan o anonimizan de forma segura.
            </p>
          </Section>

          <Section title="10. Cambios a esta política">
            <p>
              Puedo actualizar esta política. Publicaré la versión vigente en
              esta página con su fecha de actualización.
            </p>
          </Section>

          <Section title="11. Contacto">
            <p>
              ¿Dudas sobre esta política o sobre tus datos? Escríbeme a{" "}
              <a href="mailto:contacto@placeholder.cl" className="link">
                contacto@placeholder.cl
              </a>
              .
            </p>
          </Section>
        </div>

        <div className="mt-12 border-t border-white/40 dark:border-white/5 pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-lavender-600 dark:text-lavender-300 transition hover:text-lavender-700 dark:hover:text-lavender-200"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed [&_a.link]:font-medium [&_a.link]:text-lavender-600 dark:[&_a.link]:text-lavender-300 [&_a.link]:underline [&_a.link]:underline-offset-2 hover:[&_a.link]:text-lavender-700 dark:hover:[&_a.link]:text-lavender-200 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
