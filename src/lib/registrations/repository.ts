import "server-only";

import { prisma } from "@/lib/prisma";
import type {
  AuthorizedPerson,
  RegistrationDraftData,
  RegistrationFilters,
  RegistrationRecord,
  RegistrationStatus,
  UploadedDocument,
} from "@/lib/registrations/types";

function normalizeStatus(status: string): RegistrationStatus {
  if (status === "pending") {
    return "review_pending";
  }

  return status as RegistrationStatus;
}

export interface RegistrationRepository {
  createDraft(input: RegistrationRecord): Promise<RegistrationRecord>;
  updateDraft(id: string, input: RegistrationRecord): Promise<RegistrationRecord>;
  getById(id: string): Promise<RegistrationRecord | null>;
  list(filters?: RegistrationFilters): Promise<RegistrationRecord[]>;
  updateStatus(id: string, status: RegistrationStatus): Promise<RegistrationRecord>;
}

function asAuthorizedPersons(value: unknown): AuthorizedPerson[] {
  return Array.isArray(value) ? (value as AuthorizedPerson[]) : [];
}

function asUploadedDocuments(value: unknown): UploadedDocument[] {
  return Array.isArray(value) ? (value as UploadedDocument[]) : [];
}

function mapRecord(record: Awaited<ReturnType<typeof prisma.membershipSubmission.findUnique>>) {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    status: normalizeStatus(record.status),
    completionPercentage: record.completionPercentage,
    currentStep: record.currentStep,
    data: {
      clientType: (record.type as RegistrationDraftData["clientType"]) ?? "",
      razonSocial: record.legalName ?? "",
      nombreComercial: record.commercialName ?? "",
      actividad: record.activity ?? "",
      codigoIAE: record.iaeCode ?? "",
      tarifa: record.tariff ?? "",
      nifCif: record.nifCif ?? "",
      direccion: record.addressLine ?? "",
      codigoPostal: record.postalCode ?? "",
      poblacion: record.city ?? "",
      provincia: record.province ?? "",
      zona: record.zone ?? "",
      telefono: record.phone ?? "",
      movil: record.mobile ?? "",
      email: record.email ?? "",
      contactoPrincipal: "",
      personasAutorizadas: asAuthorizedPersons(record.authorizedPersons),
      observaciones: record.notes ?? "",
      documents: asUploadedDocuments(record.onboardingDocuments),
    },
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    submittedAt: record.submittedAt?.toISOString() ?? null,
  } satisfies RegistrationRecord;
}

function toPrismaData(input: RegistrationRecord) {
  return {
    legalName: input.data.razonSocial,
    commercialName: input.data.nombreComercial || null,
    email: input.data.email || "",
    phone: input.data.telefono || "",
    mobile: input.data.movil || null,
    nifCif: input.data.nifCif,
    type: input.data.clientType || "autonomo",
    activity: input.data.actividad || "",
    iaeCode: input.data.codigoIAE || null,
    tariff: input.data.tarifa || null,
    addressLine: input.data.direccion || "",
    postalCode: input.data.codigoPostal || "",
    city: input.data.poblacion || "",
    province: input.data.provincia || null,
    zone: input.data.zona || null,
    authorizedPersons: input.data.personasAutorizadas,
    documentationStatus: {},
    onboardingDocuments: input.data.documents,
    legalAccepted: true,
    source: "qr",
    notes: input.data.observaciones || null,
    status: input.status,
    currentStep: input.currentStep,
    completionPercentage: input.completionPercentage,
    submittedAt: input.submittedAt ? new Date(input.submittedAt) : new Date(input.createdAt),
    createdAt: new Date(input.createdAt),
    updatedAt: new Date(input.updatedAt),
  };
}

export class PrismaRegistrationRepository implements RegistrationRepository {
  async createDraft(input: RegistrationRecord) {
    const record = await prisma.membershipSubmission.create({
      data: {
        id: input.id,
        ...toPrismaData(input),
      },
    });

    return mapRecord(record)!;
  }

  async updateDraft(id: string, input: RegistrationRecord) {
    const record = await prisma.membershipSubmission.update({
      where: { id },
      data: toPrismaData(input),
    });

    return mapRecord(record)!;
  }

  async getById(id: string) {
    const record = await prisma.membershipSubmission.findUnique({
      where: { id },
    });

    return mapRecord(record);
  }

  async list(filters?: RegistrationFilters) {
    const statusFilter = filters?.status && filters.status !== "all" ? filters.status : undefined;
    const search = filters?.search?.trim();

    const records = await prisma.membershipSubmission.findMany({
      where: {
        ...(statusFilter
          ? statusFilter === "review_pending"
            ? { status: { in: ["review_pending", "pending"] } }
            : { status: statusFilter }
          : {}),
        ...(search
          ? {
              OR: [
                { legalName: { contains: search, mode: "insensitive" } },
                { commercialName: { contains: search, mode: "insensitive" } },
                { nifCif: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: "desc" },
    });

    return records.map((record) => mapRecord(record)!);
  }

  async updateStatus(id: string, status: RegistrationStatus) {
    const record = await prisma.membershipSubmission.update({
      where: { id },
      data: {
        status,
        submittedAt: status === "review_pending" || status === "submitted" ? new Date() : undefined,
      },
    });

    return mapRecord(record)!;
  }
}

let repository: RegistrationRepository | null = null;

export function getRegistrationRepository() {
  repository ??= new PrismaRegistrationRepository();
  return repository;
}
