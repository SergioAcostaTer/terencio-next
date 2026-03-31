"use client";

import type { Slide } from "@prisma/client";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import Button from "@/components/ui/Button";

type SlidesManagerProps = {
  slides: Slide[];
};

export default function SlidesManager({ slides }: SlidesManagerProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function refreshData() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleCreate(formData: FormData) {
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/slides", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setError(payload?.error || "No se pudo crear la diapositiva.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    await refreshData();
  }

  async function handleUpdate(slide: Slide, values: FormData) {
    setError(null);

    const response = await fetch(`/api/slides/${slide.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        durationSec: Number(values.get("durationSec")),
        order: Number(values.get("order")),
        isActive: values.get("isActive") === "on",
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setError(payload?.error || "No se pudo actualizar la diapositiva.");
      return;
    }

    await refreshData();
  }

  async function handleDelete(id: string) {
    setError(null);

    const response = await fetch(`/api/slides/${id}`, {
      method: "DELETE",
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setError(payload?.error || "No se pudo eliminar la diapositiva.");
      return;
    }

    await refreshData();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">Nueva diapositiva</h2>
          <p className="mt-1 text-sm text-gray-500">
            Sube una imagen o un vídeo y define su orden y duración.
          </p>
        </div>

        <form action={handleCreate} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Tipo
            </label>
            <select
              name="type"
              defaultValue="image"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3"
            >
              <option value="image">Imagen</option>
              <option value="video">Vídeo</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Archivo
            </label>
            <input
              name="file"
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf,video/mp4,video/webm"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Duración en segundos
            </label>
            <input
              name="durationSec"
              type="number"
              min={3}
              max={300}
              defaultValue={10}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Orden
            </label>
            <input
              name="order"
              type="number"
              min={0}
              defaultValue={slides.length}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3"
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input name="isActive" type="checkbox" value="true" defaultChecked />
            Activa desde ahora
          </label>

          <div className="flex justify-end md:col-span-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Crear diapositiva"}
            </Button>
          </div>
        </form>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">Diapositivas actuales</h2>
          <p className="mt-1 text-sm text-gray-500">
            Ajusta orden, duración y visibilidad. Los cambios impactan en la pantalla.
          </p>
        </div>

        <div className="space-y-4">
          {slides.map((slide) => (
            <form
              key={slide.id}
              action={async (formData) => handleUpdate(slide, formData)}
              className="grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))_auto]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {slide.url}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                  {slide.type === "video" ? "Vídeo" : "Imagen"}
                </p>
              </div>

              <input
                name="durationSec"
                type="number"
                min={3}
                max={300}
                defaultValue={slide.durationSec}
                className="rounded-xl border border-gray-200 px-3 py-2"
              />
              <input
                name="order"
                type="number"
                min={0}
                defaultValue={slide.order}
                className="rounded-xl border border-gray-200 px-3 py-2"
              />
              <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                <input name="isActive" type="checkbox" defaultChecked={slide.isActive} />
                Activa
              </label>

              <div className="flex gap-2">
                <Button type="submit" size="sm">
                  Guardar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(slide.id)}
                >
                  Eliminar
                </Button>
              </div>
            </form>
          ))}

          {slides.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
              Aún no hay diapositivas cargadas.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
