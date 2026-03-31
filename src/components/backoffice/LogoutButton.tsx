"use client";

import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/backoffice/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className={twMerge(
        "border-slate-200 bg-white/80 text-slate-900 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800",
        className,
      )}
    >
      Cerrar sesión
    </Button>
  );
}
