import type { Metadata } from "next";
import Link from "next/link";

import siteData from "@/data/siteData.json";

export const metadata: Metadata = {
  title: "Aviso Legal - Terencio Cash Market",
  description:
    "Información legal y condiciones de uso del sitio web de Terencio Cash Market.",
};

export default function AvisoLegalPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-slate-900 py-10 text-white md:py-14">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/90 via-green-900/65 to-slate-900" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-green-400 bg-green-800/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-100">
            Legal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
            Aviso Legal
          </h1>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-green-700 hover:prose-a:text-green-800">
            <h3>1. Datos Identificativos</h3>
            <p>
              En cumplimiento con el deber de información recogido en artículo
              10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad
              de la Información y del Comercio Electrónico, a continuación se
              reflejan los siguientes datos:
            </p>
            <ul className="space-y-2">
              <li>
                <strong>Titular (Razón Social):</strong> {siteData.legalName}
              </li>
              <li>
                <strong>C.I.F.:</strong> {siteData.cif}
              </li>
              <li>
                <strong>Forma Jurídica:</strong> {siteData.legal.form}
              </li>
              <li>
                <strong>Domicilio social:</strong> {siteData.address.streetAddress}
                , {siteData.address.postalCode}{" "}
                {siteData.address.addressLocality},{" "}
                {siteData.address.addressRegion} (
                {siteData.address.addressCountry})
              </li>
              <li>
                <strong>Correo electrónico:</strong> {siteData.contact.email}
              </li>
              <li>
                <strong>Teléfono:</strong> {siteData.contact.phone}
              </li>
              <li className="mt-4 border-t border-gray-100 pt-4">
                <strong>Sector:</strong> {siteData.legal.sector}
              </li>
              <li>
                <strong>Objeto social:</strong> {siteData.legal.socialObject}
              </li>
              <li>
                <strong>Actividad:</strong> {siteData.legal.activity}
              </li>
              <li>
                <strong>CNAE:</strong> {siteData.legal.cnae}
              </li>
              <li>
                <strong>Fecha de constitución:</strong>{" "}
                {siteData.legal.constitutionDate}
              </li>
              <li>
                <strong>Estado:</strong> {siteData.legal.status}
              </li>
            </ul>

            <h3>2. Usuarios</h3>
            <p>
              El acceso y/o uso de este portal de {siteData.name} atribuye la
              condición de USUARIO, que acepta, desde dicho acceso y/o uso, las
              Condiciones Generales de Uso aquí reflejadas.
            </p>

            <h3>3. Uso del Portal</h3>
            <p>
              {siteData.url} proporciona el acceso a multitud de informaciones,
              servicios, programas o datos (en adelante, &quot;los
              contenidos&quot;) en Internet pertenecientes a {siteData.name} o
              a sus licenciantes a los que el USUARIO pueda tener acceso. El
              USUARIO asume la responsabilidad del uso del portal.
            </p>

            <h3>4. Protección de Datos</h3>
            <p>
              {siteData.name} cumple con las directrices del Reglamento General
              de Protección de Datos (RGPD) y demás normativa vigente, y vela
              por garantizar un correcto uso y tratamiento de los datos
              personales del usuario. Para más información, visite nuestra{" "}
              <Link href="/legal/politica-privacidad">
                Política de Privacidad
              </Link>
              .
            </p>

            <h3>5. Propiedad Intelectual e Industrial</h3>
            <p>
              {siteData.name} por sí o como cesionaria, es titular de todos los
              derechos de propiedad intelectual e industrial de su página web,
              así como de los elementos contenidos en la misma (a título
              enunciativo, imágenes, sonido, audio, vídeo, software o textos;
              marcas o logotipos, combinaciones de colores, estructura y
              diseño, selección de materiales usados, etc.). Todos los derechos
              reservados.
            </p>

            <h3>6. Exclusión de Garantías y Responsabilidad</h3>
            <p>
              {siteData.name} no se hace responsable, en ningún caso, de los
              daños y perjuicios de cualquier naturaleza que pudieran ocasionar,
              a título enunciativo: errores u omisiones en los contenidos,
              falta de disponibilidad del portal o la transmisión de virus o
              programas maliciosos o lesivos en los contenidos, a pesar de
              haber adoptado todas las medidas tecnológicas necesarias para
              evitarlo.
            </p>

            <h3>7. Modificaciones</h3>
            <p>
              {siteData.name} se reserva el derecho de efectuar sin previo
              aviso las modificaciones que considere oportunas en su portal,
              pudiendo cambiar, suprimir o añadir tanto los contenidos y
              servicios que se presten a través de la misma como la forma en la
              que estos aparezcan presentados o localizados en su portal.
            </p>

            <h3>8. Legislación Aplicable y Jurisdicción</h3>
            <p>
              La relación entre {siteData.name} y el USUARIO se regirá por la
              normativa española vigente y cualquier controversia se someterá a
              los Juzgados y tribunales de la ciudad de Santa Cruz de Tenerife.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
