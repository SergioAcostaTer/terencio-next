"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Building2,
  Check,
  CircleAlert,
  Loader2,
  Plus,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  startTransition,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import Button from "@/components/ui/Button";
import {
  buildDocumentationStatus,
  getDocumentationConfig,
  inferMembershipTypeFromTaxId,
  membershipDefaultValues,
  membershipSchema,
  normalizePhone,
  normalizeTaxId,
  type DocumentationState,
  type MembershipFormValues,
  type MembershipType,
} from "@/lib/membership";

const AUTOSAVE_KEY = "terencio-client-register-v2";

type SaveState = "idle" | "saving" | "saved";
type PostalLookupState = "idle" | "loading" | "ready" | "fallback";

type PostalLookupResponse = {
  cities: string[];
  province: string | null;
  source: "external" | "province-fallback";
};

function fieldClass(hasError?: boolean) {
  return `w-full rounded-2xl border px-4 py-3.5 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 md:text-base ${
    hasError
      ? "border-red-300 bg-red-50/70 ring-2 ring-red-100"
      : "border-slate-200 bg-white focus:border-green-700 focus:ring-4 focus:ring-green-100"
  }`;
}

function sectionTitle(title: string, description: string) {
  return (
    <div className="mb-4 pr-24 md:pr-28">
      <h2 className="text-base font-bold text-slate-950 md:text-[17px]">{title}</h2>
      <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 flex items-start gap-2 text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

function ToggleCard({
  active,
  title,
  description,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-3xl border px-4 py-4 text-left transition ${
        active
          ? "border-green-700 bg-green-50 shadow-[0_10px_30px_-20px_rgba(22,101,52,0.65)]"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            active ? "bg-green-700 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          {icon}
        </div>
        <div>
          <p className="font-bold text-slate-950">{title}</p>
          <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
        </div>
      </div>
    </button>
  );
}

export default function MembershipRegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [restoreNotice, setRestoreNotice] = useState(false);
  const [postalLookupState, setPostalLookupState] = useState<PostalLookupState>("idle");
  const [postalOptions, setPostalOptions] = useState<string[]>([]);
  const [postalHint, setPostalHint] = useState<string | null>(null);
  const [typeHint, setTypeHint] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipSchema),
    defaultValues: membershipDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "authorizedPersons",
  });

  const watchedValues = useWatch({ control });
  const values = useMemo(
    () => ({ ...membershipDefaultValues, ...watchedValues }) as MembershipFormValues,
    [watchedValues],
  );
  const memberType: MembershipType = values.type ?? membershipDefaultValues.type;
  const postalCode = values.postalCode ?? "";
  const taxId = values.nifCif ?? "";
  const documentationItems = useMemo(
    () => getDocumentationConfig(memberType),
    [memberType],
  );

  const saveDraft = useEffectEvent((snapshot: MembershipFormValues) => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(
      AUTOSAVE_KEY,
      JSON.stringify({
        values: snapshot,
        savedAt: new Date().toISOString(),
      }),
    );
    setLastSavedAt(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
    setSaveState("saved");
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = localStorage.getItem(AUTOSAVE_KEY);

    if (!raw) {
      setHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as {
        values?: Partial<MembershipFormValues>;
        savedAt?: string;
      };

      if (parsed.values) {
        const nextType = (parsed.values.type ?? membershipDefaultValues.type) as MembershipType;
        reset({
          ...membershipDefaultValues,
          ...parsed.values,
          type: nextType,
          documentationStatus: buildDocumentationStatus(
            nextType,
          parsed.values.documentationStatus as Record<string, DocumentationState> | undefined,
          ),
        });
        setRestoreNotice(true);
        if (parsed.savedAt) {
          setLastSavedAt(
            new Date(parsed.savedAt).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          );
        }
      }
    } catch {
      localStorage.removeItem(AUTOSAVE_KEY);
    } finally {
      setHydrated(true);
    }
  }, [reset]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    setSaveState("saving");
    const timeout = window.setTimeout(() => saveDraft(values), 300);

    return () => window.clearTimeout(timeout);
  }, [hydrated, values]);

  useEffect(() => {
    const inferredType = inferMembershipTypeFromTaxId(taxId);

    if (!inferredType || !taxId) {
      setTypeHint(null);
      return;
    }

    if (inferredType !== memberType) {
      setValue("type", inferredType, { shouldValidate: true, shouldDirty: true });
      setValue(
        "documentationStatus",
        buildDocumentationStatus(
          inferredType,
          getValues("documentationStatus") as Record<string, DocumentationState>,
        ),
        { shouldValidate: true, shouldDirty: true },
      );
    }

    setTypeHint(
      inferredType === "empresa"
        ? "CIF detectado: el formulario se adapta a empresa."
        : "NIF/NIE detectado: el formulario se adapta a autónomo.",
    );
  }, [getValues, memberType, setValue, taxId]);

  useEffect(() => {
    setValue(
      "documentationStatus",
      buildDocumentationStatus(
        memberType,
        getValues("documentationStatus") as Record<string, DocumentationState>,
      ),
      { shouldValidate: true },
    );
  }, [getValues, memberType, setValue]);

  useEffect(() => {
    if (postalCode.length !== 5) {
      setPostalLookupState("idle");
      setPostalOptions([]);
      setPostalHint(null);
      return;
    }

    let cancelled = false;

    startTransition(() => {
      setPostalLookupState("loading");
    });

    void fetch(`/api/postal-code/${postalCode}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("lookup");
        }

        return (await response.json()) as PostalLookupResponse;
      })
      .then((payload) => {
        if (cancelled) {
          return;
        }

        const nextCities = payload.cities ?? [];
        setPostalOptions(nextCities);
        setPostalLookupState(payload.source === "external" ? "ready" : "fallback");
        setPostalHint(
          payload.source === "external"
            ? nextCities.length > 0
              ? "Población sugerida a partir del código postal."
              : "Código postal reconocido. Puedes escribir la población manualmente."
            : "No se pudo consultar la población. Puedes completar el campo manualmente.",
        );

        if (payload.province && !getValues("province")) {
          setValue("province", payload.province, { shouldDirty: true });
        }

        if (nextCities.length === 1 && !getValues("city")) {
          setValue("city", nextCities[0], { shouldValidate: true, shouldDirty: true });
        }
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setPostalLookupState("fallback");
        setPostalOptions([]);
        setPostalHint("No se pudo consultar la población. Puedes completar el campo manualmente.");
      });

    return () => {
      cancelled = true;
    };
  }, [getValues, postalCode, setValue]);

  const clearDraft = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTOSAVE_KEY);
    }

    reset(membershipDefaultValues);
    setRestoreNotice(false);
    setLastSavedAt(null);
    setSaveState("idle");
    setServerError(null);
  };

  const onSubmit = handleSubmit(async (formValues) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/memberships/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setServerError(payload?.error || "No se pudo enviar el formulario.");
        setIsSubmitting(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTOSAVE_KEY);
      }

      reset(membershipDefaultValues);
      router.push("/gracias");
      router.refresh();
    } catch {
      setServerError("No se pudo enviar el formulario. Revisa la conexión e inténtalo de nuevo.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {restoreNotice ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Hemos recuperado el borrador guardado en este móvil.
        </div>
      ) : null}

      <section className="relative rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700 md:text-[11px]">
            {saveState === "saving" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
            {saveState === "saving" ? "Guardando" : "Auto"}
          </span>
          <button
            type="button"
            onClick={clearDraft}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 md:text-[11px]"
          >
            Limpiar
          </button>
        </div>
        {sectionTitle("1. Tipo de cliente", "Selecciona el tipo correcto. El resto del formulario se adapta automáticamente.")}
        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleCard
            active={memberType === "autonomo"}
            title="Autónomo"
            description="Alta rápida para persona física con actividad."
            icon={<UserRound className="h-5 w-5" />}
            onClick={() => {
              setValue("type", "autonomo", { shouldValidate: true, shouldDirty: true });
              setValue(
                "documentationStatus",
                buildDocumentationStatus(
                  "autonomo",
                  getValues("documentationStatus") as Record<string, DocumentationState>,
                ),
                { shouldValidate: true, shouldDirty: true },
              );
            }}
          />
          <ToggleCard
            active={memberType === "empresa"}
            title="Empresa"
            description="Alta para sociedad con CIF y documentación mercantil."
            icon={<Building2 className="h-5 w-5" />}
            onClick={() => {
              setValue("type", "empresa", { shouldValidate: true, shouldDirty: true });
              setValue(
                "documentationStatus",
                buildDocumentationStatus(
                  "empresa",
                  getValues("documentationStatus") as Record<string, DocumentationState>,
                ),
                { shouldValidate: true, shouldDirty: true },
              );
            }}
          />
        </div>
        {typeHint ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-green-800">
            <Check className="h-4 w-4" />
            {typeHint}
          </p>
        ) : null}
        <FieldError message={errors.type?.message} />
      </section>

      <section className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        {sectionTitle(
          "2. Datos fiscales",
          "Rellena solo los datos necesarios. Validamos el documento fiscal al momento sin bloquear la escritura.",
        )}
        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              {memberType === "empresa" ? "Razón social" : "Nombre completo"}
            </label>
            <input
              {...register("legalName")}
              autoComplete={memberType === "empresa" ? "organization" : "name"}
              className={fieldClass(!!errors.legalName)}
              placeholder={memberType === "empresa" ? "Ej. Distribuciones Atlántico SL" : "Nombre y apellidos"}
            />
            <FieldError message={errors.legalName?.message} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              {memberType === "empresa" ? "CIF" : "NIF"}
            </label>
            <input
              {...register("nifCif", {
                onChange: (event) => {
                  event.target.value = normalizeTaxId(event.target.value);
                },
              })}
              autoCapitalize="characters"
              className={fieldClass(!!errors.nifCif)}
              placeholder={memberType === "empresa" ? "B12345678" : "12345678Z"}
            />
            <FieldError message={errors.nifCif?.message} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Nombre comercial
              <span className="ml-2 text-xs font-medium text-slate-400">Opcional</span>
            </label>
            <input
              {...register("commercialName")}
              autoComplete="organization-title"
              className={fieldClass(!!errors.commercialName)}
              placeholder="Solo si es diferente del nombre fiscal"
            />
            <FieldError message={errors.commercialName?.message} />
          </div>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        {sectionTitle("3. Actividad", "Mantiene la estructura del documento físico, pero simplificada para móvil.")}
        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Actividad</label>
            <input
              {...register("activity")}
              list="activity-suggestions"
              className={fieldClass(!!errors.activity)}
              placeholder="Ej. Bar cafetería, tienda de alimentación, catering"
            />
            <datalist id="activity-suggestions">
              <option value="Bar cafetería" />
              <option value="Restaurante" />
              <option value="Hotel" />
              <option value="Hostelería" />
              <option value="Supermercado" />
              <option value="Comercio minorista" />
              <option value="Catering" />
            </datalist>
            <FieldError message={errors.activity?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Código IAE
                <span className="ml-2 text-xs font-medium text-slate-400">Opcional</span>
              </label>
              <input
                {...register("iaeCode")}
                inputMode="numeric"
                className={fieldClass(!!errors.iaeCode)}
                placeholder="Ej. 647.1"
              />
              <FieldError message={errors.iaeCode?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Tarifa
                <span className="ml-2 text-xs font-medium text-slate-400">Opcional</span>
              </label>
              <input
                {...register("tariff")}
                className={fieldClass(!!errors.tariff)}
                placeholder="Si aplica"
              />
              <FieldError message={errors.tariff?.message} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        {sectionTitle("4. Dirección", "Autocompletamos la población por código postal cuando sea posible. Si falla, puedes escribirla manualmente.")}
        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Dirección</label>
            <input
              {...register("addressLine")}
              autoComplete="street-address"
              className={fieldClass(!!errors.addressLine)}
              placeholder="Calle, número, nave o local"
            />
            <FieldError message={errors.addressLine?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Código postal</label>
              <input
                {...register("postalCode")}
                inputMode="numeric"
                autoComplete="postal-code"
                className={fieldClass(!!errors.postalCode)}
                placeholder="38001"
              />
              <FieldError message={errors.postalCode?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Población</label>
              <input
                {...register("city")}
                autoComplete="address-level2"
                list="postal-city-options"
                className={fieldClass(!!errors.city)}
                placeholder="Población"
              />
              <datalist id="postal-city-options">
                {postalOptions.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
              <FieldError message={errors.city?.message} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Provincia</label>
              <input
                {...register("province")}
                autoComplete="address-level1"
                className={fieldClass(!!errors.province)}
                placeholder="Provincia"
              />
              <FieldError message={errors.province?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Zona
                <span className="ml-2 text-xs font-medium text-slate-400">Opcional</span>
              </label>
              <input
                {...register("zone")}
                className={fieldClass(!!errors.zone)}
                placeholder="Ej. Polígono, barrio o sector"
              />
              <FieldError message={errors.zone?.message} />
            </div>
          </div>

          {postalHint ? (
            <p className="flex items-center gap-2 text-sm text-slate-500">
              {postalLookupState === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CircleAlert className="h-4 w-4" />
              )}
              {postalHint}
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        {sectionTitle("5. Contacto", "Puedes indicar teléfono, móvil o email. Necesitamos al menos uno para contactar contigo.")}
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Teléfono</label>
              <input
                {...register("phone", {
                  onBlur: (event) => {
                    setValue("phone", normalizePhone(event.target.value), { shouldValidate: true, shouldDirty: true });
                  },
                })}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={fieldClass(!!errors.phone)}
                placeholder="922 000 000"
              />
              <FieldError message={errors.phone?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Móvil</label>
              <input
                {...register("mobile", {
                  onBlur: (event) => {
                    setValue("mobile", normalizePhone(event.target.value), { shouldValidate: true, shouldDirty: true });
                  },
                })}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                className={fieldClass(!!errors.mobile)}
                placeholder="600 000 000"
              />
              <FieldError message={errors.mobile?.message} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Email</label>
            <input
              {...register("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              className={fieldClass(!!errors.email)}
              placeholder="cliente@empresa.com"
            />
            <FieldError message={errors.email?.message} />
          </div>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        {sectionTitle("6. Personas autorizadas", "Añade solo las personas que también podrán comprar o identificarse. Este bloque es opcional.")}
        <div className="space-y-4">
          {fields.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500">
              No has añadido personas autorizadas. Puedes continuar sin este bloque.
            </div>
          ) : null}

          {fields.map((field, index) => (
            <div key={field.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">Persona {index + 1}</p>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-600 transition hover:border-red-200 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Quitar
                </button>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Nombre</label>
                  <input
                    {...register(`authorizedPersons.${index}.name`)}
                    className={fieldClass(!!errors.authorizedPersons?.[index]?.name)}
                    placeholder="Nombre completo"
                  />
                  <FieldError message={errors.authorizedPersons?.[index]?.name?.message} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">NIF</label>
                  <input
                    {...register(`authorizedPersons.${index}.nif`, {
                      onChange: (event) => {
                        event.target.value = normalizeTaxId(event.target.value);
                      },
                    })}
                    className={fieldClass(!!errors.authorizedPersons?.[index]?.nif)}
                    placeholder="12345678Z"
                  />
                  <FieldError message={errors.authorizedPersons?.[index]?.nif?.message} />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full justify-center"
            onClick={() => append({ name: "", nif: "" })}
          >
            <Plus className="h-5 w-5" />
            Añadir persona
          </Button>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        {sectionTitle("7. Documentación requerida", "Marca si la documentación está pendiente o ya entregada. Puedes completar el alta aunque todavía falte algo.")}
        <div className="space-y-4">
          {documentationItems.map((item) => {
            const fieldName = `documentationStatus.${item.key}` as const;
            const fieldError = (
              errors.documentationStatus as Record<string, { message?: string }> | undefined
            )?.[item.key]?.message;

            return (
              <div key={item.key} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3">
                  <p className="font-semibold text-slate-950">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.hint}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { value: "pending", label: "Pendiente" },
                    { value: "delivered", label: "Entregado" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                    >
                      <input
                        {...register(fieldName)}
                        type="radio"
                        value={option.value}
                        className="h-4 w-4 border-slate-300 text-green-700"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                <FieldError message={fieldError} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        {sectionTitle("8. Observaciones", "Añade cualquier dato útil para preparar el alta. Este campo es opcional.")}
        <textarea
          {...register("notes")}
          rows={4}
          className={fieldClass(!!errors.notes)}
          placeholder="Horario de entrega, persona de referencia, notas internas, etc."
        />
        <FieldError message={errors.notes?.message} />
      </section>

      <section className="rounded-[1.6rem] border border-slate-200 bg-slate-950 p-4 text-white shadow-sm md:p-5">
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold">9. Confirmación</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Revisa los datos y envía la solicitud. Si pierdes cobertura, el borrador seguirá guardado en este móvil.
            </p>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
            <input
              {...register("legalAccepted")}
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-white/20 text-green-500"
            />
            <span>
              He leído la política de privacidad y autorizo el tratamiento de los datos para gestionar esta alta.
            </span>
          </label>

          {serverError ? (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {serverError}
            </div>
          ) : null}

          {!isValid ? (
            <div className="flex items-center gap-2 text-sm text-amber-200">
              <CircleAlert className="h-4 w-4" />
              Revisa los campos marcados antes de enviar.
            </div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="w-full justify-center rounded-2xl bg-white text-slate-950 hover:bg-slate-100 focus:ring-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {isSubmitting ? "Enviando alta..." : "Enviar alta de cliente"}
          </Button>
        </div>
      </section>
    </form>
  );
}
