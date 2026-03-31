"use client";

import type { Slide } from "@prisma/client";
import { useEffect, useState } from "react";

type DisplayCarouselProps = {
  initialSlides: Slide[];
};

const POLL_INTERVAL_MS = 30_000;

export default function DisplayCarousel({ initialSlides }: DisplayCarouselProps) {
  const [slides, setSlides] = useState(initialSlides);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length === 0) {
      return;
    }

    const activeSlide = slides[activeIndex % slides.length];
    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, activeSlide.durationSec * 1000);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, slides]);

  useEffect(() => {
    const interval = window.setInterval(async () => {
      const response = await fetch("/api/slides", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as Slide[];
      setSlides(payload);
      setActiveIndex((current) =>
        payload.length === 0 ? 0 : Math.min(current, payload.length - 1),
      );
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  if (slides.length === 0) {
    return (
      <div className="flex h-[calc(100vh-92px)] items-center justify-center bg-black text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-6 text-center backdrop-blur">
          <p className="text-lg font-semibold">No hay diapositivas activas.</p>
          <p className="mt-2 text-sm text-white/70">
            Carga contenido desde el backoffice para esta pantalla.
          </p>
        </div>
      </div>
    );
  }

  const activeSlide = slides[activeIndex % slides.length];

  return (
    <div className="relative h-[calc(100vh-92px)] overflow-hidden bg-black">
      {activeSlide.type === "video" ? (
        <video
          key={activeSlide.id}
          src={activeSlide.url}
          autoPlay
          muted
          playsInline
          loop
          className="h-full w-full object-cover"
        />
      ) : (
        <img src={activeSlide.url} alt="" className="h-full w-full object-cover" />
      )}

      <div className="absolute top-6 right-6 rounded-full bg-black/45 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
        {activeIndex + 1} / {slides.length}
      </div>
    </div>
  );
}
