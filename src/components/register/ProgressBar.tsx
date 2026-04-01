type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  completionPercentage: number;
};

export default function ProgressBar({
  currentStep,
  totalSteps,
  completionPercentage,
}: ProgressBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span className="font-semibold">Paso {currentStep} de {totalSteps}</span>
        <span>{completionPercentage}% completado</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#14532d_0%,#22c55e_100%)] transition-all duration-500"
          style={{ width: `${Math.max((currentStep / totalSteps) * 100, completionPercentage)}%` }}
        />
      </div>
    </div>
  );
}
