"use client";

import { ShieldCheck } from "lucide-react";
import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

import StepFooter from "@/components/register/StepFooter";
import StepHeader from "@/components/register/StepHeader";
import Step1Company from "@/components/register/steps/Step1Company";
import Step2Contact from "@/components/register/steps/Step2Contact";
import Step3Authorized from "@/components/register/steps/Step3Authorized";
import Step4Documents from "@/components/register/steps/Step4Documents";
import Step5Review from "@/components/register/steps/Step5Review";
import { useRegisterDraft } from "@/hooks/useRegisterDraft";
import { calculateCompletionPercentage } from "@/lib/registrations/completion";
import { REGISTRATION_STEPS } from "@/lib/registrations/types";

const STEP_COPY = {
  1: {
    title: "Empecemos por tu empresa",
    description: "Solo te pedimos los datos fiscales esenciales para abrir la cuenta.",
  },
  2: {
    title: "Dónde y cómo contactarte",
    description: "Necesitamos una dirección operativa y al menos una vía de contacto.",
  },
  3: {
    title: "Quién puede operar con la cuenta",
    description: "Añade solo las personas que también podrán comprar o identificarse.",
  },
  4: {
    title: "Sube tu documentación",
    description: "Adjunta ahora lo obligatorio para evitar llamadas y acelerar la revisión.",
  },
  5: {
    title: "Revisión final",
    description: "Comprueba el resumen y envía tu solicitud cuando todo esté listo.",
  },
} as const;

export default function RegisterWizard() {
  const router = useRouter();
  const draft = useRegisterDraft();

  useEffect(() => {
    document.body.dataset.chrome = "default";

    return () => {
      delete document.body.dataset.chrome;
    };
  }, []);

  function goToNextStep() {
    if (!draft.currentStepValidation.isValid) {
      return;
    }

    startTransition(() => {
      draft.setCurrentStep(Math.min(REGISTRATION_STEPS, draft.currentStep + 1));
    });
  }

  function goToPreviousStep() {
    startTransition(() => {
      draft.setCurrentStep(Math.max(1, draft.currentStep - 1));
    });
  }

  async function handleSubmit() {
    const record = await draft.submit();
    if (!record) {
      return;
    }

    router.push(`/register/completado?id=${record.id}`);
    router.refresh();
  }

  if (!draft.hydrated) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 text-center text-sm text-slate-500 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.45)]">
        Recuperando tu borrador...
      </div>
    );
  }

  const stepMeta = STEP_COPY[draft.currentStep as keyof typeof STEP_COPY];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,#dcfce7,transparent_45%),linear-gradient(180deg,#f8fafc_0%,#eefaf2_100%)] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-green-800">
              Crea tu cuenta de cliente
            </span>
            <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
              Alta digital clara, rápida y pensada para móvil.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              Solo necesitamos unos pocos datos para empezar. Tu progreso se guarda automáticamente y puedes salir para continuar más tarde.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-green-700" />
            Tus datos están protegidos
          </div>
        </div>
      </div>

      {draft.restoredFromDraft ? (
        <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          Hemos recuperado tu progreso. Puedes seguir exactamente donde lo dejaste.
        </div>
      ) : null}

      {draft.loadError ? (
        <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          {draft.loadError}
        </div>
      ) : null}

      <StepHeader
        currentStep={draft.currentStep}
        totalSteps={REGISTRATION_STEPS}
        title={stepMeta.title}
        description={stepMeta.description}
        completionPercentage={calculateCompletionPercentage(draft.data)}
        saveState={draft.saveState}
        lastSavedAt={draft.lastSavedAt}
      />

      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_-55px_rgba(15,23,42,0.45)] backdrop-blur md:p-7">
        <div className="animate-fade-in-up">
          {draft.currentStep === 1 ? (
            <Step1Company
              data={draft.data}
              errors={draft.currentStepValidation.fieldErrors}
              onClientTypeChange={draft.setClientType}
              onChange={draft.updateField}
            />
          ) : null}
          {draft.currentStep === 2 ? (
            <Step2Contact
              data={draft.data}
              errors={draft.currentStepValidation.fieldErrors}
              onChange={draft.updateField}
            />
          ) : null}
          {draft.currentStep === 3 ? (
            <Step3Authorized
              data={draft.data}
              errors={draft.currentStepValidation.fieldErrors}
              onAdd={draft.addAuthorizedPerson}
              onUpdate={draft.updateAuthorizedPerson}
              onRemove={draft.removeAuthorizedPerson}
              onChange={draft.updateField}
            />
          ) : null}
          {draft.currentStep === 4 ? (
            <Step4Documents
              data={draft.data}
              errors={draft.currentStepValidation.fieldErrors}
              uploadingType={draft.uploadingType}
              uploadError={draft.uploadError}
              onUpload={draft.uploadDocument}
              onRemove={draft.removeDocument}
            />
          ) : null}
          {draft.currentStep === 5 ? (
            <Step5Review
              data={draft.data}
              submitError={draft.submitError}
              submitValidation={draft.submitValidation}
            />
          ) : null}
        </div>
      </section>

      <StepFooter
        currentStep={draft.currentStep}
        totalSteps={REGISTRATION_STEPS}
        canContinue={draft.currentStepValidation.isValid}
        isSubmitting={draft.isSubmitting}
        onBack={goToPreviousStep}
        onNext={goToNextStep}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
