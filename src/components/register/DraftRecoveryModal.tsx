"use client";

type DraftRecoveryModalProps = {
  currentStep: number;
  lastSavedAt: string | null;
  onContinue: () => void;
  onReset: () => void;
};

function formatDraftDate(value: string | null) {
  if (!value) {
    return "Borrador recuperado recientemente";
  }

  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function DraftRecoveryModal({
  currentStep,
  lastSavedAt,
  onContinue,
  onReset,
}: DraftRecoveryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <p className="text-2xl">📋</p>
        <h2 className="mt-3 text-lg font-semibold text-slate-950">Tienes un borrador guardado</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Guardado el {formatDraftDate(lastSavedAt)} · Paso {currentStep} de 5
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          Continuar donde lo dejaste
        </button>
        <button
          type="button"
          onClick={onReset}
          className="mt-3 inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Empezar de nuevo
        </button>
      </div>
    </div>
  );
}
