"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import DraftRecoveryModal from "@/components/register/DraftRecoveryModal";
import StepHeader from "@/components/register/StepHeader";
import WizardFooter from "@/components/register/WizardFooter";
import Step1Company from "@/components/register/steps/Step1Company";
import Step2Contact from "@/components/register/steps/Step2Contact";
import Step3Authorized from "@/components/register/steps/Step3Authorized";
import Step4Documents from "@/components/register/steps/Step4Documents";
import Step5Review from "@/components/register/steps/Step5Review";
import Icon from "@/components/ui/Icon";
import { useRegisterDraft } from "@/hooks/useRegisterDraft";
import { calculateCompletionPercentage } from "@/lib/registrations/completion";
import { REGISTRATION_STEPS } from "@/lib/registrations/types";

const STEP_COPY = {
  1: {
    title: "Tu empresa o actividad",
    description: "Datos fiscales que identificarán tu cuenta.",
  },
  2: {
    title: "Dirección y contacto",
    description: "Dónde operas y cómo podemos contactarte.",
  },
  3: {
    title: "Personas autorizadas",
    description: "Opcional. Añade solo quienes también puedan comprar o identificarse.",
  },
  4: {
    title: "Documentación",
    description: "Adjunta los documentos para agilizar la revisión.",
  },
  5: {
    title: "Revisión final",
    description: "Comprueba tus datos antes de enviar.",
  },
} as const;

export default function RegisterWizard() {
  const router = useRouter();
  const draft = useRegisterDraft();
  const [attemptedAdvance, setAttemptedAdvance] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const stepMeta = STEP_COPY[draft.currentStep as keyof typeof STEP_COPY];
  const completionPercentage = calculateCompletionPercentage(draft.data);
  const canContinue = draft.currentStepValidation.isValid;
  const canSubmit =
    draft.missingRequirements.missingFields.length === 0 &&
    draft.missingRequirements.missingDocuments.length === 0 &&
    draft.legalAccepted &&
    !draft.isSubmitting;

  const visibleErrors = useMemo(() => {
    const entries = Object.entries(draft.currentStepValidation.fieldErrors).filter(([field]) => {
      if (attemptedAdvance) {
        return true;
      }

      if (field === "contact") {
        return false;
      }

      return touched[field];
    });

    return Object.fromEntries(entries);
  }, [attemptedAdvance, draft.currentStepValidation.fieldErrors, touched]);

  function markTouched(field: string) {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));
  }

  function resetStepUi() {
    setAttemptedAdvance(false);
    setTouched({});
  }

  function scrollToFirstError() {
    requestAnimationFrame(() => {
      const firstErrorField = document.querySelector("[data-error='true']");
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function goToNextStep() {
    if (!canContinue) {
      setAttemptedAdvance(true);
      scrollToFirstError();
      return;
    }

    resetStepUi();
    startTransition(() => {
      draft.setCurrentStep(Math.min(REGISTRATION_STEPS, draft.currentStep + 1));
    });
  }

  function goToPreviousStep() {
    resetStepUi();
    startTransition(() => {
      draft.setCurrentStep(Math.max(1, draft.currentStep - 1));
    });
  }

  async function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    const record = await draft.submit();
    if (!record) {
      return;
    }

    router.push(`/register/completado?id=${record.id}`);
    router.refresh();
  }

  function handleEditStep(step: number) {
    resetStepUi();
    draft.setCurrentStep(step);
  }

  return (
    <div className="min-h-[calc(100vh-58px)] bg-slate-50 md:min-h-[calc(100vh-74px)]">
      <div className="mx-auto max-w-2xl px-4 pb-32 pt-6 md:pt-8">
        {draft.loadError ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {draft.loadError}
          </div>
        ) : null}

        <div className="space-y-4">
          {draft.currentStep === 1 ? (
            <div className="rounded-2xl bg-gradient-to-br from-green-900 to-green-800 p-6 text-white shadow-lg md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
                Únete a Terencio Profesional
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-green-50 md:text-base">
                Completa tu alta en menos de 3 minutos y accede a ventajas exclusivas para tu negocio. Guardaremos tu progreso automáticamente.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-green-50 backdrop-blur-sm md:text-sm">
                  <Icon name="BadgePercent" size={16} className="text-yellow-400" />
                  Hasta 10% Dto.
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-green-50 backdrop-blur-sm md:text-sm">
                  <Icon name="Euro" size={16} className="text-yellow-400" />
                  Tarifas netas
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-green-50 backdrop-blur-sm md:text-sm">
                  <Icon name="Gift" size={16} className="text-yellow-400" />
                  Promociones HORECA
                </span>
              </div>
            </div>
          ) : null}

          <StepHeader title={stepMeta.title} description={stepMeta.description} />

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {draft.currentStep === 1 ? (
              <Step1Company
                data={draft.data}
                errors={visibleErrors}
                onBlur={markTouched}
                onClientTypeChange={draft.setClientType}
                onChange={draft.updateField}
              />
            ) : null}

            {draft.currentStep === 2 ? (
              <Step2Contact
                data={draft.data}
                errors={visibleErrors}
                onBlur={markTouched}
                onChange={draft.updateField}
              />
            ) : null}

            {draft.currentStep === 3 ? (
              <Step3Authorized
                data={draft.data}
                errors={visibleErrors}
                onBlur={markTouched}
                onAdd={draft.addAuthorizedPerson}
                onUpdate={draft.updateAuthorizedPerson}
                onRemove={draft.removeAuthorizedPerson}
                onChange={draft.updateField}
              />
            ) : null}

            {draft.currentStep === 4 ? (
              <Step4Documents
                data={draft.data}
                errors={visibleErrors}
                uploadingType={draft.uploadingType}
                uploadErrors={draft.uploadErrors}
                onUpload={draft.uploadDocument}
                onRemove={draft.removeDocument}
                onSetUploadError={draft.setUploadError}
              />
            ) : null}

            {draft.currentStep === 5 ? (
              <Step5Review
                data={draft.data}
                submitValidation={draft.submitValidation}
                onEditStep={handleEditStep}
              />
            ) : null}
          </section>
        </div>
      </div>

      <WizardFooter
        currentStep={draft.currentStep}
        totalSteps={REGISTRATION_STEPS}
        completionPercentage={completionPercentage}
        canContinue={canContinue}
        canSubmit={canSubmit}
        isSubmitting={draft.isSubmitting}
        saveState={draft.saveState}
        legalAccepted={draft.legalAccepted}
        onLegalAcceptedChange={draft.setLegalAccepted}
        submitError={draft.submitError}
        onBack={goToPreviousStep}
        onNext={goToNextStep}
        onSubmit={handleSubmit}
      />

      {draft.draftFound ? (
        <DraftRecoveryModal
          currentStep={draft.currentStep}
          lastSavedAt={draft.lastSavedAt}
          onContinue={draft.dismissDraft}
          onReset={draft.clearDraft}
        />
      ) : null}
    </div>
  );
}
