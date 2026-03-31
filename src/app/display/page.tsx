import type { Metadata } from "next";

import DisplayRuntime from "@/components/display/DisplayRuntime";

export const metadata: Metadata = {
  title: "Pantalla Smart TV",
  description: "Pantalla interna de promociones y comunicación de Terencio.",
};

const LEGAL_BANNER_TEXT =
  "Información legal y subvenciones: comunicación interna de Terencio Cash Market. Proyecto empresarial apoyado por programas institucionales y fondos europeos de recuperación aplicables a la compañía.";

export default async function DisplayPage() {
  return (
    <DisplayRuntime legalBannerText={LEGAL_BANNER_TEXT} />
  );
}
