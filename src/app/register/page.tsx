import type { Metadata } from "next";

import RegisterWizard from "@/components/register/RegisterWizard";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Alta de cliente",
  description: "Onboarding digital para alta de clientes, optimizado para móvil, guardado en borrador y revisión interna.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef7f1_45%,#f8fafc_100%)]">
      <Section className="pb-24 pt-6 md:pb-12 md:pt-10">
        <div className="mx-auto max-w-5xl">
          <RegisterWizard />
        </div>
      </Section>
    </main>
  );
}
