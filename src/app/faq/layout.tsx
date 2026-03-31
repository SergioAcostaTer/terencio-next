import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Terencio La Esperanza, San Cristóbal de La Laguna",
  description:
    "Resuelve tus dudas sobre Terencio Cash Market: supermercado abierto hoy domingos en Tenerife, venta al por mayor para hostelería, restaurantes y productos de El Hierro.",
};

export default function FaqLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
