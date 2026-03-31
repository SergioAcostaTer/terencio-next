"use client";

import { useEffect, useState } from "react";

import { manageableAdminRoles, roleLabels } from "@/lib/admin-users";

type UserModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
};

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/80";

export default function UserModal({ open, onClose, onCreated }: UserModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<(typeof manageableAdminRoles)[number]>("EDITOR");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setRole("EDITOR");
      setError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(payload?.error ?? "No se pudo crear el usuario.");
      setIsSubmitting(false);
      return;
    }

    await onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-4 py-6">
      <div className="w-full max-w-xl rounded-[30px] border border-[var(--backoffice-border)] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
              Acceso interno
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Invitar usuario
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Crea una cuenta con rol y estado inicial activo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
            aria-label="Cerrar modal de usuario"
          >
            ×
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputCls}
              placeholder="equipo@terencio.es"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Contraseña temporal
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputCls}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Rol
            </label>
            <select
              value={role}
              onChange={(event) =>
                setRole(event.target.value as (typeof manageableAdminRoles)[number])
              }
              className={inputCls}
            >
              {manageableAdminRoles.map((item) => (
                <option key={item} value={item}>
                  {roleLabels[item]}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-[linear-gradient(135deg,#166534,#0f172a)] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_35px_-20px_rgba(22,101,52,0.95)] transition hover:translate-y-[-1px] disabled:translate-y-0 disabled:opacity-60"
            >
              {isSubmitting ? "Creando" : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
