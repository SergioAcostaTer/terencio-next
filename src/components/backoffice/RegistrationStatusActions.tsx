"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import type { RegistrationStatus } from "@/lib/registrations/types";

const ACTIONS: Array<{ status: RegistrationStatus; label: string; variant: "outline" | "primary" | "danger" }> = [
  { status: "review_pending", label: "Marcar revisión", variant: "outline" },
  { status: "approved", label: "Aprobar", variant: "primary" },
  { status: "rejected", label: "Rechazar", variant: "danger" },
];

export default function RegistrationStatusActions({ registrationId }: { registrationId: string }) {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<RegistrationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(status: RegistrationStatus) {
    setPendingStatus(status);
    setError(null);

    try {
      const response = await fetch(`/api/backoffice/registrations/${registrationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "No se pudo actualizar el estado.");
      }

      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo actualizar el estado.");
    } finally {
      setPendingStatus(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((action) => (
          <Button
            key={action.status}
            type="button"
            size="sm"
            variant={action.variant}
            onClick={() => void updateStatus(action.status)}
            disabled={pendingStatus !== null}
          >
            {pendingStatus === action.status ? "Guardando..." : action.label}
          </Button>
        ))}
      </div>
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}
