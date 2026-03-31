import type { Metadata } from "next";

import MembershipRegisterForm from "@/components/forms/MembershipRegisterForm";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Hazte socio",
  description: "Alta interna de socios y clientes profesionales de Terencio.",
};

export default function RegisterPage() {
  return (
    <main className="bg-gradient-to-b from-white to-gray-50">
      <Section className="pb-4">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-bold uppercase tracking-widest text-green-700">
            Alta de socios
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-900">
            Solicitud de alta para empresa o autónomo
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            Completa tus datos fiscales, adjunta la documentación necesaria y el
            equipo de Terencio revisará la solicitud desde el backoffice interno.
          </p>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <MembershipRegisterForm />
          </div>

          <aside className="space-y-4">
            <div className="rounded-[2rem] border border-green-100 bg-green-50 p-6">
              <h2 className="text-lg font-bold text-green-900">Documentación</h2>
              <ul className="mt-4 space-y-3 text-sm text-green-950/85">
                <li>DNI o CIF en PDF, JPG, PNG o WEBP</li>
                <li>Modelo 21/62 opcional</li>
                <li>Certificado de autónomo opcional</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-yellow-100 bg-yellow-50 p-6">
              <h2 className="text-lg font-bold text-yellow-900">Revisión</h2>
              <p className="mt-3 text-sm leading-relaxed text-yellow-950/80">
                La solicitud queda registrada con estado pendiente y se notifica
                por email al equipo interno.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </main>
  );
}
