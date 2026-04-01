"use client";

import { useState } from "react";

type SubmitStatus = "idle" | "success" | "error";

export function useFormSubmit<T extends { honeypot?: string }>(endpoint: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  async function submit(data: T, onSuccess?: () => void) {
    if (data.honeypot) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        onSuccess?.();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetStatus() {
    setSubmitStatus("idle");
  }

  return { isSubmitting, submitStatus, submit, resetStatus };
}
