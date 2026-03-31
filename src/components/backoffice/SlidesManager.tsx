"use client";

import type { Slide } from "@prisma/client";
import {
  Eye,
  Film,
  GripVertical,
  ImageIcon,
  Layers3,
  LoaderCircle,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type SlidesManagerProps = {
  slides: Slide[];
  canManage?: boolean;
};

type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
  type: "image" | "video";
};

function inferMediaType(file: File): "image" | "video" {
  return file.type.startsWith("video/") ? "video" : "image";
}

function reorderSlides(items: Slide[], draggedId: string, targetId: string) {
  const draggedIndex = items.findIndex((item) => item.id === draggedId);
  const targetIndex = items.findIndex((item) => item.id === targetId);

  if (draggedIndex < 0 || targetIndex < 0 || draggedIndex === targetIndex) {
    return items;
  }

  const next = [...items];
  const [dragged] = next.splice(draggedIndex, 1);
  next.splice(targetIndex, 0, dragged);

  return next.map((slide, index) => ({
    ...slide,
    order: index,
  }));
}

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/80";

export default function SlidesManager({
  slides,
  canManage = true,
}: SlidesManagerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemsRef = useRef<Slide[]>(slides);
  const [items, setItems] = useState<Slide[]>(slides);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [durationSec, setDurationSec] = useState(10);
  const [isActiveByDefault, setIsActiveByDefault] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  useEffect(() => {
    setItems(slides);
    itemsRef.current = slides;
  }, [slides]);

  function addFiles(fileList: FileList | File[]) {
    const next = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        type: inferMediaType(file),
      }));

    if (next.length === 0) {
      setError("Arrastra o selecciona imágenes o vídeos compatibles.");
      return;
    }

    setError(null);
    setUploadQueue((current) => [...current, ...next]);
  }

  function removeQueuedItem(id: string) {
    setUploadQueue((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  }

  async function handleBatchUpload() {
    if (!canManage) {
      return;
    }

    if (uploadQueue.length === 0) {
      setError("Añade al menos un archivo para cargar.");
      return;
    }

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    uploadQueue.forEach((item) => formData.append("files", item.file));
    formData.append("durationSec", String(durationSec));
    formData.append("isActive", String(isActiveByDefault));

    const res = await fetch("/api/slides", {
      method: "POST",
      body: formData,
    });

    const payload = (await res.json().catch(() => null)) as
      | { error?: string }
      | Slide[]
      | null;

    if (!res.ok) {
      setError(
        payload && "error" in payload
          ? payload.error ?? "No se pudieron subir los archivos."
          : "No se pudieron subir los archivos.",
      );
      setIsUploading(false);
      return;
    }

    setUploadQueue((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });

    if (Array.isArray(payload)) {
      setItems((current) => {
        const next = [...current, ...payload].sort((a, b) => a.order - b.order);
        itemsRef.current = next;
        return next;
      });
    }

    setIsUploading(false);
  }

  async function persistOrder(nextItems: Slide[]) {
    if (!canManage) {
      return;
    }

    setIsSavingOrder(true);
    setError(null);

    try {
      await Promise.all(
        nextItems.map((slide, index) =>
          fetch(`/api/slides/${slide.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              durationSec: slide.durationSec,
              order: index,
              isActive: slide.isActive,
            }),
          }).then(async (response) => {
            if (!response.ok) {
              const payload = (await response.json().catch(() => null)) as { error?: string } | null;
              throw new Error(payload?.error ?? "No se pudo guardar el orden.");
            }
          }),
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el orden.");
    } finally {
      setIsSavingOrder(false);
    }
  }

  async function handleSaveSlide(slide: Slide) {
    if (!canManage) {
      return;
    }

    setSavingIds((current) => [...current, slide.id]);
    setError(null);

    try {
      const res = await fetch(`/api/slides/${slide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationSec: slide.durationSec,
          order: slide.order,
          isActive: slide.isActive,
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "No se pudo guardar la diapositiva.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la diapositiva.");
    } finally {
      setSavingIds((current) => current.filter((id) => id !== slide.id));
    }
  }

  async function handleDelete(id: string) {
    if (!canManage) {
      return;
    }

    if (!confirm("¿Eliminar esta diapositiva?")) {
      return;
    }

    setDeletingIds((current) => [...current, id]);
    setError(null);

    const res = await fetch(`/api/slides/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Error al eliminar.");
      setDeletingIds((current) => current.filter((item) => item !== id));
      return;
    }

    setItems((current) => {
      const next = current
        .filter((item) => item.id !== id)
        .map((slide, index) => ({
          ...slide,
          order: index,
        }));
      itemsRef.current = next;
      return next;
    });
    setDeletingIds((current) => current.filter((item) => item !== id));
  }

  function updateSlide(id: string, patch: Partial<Slide>) {
    setItems((current) => {
      const next = current.map((item) => (item.id === id ? { ...item, ...patch } : item));
      itemsRef.current = next;
      return next;
    });
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.75)]">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
              Carga masiva
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Arrastra, suelta y publica
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              El gestor detecta automáticamente si cada archivo es imagen o vídeo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={!canManage}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Añadir archivos
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) {
              addFiles(event.target.files);
              event.target.value = "";
            }
          }}
        />

        <div
          onDragOver={(event) => {
            if (canManage) {
              event.preventDefault();
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            if (canManage) {
              addFiles(event.dataTransfer.files);
            }
          }}
          className="rounded-[28px] border-2 border-dashed border-blue-200 bg-[linear-gradient(180deg,rgba(239,246,255,0.9),rgba(248,250,252,0.9))] px-6 py-10 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="mt-4 text-lg font-black tracking-tight text-slate-950">
            Suelta aquí imágenes o vídeos
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {canManage
              ? "También puedes seleccionar varios archivos de una vez."
              : "Tu rol puede revisar el tablero, pero no publicar ni editar diapositivas."}
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Vista previa de carga</p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                {uploadQueue.length} archivos
              </span>
            </div>

            {uploadQueue.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
                No hay archivos en cola todavía.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {uploadQueue.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
                    <div className="relative h-40 bg-slate-950">
                      {item.type === "image" ? (
                        <img src={item.previewUrl} alt={item.file.name} className="h-full w-full object-cover" />
                      ) : (
                        <video src={item.previewUrl} className="h-full w-full object-cover" muted playsInline />
                      )}
                      <div className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                        {item.type}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQueuedItem(item.id)}
                        className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-slate-900 transition hover:bg-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {item.file.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <p className="text-sm font-bold text-slate-900">Ajustes por lote</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Duración por defecto (seg)
                </label>
                <input
                  type="number"
                  min={3}
                  max={300}
                  value={durationSec}
                  onChange={(event) => setDurationSec(Number(event.target.value))}
                  className={inputCls}
                  disabled={!canManage}
                />
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isActiveByDefault}
                  onChange={(event) => setIsActiveByDefault(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                  disabled={!canManage}
                />
                Activar nuevas diapositivas al subir
              </label>
              <button
                type="button"
                onClick={handleBatchUpload}
                disabled={!canManage || isUploading || uploadQueue.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1d4ed8,#0f172a)] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_35px_-20px_rgba(29,78,216,0.95)] transition hover:translate-y-[-1px] disabled:translate-y-0 disabled:opacity-60"
              >
                {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                {!canManage ? "Solo lectura" : isUploading ? "Subiendo..." : "Subir lote"}
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </section>

      <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.75)]">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
              Orden visual
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Tablero de diapositivas
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Reordena arrastrando las tarjetas. El orden se guarda al soltarlas.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              {items.length} activas en tablero
            </span>
            {isSavingOrder ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                Guardando orden
              </span>
            ) : null}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/80 py-12 text-center text-sm text-slate-400">
            No hay diapositivas cargadas aún.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {items.map((slide) => {
              const isSaving = savingIds.includes(slide.id);
              const isDeleting = deletingIds.includes(slide.id);

              return (
                <article
                  key={slide.id}
                  draggable={canManage}
                  onDragStart={() => {
                    if (canManage) {
                      setDraggedId(slide.id);
                    }
                  }}
                  onDragOver={(event) => {
                    if (!canManage) {
                      return;
                    }
                    event.preventDefault();
                    if (!draggedId || draggedId === slide.id) {
                      return;
                    }
                    setItems((current) => {
                      const next = reorderSlides(current, draggedId, slide.id);
                      itemsRef.current = next;
                      return next;
                    });
                  }}
                  onDragEnd={async () => {
                    setDraggedId(null);
                    if (canManage) {
                      await persistOrder(itemsRef.current);
                    }
                  }}
                  className={`overflow-hidden rounded-[24px] border bg-white transition ${
                    draggedId === slide.id
                      ? "border-blue-400 shadow-[0_26px_45px_-30px_rgba(29,78,216,0.65)]"
                      : "border-slate-200 shadow-[0_18px_35px_-30px_rgba(15,23,42,0.55)]"
                  }`}
                >
                  <div className="relative h-52 bg-slate-950">
                    {slide.type === "image" ? (
                      <img src={slide.url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <video src={slide.url} className="h-full w-full object-cover" muted playsInline controls />
                    )}
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                        {slide.type === "image" ? <ImageIcon className="h-3.5 w-3.5" /> : <Film className="h-3.5 w-3.5" />}
                        {slide.type}
                      </span>
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-800">
                        #{slide.order + 1}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-800">
                        <GripVertical className="h-3.5 w-3.5" />
                        {canManage ? "Arrastrar" : "Lectura"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{slide.url}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
                              slide.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {slide.isActive ? "Activa" : "Inactiva"}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                            <Layers3 className="h-3.5 w-3.5" />
                            ID {slide.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                      <a
                        href={slide.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                        aria-label="Abrir vista previa"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                          Duración (seg)
                        </label>
                        <input
                          type="number"
                          min={3}
                          max={300}
                          value={slide.durationSec}
                          onChange={(event) =>
                            updateSlide(slide.id, {
                              durationSec: Number(event.target.value),
                            })
                          }
                          className={inputCls}
                          disabled={!canManage}
                        />
                      </div>
                      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700 sm:self-end">
                        <input
                          type="checkbox"
                          checked={slide.isActive}
                          onChange={(event) =>
                            updateSlide(slide.id, {
                              isActive: event.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                          disabled={!canManage}
                        />
                        Visible
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveSlide(slide)}
                        disabled={!canManage || isSaving || isDeleting}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                      >
                        {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                        {canManage ? "Guardar" : "Bloqueado"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(slide.id)}
                        disabled={!canManage || isDeleting}
                        className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-white px-4 py-3 text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                        aria-label="Eliminar diapositiva"
                      >
                        {isDeleting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
