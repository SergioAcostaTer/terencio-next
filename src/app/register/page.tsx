import type { Metadata } from "next";

import MembershipRegisterForm from "@/components/forms/MembershipRegisterForm";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Alta de cliente",
  description: "Formulario digital de alta de cliente para tienda, optimizado para móvil y acceso por QR.",
};

export default function RegisterPage() {
  return (
    <main className="bg-gradient-to-b from-white to-gray-50">
      <Section className="pb-3 md:pb-4">
        <div className="mx-auto max-w-5xl">
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
            Alta de clientes
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-gray-900 md:text-3xl">
            Formulario de alta para empresa o autónomo
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 md:text-base">
            Completa los datos fiscales y de contacto. El formulario se guarda automáticamente en este móvil mientras lo rellenas.
          </p>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1.7fr)_320px]">
          <div className="rounded-[1.75rem] border border-gray-200 bg-white p-3 shadow-sm md:p-5">
            <MembershipRegisterForm />
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.75rem] border border-green-100 bg-green-50 p-5">
              <h2 className="text-base font-bold text-green-950">Qué necesitas</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-green-950/85">
                <li>Datos fiscales del titular o empresa.</li>
                <li>Dirección y al menos una vía de contacto.</li>
                <li>Estado de la documentación requerida.</li>
                <li>Opcionalmente, personas autorizadas y observaciones.</li>
              </ul>
            </div>

            <div className="rounded-[1.75rem] border border-green-100 bg-green-50 p-5">
              <h2 className="text-base font-bold text-green-950">Al enviar</h2>
              <p className="mt-3 text-sm leading-6 text-green-950/80">
                La solicitud queda registrada con estado pendiente y el equipo la recibe en backoffice para revisión.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </main>
  );
}
