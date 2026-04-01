import "server-only";

import {
  createEmptyRegistrationDraftData,
  type RegistrationDetail,
  type RegistrationDraftPayload,
  type RegistrationFilters,
  type RegistrationRecord,
  type RegistrationStatus,
} from "@/lib/registrations/types";
import { calculateCompletionPercentage } from "@/lib/registrations/completion";
import { getRegistrationRepository } from "@/lib/registrations/repository";
import { sanitizeRegistrationData, getMissingRequirements } from "@/lib/registrations/validation";

function clampStep(step: number) {
  return Math.max(1, Math.min(5, Number.isFinite(step) ? step : 1));
}

function buildRecord(input: {
  existing?: RegistrationRecord | null;
  payload: RegistrationDraftPayload;
  status?: RegistrationStatus;
}) {
  const now = new Date().toISOString();
  const sanitizedData = sanitizeRegistrationData({
    ...createEmptyRegistrationDraftData(),
    ...input.payload.data,
  });

  return {
    id: input.existing?.id ?? crypto.randomUUID(),
    status: input.status ?? input.existing?.status ?? "draft",
    completionPercentage: calculateCompletionPercentage(sanitizedData),
    currentStep: clampStep(input.payload.currentStep),
    data: sanitizedData,
    createdAt: input.existing?.createdAt ?? now,
    updatedAt: now,
    submittedAt: input.existing?.submittedAt ?? null,
  } satisfies RegistrationRecord;
}

export async function saveRegistrationDraft(payload: RegistrationDraftPayload) {
  const repository = getRegistrationRepository();

  if (payload.id) {
    const existing = await repository.getById(payload.id);
    if (!existing) {
      throw new Error("Draft not found");
    }

    const nextRecord = buildRecord({ existing, payload, status: "draft" });
    return repository.updateDraft(existing.id, nextRecord);
  }

  const newRecord = buildRecord({ payload, status: "draft" });
  return repository.createDraft(newRecord);
}

export async function getRegistrationDraftById(id: string) {
  return getRegistrationRepository().getById(id);
}

export async function submitRegistration(id: string) {
  const repository = getRegistrationRepository();
  const existing = await repository.getById(id);

  if (!existing) {
    throw new Error("Draft not found");
  }

  const missing = getMissingRequirements(existing.data);
  if (missing.missingFields.length > 0 || missing.missingDocuments.length > 0) {
    return {
      success: false as const,
      errors: {
        fields: missing.missingFields,
        documents: missing.missingDocuments,
      },
    };
  }

  const nextRecord: RegistrationRecord = {
    ...existing,
    status: "review_pending",
    completionPercentage: 100,
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true as const,
    record: await repository.updateDraft(id, nextRecord),
  };
}

export async function listRegistrations(filters?: RegistrationFilters) {
  return getRegistrationRepository().list(filters);
}

export async function getRegistrationDetail(id: string): Promise<RegistrationDetail | null> {
  const record = await getRegistrationRepository().getById(id);
  if (!record) {
    return null;
  }

  const missing = getMissingRequirements(record.data);
  return {
    record,
    missingFields: missing.missingFields,
    missingDocuments: missing.missingDocuments,
    readyForReview:
      missing.missingFields.length === 0 &&
      missing.missingDocuments.length === 0 &&
      record.status !== "draft",
  };
}

export async function transitionRegistrationStatus(id: string, status: RegistrationStatus) {
  return getRegistrationRepository().updateStatus(id, status);
}
