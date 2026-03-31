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
      <section className="rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,#0f172a,#166534)] px-6 py-7 text-white shadow-[0_26px_50px_-34px_rgba(15,23,42,0.75)] sm:px-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-100/80">
          Backoffice / Usuarios
        </p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Usuarios internos</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-100/80">
              Gestión centralizada de credenciales, roles operativos y revocación de acceso.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-100/70">
              Sesión actual
            </p>
            <p className="mt-1 text-lg font-black">{session.email}</p>
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
