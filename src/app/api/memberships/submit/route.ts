import { NextResponse } from "next/server";

import siteData from "@/data/siteData.json";
import {
  buildDocumentationStatus,
  getDocumentationConfig,
  membershipSchema,
  type DocumentationState,
  type MembershipSubmissionInput,
} from "@/lib/membership";
import { sendEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderDocumentationLines(type: "autonomo" | "empresa", docs: Record<string, DocumentationState>) {
  return getDocumentationConfig(type).map((item) => ({
    label: item.label,
    status: docs[item.key] === "delivered" ? "Entregado" : "Pendiente",
  }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = membershipSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Revisa los campos del formulario.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data as MembershipSubmissionInput;
    const documentationStatus = buildDocumentationStatus(
      data.type,
      data.documentationStatus as Record<string, DocumentationState>,
    );

    const submission = await prisma.membershipSubmission.create({
      data: {
        legalName: data.legalName,
        commercialName: data.commercialName || null,
        email: data.email || "",
        phone: data.phone || "",
        mobile: data.mobile || null,
        nifCif: data.nifCif,
        type: data.type,
        activity: data.activity,
        iaeCode: data.iaeCode || null,
        tariff: data.tariff || null,
        addressLine: data.addressLine,
        postalCode: data.postalCode,
        city: data.city,
        province: data.province || null,
        zone: data.zone || null,
        authorizedPersons: data.authorizedPersons,
        documentationStatus,
        legalAccepted: data.legalAccepted ?? false,
        source: "qr",
        notes: data.notes || null,
      },
    });

    const documentationLines = renderDocumentationLines(
      data.type,
      documentationStatus,
    );

    const lines = [
      `Tipo: ${data.type === "empresa" ? "Empresa" : "Autónomo"}`,
      `Nombre fiscal: ${data.legalName}`,
      `Nombre comercial: ${data.commercialName || "-"}`,
      `NIF/CIF: ${data.nifCif}`,
      `Actividad: ${data.activity}`,
      `Código IAE: ${data.iaeCode || "-"}`,
      `Tarifa: ${data.tariff || "-"}`,
      `Dirección: ${data.addressLine}`,
      `Código postal: ${data.postalCode}`,
      `Población: ${data.city}`,
      `Provincia: ${data.province || "-"}`,
      `Zona: ${data.zone || "-"}`,
      `Teléfono: ${data.phone || "-"}`,
      `Móvil: ${data.mobile || "-"}`,
      `Email: ${data.email || "-"}`,
      `Autorizados: ${
        data.authorizedPersons.length > 0
          ? data.authorizedPersons
              .map((person) => `${person.name} (${person.nif})`)
              .join(", ")
          : "-"
      }`,
      `Observaciones: ${data.notes || "-"}`,
      `Aceptación legal: ${data.legalAccepted ? "Sí" : "No"}`,
    ];

    const htmlRows = [
      ["Tipo", data.type === "empresa" ? "Empresa" : "Autónomo"],
      ["Nombre fiscal", data.legalName],
      ["Nombre comercial", data.commercialName || "-"],
      ["NIF/CIF", data.nifCif],
      ["Actividad", data.activity],
      ["Código IAE", data.iaeCode || "-"],
      ["Tarifa", data.tariff || "-"],
      ["Dirección", data.addressLine],
      ["Código postal", data.postalCode],
      ["Población", data.city],
      ["Provincia", data.province || "-"],
      ["Zona", data.zone || "-"],
      ["Teléfono", data.phone || "-"],
      ["Móvil", data.mobile || "-"],
      ["Email", data.email || "-"],
      [
        "Personas autorizadas",
        data.authorizedPersons.length > 0
          ? data.authorizedPersons
              .map((person) => `${person.name} (${person.nif})`)
              .join("<br />")
          : "-",
      ],
      ["Observaciones", data.notes || "-"],
      ["Aceptación legal", data.legalAccepted ? "Sí" : "No"],
    ];

    await sendEmail({
      to: siteData.contact.email,
      subject: `Nueva alta de cliente: ${submission.legalName}`,
      text: [
        "Nueva alta de cliente",
        "",
        ...lines,
        "",
        "Documentación:",
        ...documentationLines.map((item) => `- ${item.label}: ${item.status}`),
      ].join("\n"),
      html: `
        <h1>Nueva alta de cliente</h1>
        <table cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <tbody>
            ${htmlRows
              .map(
                ([label, value]) =>
                  `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${value.includes("<br />") ? value : escapeHtml(value)}</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
        <h2>Documentación</h2>
        <ul>
          ${documentationLines
            .map(
              (item) =>
                `<li><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.status)}</li>`,
            )
            .join("")}
        </ul>
      `,
    });

    return NextResponse.json({ ok: true, id: submission.id });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "No se pudo enviar la solicitud.",
      },
      { status: 500 },
    );
  }
}
