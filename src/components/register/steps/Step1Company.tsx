import type { RegistrationDraftData } from "@/lib/registrations/types";

type Step1CompanyProps = {
  data: RegistrationDraftData;
  errors: Record<string, string>;
  onClientTypeChange: (value: RegistrationDraftData["clientType"]) => void;
  onChange: <K extends keyof RegistrationDraftData>(field: K, value: RegistrationDraftData[K]) => void;
};

function inputClass(hasError: boolean) {
  return `w-full rounded-2xl border px-4 py-3.5 text-[15px] text-slate-950 outline-none transition ${
    hasError
      ? "border-rose-300 bg-rose-50 ring-4 ring-rose-100"
      : "border-slate-200 bg-white focus:border-green-700 focus:ring-4 focus:ring-green-100"
  }`;
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-sm text-rose-700">{message}</p> : null;
}

export default function Step1Company({ data, errors, onClientTypeChange, onChange }: Step1CompanyProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2">
        {[
          {
            value: "autonomo" as const,
            title: "Autónomo",
            description: "Alta rápida para actividad individual.",
          },
          {
            value: "empresa" as const,
            title: "Empresa",
            description: "Sociedad con CIF y documentación corporativa.",
          },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onClientTypeChange(option.value)}
            className={`rounded-[1.75rem] border px-5 py-5 text-left transition ${
              data.clientType === option.value
                ? "border-green-700 bg-green-50 shadow-[0_18px_45px_-35px_rgba(22,101,52,0.8)]"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-lg font-bold text-slate-950">{option.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{option.description}</p>
          </button>
        ))}
      </div>
      <FieldError message={errors.clientType} />

      <div className="grid gap-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">Razón social</label>
          <input
            value={data.razonSocial}
            onChange={(event) => onChange("razonSocial", event.target.value)}
            className={inputClass(Boolean(errors.razonSocial))}
            placeholder={data.clientType === "autonomo" ? "Nombre y apellidos" : "Distribuciones Atlántico SL"}
          />
          <FieldError message={errors.razonSocial} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Nombre comercial <span className="text-slate-400">Opcional</span>
          </label>
          <input
            value={data.nombreComercial}
            onChange={(event) => onChange("nombreComercial", event.target.value)}
            className={inputClass(false)}
            placeholder="Solo si es distinto al nombre fiscal"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">Actividad</label>
          <input
            value={data.actividad}
            onChange={(event) => onChange("actividad", event.target.value)}
            className={inputClass(false)}
            placeholder="Bar, restaurante, tienda, catering..."
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Código IAE</label>
            <input
              value={data.codigoIAE}
              onChange={(event) => onChange("codigoIAE", event.target.value)}
              className={inputClass(false)}
              placeholder="647.1"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Tarifa</label>
            <input
              value={data.tarifa}
              onChange={(event) => onChange("tarifa", event.target.value)}
              className={inputClass(false)}
              placeholder="Si aplica"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">NIF/CIF</label>
          <input
            value={data.nifCif}
            onChange={(event) => onChange("nifCif", event.target.value.toUpperCase())}
            className={inputClass(Boolean(errors.nifCif))}
            placeholder={data.clientType === "empresa" ? "B12345678" : "12345678Z"}
          />
          <FieldError message={errors.nifCif} />
        </div>
      </div>
    </div>
  );
}
