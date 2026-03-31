import { z } from "zod";

export const adminRoles = ["ROOT", "ADMIN", "EDITOR", "VIEWER"] as const;
export type AdminRole = (typeof adminRoles)[number];

export const manageableAdminRoles = ["ADMIN", "EDITOR", "VIEWER"] as const;

export const roleLabels: Record<AdminRole, string> = {
  ROOT: "Root",
  ADMIN: "Admin",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};

export const permissionKeys = [
  "submissions.read",
  "memberships.read",
  "slides.read",
  "slides.write",
  "users.read",
  "users.write",
] as const;

export type PermissionKey = (typeof permissionKeys)[number];

export const rolePermissions: Record<AdminRole, readonly PermissionKey[]> = {
  ROOT: permissionKeys,
  ADMIN: permissionKeys,
  EDITOR: ["submissions.read", "memberships.read", "slides.read", "slides.write"],
  VIEWER: ["submissions.read", "memberships.read", "slides.read"],
};

export const segmentPermissions = {
  submissions: "submissions.read",
  memberships: "memberships.read",
  slides: "slides.read",
  users: "users.read",
} as const satisfies Record<string, PermissionKey>;

export const createAdminUserSchema = z.object({
  email: z.string().trim().email("Introduce un email válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  role: z.enum(manageableAdminRoles, {
    error: "Selecciona un rol válido.",
  }),
});

export const updateAdminUserSchema = z
  .object({
    role: z
      .enum(manageableAdminRoles, {
        error: "Selecciona un rol válido.",
      })
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => value.role !== undefined || value.isActive !== undefined, {
    message: "No hay cambios para guardar.",
  });

export function hasPermission(role: AdminRole, permission: PermissionKey) {
  return rolePermissions[role].includes(permission);
}

export function isRootAdminEmail(email: string, rootEmail: string) {
  return email.toLowerCase() === rootEmail.toLowerCase();
}
