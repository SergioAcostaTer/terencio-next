"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { FieldError, FieldLabel, inputClass, labelClass } from "@/components/register/formUi";
import type { RegistrationDraftData } from "@/lib/registrations/types";

type PostalLookupState = "idle" | "loading";

type Step2ContactProps = {
  data: RegistrationDraftData;
  errors: Record<string, string>;
  onBlur: (field: string) => void;
  onChange: <K extends keyof RegistrationDraftData>(field: K, value: RegistrationDraftData[K]) => void;
};

export default function Step2Contact({ data, errors, onBlur, onChange }: Step2ContactProps) {
  const [postalLookupState, setPostalLookupState] = useState<PostalLookupState>("idle");
  const [postalOptions, setPostalOptions] = useState<string[]>([]);
  const hasCityOptions = postalOptions.length > 1;
  const lookupCacheRef = useRef<Map<string, { cities: string[]; province: string | null }>>(new Map());
  const lastRequestedPostalCodeRef = useRef<string | null>(null);

  useEffect(() => {
    const postalCode = data.codigoPostal.trim();

    if (!/^\d{5}$/.test(postalCode)) {
      setPostalLookupState("idle");
      setPostalOptions([]);
      lastRequestedPostalCodeRef.current = null;
      return;
    }

    const cached = lookupCacheRef.current.get(postalCode);
    if (cached) {
      setPostalOptions(cached.cities);
      if (cached.cities.length === 1 && !data.poblacion.trim()) {
        onChange("poblacion", cached.cities[0]);
      }
      if (cached.province && !data.provincia.trim()) {
        onChange("provincia", cached.province);
      }
      setPostalLookupState("idle");
      return;
    }

    if (lastRequestedPostalCodeRef.current === postalCode) {
      return;
    }

    let active = true;
    lastRequestedPostalCodeRef.current = postalCode;
    setPostalLookupState("loading");

    void fetch(`/api/postal-code/${postalCode}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Postal lookup failed");
        }

        return (await response.json()) as { cities: string[]; province: string | null };
      })
      .then((payload) => {
        if (!active) {
          return;
        }

        lookupCacheRef.current.set(postalCode, payload);
        setPostalOptions(payload.cities);
        if (payload.cities.length === 1 && !data.poblacion.trim()) {
          onChange("poblacion", payload.cities[0]);
        }
        if (payload.province && !data.provincia.trim()) {
          onChange("provincia", payload.province);
        }
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setPostalOptions([]);
        lastRequestedPostalCodeRef.current = null;
      })
      .finally(() => {
        if (!active) {
          return;
        }
        setPostalLookupState("idle");
      });

    return () => {
      active = false;
    };
  }, [data.codigoPostal, data.poblacion, data.provincia, onChange]);

  return (
    <div className="space-y-5">
      <div data-error={errors.direccion ? "true" : undefined}>
        <FieldLabel required>Dirección</FieldLabel>
        <input
          value={data.direccion}
          onBlur={() => onBlur("direccion")}
          onChange={(event) => onChange("direccion", event.target.value)}
          autoComplete="street-address"
          className={inputClass(Boolean(errors.direccion))}
          placeholder="Calle, número, nave o local"
        />
        <FieldError message={errors.direccion} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div data-error={errors.codigoPostal ? "true" : undefined}>
          <FieldLabel required>Código postal</FieldLabel>
          <input
            value={data.codigoPostal}
            onBlur={() => onBlur("codigoPostal")}
            onChange={(event) => onChange("codigoPostal", event.target.value.replace(/\D/g, "").slice(0, 5))}
            autoComplete="postal-code"
            inputMode="numeric"
            className={inputClass(Boolean(errors.codigoPostal))}
            placeholder="38001"
          />
          <FieldError message={errors.codigoPostal} />
        </div>

        <div data-error={errors.poblacion ? "true" : undefined}>
          <FieldLabel required>Población</FieldLabel>
          <div className="relative">
            {hasCityOptions ? (
              <select
                value={data.poblacion}
                onBlur={() => onBlur("poblacion")}
                onChange={(event) => onChange("poblacion", event.target.value)}
                className={`${inputClass(Boolean(errors.poblacion))} pr-10 appearance-none`}
              >
                <option value="">Selecciona una población</option>
                {postalOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={data.poblacion}
                onBlur={() => onBlur("poblacion")}
                onChange={(event) => onChange("poblacion", event.target.value)}
                className={`${inputClass(Boolean(errors.poblacion))} pr-10`}
                placeholder="La Laguna"
              />
            )}
            {postalLookupState === "loading" ? (
              <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
            ) : null}
          </div>
          <FieldError message={errors.poblacion} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass()}>
            Provincia <span className="ml-2 text-xs font-normal text-slate-400">(Opcional)</span>
          </label>
          <input
            value={data.provincia}
            onChange={(event) => onChange("provincia", event.target.value)}
            className={inputClass(false)}
            placeholder="Santa Cruz de Tenerife"
          />
        </div>

        <div>
          <label className={labelClass()}>
            Zona <span className="ml-2 text-xs font-normal text-slate-400">(Opcional)</span>
          </label>
          <input
            value={data.zona}
            onChange={(event) => onChange("zona", event.target.value)}
            className={inputClass(false)}
            placeholder="Polígono, barrio o sector"
          />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-slate-800">Contacto</p>
          <p className="mt-1 text-xs text-slate-500">
            Necesitamos un email y al menos un teléfono. Los campos obligatorios llevan <span className="font-semibold text-red-600">*</span>.
          </p>
        </div>

        {errors.contact ? (
          <div data-error="true" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Necesitamos un número de teléfono o móvil y también un email para contactarte.
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass()}>Teléfono fijo</label>
            <input
              value={data.telefono}
              onBlur={() => onBlur("telefono")}
              onChange={(event) => onChange("telefono", event.target.value)}
              className={inputClass(false)}
              placeholder="Ej: 922 123 456"
            />
            <p className="mt-1.5 text-xs text-slate-500">Puedes indicar fijo o dejar este campo vacío y usar el móvil.</p>
          </div>

          <div>
            <label className={labelClass()}>Móvil</label>
            <input
              value={data.movil}
              onBlur={() => onBlur("movil")}
              onChange={(event) => onChange("movil", event.target.value)}
              className={inputClass(false)}
              placeholder="Ej: 600 123 456"
            />
            <p className="mt-1.5 text-xs text-slate-500">Con uno de los dos teléfonos es suficiente.</p>
          </div>
        </div>

        <div data-error={errors.email || errors.contact ? "true" : undefined}>
          <FieldLabel required>Email</FieldLabel>
          <input
            value={data.email}
            onBlur={() => onBlur("email")}
            onChange={(event) => onChange("email", event.target.value)}
            className={inputClass(Boolean(errors.email || (!data.email.trim() && errors.contact)))}
            placeholder="Ej: compras@tuempresa.com"
            autoComplete="email"
          />
          <p className="mt-1.5 text-xs text-slate-500">Usaremos este email para avisos y para la revisión del alta.</p>
          <FieldError message={errors.email || (!data.email.trim() && errors.contact ? "El email es obligatorio." : undefined)} />
        </div>
      </div>
    </div>
  );
}
