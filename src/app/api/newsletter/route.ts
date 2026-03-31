import { NextResponse } from "next/server";

import siteData from "@/data/siteData.json";
import { newsletterSubscriptionSchema } from "@/lib/form-submissions";
import { sendEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSubscriptionSchema.safeParse(body);

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

    const subscription = await prisma.newsletterSubscription.create({
      data: {
        email: parsed.data.email,
      },
    });

    await sendEmail({
      to: siteData.contact.email,
      subject: "Nueva suscripción a la newsletter",
      text: `Email: ${subscription.email}`,
      html: `
        <h1>Nueva suscripción a la newsletter</h1>
        <p><strong>Email:</strong> ${subscription.email}</p>
      `,
    });

    return NextResponse.json({ ok: true, id: subscription.id });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al registrar la suscripción.",
      },
      { status: 500 },
    );
  }
}
