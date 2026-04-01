import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

export function inputClass(hasError: boolean) {
  return [
    "w-full rounded-xl border px-4 py-3 text-sm text-slate-950 outline-none transition",
    "placeholder:text-slate-400",
    "focus:ring-2 focus:ring-green-100",
    hasError
      ? "border-red-300 bg-red-50 focus:border-red-400"
      : "border-slate-200 bg-white focus:border-green-600",
  ].join(" ");
}

export function sectionCardClass() {
  return "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
}

export function labelClass() {
  return "mb-1.5 block text-sm font-semibold text-slate-700";
}

export function FieldLabel({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className={labelClass()}>
      {children}
      {required ? <span className="ml-1 text-red-600">*</span> : null}
    </label>
  );
}

export function helperClass() {
  return "mt-1.5 text-xs text-slate-500";
}

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}
