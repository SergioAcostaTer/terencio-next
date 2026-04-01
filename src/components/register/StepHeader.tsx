type StepHeaderProps = {
  title: string;
  description: string;
};

export default function StepHeader(props: StepHeaderProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Registro profesional</p>
      <h1 className="text-base font-semibold text-slate-900">{props.title}</h1>
      <p className="text-sm text-slate-500">{props.description}</p>
    </div>
  );
}
