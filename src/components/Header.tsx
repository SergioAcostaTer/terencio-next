"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import logo from "@/assets/images/logo.webp";
import StoreStatus from "@/components/StoreStatus";
import Icon from "@/components/ui/Icon";
import navigation from "@/data/navigation.json";
import siteData from "@/data/siteData.json";

type NavItem = {
  label: string;
  href: string;
  color?: "red" | "slate";
  children?: { label: string; href: string }[];
};

function desktopNavClass(color?: string) {
  if (color === "red") {
    return "bg-red-50 text-red-700 hover:bg-red-100";
  }

  if (color === "slate") {
    return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }

  return "text-gray-800 hover:bg-gray-50 hover:text-green-700";
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-[100] flex w-full flex-col bg-white font-sans shadow-md transition-all duration-300">
      <div className="hidden justify-between border-b border-green-800 bg-green-700 px-6 py-2 text-xs text-white md:flex lg:px-8">
        <div className="flex gap-6">
          <a
            href={siteData.social.googleMaps}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-medium transition hover:text-yellow-200"
          >
            <Icon name="MapPin" size={14} /> Ctra. La Esperanza 22, La Laguna
          </a>
          <span className="flex items-center gap-1 font-bold text-yellow-300">
            <Icon name="Calendar" size={14} /> ¡ABIERTO DOMINGOS!
          </span>
        </div>
        <div className="flex gap-6">
          <Link
            href="/profesionales"
            className="font-medium transition hover:text-yellow-200"
          >
            Zona Profesionales HORECA
          </Link>
          <a
            href={`tel:${siteData.contact.phoneRaw}`}
            className="flex items-center gap-1 font-bold transition hover:text-yellow-200"
          >
            <Icon name="Phone" size={14} /> {siteData.contact.phone}
          </a>
        </div>
      </div>

      <div className="container relative z-50 mx-auto flex h-[70px] items-center justify-between bg-white px-4 md:h-[80px] lg:px-6">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="flex h-12 w-12 items-center justify-center rounded-xl text-gray-800 transition hover:bg-gray-100 md:hidden"
          aria-label="Menú Principal"
          aria-expanded={mobileMenuOpen}
        >
          <Icon name={mobileMenuOpen ? "X" : "Menu"} className="h-8 w-8" />
        </button>

        <Link
          href="/"
          className="group relative flex items-center gap-2"
          aria-label="Terencio Cash Market Inicio"
        >
          <div className="flex h-8 items-center md:h-12">
            <Image
              className="h-full w-auto object-contain transition-transform group-hover:scale-105"
              src={logo}
              alt="Logotipo Terencio Supermercado"
              width={48}
              height={48}
              priority
            />
          </div>
          <div className="flex flex-col justify-center -space-y-1">
            <span className="text-3xl leading-none font-black tracking-tighter text-[#c81010] capitalize lg:text-4xl">
              Terencio
            </span>
            <span className="text-lg leading-none font-extrabold italic tracking-wider text-[#007236] capitalize lg:text-base">
              Cash Market
            </span>
          </div>
        </Link>

        <nav aria-label="Navegación Desktop Principal" className="hidden md:block">
          <ul className="m-0 flex list-none items-center gap-1 p-0 lg:gap-2">
            {(navigation.main as NavItem[]).map((link) => (
              <li key={link.label} className="group relative">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold transition-all lg:text-[15px] ${desktopNavClass(link.color)}`}
                >
                  {link.label}
                  {link.children ? (
                    <Icon
                      name="ChevronDown"
                      size={14}
                      className="mt-0.5 text-gray-500 transition-transform group-hover:rotate-180"
                    />
                  ) : null}
                </Link>

                {link.children ? (
                  <div className="invisible absolute top-full left-0 z-50 translate-y-2 pt-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className="m-0 w-64 list-none overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5">
                      {link.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            className="group/item flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-green-50 hover:text-green-900"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition group-hover/item:bg-green-200 group-hover/item:text-green-800">
                              {child.label.includes("Carnicería")
                                ? "🥩"
                                : child.label.includes("Quesos")
                                  ? "🧀"
                                  : child.label.includes("Hierro")
                                    ? "🍍"
                                    : child.label.includes("Cash")
                                      ? "🛒"
                                      : "•"}
                            </div>
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}

            <li className="ml-2 list-none">
              <Link
                href={navigation.cta.href}
                className="ml-4 flex items-center gap-2 rounded-xl bg-green-700 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-lg"
              >
                {navigation.cta.label}
                <Icon name="ArrowRight" size={16} />
              </Link>
            </li>
          </ul>
        </nav>

        <Link
          href="/ofertas"
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700 transition active:scale-95 md:hidden"
          aria-label="Ver Ofertas"
        >
          <Icon name="Tag" className="h-7 w-7" />
        </Link>
      </div>

      <StoreStatus />

      <nav
        aria-label="Navegación Móvil Principal"
        className={`fixed top-[105px] left-0 z-[70] h-[calc(100dvh-105px)] w-full overflow-hidden bg-white pb-6 shadow-inner transition-transform duration-300 md:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <ul className="m-0 flex list-none flex-col gap-2 p-6">
          {(navigation.main as NavItem[]).map((link) => (
            <li key={link.label} className="mb-2">
              {link.children ? (
                <>
                  <button
                    type="button"
                    onClick={() => setMobileProductsOpen((value) => !value)}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 text-left text-gray-800 shadow-sm"
                  >
                    <span className="font-bold">{link.label}</span>
                    <Icon
                      name="ChevronDown"
                      size={18}
                      className={`transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileProductsOpen ? (
                    <ul className="mt-2 space-y-2 pl-3">
                      {link.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-800"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-xl border px-4 py-4 font-bold shadow-sm transition ${link.color === "red" ? "border-red-500 bg-red-700 text-white" : link.color === "slate" ? "border-slate-600 bg-slate-900 text-white" : "border-gray-200 bg-white text-gray-800"}`}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}

          {navigation.mobileExtra.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-800"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
