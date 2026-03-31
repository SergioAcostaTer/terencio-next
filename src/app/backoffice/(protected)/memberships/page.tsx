import { prisma } from "@/lib/prisma";

function getFileHref(item: {
  id: string;
  dniFileKey: string | null;
  modelFileKey: string | null;
  certificateKey: string | null;
  dniFileUrl: string | null;
  modelFileUrl: string | null;
  certificateUrl: string | null;
}, fileType: "dni" | "model" | "certificate") {
  switch (fileType) {
    case "dni":
      return item.dniFileKey
        ? `/api/memberships/${item.id}/files/dni`
        : item.dniFileUrl;
    case "model":
      return item.modelFileKey
        ? `/api/memberships/${item.id}/files/model`
        : item.modelFileUrl;
    case "certificate":
      return item.certificateKey
        ? `/api/memberships/${item.id}/files/certificate`
        : item.certificateUrl;
  }
}

export default async function MembershipsPage() {
  const submissions = await prisma.membershipSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-3xl font-black text-slate-900">Memberships</h2>
        <p className="mt-2 text-sm text-slate-500">
          Solicitudes registradas desde el formulario público.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Razón social</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Teléfono</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Archivos</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900">{item.legalName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.nifCif} · {new Date(item.createdAt).toLocaleString("es-ES")}
                    </p>
                  </td>
                  <td className="px-4 py-4">{item.email}</td>
                  <td className="px-4 py-4">{item.phone}</td>
                  <td className="px-4 py-4 capitalize">{item.type}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      {item.dniFileUrl || item.dniFileKey ? (
                        <a
                          href={getFileHref(item, "dni") || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-700 hover:underline"
                        >
                          DNI / CIF
                        </a>
                      ) : null}
                      {item.modelFileUrl || item.modelFileKey ? (
                        <a
                          href={getFileHref(item, "model") || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-700 hover:underline"
                        >
                          Modelo 21/62
                        </a>
                      ) : null}
                      {item.certificateUrl || item.certificateKey ? (
                        <a
                          href={getFileHref(item, "certificate") || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-700 hover:underline"
                        >
                          Certificado
                        </a>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}

              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    Aún no se han recibido solicitudes.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
