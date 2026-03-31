"use client";

import { useMemo, useState } from "react";
import { Plus, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";

import UserModal from "@/components/backoffice/UserModal";
import {
  manageableAdminRoles,
  roleLabels,
  type AdminRole,
} from "@/lib/admin-users";

type AdminUserRow = {
  id: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  isRoot: boolean;
  createdAt: string;
  updatedAt: string;
};

type UsersManagerProps = {
  currentUserId: string;
  currentUserRole: AdminRole;
  initialUsers: AdminUserRow[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function isAdminUserRow(payload: unknown): payload is AdminUserRow {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return "id" in payload && "email" in payload && "role" in payload && "isActive" in payload;
}

export default function UsersManager({
  currentUserId,
  currentUserRole,
  initialUsers,
}: UsersManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [drafts, setDrafts] = useState(() =>
    Object.fromEntries(
      initialUsers.map((user) => [
        user.id,
        { role: user.role, isActive: user.isActive },
      ]),
    ),
  );
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const summary = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.isActive).length,
      suspended: users.filter((user) => !user.isActive).length,
    }),
    [users],
  );

  async function refreshUsers() {
    const response = await fetch("/api/users", { cache: "no-store" });
    const payload = (await response.json().catch(() => null)) as
      | AdminUserRow[]
      | { error?: string }
      | null;

    if (!response.ok || !Array.isArray(payload)) {
      setError(
        payload && !Array.isArray(payload) && payload.error
          ? payload.error
          : "No se pudo refrescar la lista de usuarios.",
      );
      return;
    }

    setUsers(payload);
    setDrafts(
      Object.fromEntries(
        payload.map((user) => [
          user.id,
          { role: user.role, isActive: user.isActive },
        ]),
      ),
    );
    setError(null);
  }

  async function saveUser(id: string) {
    const draft = drafts[id];

    if (!draft) {
      return;
    }

    setSavingIds((current) => [...current, id]);
    setError(null);

    const response = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    const payload = (await response.json().catch(() => null)) as
      | AdminUserRow
      | { error?: string }
      | null;

    if (!response.ok || !isAdminUserRow(payload)) {
      setError(
        payload && typeof payload === "object" && "error" in payload
          ? payload.error ?? "No se pudo guardar el usuario."
          : "No se pudo guardar el usuario.",
      );
      setSavingIds((current) => current.filter((item) => item !== id));
      return;
    }

    const updatedUser: AdminUserRow = payload;

    setUsers((current) => current.map((user) => (user.id === id ? updatedUser : user)));
    setDrafts((current) => ({
      ...current,
      [id]: { role: updatedUser.role, isActive: updatedUser.isActive },
    }));
    setSavingIds((current) => current.filter((item) => item !== id));

    if (id === currentUserId && !updatedUser.isActive) {
      window.location.href = "/backoffice/login?error=account_disabled";
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("¿Eliminar este usuario del backoffice?")) {
      return;
    }

    setDeletingIds((current) => [...current, id]);
    setError(null);

    const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(payload?.error ?? "No se pudo eliminar el usuario.");
      setDeletingIds((current) => current.filter((item) => item !== id));
      return;
    }

    setUsers((current) => current.filter((user) => user.id !== id));
    setDrafts((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setDeletingIds((current) => current.filter((item) => item !== id));
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="backoffice-stat rounded-[24px] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
            Usuarios
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{summary.total}</p>
        </div>
        <div className="backoffice-stat rounded-[24px] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
            Activos
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-emerald-700">
            {summary.active}
          </p>
        </div>
        <div className="backoffice-stat rounded-[24px] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
            Suspendidos
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-amber-600">
            {summary.suspended}
          </p>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.75)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
              Seguridad interna
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Usuarios, roles y sesiones
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              `ROOT` queda blindado por `.env`; `ADMIN` gestiona el resto de cuentas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#166534,#0f172a)] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_35px_-20px_rgba(22,101,52,0.95)] transition hover:translate-y-[-1px]"
          >
            <Plus className="h-4 w-4" />
            Nuevo usuario
          </button>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Usuario</th>
                  <th className="px-5 py-4">Rol</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Creado</th>
                  <th className="px-5 py-4">Actualizado</th>
                  <th className="px-5 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const draft = drafts[user.id] ?? {
                    role: user.role,
                    isActive: user.isActive,
                  };
                  const isSaving = savingIds.includes(user.id);
                  const isDeleting = deletingIds.includes(user.id);
                  const isReadonlyRow = user.isRoot;
                  const canDelete = !user.isRoot && user.id !== currentUserId;

                  return (
                    <tr key={user.id} className="align-top transition hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                            {user.email.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-950">{user.email}</p>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {user.isRoot ? (
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                                  Cuenta ROOT
                                </span>
                              ) : null}
                              {user.id === currentUserId ? (
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                                  Tu sesión
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {isReadonlyRow ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                            {roleLabels[user.role]}
                          </span>
                        ) : (
                          <select
                            value={draft.role}
                            onChange={(event) =>
                              setDrafts((current) => ({
                                ...current,
                                [user.id]: {
                                  ...draft,
                                  role: event.target.value as AdminRole,
                                },
                              }))
                            }
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-300"
                          >
                            {manageableAdminRoles.map((role) => (
                              <option key={role} value={role}>
                                {roleLabels[role]}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {isReadonlyRow ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Activo fijo
                          </span>
                        ) : (
                          <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                            <input
                              type="checkbox"
                              checked={draft.isActive}
                              onChange={(event) =>
                                setDrafts((current) => ({
                                  ...current,
                                  [user.id]: {
                                    ...draft,
                                    isActive: event.target.checked,
                                  },
                                }))
                              }
                              className="h-4 w-4 rounded border-slate-300 text-green-700 focus:ring-green-600"
                            />
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                              {draft.isActive ? (
                                <>
                                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                  Activo
                                </>
                              ) : (
                                <>
                                  <ShieldOff className="h-4 w-4 text-amber-600" />
                                  Suspendido
                                </>
                              )}
                            </span>
                          </label>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-500">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-4 text-slate-500">{formatDate(user.updatedAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          {!isReadonlyRow ? (
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => saveUser(user.id)}
                              className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-green-800 transition hover:bg-green-100 disabled:opacity-60"
                            >
                              {isSaving ? "Guardando" : "Guardar"}
                            </button>
                          ) : null}
                          {canDelete ? (
                            <button
                              type="button"
                              disabled={isDeleting || currentUserRole === "VIEWER"}
                              onClick={() => deleteUser(user.id)}
                              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {isDeleting ? "Eliminando" : "Eliminar"}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={refreshUsers}
      />
    </div>
  );
}
