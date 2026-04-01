import { z } from "zod";

import { getRequiredDocuments } from "@/lib/registrations/requiredDocuments";
import type {
  MissingRequirements,
  RegistrationDraftData,
  StepValidationResult,
} from "@/lib/registrations/types";

const emailSchema = z.string().trim().email("Introduce un email válido.");

function hasValue(value: string) {
  return value.trim().length > 0;
}

function normalizeTaxId(value: string) {
  return value.replaceAll(/\s+/g, "").toUpperCase();
}

export function isValidEmail(email: string) {
  return emailSchema.safeParse(email).success;
}

export function getStepErrors(step: number, data: RegistrationDraftData): StepValidationResult {
  const fieldErrors: Record<string, string> = {};

  if (step === 1) {
    if (!data.clientType) {
      fieldErrors.clientType = "Selecciona si eres autónomo o empresa.";
    }
    if (!hasValue(data.razonSocial)) {
      fieldErrors.razonSocial = "La razón social es obligatoria.";
    } else if (data.razonSocial.trim().length < 2) {
      fieldErrors.razonSocial = "Indica un nombre o razón social con al menos 2 caracteres.";
    }
    if (!hasValue(data.nifCif)) {
      fieldErrors.nifCif = "El NIF/CIF es obligatorio.";
    }
  }

  if (step === 2) {
    if (!hasValue(data.direccion)) {
      fieldErrors.direccion = "La dirección es obligatoria.";
    }
    if (!hasValue(data.codigoPostal)) {
      fieldErrors.codigoPostal = "El código postal es obligatorio.";
    } else if (!/^\d{5}$/.test(data.codigoPostal.trim())) {
      fieldErrors.codigoPostal = "El código postal debe tener 5 dígitos.";
    }
    if (!hasValue(data.poblacion)) {
      fieldErrors.poblacion = "La población es obligatoria.";
    }
    if (!hasValue(data.telefono) && !hasValue(data.movil)) {
      fieldErrors.contact = "Indica al menos un teléfono o móvil.";
    }
    if (!hasValue(data.email)) {
      fieldErrors.contact = "Indica un email y al menos un teléfono o móvil.";
    }
    if (hasValue(data.email) && !isValidEmail(data.email)) {
      fieldErrors.email = "Introduce un email válido.";
    }
  }

  if (step === 3) {
    data.personasAutorizadas.forEach((person, index) => {
      const hasPartialRow = hasValue(person.nombre) || hasValue(person.nif);
      if (!hasPartialRow) {
        return;
      }

      if (!hasValue(person.nombre)) {
        fieldErrors[`personasAutorizadas.${index}.nombre`] = "Completa el nombre.";
      }
      if (!hasValue(person.nif)) {
        fieldErrors[`personasAutorizadas.${index}.nif`] = "Completa el NIF.";
      }
    });
  }

  if (step === 5) {
    const aggregate = getAllValidationErrors(data, data.documents);
    aggregate.fields.forEach((field) => {
      fieldErrors[field] = "Revisa este dato.";
    });
    if (aggregate.documents.length > 0) {
      fieldErrors.documents = "Falta documentación obligatoria.";
    }
  }

  const summary = Object.values(fieldErrors);

  return {
    isValid: summary.length === 0,
    fieldErrors,
    summary,
  };
}

export function getMissingRequiredDocuments(data: RegistrationDraftData) {
  const required = getRequiredDocuments(data.clientType);
  return required
    .filter((doc) => !data.documents.some((item) => item.type === doc.type))
    .map((doc) => doc.label);
}

export function getMissingRequirements(data: RegistrationDraftData): MissingRequirements {
  const missingFields: string[] = [];

  if (!hasValue(data.clientType)) {
    missingFields.push("Tipo de cliente");
  }
  if (!hasValue(data.razonSocial)) {
    missingFields.push("Razón social");
  }
  if (!hasValue(data.nifCif)) {
    missingFields.push("NIF/CIF");
  }
  if (!hasValue(data.direccion)) {
    missingFields.push("Dirección");
  }
  if (!hasValue(data.codigoPostal)) {
    missingFields.push("Código postal");
  } else if (!/^\d{5}$/.test(data.codigoPostal.trim())) {
    missingFields.push("Código postal válido");
  }
  if (!hasValue(data.poblacion)) {
    missingFields.push("Población");
  }
  if (!hasValue(data.telefono) && !hasValue(data.movil)) {
    missingFields.push("Teléfono o móvil");
  }
  if (!hasValue(data.email)) {
    missingFields.push("Email");
  }
  if (hasValue(data.email) && !isValidEmail(data.email)) {
    missingFields.push("Email válido");
  }

  data.personasAutorizadas.forEach((person, index) => {
    const hasPartialRow = hasValue(person.nombre) || hasValue(person.nif);
    if (!hasPartialRow) {
      return;
    }
    if (!hasValue(person.nombre) || !hasValue(person.nif)) {
      missingFields.push(`Persona autorizada ${index + 1}`);
    }
  });

  return {
    missingFields,
    missingDocuments: getMissingRequiredDocuments(data),
  };
}

export function getAllValidationErrors(
  data: RegistrationDraftData,
  _documents = data.documents,
) {
  const stepOne = getStepErrors(1, data);
  const stepTwo = getStepErrors(2, data);
  const stepThree = getStepErrors(3, data);
  const requirements = getMissingRequirements(data);

  return {
    fields: [
      ...new Set([
        ...Object.keys(stepOne.fieldErrors),
        ...Object.keys(stepTwo.fieldErrors),
        ...Object.keys(stepThree.fieldErrors),
      ]),
    ],
    documents: requirements.missingDocuments,
  };
}

export function sanitizeRegistrationData(data: RegistrationDraftData): RegistrationDraftData {
  return {
    ...data,
    nifCif: normalizeTaxId(data.nifCif),
    email: data.email.trim(),
    telefono: data.telefono.trim(),
    movil: data.movil.trim(),
    codigoPostal: data.codigoPostal.trim(),
    provincia: data.provincia.trim(),
    personasAutorizadas: data.personasAutorizadas.map((person) => ({
      ...person,
      nombre: person.nombre.trim(),
      nif: normalizeTaxId(person.nif),
    })),
  };
}
