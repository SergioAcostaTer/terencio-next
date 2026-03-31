import { NextResponse } from "next/server";

import siteData from "@/data/siteData.json";
import { professionalSubmissionSchema } from "@/lib/form-submissions";
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = professionalSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (parsed.data.honeypot) {
      return NextResponse.json({ ok: true });
    }

    const submission = await prisma.professionalSubmission.create({
      data: {
        businessName: parsed.data.businessName,
        sector: parsed.data.sector,
        email: parsed.data.email,
        phone: parsed.data.phone,
      },
    });

    await sendEmail({
      to: siteData.contact.email,
      subject: "Nueva solicitud de tarifas mayoristas",
      text: [
        `Negocio: ${submission.businessName}`,
        `Sector: ${submission.sector}`,
        `Email: ${submission.email}`,
        `Teléfono: ${submission.phone}`,
      ].join("\n"),
      html: `
        <h1>Nueva solicitud profesional</h1>
        <p><strong>Negocio:</strong> ${escapeHtml(submission.businessName)}</p>
        <p><strong>Sector:</strong> ${escapeHtml(submission.sector)}</p>
        <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(submission.phone)}</p>
      `,
    });

    return NextResponse.json({ ok: true, id: submission.id });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al enviar la solicitud.",
      },
      { status: 500 },
    );
  }
}
