"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Icon from "@/components/ui/Icon";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string | null;
  consented: boolean;
};

const STORAGE_KEY = "terencio_consent_v1";

const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: null,
  consented: false,
};

function readConsent(): ConsentState {
  if (typeof window === "undefined") {
    return defaultConsent;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ConsentState) : defaultConsent;
  } catch {
    return defaultConsent;
  }
}

function applyConsent(consent: ConsentState) {
  if (typeof window === "undefined") {
    return;
  }

  const gaId = "G-HVCHD7R86X";
  (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] =
    !consent.analytics;
}

export default function CookieBanner() {
  const [isReady, setIsReady] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const consent = readConsent();
    applyConsent(consent);
    setAnalytics(consent.analytics);
    setShowBanner(!consent.consented);
    setIsReady(true);
  }, []);

  function saveConsent(consent: ConsentState) {
    const nextConsent = {
      ...consent,
      timestamp: new Date().toISOString(),
      consented: true,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextConsent));
    applyConsent(nextConsent);
    setShowBanner(false);
    setShowModal(false);
  }

  if (!isReady) {
    return null;
  }

  return (
    <>
      {showModal ? (
        <div
          className="fixed inset-0 z-[140] bg-black/40"
          onClick={() => setShowModal(false)}
        />
      ) : null}

      {showBanner ? (
        <div className="fixed bottom-0 left-0 z-[150] flex min-h-[100px] w-full translate-y-0 flex-col justify-center border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-transform duration-500">
          <div className="container mx-auto grid grid-cols-1 items-center gap-6 px-4 py-6 md:py-8 lg:grid-cols-[1fr_auto]">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-lg font-bold text-gray-900">
                Valoramos tu privacidad
              </h2>
              <p className="mx-auto max-w-3xl text-sm leading-relaxed text-gray-600 lg:mx-0">
                Utilizamos cookies propias y de terceros para mejorar tu
                experiencia de navegación, analizar el tráfico del sitio y
                personalizar el contenido. Antes de continuar, puedes aceptar
                todas las cookies, rechazarlas o configurar tus preferencias.
                Consulta nuestra{" "}
                <Link
                  href="/legal/cookies"
                  className="font-semibold text-green-700 hover:underline"
                >
                  Política de Cookies
                </Link>{" "}
                para más información.
              </p>
            </div>

            <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:w-auto lg:justify-end">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 cursor-pointer"
              >
                Configurar
              </button>
              <button
                type="button"
                onClick={() =>
                  saveConsent({
                    ...defaultConsent,
                    consented: true,
                  })
                }
                className="rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 cursor-pointer"
              >
                Rechazar
              </button>
              <button
                type="button"
                onClick={() =>
                  saveConsent({
                    ...defaultConsent,
                    analytics: true,
                    marketing: true,
                    consented: true,
                  })
                }
                className="rounded-lg bg-green-700 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-green-800 hover:shadow-lg cursor-pointer"
              >
                Aceptar Todo
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showModal ? (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Preferencias de Cookies
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <Icon name="X" className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <p className="mb-4 text-sm text-gray-600">
                Gestiona tus preferencias de consentimiento. Puedes activar o
                desactivar las diferentes categorías de cookies a continuación.
              </p>

              <div className="flex items-start gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900">
                      Estrictamente Necesarias
                    </h4>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700">
                      Siempre Activo
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Estas cookies son esenciales para el funcionamiento del
                    sitio web y no pueden desactivarse.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-5 w-5 cursor-not-allowed rounded opacity-50"
                />
              </div>

              <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:border-green-200">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900">
                      Analíticas y Rendimiento
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500">
                    Nos permiten contar las visitas y fuentes de tráfico para
                    medir y mejorar el rendimiento de nuestro sitio.
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(event) => setAnalytics(event.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-green-600 peer-focus:ring-2 peer-focus:ring-green-300 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 rounded-b-xl border-t border-gray-100 bg-gray-50 p-6">
              <button
                type="button"
                onClick={() =>
                  saveConsent({
                    ...defaultConsent,
                    analytics,
                    consented: true,
                  })
                }
                className="w-full rounded-lg bg-green-700 px-6 py-2.5 font-bold text-white shadow-sm transition hover:bg-green-800 sm:w-auto"
              >
                Guardar Preferencias
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
