import "server-only";

import nodemailer from "nodemailer";

import { getEnv } from "@/lib/env";

function getTransporter() {
  const env = getEnv();

  if (
    !env.SMTP_HOST ||
    !env.SMTP_PORT ||
    !env.SMTP_USER ||
    !env.SMTP_PASSWORD ||
    !env.SMTP_FROM
  ) {
    throw new Error("SMTP configuration is incomplete");
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE ?? false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
}

export async function sendEmail(params: {
  subject: string;
  html: string;
  text: string;
  to: string | string[];
}) {
  const env = getEnv();

  await getTransporter().sendMail({
    from: env.SMTP_FROM,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });
}
