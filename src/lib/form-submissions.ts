import { z } from "zod";

export const contactSubmissionSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Teléfono inválido"),
  topic: z.string().min(1, "Selecciona un motivo"),
  message: z.string().min(10, "Cuéntanos un poco más (mín. 10 caracteres)"),
  honeypot: z.string().optional(),
});

export const professionalSubmissionSchema = z.object({
  businessName: z.string().min(2, "El nombre del negocio es obligatorio"),
  sector: z.string().min(1, "Selecciona un sector"),
  email: z.string().email("Introduce un email válido"),
  phone: z.string().min(9, "Introduce un teléfono válido"),
  honeypot: z.string().optional(),
});

export const newsletterSubscriptionSchema = z.object({
  email: z.string().email("Introduce un email válido"),
  honeypot: z.string().optional(),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
export type ProfessionalSubmissionInput = z.infer<typeof professionalSubmissionSchema>;
export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionSchema>;
