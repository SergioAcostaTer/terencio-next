import type { RegistrationDraftData } from "@/lib/registrations/types";

type Step2ContactProps = {
  data: RegistrationDraftData;
  errors: Record<string, string>;
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

export default function Step2Contact({ data, errors, onChange }: Step2ContactProps) {
  return (
    <div className="grid gap-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">Dirección</label>
        <input
          value={data.direccion}
          onChange={(event) => onChange("direccion", event.target.value)}
          className={inputClass(Boolean(errors.direccion))}
          placeholder="Calle, número, nave o local"
        />
        <FieldError message={errors.direccion} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">Código postal</label>
          <input
            value={data.codigoPostal}
            onChange={(event) => onChange("codigoPostal", event.target.value)}
            className={inputClass(Boolean(errors.codigoPostal))}
            placeholder="38001"
          />
          <FieldError message={errors.codigoPostal} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">Población</label>
          <input
            value={data.poblacion}
            onChange={(event) => onChange("poblacion", event.target.value)}
            className={inputClass(Boolean(errors.poblacion))}
            placeholder="La Laguna"
          />
          <FieldError message={errors.poblacion} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">Zona</label>
        <input
          value={data.zona}
          onChange={(event) => onChange("zona", event.target.value)}
          className={inputClass(false)}
          placeholder="Polígono, barrio o sector"
        />
      </div>

      <div className="rounded-[1.75rem] bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-800">Contacto</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Necesitamos al menos una vía para confirmar el alta o pedir documentación pendiente.
        </p>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Teléfono</label>
            <input
              value={data.telefono}
              onChange={(event) => onChange("telefono", event.target.value)}
              className={inputClass(Boolean(errors.contact))}
              placeholder="922 000 000"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Móvil</label>
            <input
              value={data.movil}
              onChange={(event) => onChange("movil", event.target.value)}
              className={inputClass(Boolean(errors.contact))}
              placeholder="600 000 000"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-slate-800">Email</label>
          <input
            value={data.email}
            onChange={(event) => onChange("email", event.target.value)}
            className={inputClass(Boolean(errors.email || errors.contact))}
            placeholder="cliente@empresa.com"
          />
          <FieldError message={errors.email || errors.contact} />
        </div>
      </div>
    </div>
  );
}
