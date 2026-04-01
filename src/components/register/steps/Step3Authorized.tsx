import { Plus, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";
import type { AuthorizedPerson, RegistrationDraftData } from "@/lib/registrations/types";

type Step3AuthorizedProps = {
  data: RegistrationDraftData;
  errors: Record<string, string>;
  onAdd: () => void;
  onUpdate: (id: string, field: keyof AuthorizedPerson, value: string) => void;
  onRemove: (id: string) => void;
  onChange: <K extends keyof RegistrationDraftData>(field: K, value: RegistrationDraftData[K]) => void;
};

function inputClass(hasError: boolean) {
  return `w-full rounded-2xl border px-4 py-3.5 text-[15px] text-slate-950 outline-none transition ${
    hasError
      ? "border-rose-300 bg-rose-50 ring-4 ring-rose-100"
      : "border-slate-200 bg-white focus:border-green-700 focus:ring-4 focus:ring-green-100"
  }`;
}

export default function Step3Authorized({
  data,
  errors,
  onAdd,
  onUpdate,
  onRemove,
  onChange,
}: Step3AuthorizedProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">Contacto principal</label>
        <input
          value={data.contactoPrincipal}
          onChange={(event) => onChange("contactoPrincipal", event.target.value)}
          className={inputClass(false)}
          placeholder="Nombre de la persona que gestiona el alta"
        />
      </div>

      <div className="space-y-4">
        {data.personasAutorizadas.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500">
            Este bloque es opcional. Añádelo solo si otras personas también podrán operar con la cuenta.
          </div>
        ) : null}

        {data.personasAutorizadas.map((person, index) => (
          <div key={person.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-900">Persona autorizada {index + 1}</p>
              <button
                type="button"
                onClick={() => onRemove(person.id)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-slate-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Nombre</label>
                <input
                  value={person.nombre}
                  onChange={(event) => onUpdate(person.id, "nombre", event.target.value)}
                  className={inputClass(Boolean(errors[`personasAutorizadas.${index}.nombre`]))}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">NIF</label>
                <input
                  value={person.nif}
                  onChange={(event) => onUpdate(person.id, "nif", event.target.value.toUpperCase())}
                  className={inputClass(Boolean(errors[`personasAutorizadas.${index}.nif`]))}
                  placeholder="12345678Z"
                />
              </div>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" size="lg" className="w-full justify-center" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Añadir persona autorizada
        </Button>
      </div>
    </div>
  );
}
