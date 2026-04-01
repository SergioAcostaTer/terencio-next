"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, MessageSquare } from "lucide-react";

import logo from "@/assets/images/logo.webp";

type WizardHeaderProps = {
  hasUnsavedChanges: boolean;
};

export default function WizardHeader({ hasUnsavedChanges }: WizardHeaderProps) {
  function handleNavigate(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!hasUnsavedChanges) {
      return;
    }

    const shouldLeave = window.confirm("Tienes cambios guardados en borrador. Si sales ahora podrás continuar más tarde.");
    if (!shouldLeave) {
      event.preventDefault();
    }
  }

  return (
    <header className="fixed inset-x-0 top-[97px] z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur md:top-[130px]">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 px-4">
        <Link
          href="/"
          onClick={handleNavigate}
          className="inline-flex min-w-0 items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src={logo}
              alt="Logotipo Terencio"
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 object-contain"
              priority
            />
            <div className="min-w-0 leading-none">
              <p className="truncate text-sm font-black tracking-tight text-[#c81010]">Terencio</p>
              <p className="truncate pt-0.5 text-[10px] font-extrabold italic tracking-wide text-[#007236]">
                Cash Market
              </p>
            </div>
          </div>
        </Link>
        <p className="hidden text-sm font-semibold text-slate-700 sm:block">Alta profesional</p>
        <Link href="/contacto" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-700 transition hover:bg-red-100">
          <MessageSquare className="h-4.5 w-4.5" />
        </Link>
      </div>
    </header>
  );
}
