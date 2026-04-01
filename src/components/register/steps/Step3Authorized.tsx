import type { AuthorizedPerson, RegistrationDraftData } from "@/lib/registrations/types";

import { FieldError, inputClass, labelClass } from "@/components/register/formUi";

type Step3AuthorizedProps = {
  data: RegistrationDraftData;
  errors: Record<string, string>;
  onBlur: (field: string) => void;
  onAdd: () => void;
  onUpdate: (id: string, field: keyof AuthorizedPerson, value: string) => void;
  onRemove: (id: string) => void;
  onChange: <K extends keyof RegistrationDraftData>(field: K, value: RegistrationDraftData[K]) => void;
};

export default function Step3Authorized({
  data,
  errors,
  onBlur,
  onAdd,
  onUpdate,
  onRemove,
  onChange,
}: Step3AuthorizedProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass()}>
          Persona de contacto principal <span className="ml-2 text-xs font-normal text-slate-400">(Opcional)</span>
        </label>
        <input
          value={data.contactoPrincipal}
          onChange={(event) => onChange("contactoPrincipal", event.target.value)}
          className={inputClass(false)}
          placeholder="La persona a la que llamaremos si necesitamos confirmar algo"
        />
      </div>

      {data.personasAutorizadas.length === 0 ? (
        <div className="rounded-xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
          Este paso es opcional. No tienes que añadir personas ahora, puedes completarlo después.
        </div>
      ) : null}

      <div className="space-y-4">
        {data.personasAutorizadas.map((person, index) => (
          <div key={person.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">Persona autorizada {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemove(person.id)}
                className="text-xs font-medium text-red-600 transition hover:text-red-700"
              >
                Eliminar
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div data-error={errors[`personasAutorizadas.${index}.nombre`] ? "true" : undefined}>
                <label className={labelClass()}>Nombre</label>
                <input
                  value={person.nombre}
                  onBlur={() => onBlur(`personasAutorizadas.${index}.nombre`)}
                  onChange={(event) => onUpdate(person.id, "nombre", event.target.value)}
                  className={inputClass(Boolean(errors[`personasAutorizadas.${index}.nombre`]))}
                  placeholder="Nombre completo"
                />
                <FieldError message={errors[`personasAutorizadas.${index}.nombre`]} />
              </div>

              <div data-error={errors[`personasAutorizadas.${index}.nif`] ? "true" : undefined}>
                <label className={labelClass()}>NIF</label>
                <input
                  value={person.nif}
                  onBlur={() => onBlur(`personasAutorizadas.${index}.nif`)}
                  onChange={(event) => onUpdate(person.id, "nif", event.target.value.toUpperCase())}
                  className={inputClass(Boolean(errors[`personasAutorizadas.${index}.nif`]))}
                  placeholder="12345678Z"
                />
                <FieldError message={errors[`personasAutorizadas.${index}.nif`]} />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onAdd}
          className="w-full rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
        >
          + Añadir persona autorizada
        </button>
      </div>
    </div>
  );
}
