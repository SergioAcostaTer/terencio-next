import { prisma } from "@/lib/prisma";

function formatDate(value: Date) {
  return new Date(value).toLocaleString("es-ES");
}

export default async function SubmissionsPage() {
  const [contactSubmissions, professionalSubmissions, newsletterSubscriptions] = await Promise.all([
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.professionalSubmission.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.newsletterSubscription.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900">Consultas Web</h2>
        <p className="mt-2 text-sm text-slate-500">
          Envios registrados desde los formularios de contacto y profesionales.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-xl font-black text-slate-900">Contacto</h3>
          <p className="mt-1 text-sm text-slate-500">
            Mensajes recibidos desde la pagina de contacto.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Telefono</th>
                  <th className="px-4 py-3 font-semibold">Motivo</th>
                  <th className="px-4 py-3 font-semibold">Mensaje</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {contactSubmissions.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-4 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-4 py-4">{item.email}</td>
                    <td className="px-4 py-4">{item.phone}</td>
                    <td className="px-4 py-4">{item.topic}</td>
                    <td className="max-w-md px-4 py-4 whitespace-pre-wrap text-slate-700">
                      {item.message}
                    </td>
                    <td className="px-4 py-4 text-slate-500">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}

                {contactSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      Aun no se han recibido mensajes de contacto.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-xl font-black text-slate-900">Profesionales</h3>
          <p className="mt-1 text-sm text-slate-500">
            Solicitudes comerciales recibidas desde la landing de profesionales.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Negocio</th>
                  <th className="px-4 py-3 font-semibold">Sector</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Telefono</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {professionalSubmissions.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {item.businessName}
                    </td>
                    <td className="px-4 py-4">{item.sector}</td>
                    <td className="px-4 py-4">{item.email}</td>
                    <td className="px-4 py-4">{item.phone}</td>
                    <td className="px-4 py-4 text-slate-500">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}

                {professionalSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      Aun no se han recibido solicitudes profesionales.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-xl font-black text-slate-900">Newsletter</h3>
          <p className="mt-1 text-sm text-slate-500">
            Suscripciones registradas desde el formulario de portada.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {newsletterSubscriptions.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-4 font-semibold text-slate-900">{item.email}</td>
                    <td className="px-4 py-4">{item.status}</td>
                    <td className="px-4 py-4 text-slate-500">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}

                {newsletterSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                      Aun no se han recibido suscripciones.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
