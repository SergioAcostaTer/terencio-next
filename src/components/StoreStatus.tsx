"use client";

import { useEffect, useMemo, useState } from "react";

import Icon from "@/components/ui/Icon";

type StatusState = {
  isOpen: boolean;
  message: string;
};

function getCanaryTimeParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Atlantic/Canary",
    weekday: "short",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    weekday: value("weekday"),
    month: Number.parseInt(value("month"), 10),
    day: Number.parseInt(value("day"), 10),
    hour: Number.parseInt(value("hour"), 10),
    minute: Number.parseInt(value("minute"), 10),
  };
}

function getStoreStatus(date: Date): StatusState {
  const { weekday, month, day, hour, minute } = getCanaryTimeParts(date);
  const isHoliday =
    (month === 12 && day === 25) ||
    (month === 1 && day === 1) ||
    (month === 1 && day === 6);

  if (isHoliday) {
    return {
      isOpen: false,
      message: "CERRADO POR FESTIVO",
    };
  }

  const isSunday = weekday === "Sun";
  const currentMinutes = hour * 60 + minute;
  const openMinutes = isSunday ? 8 * 60 + 30 : 8 * 60;
  const closeMinutes = isSunday ? 20 * 60 + 30 : 21 * 60;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    const closeHour = Math.floor(closeMinutes / 60);
    const closeMinute = `${closeMinutes % 60}`.padStart(2, "0");

    return {
      isOpen: true,
      message: `ABIERTO AHORA - CERRAMOS A LAS ${closeHour}:${closeMinute}`,
    };
  }

  if (currentMinutes < openMinutes) {
    const openHour = Math.floor(openMinutes / 60);
    const openMinute = `${openMinutes % 60}`.padStart(2, "0");

    return {
      isOpen: false,
      message: `CERRADO - ABRIMOS HOY A LAS ${openHour}:${openMinute}`,
    };
  }

  return {
    isOpen: false,
    message: `CERRADO - ABRIMOS MAÑANA A LAS ${weekday === "Sat" ? "08:30" : "08:00"}`,
  };
}

export default function StoreStatus() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<StatusState>(() => getStoreStatus(new Date()));

  useEffect(() => {
    const tick = () => setStatus(getStoreStatus(new Date()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const bannerClasses = useMemo(
    () =>
      status.isOpen
        ? "bg-green-700 hover:bg-green-800"
        : "bg-red-700 hover:bg-red-800",
    [status.isOpen],
  );

  const modalClasses = useMemo(
    () =>
      status.isOpen
        ? "border-green-200 bg-green-50 text-green-800"
        : "border-red-200 bg-red-50 text-red-800",
    [status.isOpen],
  );

  return (
    <>
      <div
        className={`block w-full cursor-pointer border-b border-gray-200 transition-colors duration-500 ${bannerClasses}`}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="container mx-auto flex items-center justify-center px-4 py-2 lg:px-6">
          <div className="group flex items-center gap-2 text-sm font-medium text-white">
            <Icon
              name={status.isOpen ? "CircleCheck" : "Clock3"}
              size={16}
              className="text-white"
            />
            <span className="uppercase tracking-wide">{status.message}</span>
            <Icon
              name="Info"
              size={14}
              className="ml-1 text-white/70 transition-colors group-hover:text-white"
            />
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Icon name="Store" className="text-green-600" /> Horario
                Detallado
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div
                className={`flex items-center gap-3 rounded-xl border p-4 font-bold ${modalClasses}`}
              >
                <Icon name={status.isOpen ? "CircleCheck" : "Clock3"} />
                <span>{status.message}</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-gray-50 py-2">
                  <span className="text-gray-500">Lunes - Sábado</span>
                  <span className="font-bold text-gray-900">08:00 - 21:00</span>
                </div>
                <div className="-mx-2 flex justify-between rounded bg-yellow-50/50 px-2 py-2 border-b border-gray-50">
                  <span className="font-medium text-gray-600">
                    Domingos y Festivos
                  </span>
                  <span className="font-bold text-gray-900">08:30 - 20:30</span>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-gray-400">
                Horario continuo. No cerramos a mediodía.
                <br />
                Ubicación: Ctra. La Esperanza 22, La Laguna.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
