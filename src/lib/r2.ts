import "server-only";

import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import path from "path";

import { getEnv } from "@/lib/env";

const ALLOWED_FOLDERS = new Set(["memberships", "slides", "media"]);
const ensuredBuckets = new Map<string, Promise<void>>();

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

function getPublicBucketName() {
  return getEnv().R2_PUBLIC_BUCKET_NAME;
}

function getPrivateBucketName() {
  return getEnv().R2_PRIVATE_BUCKET_NAME;
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

async function ensureBucketExists(bucketName: string) {
  const existing = ensuredBuckets.get(bucketName);
  if (existing) {
    return existing;
  }

  const pending = (async () => {
    const client = getR2Client();

    try {
      await client.send(
        new HeadBucketCommand({
          Bucket: bucketName,
        }),
      );
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const name = typeof error === "object" && error !== null && "name" in error ? String(error.name) : "";
      const missingBucket =
        name === "NotFound" ||
        name === "NoSuchBucket" ||
        message.includes("does not exist") ||
        message.includes("NotFound") ||
        message.includes("NoSuchBucket");

      if (!missingBucket) {
        throw error;
      }
    }

    await client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
      }),
    );
  })().catch((error) => {
    ensuredBuckets.delete(bucketName);
    throw error;
  });

  ensuredBuckets.set(bucketName, pending);
  return pending;
}

export function getPublicUrl(key: string) {
  const env = getEnv();
  return `${env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
}

export async function uploadFile(file: File, folder: "memberships" | "slides" | "media") {
  if (!ALLOWED_FOLDERS.has(folder)) {
    throw new Error("Invalid upload folder");
  }

  const key = `${folder}/${randomUUID()}-${sanitizeFilename(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const bucketName =
    folder === "memberships" ? getPrivateBucketName() : getPublicBucketName();
  await ensureBucketExists(bucketName);

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
      ContentLength: buffer.byteLength,
    }),
  );

  return {
    key,
    url: folder === "memberships" ? undefined : getPublicUrl(key),
  };
}

export async function getPrivateSignedUrl(key: string) {
  const env = getEnv();
  await ensureBucketExists(getPrivateBucketName());

  return getSignedUrl(
    getR2Client(),
    new GetObjectCommand({
      Bucket: getPrivateBucketName(),
      Key: key,
    }),
    {
      expiresIn: env.R2_PRIVATE_URL_EXPIRES_SECONDS ?? 900,
    },
  );
}

export async function deleteFile(key: string, folder: "memberships" | "slides" | "media") {
  const bucketName =
    folder === "memberships" ? getPrivateBucketName() : getPublicBucketName();
  await ensureBucketExists(bucketName);

  await getR2Client().send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );
}
