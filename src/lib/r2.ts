import "server-only";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";

import { getEnv } from "@/lib/env";

const ALLOWED_FOLDERS = new Set(["memberships", "slides"]);

function getR2Client() {
  const env = getEnv();

  return new S3Client({
    region: "auto",
    endpoint: env.R2_ENDPOINT,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
}

function sanitizeFilename(filename: string) {
  const parsed = path.parse(filename);
  const base = parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
  const extension = parsed.ext.toLowerCase().replace(/[^a-z0-9.]/g, "");

  return `${base || "file"}${extension}`;
}

export function getPublicUrl(key: string) {
  const env = getEnv();
  return `${env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
}

export async function uploadFile(file: File, folder: "memberships" | "slides") {
  if (!ALLOWED_FOLDERS.has(folder)) {
    throw new Error("Invalid upload folder");
  }

  const env = getEnv();
  const key = `${folder}/${randomUUID()}-${sanitizeFilename(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
      ContentLength: buffer.byteLength,
    }),
  );

  return {
    key,
    url: getPublicUrl(key),
  };
}

export async function deleteFile(key: string) {
  const env = getEnv();

  await getR2Client().send(
    new DeleteObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
    }),
  );
}
