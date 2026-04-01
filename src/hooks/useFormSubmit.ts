"use client";

import { useState } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

type SubmitStatus = "idle" | "success" | "error";
type FieldErrorMap<T extends FieldValues> = Partial<Record<Path<T>, string[] | undefined>>;

type UseFormSubmitOptions<T extends FieldValues> = {
  setError?: UseFormSetError<T>;
};

export function useFormSubmit<T extends FieldValues & { honeypot?: string }>(
  endpoint: string,
  options: UseFormSubmitOptions<T> = {},
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function submit(data: T, onSuccess?: () => void) {
    if (data.honeypot) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitError(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: FieldErrorMap<T>;
      } | null;

      if (response.ok) {
        setSubmitStatus("success");
        onSuccess?.();
      } else {
        if (payload?.fieldErrors && options.setError) {
          for (const [fieldName, messages] of Object.entries(payload.fieldErrors)) {
            const fieldMessages = Array.isArray(messages) ? messages : [];
            const message = fieldMessages[0];

            if (!message) {
              continue;
            }

            options.setError(fieldName as Path<T>, {
              type: "server",
              message,
            });
          }
        }

        setSubmitError(payload?.error ?? "No se pudo enviar el formulario.");
        setSubmitStatus("error");
      }
    } catch {
      setSubmitError("No se pudo completar la solicitud. Inténtalo de nuevo.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetStatus() {
    setSubmitStatus("idle");
    setSubmitError(null);
  }

  return { isSubmitting, submitStatus, submitError, submit, resetStatus };
}
