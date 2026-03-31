import { z } from "zod";

export const membershipTypes = ["autonomo", "empresa"] as const;
export const documentationStates = ["pending", "delivered"] as const;

export type MembershipType = (typeof membershipTypes)[number];
export type DocumentationState = (typeof documentationStates)[number];

export const membershipFileTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
const CIF_CONTROL_MAP = "JABCDEFGHI";

const phoneField = z
  .string()
  .trim()
  .max(20, "Demasiados caracteres.")
  .optional()
  .or(z.literal(""));

const textField = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().or(z.literal(""));

const authorizedPersonSchema = z.object({
  name: z.string().trim().min(2, "Indica el nombre.").max(120, "Nombre demasiado largo."),
  nif: z
    .string()
    .trim()
    .transform(normalizeTaxId)
    .refine((value) => isValidSpanishTaxId(value), "NIF no válido."),
});

export const membershipSchema = z
  .object({
    legalName: z.string().trim().min(2, "Indica el nombre fiscal.").max(140, "Nombre demasiado largo."),
    commercialName: textField(120, "Nombre comercial demasiado largo."),
    email: z.string().trim().email("Introduce un email válido.").optional().or(z.literal("")),
    phone: phoneField,
    mobile: phoneField,
    nifCif: z
      .string()
      .trim()
      .min(1, "Indica el NIF o CIF.")
      .transform(normalizeTaxId),
    type: z.enum(membershipTypes),
    activity: z.string().trim().min(2, "Indica la actividad.").max(140, "Actividad demasiado larga."),
    iaeCode: textField(20, "Código IAE demasiado largo."),
    tariff: textField(60, "Tarifa demasiado larga."),
    addressLine: z.string().trim().min(5, "Indica la dirección.").max(180, "Dirección demasiado larga."),
    postalCode: z
      .string()
      .trim()
      .regex(/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/, "Código postal no válido."),
    city: z.string().trim().min(2, "Indica la población.").max(100, "Población demasiado larga."),
    province: textField(100, "Provincia demasiado larga."),
    zone: textField(80, "Zona demasiado larga."),
    authorizedPersons: z.array(authorizedPersonSchema).max(8, "Máximo 8 personas autorizadas."),
    documentationStatus: z.record(z.string(), z.enum(documentationStates)),
    notes: textField(1000, "Observaciones demasiado largas."),
    legalAccepted: z.boolean().optional().default(false),
  })
  .superRefine((value, ctx) => {
    const inferredType = inferMembershipTypeFromTaxId(value.nifCif);

    if (!isValidTaxIdForType(value.nifCif, value.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nifCif"],
        message:
          value.type === "empresa"
            ? "Introduce un CIF válido."
            : "Introduce un NIF/NIE válido.",
      });
    }

    if (!value.email && !value.phone && !value.mobile) {
      for (const field of ["email", "phone", "mobile"] as const) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: "Indica al menos un medio de contacto.",
        });
      }
    }

    for (const field of [
      { key: "phone", label: "Teléfono" },
      { key: "mobile", label: "Móvil" },
    ] as const) {
      const rawValue = value[field.key];
      if (rawValue && !isValidSpanishPhone(rawValue)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field.key],
          message: `${field.label} no válido.`,
        });
      }
    }

    const expectedDocs = getDocumentationKeys(value.type);
    for (const docKey of expectedDocs) {
      if (!value.documentationStatus[docKey]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["documentationStatus", docKey],
          message: "Selecciona un estado.",
        });
      }
    }

    if (inferredType && inferredType !== value.type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["type"],
        message: "El tipo no coincide con el documento fiscal.",
      });
    }
  });

export type MembershipFormValues = z.input<typeof membershipSchema>;
export type MembershipSubmissionInput = z.output<typeof membershipSchema>;

export const membershipDefaultValues: MembershipFormValues = {
  legalName: "",
  commercialName: "",
  email: "",
  phone: "",
  mobile: "",
  nifCif: "",
  type: "autonomo",
  activity: "",
  iaeCode: "",
  tariff: "",
  addressLine: "",
  postalCode: "",
  city: "",
  province: "",
  zone: "",
  authorizedPersons: [],
  documentationStatus: {
    dni: "pending",
    autonomoProof: "pending",
  },
  notes: "",
  legalAccepted: false,
};

export const loginSchema = z.object({
  email: z.string().email("Introduce un email válido."),
  password: z.string().min(1, "Introduce la contraseña."),
});

export function normalizeTaxId(value: string) {
  return value.replaceAll(/[\s-]/g, "").toUpperCase();
}

export function normalizePhone(value: string) {
  const digits = value.replaceAll(/\D/g, "").slice(0, 12);

  if (digits.startsWith("34") && digits.length > 9) {
    return `+34 ${digits.slice(2).replace(/(\d{3})(?=\d)/g, "$1 ").trim()}`.trim();
  }

  return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

export function isValidSpanishPhone(value: string) {
  const digits = value.replaceAll(/\D/g, "");
  return /^(34)?[6789]\d{8}$/.test(digits);
}

export function inferMembershipTypeFromTaxId(value: string): MembershipType | null {
  const normalized = normalizeTaxId(value);

  if (isValidNif(normalized) || isValidNie(normalized)) {
    return "autonomo";
  }

  if (isValidCif(normalized)) {
    return "empresa";
  }

  return null;
}

export function isValidSpanishTaxId(value: string) {
  const normalized = normalizeTaxId(value);
  return isValidNif(normalized) || isValidNie(normalized) || isValidCif(normalized);
}

export function isValidTaxIdForType(value: string, type: MembershipType) {
  const normalized = normalizeTaxId(value);
  return type === "empresa"
    ? isValidCif(normalized)
    : isValidNif(normalized) || isValidNie(normalized);
}

export function getDocumentationKeys(type: MembershipType) {
  return type === "empresa"
    ? (["cif", "modelo036"] as const)
    : (["dni", "autonomoProof"] as const);
}

export function getDocumentationConfig(type: MembershipType) {
  return type === "empresa"
    ? [
        { key: "cif", label: "CIF", hint: "Documento fiscal de la empresa" },
        { key: "modelo036", label: "Modelo 036/037", hint: "Alta o modificación censal" },
      ]
    : [
        { key: "dni", label: "DNI", hint: "Documento identificativo" },
        { key: "autonomoProof", label: "Alta autónomo", hint: "Justificante de alta" },
      ];
}

export function buildDocumentationStatus(type: MembershipType, current?: Record<string, DocumentationState>) {
  return Object.fromEntries(
    getDocumentationKeys(type).map((key) => [key, current?.[key] ?? "pending"]),
  ) as Record<string, DocumentationState>;
}

export function validateUploadFile(
  file: File | null,
  {
    required,
    label,
    allowedTypes = membershipFileTypes,
  }: {
    required: boolean;
    label: string;
    allowedTypes?: string[];
  },
) {
  if (!file || file.size === 0) {
    if (required) {
      throw new Error(`${label} es obligatorio.`);
    }

    return null;
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${label} no tiene un formato compatible.`);
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`${label} supera el máximo de 10 MB.`);
  }

  return file;
}

function isValidNif(value: string) {
  if (!/^\d{8}[A-Z]$/.test(value)) {
    return false;
  }

  const number = Number.parseInt(value.slice(0, 8), 10);
  return value[8] === DNI_LETTERS[number % 23];
}

function isValidNie(value: string) {
  if (!/^[XYZ]\d{7}[A-Z]$/.test(value)) {
    return false;
  }

  const prefix = value[0] === "X" ? "0" : value[0] === "Y" ? "1" : "2";
  return isValidNif(`${prefix}${value.slice(1)}`);
}

function isValidCif(value: string) {
  if (!/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(value)) {
    return false;
  }

  const controlLetter = value[0];
  const digits = value.slice(1, 8);
  const control = value[8];

  let evenSum = 0;
  let oddSum = 0;

  for (let index = 0; index < digits.length; index += 1) {
    const digit = Number.parseInt(digits[index], 10);

    if (index % 2 === 0) {
      const doubled = digit * 2;
      oddSum += Math.floor(doubled / 10) + (doubled % 10);
    } else {
      evenSum += digit;
    }
  }

  const checksum = (10 - ((evenSum + oddSum) % 10)) % 10;
  const expectedDigit = String(checksum);
  const expectedLetter = CIF_CONTROL_MAP[checksum];

  if ("PQRSNW".includes(controlLetter)) {
    return control === expectedLetter;
  }

  if ("ABEH".includes(controlLetter)) {
    return control === expectedDigit;
  }

  return control === expectedDigit || control === expectedLetter;
}
