import { NextResponse } from "next/server";

import siteData from "@/data/siteData.json";
import { contactSubmissionSchema } from "@/lib/form-submissions";
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
    const parsed = contactSubmissionSchema.safeParse(body);

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

    const submission = await prisma.contactSubmission.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        topic: parsed.data.topic,
        message: parsed.data.message,
      },
    });

    await sendEmail({
      to: siteData.contact.email,
      subject: `Nuevo mensaje Web: ${submission.topic}`,
      text: [
        `Nombre: ${submission.name}`,
        `Email: ${submission.email}`,
        `Teléfono: ${submission.phone}`,
        `Motivo: ${submission.topic}`,
        `Mensaje: ${submission.message}`,
      ].join("\n"),
      html: `
        <h1>Nuevo mensaje de contacto</h1>
        <p><strong>Nombre:</strong> ${escapeHtml(submission.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(submission.phone)}</p>
        <p><strong>Motivo:</strong> ${escapeHtml(submission.topic)}</p>
        <p><strong>Mensaje:</strong><br />${escapeHtml(submission.message).replaceAll("\n", "<br />")}</p>
      `,
    });

    return NextResponse.json({ ok: true, id: submission.id });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al enviar el mensaje.",
      },
      { status: 500 },
    );
  }
}
