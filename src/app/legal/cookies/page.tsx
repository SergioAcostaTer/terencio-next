import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies - Terencio Cash Market",
  description: "Información sobre el uso de cookies en Terencio Cash Market.",
};

export default function CookiesPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-slate-900 py-10 text-white md:py-14">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/90 via-green-900/65 to-slate-900" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-green-400 bg-green-800/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-100">
            Legal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
            Política de Cookies
          </h1>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-green-700 hover:prose-a:text-green-800">
            <h3>1. ¿Qué son las cookies?</h3>
            <p>
              Una cookie es un fichero que se descarga en su ordenador al
              acceder a determinadas páginas web. Las cookies permiten a una
              página web, entre otras cosas, almacenar y recuperar información
              sobre los hábitos de navegación de un usuario o de su equipo y,
              dependiendo de la información que contengan y de la forma en que
              utilice su equipo, pueden utilizarse para reconocer al usuario.
            </p>

            <h3>2. Tipos de cookies que utiliza esta web</h3>

            <h4>Según la entidad que las gestiona:</h4>
            <ul>
              <li>
                <strong>Propias:</strong> Son aquellas que se envían al equipo
                terminal del usuario desde un equipo o dominio gestionado por
                el propio editor y desde el que se presta el servicio
                solicitado por el usuario.
              </li>
              <li>
                <strong>De terceros:</strong> Son aquellas que se envían al
                equipo terminal del usuario desde un equipo o dominio que no es
                gestionado por el editor, sino por otra entidad que trata los
                datos obtenidos a través de las cookies.
              </li>
            </ul>

            <h4>Según su finalidad:</h4>
            <ul>
              <li>
                <strong>Técnicas/Necesarias:</strong> Son aquellas que permiten
                al usuario la navegación a través de una página web y la
                utilización de las diferentes opciones o servicios que en ella
                existan.
              </li>
              <li>
                <strong>De análisis:</strong> Son aquellas que permiten al
                responsable de las mismas el seguimiento y análisis del
                comportamiento de los usuarios de los sitios web a los que
                están vinculadas.
              </li>
            </ul>

            <h3>3. Consentimiento</h3>
            <p>
              Al navegar por nuestro sitio web, usted acepta la instalación de
              cookies estrictamente necesarias. Para las cookies de análisis u
              otras no necesarias, solicitamos su consentimiento a través de
              nuestro banner de cookies. Puede retirar su consentimiento en
              cualquier momento.
            </p>

            <h3>4. Gestión de Cookies</h3>
            <p>
              Usted puede permitir, bloquear o eliminar las cookies instaladas
              en su equipo mediante la configuración de las opciones del
              navegador instalado en su ordenador:
            </p>
            <ul>
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647?hl=es"
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies"
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  Internet Explorer / Edge
                </a>
              </li>
            </ul>

            <h3>5. Actualización de la Política de Cookies</h3>
            <p>
              Es posible que actualicemos la Política de Cookies de nuestro
              Sitio Web, por ello le recomendamos revisar esta política cada
              vez que acceda a nuestro Sitio Web con el objetivo de estar
              adecuadamente informado sobre cómo y para qué usamos las cookies.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
