"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/ui/Button";
import { membershipSchema } from "@/lib/membership";

const formSchema = membershipSchema.extend({
  dniFile: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "Adjunta el DNI o CIF.",
  }),
  modelFile: z.instanceof(FileList).optional(),
  certificateFile: z.instanceof(FileList).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function fieldClass(hasError?: boolean) {
  return `w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition ${
    hasError
      ? "border-red-400 ring-2 ring-red-100"
      : "border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-100"
  }`;
}

export default function MembershipRegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      legalName: "",
      commercialName: "",
      email: "",
      phone: "",
      nifCif: "",
      type: "empresa",
      notes: "",
    },
  });

  const memberType = watch("type");

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("legalName", values.legalName);
    formData.set("commercialName", values.commercialName || "");
    formData.set("email", values.email);
    formData.set("phone", values.phone);
    formData.set("nifCif", values.nifCif);
    formData.set("type", values.type);
    formData.set("notes", values.notes || "");

    if (values.dniFile?.[0]) {
      formData.set("dniFile", values.dniFile[0]);
    }
    if (values.modelFile?.[0]) {
      formData.set("modelFile", values.modelFile[0]);
    }
    if (values.certificateFile?.[0]) {
      formData.set("certificateFile", values.certificateFile[0]);
    }

    const response = await fetch("/api/memberships/submit", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setServerError(payload?.error || "No se pudo enviar el formulario.");
      setIsSubmitting(false);
      return;
    }

    router.push("/gracias");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Razón social / Nombre legal
          </label>
          <input {...register("legalName")} className={fieldClass(!!errors.legalName)} />
          {errors.legalName ? (
            <p className="mt-2 text-sm text-red-600">{errors.legalName.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Nombre comercial
          </label>
          <input {...register("commercialName")} className={fieldClass(!!errors.commercialName)} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Tipo de alta
          </label>
          <select {...register("type")} className={fieldClass(!!errors.type)}>
            <option value="empresa">Empresa</option>
            <option value="autonomo">Autónomo</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            className={fieldClass(!!errors.email)}
          />
          {errors.email ? (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Teléfono
          </label>
          <input {...register("phone")} className={fieldClass(!!errors.phone)} />
          {errors.phone ? (
            <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            NIF / CIF
          </label>
          <input {...register("nifCif")} className={fieldClass(!!errors.nifCif)} />
          {errors.nifCif ? (
            <p className="mt-2 text-sm text-red-600">{errors.nifCif.message}</p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Documento DNI / CIF
          </label>
          <input
            {...register("dniFile")}
            type="file"
            accept=".pdf,image/png,image/jpeg,image/webp"
            className={fieldClass(!!errors.dniFile)}
          />
          {errors.dniFile ? (
            <p className="mt-2 text-sm text-red-600">{errors.dniFile.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Modelo 21 o 62
          </label>
          <input
            {...register("modelFile")}
            type="file"
            accept=".pdf,image/png,image/jpeg,image/webp"
            className={fieldClass()}
          />
        </div>

        {memberType === "autonomo" ? (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Certificado de autónomo
            </label>
            <input
              {...register("certificateFile")}
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              className={fieldClass()}
            />
            <p className="mt-2 text-xs text-gray-500">
              Recomendado para altas de autónomo.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-500">
            Para altas de empresa no mostramos el certificado de autónomo.
          </div>
        )}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Observaciones
          </label>
          <textarea
            {...register("notes")}
            rows={4}
            className={fieldClass(!!errors.notes)}
          />
        </div>
      </div>

      {serverError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          Los documentos se almacenan en la nube y no se guardan localmente.
        </p>
        <Button type="submit" size="lg" className="min-w-52" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar solicitud"}
        </Button>
      </div>
    </form>
  );
}
