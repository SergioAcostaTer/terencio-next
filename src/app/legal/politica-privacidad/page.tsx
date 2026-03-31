import type { Metadata } from "next";

import siteData from "@/data/siteData.json";

export const metadata: Metadata = {
  title: "Política de Privacidad - Terencio Cash Market",
  description:
    "Política de privacidad y protección de datos de Terencio Cash Market.",
};

export default function PoliticaPrivacidadPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-slate-900 py-10 text-white md:py-14">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/90 via-green-900/65 to-slate-900" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-green-400 bg-green-800/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-100">
            Legal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
            Política de Privacidad
          </h1>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
            <p>
              En <strong>{siteData.legalName}</strong> (en adelante,{" "}
              {siteData.name}), nos tomamos muy en serio la privacidad de sus
              datos. La presente Política de Privacidad describe cómo
              recopilamos, utilizamos y protegemos su información personal.
            </p>

            <h3>1. Responsable del Tratamiento</h3>
            <ul>
              <li>
                <strong>Identidad:</strong> {siteData.legalName}
              </li>
              <li>
                <strong>Dirección:</strong> {siteData.address.streetAddress},{" "}
                {siteData.address.postalCode}{" "}
                {siteData.address.addressLocality}
              </li>
              <li>
                <strong>Email:</strong> {siteData.contact.email}
              </li>
              <li>
                <strong>Teléfono:</strong> {siteData.contact.phone}
              </li>
            </ul>

            <h3>2. Finalidad del Tratamiento</h3>
            <p>
              Tratamos la información que nos facilitan las personas interesadas
              con el fin de:
            </p>
            <ul>
              <li>Gestionar el envío de la información que nos soliciten.</li>
              <li>
                Procesar pedidos, encargos o cualquier tipo de petición
                realizada por el usuario a través de cualquiera de las formas
                de contacto.
              </li>
              <li>
                Enviar comunicaciones comerciales sobre nuestros productos y
                servicios (solo si ha dado su consentimiento explícito).
              </li>
            </ul>

            <h3>3. Legitimación</h3>
            <p>
              La base legal para el tratamiento de sus datos es el
              consentimiento del interesado al rellenar formularios y aceptar
              esta política, o la ejecución de un contrato en caso de compra de
              productos o servicios.
            </p>

            <h3>4. Destinatarios</h3>
            <p>
              Los datos no se cederán a terceros salvo en los casos en que
              exista una obligación legal o sea necesario para la prestación del
              servicio.
            </p>

            <h3>5. Derechos</h3>
            <p>
              Cualquier persona tiene derecho a obtener confirmación sobre si en{" "}
              {siteData.name} estamos tratando datos personales que les
              conciernan, o no.
            </p>
            <p>Las personas interesadas tienen derecho a:</p>
            <ul>
              <li>Acceder a sus datos personales.</li>
              <li>Solicitar la rectificación de los datos inexactos.</li>
              <li>
                Solicitar su supresión cuando, entre otros motivos, los datos
                ya no sean necesarios.
              </li>
              <li>Solicitar la limitación del tratamiento.</li>
              <li>Oponerse al tratamiento.</li>
            </ul>
            <p>
              Puede ejercer sus derechos enviando un correo electrónico a{" "}
              <strong>{siteData.contact.email}</strong>.
            </p>

            <h3>6. Seguridad de los Datos</h3>
            <p>
              Hemos adoptado todas las medidas técnicas y organizativas
              necesarias para garantizar la seguridad de los datos personales y
              evitar su alteración, pérdida, tratamiento o acceso no autorizado.
            </p>

            <h3>7. Analítica Web y Rendimiento</h3>
            <p>
              Este sitio web utiliza <strong>Vercel Analytics</strong> y{" "}
              <strong>Vercel Speed Insights</strong> para medir el rendimiento y
              obtener estadísticas anónimas de uso.
            </p>
            <p>
              Estas herramientas no utilizan cookies de rastreo persistentes ni
              recopilan Información Personal Identificable (PII). Los datos se
              procesan de forma anónima con el único fin de mejorar la
              experiencia de usuario y la velocidad de carga del sitio.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
