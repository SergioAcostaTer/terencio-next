import type { Metadata } from "next";

import Header from "@/components/Header";
import RegisterWizard from "@/components/register/RegisterWizard";

export const metadata: Metadata = {
  title: "Alta de cliente",
  description: "Onboarding digital para alta de clientes, optimizado para móvil, guardado en borrador y revisión interna.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header showTopStrip={false} showStoreStatus={false} />
      <div className="pt-[58px] md:pt-[74px]">
        <RegisterWizard />
      </div>
    </main>
  );
}
