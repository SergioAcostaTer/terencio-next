import { getRequiredDocuments } from "@/lib/registrations/requiredDocuments";
import type { RegistrationDraftData } from "@/lib/registrations/types";
import { getMissingRequirements } from "@/lib/registrations/validation";

const SECTION_WEIGHTS = {
  company: 28,
  contact: 26,
  authorized: 10,
  documents: 22,
  review: 14,
} as const;

export function calculateCompletionPercentage(data: RegistrationDraftData) {
  let score = 0;

  const companyChecks = [data.clientType, data.razonSocial, data.nifCif];
  score += (companyChecks.filter(Boolean).length / companyChecks.length) * SECTION_WEIGHTS.company;

  const contactChecks = [
    data.direccion,
    data.codigoPostal,
    data.poblacion,
    data.telefono || data.movil || data.email,
  ];
  score += (contactChecks.filter(Boolean).length / contactChecks.length) * SECTION_WEIGHTS.contact;

  const authorizedValid =
    data.personasAutorizadas.length === 0 ||
    data.personasAutorizadas.every((person) => {
      const empty = !person.nombre.trim() && !person.nif.trim();
      const full = person.nombre.trim() && person.nif.trim();
      return empty || full;
    });
  score += authorizedValid ? SECTION_WEIGHTS.authorized : SECTION_WEIGHTS.authorized / 2;

  const requiredDocuments = getRequiredDocuments(data.clientType);
  const uploadedRequiredCount = requiredDocuments.filter((doc) =>
    data.documents.some((item) => item.type === doc.type),
  ).length;
  score += requiredDocuments.length > 0
    ? (uploadedRequiredCount / requiredDocuments.length) * SECTION_WEIGHTS.documents
    : 0;

  const missing = getMissingRequirements(data);
  score += missing.missingFields.length === 0 && missing.missingDocuments.length === 0
    ? SECTION_WEIGHTS.review
    : SECTION_WEIGHTS.review * 0.35;

  return Math.max(0, Math.min(100, Math.round(score)));
}
