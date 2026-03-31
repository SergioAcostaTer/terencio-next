import UsersManager from "@/components/backoffice/UsersManager";
import { isRootAdminEmail } from "@/lib/admin-users";
import { requireAdminPermission } from "@/lib/auth";
import { getEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const session = await requireAdminPermission("users.read");
  const users = await prisma.adminUser.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="space-y-8">
      <section className="backoffice-page-header px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Backoffice / Usuarios
        </p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Usuarios internos</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Gestión centralizada de credenciales, roles operativos y revocación de acceso.
            </p>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Sesión actual
            </p>
            <p className="mt-1 text-base font-semibold text-slate-950">{session.email}</p>
          </div>
        </div>
      </section>

      <UsersManager
        currentUserId={session.userId}
        currentUserRole={session.role}
        initialUsers={users.map((user) => ({
          ...user,
          isRoot: isRootAdminEmail(user.email, getEnv().ADMIN_EMAIL),
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
