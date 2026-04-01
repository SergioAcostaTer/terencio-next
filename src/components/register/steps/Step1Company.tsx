import { Building2, ChevronDown, Circle, Dot, UserRound } from "lucide-react";
import { useEffect, useEffectEvent } from "react";

import { FieldError, FieldLabel, helperClass, inputClass, labelClass } from "@/components/register/formUi";
import { inferMembershipTypeFromTaxId } from "@/lib/membership";
import type { RegistrationDraftData } from "@/lib/registrations/types";

type Step1CompanyProps = {
  data: RegistrationDraftData;
  errors: Record<string, string>;
  onBlur: (field: string) => void;
  onClientTypeChange: (value: RegistrationDraftData["clientType"]) => void;
  onChange: <K extends keyof RegistrationDraftData>(field: K, value: RegistrationDraftData[K]) => void;
};

const ACTIVITY_SUGGESTIONS = [
  "Bar cafetería",
  "Restaurante",
  "Panadería",
  "Tienda de alimentación",
  "Hotel",
  "Catering",
];

export default function Step1Company({
  data,
  errors,
  onBlur,
  onClientTypeChange,
  onChange,
}: Step1CompanyProps) {
  const syncClientType = useEffectEvent((value: string, currentType: RegistrationDraftData["clientType"]) => {
    const inferredType = inferMembershipTypeFromTaxId(value);
    if (inferredType && inferredType !== currentType) {
      onClientTypeChange(inferredType);
    }
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      syncClientType(data.nifCif, data.clientType);
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [data.clientType, data.nifCif, syncClientType]);

  return (
    <div className="space-y-5">
      <div data-error={errors.clientType ? "true" : undefined}>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              value: "autonomo" as const,
              title: "Autónomo",
              description: "Alta individual",
              icon: UserRound,
            },
            {
              value: "empresa" as const,
              title: "Empresa",
              description: "Sociedad con CIF",
              icon: Building2,
            },
          ].map((option) => {
            const selected = data.clientType === option.value;
            const Icon = option.icon;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onClientTypeChange(option.value)}
                onBlur={() => onBlur("clientType")}
                className={[
                  "rounded-xl p-4 text-left transition-all",
                  selected
                    ? "border border-green-600 bg-green-50 ring-2 ring-green-100"
                    : "border border-slate-200 bg-white",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Icon className={`mt-0.5 h-5 w-5 ${selected ? "text-green-700" : "text-slate-500"}`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{option.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                    </div>
                  </div>
                  {selected ? (
                    <Dot className="h-5 w-5 text-green-700" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <FieldError message={errors.clientType} />
      </div>

      <div data-error={errors.nifCif ? "true" : undefined}>
        <FieldLabel required>NIF / CIF</FieldLabel>
        <input
          value={data.nifCif}
          onBlur={() => onBlur("nifCif")}
          onChange={(event) => onChange("nifCif", event.target.value.toUpperCase())}
          className={inputClass(Boolean(errors.nifCif))}
          placeholder={data.clientType === "empresa" ? "B12345678" : "12345678Z"}
        />
        <p className={helperClass()}>Introduce tu NIF, NIE o CIF. Detectaremos el tipo automáticamente.</p>
        <FieldError message={errors.nifCif} />
      </div>

      <div data-error={errors.razonSocial ? "true" : undefined}>
        <FieldLabel required>
          {data.clientType === "autonomo" ? "Nombre completo" : "Razón social"}
        </FieldLabel>
        <input
          value={data.razonSocial}
          onBlur={() => onBlur("razonSocial")}
          onChange={(event) => onChange("razonSocial", event.target.value)}
          className={inputClass(Boolean(errors.razonSocial))}
          placeholder={data.clientType === "autonomo" ? "Nombre y apellidos" : "Distribuciones Atlántico SL"}
        />
        <FieldError message={errors.razonSocial} />
      </div>

      <div>
        <label className={labelClass()}>
          Nombre comercial <span className="ml-2 text-xs font-normal text-slate-400">(Opcional)</span>
        </label>
        <input
          value={data.nombreComercial}
          onChange={(event) => onChange("nombreComercial", event.target.value)}
          className={inputClass(false)}
          placeholder="Solo si es distinto al nombre fiscal"
        />
      </div>

      <div className="space-y-2">
        <FieldLabel>Actividad</FieldLabel>
        <div className="relative">
          <select
            value={ACTIVITY_SUGGESTIONS.includes(data.actividad) ? data.actividad : ""}
            onChange={(event) => onChange("actividad", event.target.value)}
            className={`${inputClass(false)} appearance-none pr-10`}
          >
            <option value="">Selecciona una actividad</option>
            {ACTIVITY_SUGGESTIONS.map((activity) => (
              <option key={activity} value={activity}>
                {activity}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass()}>
            Código IAE <span className="ml-2 text-xs font-normal text-slate-400">(Opcional)</span>
          </label>
          <input
            value={data.codigoIAE}
            onChange={(event) => onChange("codigoIAE", event.target.value)}
            className={inputClass(false)}
            placeholder="647.1"
          />
        </div>

        <div>
          <label className={labelClass()}>
            Tarifa <span className="ml-2 text-xs font-normal text-slate-400">(Opcional)</span>
          </label>
          <input
            value={data.tarifa}
            onChange={(event) => onChange("tarifa", event.target.value)}
            className={inputClass(false)}
            placeholder="Si aplica"
          />
        </div>
      </div>
    </div>
  );
}
