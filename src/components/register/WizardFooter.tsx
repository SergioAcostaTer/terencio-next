"use client";

import { Loader2 } from "lucide-react";

type WizardFooterProps = {
  currentStep: number;
  totalSteps: number;
  completionPercentage: number;
  canContinue: boolean;
  canSubmit: boolean;
  isSubmitting: boolean;
  saveState: "idle" | "saving" | "saved" | "error" | "local_only";
  legalAccepted: boolean;
  onLegalAcceptedChange: (value: boolean) => void;
  submitError: string | null;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

function saveLabel(saveState: WizardFooterProps["saveState"]) {
  if (saveState === "saving") {
    return { dot: "bg-slate-400 animate-pulse", text: "Guardando..." };
  }

  if (saveState === "local_only") {
    return { dot: "bg-slate-400", text: "Guardado localmente" };
  }

  return { dot: "bg-green-600", text: "Guardado" };
}

export default function WizardFooter({
  currentStep,
  totalSteps,
  completionPercentage,
  canContinue,
  canSubmit,
  isSubmitting,
  saveState,
  legalAccepted,
  onLegalAcceptedChange,
  submitError,
  onBack,
  onNext,
  onSubmit,
}: WizardFooterProps) {
  const isLastStep = currentStep === totalSteps;
  const saveMeta = saveLabel(saveState);
  const progressPercentage = Math.max(0, Math.min(100, Math.round((currentStep / totalSteps) * 100)));

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white">
      <div className="mx-auto h-[3px] max-w-2xl bg-slate-100">
        <div className="h-full bg-green-600 transition-[width]" style={{ width: `${progressPercentage}%` }} />
      </div>

      {submitError ? (
        <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
          {submitError}
        </div>
      ) : null}

      {isLastStep ? (
        <div className="border-t border-slate-200 px-4 py-3">
          <label className="mx-auto flex max-w-2xl items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={legalAccepted}
              onChange={(event) => onLegalAcceptedChange(event.target.checked)}
              className="h-4 w-4 shrink-0 rounded border-slate-300 text-green-700 focus:ring-green-200"
            />
            <span className="leading-5">
              He leído la{" "}
              <a
                href="/legal/politica-privacidad"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-slate-900 underline underline-offset-2"
              >
                política de privacidad
              </a>{" "}
              y acepto el tratamiento de mis datos para gestionar el alta.
            </span>
          </label>
        </div>
      ) : null}

      <div
        className="mx-auto flex h-[60px] max-w-2xl items-center justify-between gap-3 px-4"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
      >
        <div className="min-w-[64px]">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-0 py-3 text-sm font-medium text-slate-600 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Atrás
            </button>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col items-center justify-center text-center">
          <p className="text-xs text-slate-400">Paso {currentStep} de {totalSteps}</p>
          <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`h-2 w-2 rounded-full ${saveMeta.dot}`} />
            <span>{saveMeta.text}</span>
          </div>
        </div>

        {isLastStep ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit || isSubmitting}
            className="inline-flex min-w-[148px] items-center justify-center rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar solicitud"
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canContinue}
            className="inline-flex min-w-[136px] items-center justify-center rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar
          </button>
        )}
      </div>
    </div>
  );
}
