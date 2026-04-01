import AutosaveIndicator from "@/components/register/AutosaveIndicator";
import ProgressBar from "@/components/register/ProgressBar";

type StepHeaderProps = {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  completionPercentage: number;
  saveState: "idle" | "saving" | "saved" | "error" | "local_only";
  lastSavedAt: string | null;
};

export default function StepHeader(props: StepHeaderProps) {
  return (
    <div className="space-y-5 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_80px_-50px_rgba(15,23,42,0.45)] backdrop-blur md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-green-800">Onboarding de cliente</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{props.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{props.description}</p>
        </div>
        <AutosaveIndicator saveState={props.saveState} lastSavedAt={props.lastSavedAt} />
      </div>
      <ProgressBar
        currentStep={props.currentStep}
        totalSteps={props.totalSteps}
        completionPercentage={props.completionPercentage}
      />
    </div>
  );
}
