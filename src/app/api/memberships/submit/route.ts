import { NextResponse } from "next/server";

import { sendEmail } from "@/lib/mail";
import { membershipSchema, validateUploadFile } from "@/lib/membership";
import { prisma } from "@/lib/prisma";
import { deleteFile, uploadFile } from "@/lib/r2";

export const dynamic = "force-dynamic";

function buildEmailContent(params: {
  legalName: string;
  commercialName?: string;
  email: string;
  phone: string;
  nifCif: string;
  type: string;
  notes?: string;
  hasDniFile: boolean;
  hasModelFile: boolean;
  hasCertificateFile: boolean;
}) {
  const lines = [
    `Razón social / Nombre legal: ${params.legalName}`,
    `Nombre comercial: ${params.commercialName || "-"}`,
    `Email: ${params.email}`,
    `Teléfono: ${params.phone}`,
    `NIF/CIF: ${params.nifCif}`,
    `Tipo: ${params.type}`,
    `Notas: ${params.notes || "-"}`,
    `Documento DNI/CIF: ${params.hasDniFile ? "Adjuntado (ver backoffice)" : "-"}`,
    `Modelo 21/62: ${params.hasModelFile ? "Adjuntado (ver backoffice)" : "-"}`,
    `Certificado autónomo: ${params.hasCertificateFile ? "Adjuntado (ver backoffice)" : "-"}`,
  ];

  return {
    text: lines.join("\n"),
    html: `
      <h1>Nueva solicitud de socio</h1>
      <ul>
        ${lines.map((line) => `<li>${line}</li>`).join("")}
      </ul>
    `,
  };
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const parsed = membershipSchema.safeParse({
    legalName: formData.get("legalName"),
    commercialName: formData.get("commercialName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    nifCif: formData.get("nifCif"),
    type: formData.get("type"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Revisa los campos del formulario.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const uploadedKeys: string[] = [];

  try {
    const dniFile = validateUploadFile(formData.get("dniFile") as File | null, {
      required: true,
      label: "El documento DNI/CIF",
    });
    const modelFile = validateUploadFile(formData.get("modelFile") as File | null, {
      required: false,
      label: "El modelo 21/62",
    });
    const certificateFile = validateUploadFile(
      formData.get("certificateFile") as File | null,
      {
        required: false,
        label: "El certificado de autónomo",
      },
    );

    const dniUpload = dniFile ? await uploadFile(dniFile, "memberships") : null;
    const modelUpload = modelFile
      ? await uploadFile(modelFile, "memberships")
      : null;
    const certificateUpload = certificateFile
      ? await uploadFile(certificateFile, "memberships")
      : null;

    for (const key of [
      dniUpload?.key,
      modelUpload?.key,
      certificateUpload?.key,
    ]) {
      if (key) {
        uploadedKeys.push(key);
      }
    }

    const submission = await prisma.membershipSubmission.create({
      data: {
        ...parsed.data,
        commercialName: parsed.data.commercialName || null,
        notes: parsed.data.notes || null,
        dniFileUrl: null,
        dniFileKey: dniUpload?.key,
        modelFileUrl: null,
        modelFileKey: modelUpload?.key,
        certificateUrl: null,
        certificateKey: certificateUpload?.key,
      },
    });

    const emailContent = buildEmailContent({
      ...parsed.data,
      hasDniFile: Boolean(dniUpload?.key),
      hasModelFile: Boolean(modelUpload?.key),
      hasCertificateFile: Boolean(certificateUpload?.key),
    });

    await sendEmail({
    //   to: siteData.contact.email,
      to: "sergioacostaquintana@gmail.com",
      subject: `Nueva solicitud de socio: ${submission.legalName}`,
      html: emailContent.html,
      text: emailContent.text,
    });

    return NextResponse.json({ ok: true, id: submission.id });
  } catch (error) {
    await Promise.all(
      uploadedKeys.map(async (key) => {
        try {
          await deleteFile(key, "memberships");
        } catch {
          // Best-effort cleanup only.
        }
      }),
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo enviar la solicitud.",
      },
      { status: 500 },
    );
  }
}
