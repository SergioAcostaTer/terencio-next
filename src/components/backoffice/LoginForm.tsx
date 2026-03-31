"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { loginSchema } from "@/lib/membership";

type LoginValues = z.infer<typeof loginSchema>;

const inputCls = (hasError?: boolean) =>
  `w-full rounded-md border bg-slate-50 px-4 py-2.5 text-sm text-slate-950 outline-none transition focus:bg-white ${
    hasError
      ? "border-red-300 ring-2 ring-red-100"
      : "border-slate-200 focus:border-green-700 focus:ring-2 focus:ring-green-100"
  }`;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "account_disabled"
      ? "Tu cuenta está desactivada o la sesión ha sido revocada."
      : null,
  );
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      setError(payload?.error ?? "No se pudo iniciar sesión.");
      return;
    }
    router.push(searchParams.get("next") ?? "/backoffice/submissions");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            className={`${inputCls(!!errors.email)} pl-11`}
            placeholder="admin@terencio.es"
          />
        </div>
        {errors.email ? <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Contraseña
        </label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className={`${inputCls(!!errors.password)} px-11`}
            placeholder="Introduce tu contraseña"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password ? (
          <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-[var(--brand-green)] py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
      >
        {isSubmitting ? "Accediendo" : "Entrar al backoffice"}
      </button>
    </form>
  );
}
