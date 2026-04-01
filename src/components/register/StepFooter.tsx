import Button from "@/components/ui/Button";

type StepFooterProps = {
  currentStep: number;
  totalSteps: number;
  canContinue: boolean;
  isSubmitting?: boolean;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
};

export default function StepFooter({
  currentStep,
  totalSteps,
  canContinue,
  isSubmitting,
  onNext,
  onBack,
  onSubmit,
}: StepFooterProps) {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200/80 bg-white/95 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="min-w-[120px] flex-1 justify-center md:flex-none"
          onClick={onBack}
          disabled={currentStep === 1 || isSubmitting}
        >
          Atrás
        </Button>
        {isLastStep ? (
          <Button
            type="button"
            size="lg"
            className="flex-[1.4] justify-center rounded-2xl"
            onClick={onSubmit}
            disabled={!canContinue || isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar solicitud"}
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            className="flex-[1.4] justify-center rounded-2xl"
            onClick={onNext}
            disabled={!canContinue}
          >
            Guardar y seguir
          </Button>
        )}
      </div>
    </div>
  );
}
