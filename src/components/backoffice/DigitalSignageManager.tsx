"use client";

import {
  ArrowLeft,
  ArrowRight,
  Film,
  ImageIcon,
  Link2,
  LoaderCircle,
  MonitorCog,
  MonitorPlay,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type {
  DisplayAdminPayload,
  MediaAssetPayload,
  PlaylistPayload,
} from "@/lib/display-types";

type DigitalSignageManagerProps = {
  assets: MediaAssetPayload[];
  playlists: PlaylistPayload[];
  displays: DisplayAdminPayload[];
  canManage?: boolean;
};

type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
  type: "image" | "video";
};

type DisplayDraft = {
  name: string;
  mode: DisplayAdminPayload["mode"];
  playlistId: string;
  pinnedAssetId: string;
};

const inputCls =
  "w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-950 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100";

function badgeForDisplay(display: DisplayAdminPayload) {
  return display.online
    ? "bg-emerald-50 text-emerald-700"
    : "bg-slate-100 text-slate-600";
}

function formatMode(mode: DisplayAdminPayload["mode"]) {
  if (mode === "AUTOPLAY") return "Autoplay";
  if (mode === "PINNED") return "Fijado";
  return "Manual";
}

function moveItem<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function isPlaylistPayload(payload: unknown): payload is PlaylistPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "id" in payload &&
    "items" in payload
  );
}

function isDisplayPayload(payload: unknown): payload is DisplayAdminPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "id" in payload &&
    "mode" in payload
  );
}

export default function DigitalSignageManager({
  assets: initialAssets,
  playlists: initialPlaylists,
  displays: initialDisplays,
  canManage = true,
}: DigitalSignageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [assets, setAssets] = useState(initialAssets);
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [displays, setDisplays] = useState(initialDisplays);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(initialPlaylists[0]?.id ?? "");
  const [selectedDisplayId, setSelectedDisplayId] = useState(initialDisplays[0]?.id ?? "");
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [renamePlaylist, setRenamePlaylist] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState(initialAssets[0]?.id ?? "");
  const [newItemDuration, setNewItemDuration] = useState(10);
  const [pairingCode, setPairingCode] = useState("");
  const [pairingName, setPairingName] = useState("");
  const [displayDraft, setDisplayDraft] = useState<DisplayDraft | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingPlaylist, setIsSavingPlaylist] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [isSavingDisplay, setIsSavingDisplay] = useState(false);
  const [isSendingCommand, setIsSendingCommand] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedPlaylist =
    playlists.find((playlist) => playlist.id === selectedPlaylistId) ?? null;
  const selectedDisplay =
    displays.find((display) => display.id === selectedDisplayId) ?? null;

  useEffect(() => {
    if (!selectedPlaylistId && playlists[0]) {
      setSelectedPlaylistId(playlists[0].id);
    }
  }, [playlists, selectedPlaylistId]);

  useEffect(() => {
    if (!selectedDisplayId && displays[0]) {
      setSelectedDisplayId(displays[0].id);
    }
  }, [displays, selectedDisplayId]);

  useEffect(() => {
    setRenamePlaylist(selectedPlaylist?.name ?? "");
  }, [selectedPlaylist]);

  useEffect(() => {
    if (!selectedDisplay) {
      setDisplayDraft(null);
      return;
    }

    setDisplayDraft({
      name: selectedDisplay.name,
      mode: selectedDisplay.mode,
      playlistId: selectedDisplay.playlist?.id ?? "",
      pinnedAssetId: selectedDisplay.pinnedAsset?.id ?? "",
    });
  }, [selectedDisplay]);

  function syncDisplay(updated: DisplayAdminPayload) {
    setDisplays((current) =>
      current.map((display) => (display.id === updated.id ? updated : display)),
    );
  }

  async function refreshDisplays() {
    const response = await fetch("/api/displays", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as DisplayAdminPayload[];
    setDisplays(payload);
  }

  async function refreshPlaylists() {
    const response = await fetch("/api/playlists", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as PlaylistPayload[];
    setPlaylists(payload);
  }

  function addFiles(fileList: FileList | File[]) {
    const next = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? ("video" as const) : ("image" as const),
      }));

    if (next.length === 0) {
      setError("Selecciona imágenes o vídeos compatibles.");
      return;
    }

    setError(null);
    setUploadQueue((current) => [...current, ...next]);
  }

  async function handleUpload() {
    if (!canManage || uploadQueue.length === 0) {
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    uploadQueue.forEach((item) => formData.append("files", item.file));

    const response = await fetch("/api/media-assets", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json().catch(() => null)) as
      | MediaAssetPayload[]
      | { error?: string }
      | null;

    if (!response.ok || !Array.isArray(payload)) {
      setError(
        payload && !Array.isArray(payload)
          ? payload.error ?? "No se pudieron subir los assets."
          : "No se pudieron subir los assets.",
      );
      setIsUploading(false);
      return;
    }

    setAssets((current) => [...payload, ...current]);
    if (!selectedAssetId && payload[0]) {
      setSelectedAssetId(payload[0].id);
    }
    setUploadQueue((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
    setIsUploading(false);
  }

  async function handleDeleteAsset(assetId: string) {
    if (!canManage || !confirm("¿Eliminar este asset de la biblioteca?")) {
      return;
    }

    setError(null);
    const response = await fetch(`/api/media-assets/${assetId}`, { method: "DELETE" });

    if (!response.ok) {
      setError("No se pudo eliminar el asset.");
      return;
    }

    setAssets((current) => current.filter((asset) => asset.id !== assetId));
    await Promise.all([refreshPlaylists(), refreshDisplays()]);
  }

  async function handleCreatePlaylist() {
    if (!canManage || !newPlaylistName.trim()) {
      return;
    }

    setError(null);
    const response = await fetch("/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPlaylistName.trim() }),
    });

    const payload = (await response.json().catch(() => null)) as
      | PlaylistPayload
      | { error?: string }
      | null;

    if (!response.ok || !payload || "error" in payload) {
      setError(
        payload && "error" in payload
          ? payload.error ?? "No se pudo crear la playlist."
          : "No se pudo crear la playlist.",
      );
      return;
    }

    if (!isPlaylistPayload(payload)) {
      setError("Respuesta inválida al crear la playlist.");
      return;
    }

    setPlaylists((current) => [payload, ...current]);
    setSelectedPlaylistId(payload.id);
    setNewPlaylistName("");
  }

  async function savePlaylist(nextPlaylist: PlaylistPayload) {
    if (!canManage) {
      return;
    }

    setIsSavingPlaylist(true);
    setError(null);

    const response = await fetch(`/api/playlists/${nextPlaylist.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nextPlaylist.name,
        items: nextPlaylist.items.map((item, index) => ({
          id: item.id,
          order: index,
          durationSec: item.durationSec,
        })),
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | PlaylistPayload
      | { error?: string }
      | null;

    if (!response.ok || !payload || "error" in payload) {
      setError(
        payload && "error" in payload
          ? payload.error ?? "No se pudo guardar la playlist."
          : "No se pudo guardar la playlist.",
      );
      setIsSavingPlaylist(false);
      return;
    }

    if (!isPlaylistPayload(payload)) {
      setError("Respuesta inválida al guardar la playlist.");
      setIsSavingPlaylist(false);
      return;
    }

    setPlaylists((current) =>
      current.map((playlist) => (playlist.id === payload.id ? payload : playlist)),
    );
    setIsSavingPlaylist(false);
    await refreshDisplays();
  }

  async function handleAddAssetToPlaylist() {
    if (!canManage || !selectedPlaylist || !selectedAssetId) {
      return;
    }

    setError(null);
    const response = await fetch(`/api/playlists/${selectedPlaylist.id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assetId: selectedAssetId,
        durationSec: newItemDuration,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | PlaylistPayload
      | { error?: string }
      | null;

    if (!response.ok || !payload || "error" in payload) {
      setError(
        payload && "error" in payload
          ? payload.error ?? "No se pudo añadir el asset."
          : "No se pudo añadir el asset.",
      );
      return;
    }

    if (!isPlaylistPayload(payload)) {
      setError("Respuesta inválida al añadir el asset.");
      return;
    }

    setPlaylists((current) =>
      current.map((playlist) => (playlist.id === payload.id ? payload : playlist)),
    );
    await refreshDisplays();
  }

  async function handleDeletePlaylistItem(itemId: string) {
    if (!canManage || !selectedPlaylist) {
      return;
    }

    setError(null);
    const response = await fetch(`/api/playlists/items/${itemId}`, {
      method: "DELETE",
    });

    const payload = (await response.json().catch(() => null)) as
      | PlaylistPayload
      | { ok?: boolean }
      | null;

    if (!response.ok) {
      setError("No se pudo quitar el item.");
      return;
    }

    if (isPlaylistPayload(payload)) {
      setPlaylists((current) =>
        current.map((playlist) => (playlist.id === payload.id ? payload : playlist)),
      );
    } else {
      await refreshPlaylists();
    }
    await refreshDisplays();
  }

  async function handlePairDisplay() {
    if (!canManage) {
      return;
    }

    setIsPairing(true);
    setError(null);

    const response = await fetch("/api/displays/pair", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pairingCode,
        name: pairingName,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { display: DisplayAdminPayload; error?: string }
      | null;

    if (!response.ok || !payload?.display) {
      setError(payload?.error ?? "No se pudo vincular la pantalla.");
      setIsPairing(false);
      return;
    }

    setDisplays((current) => [
      payload.display,
      ...current.filter((display) => display.id !== payload.display.id),
    ]);
    setSelectedDisplayId(payload.display.id);
    setPairingCode("");
    setPairingName("");
    setIsPairing(false);
  }

  async function handleSaveDisplay() {
    if (!canManage || !selectedDisplay || !displayDraft) {
      return;
    }

    setIsSavingDisplay(true);
    setError(null);

    const response = await fetch(`/api/displays/${selectedDisplay.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: displayDraft.name,
        mode: displayDraft.mode,
        playlistId: displayDraft.playlistId || null,
        pinnedAssetId: displayDraft.pinnedAssetId || null,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | DisplayAdminPayload
      | { error?: string }
      | null;

    if (!response.ok || !payload || "error" in payload) {
      setError(
        payload && "error" in payload
          ? payload.error ?? "No se pudo guardar la pantalla."
          : "No se pudo guardar la pantalla.",
      );
      setIsSavingDisplay(false);
      return;
    }

    if (!isDisplayPayload(payload)) {
      setError("Respuesta inválida al guardar la pantalla.");
      setIsSavingDisplay(false);
      return;
    }

    syncDisplay(payload);
    setIsSavingDisplay(false);
  }

  async function handleCommand(command: "PREVIOUS" | "NEXT" | "RELOAD" | "RESYNC") {
    if (!canManage || !selectedDisplay) {
      return;
    }

    setIsSendingCommand(command);
    setError(null);

    const response = await fetch(`/api/displays/${selectedDisplay.id}/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    });

    const payload = (await response.json().catch(() => null)) as
      | DisplayAdminPayload
      | { error?: string }
      | null;

    if (!response.ok || !payload || "error" in payload) {
      setError(
        payload && "error" in payload
          ? payload.error ?? "No se pudo enviar el comando."
          : "No se pudo enviar el comando.",
      );
      setIsSendingCommand(null);
      return;
    }

    if (!isDisplayPayload(payload)) {
      setError("Respuesta inválida al enviar el comando.");
      setIsSendingCommand(null);
      return;
    }

    syncDisplay(payload);
    setIsSendingCommand(null);
  }

  return (
    <div className="space-y-8">
      <section className="backoffice-card rounded-xl p-5">
        <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Biblioteca media
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">Assets reutilizables</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Sube imágenes y vídeos una sola vez. Después podrás reutilizarlos en playlists o fijarlos en pantallas.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-3 xl:justify-end">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              {assets.length} assets
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!canManage}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              Añadir archivos
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
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
          className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center"
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
        >
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-md bg-slate-900 text-white">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="mt-4 text-base font-semibold text-slate-950">Arrastra aquí los assets del signage</p>
          <p className="mt-2 text-sm text-slate-500">
            {canManage ? "Puedes cargar varios archivos a la vez." : "Tu rol permite revisar, pero no publicar ni editar."}
          </p>
        </div>

        {uploadQueue.length > 0 ? (
          <div className="mt-5 space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {uploadQueue.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="relative h-40 bg-slate-950">
                    {item.type === "image" ? (
                      <img src={item.previewUrl} alt={item.file.name} className="h-full w-full object-cover" />
                    ) : (
                      <video src={item.previewUrl} className="h-full w-full object-cover" muted playsInline />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold text-slate-900">{item.file.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{(item.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!canManage || isUploading}
              className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              {isUploading ? "Subiendo..." : "Publicar assets"}
            </button>
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {assets.map((asset) => (
            <article key={asset.id} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_35px_-30px_rgba(15,23,42,0.55)]">
              <div className="relative h-48 bg-slate-950">
                {asset.type === "image" ? (
                  <img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />
                ) : (
                  <video src={asset.url} className="h-full w-full object-cover" muted playsInline controls />
                )}
                <div className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                  {asset.type}
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-center gap-2">
                  {asset.type === "image" ? <ImageIcon className="h-4 w-4 text-slate-500" /> : <Film className="h-4 w-4 text-slate-500" />}
                  <p className="truncate text-sm font-semibold text-slate-900">{asset.name}</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Preview
                  </a>
                  <button
                    type="button"
                    disabled={!canManage}
                    onClick={() => handleDeleteAsset(asset.id)}
                    className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2.5 text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="backoffice-card rounded-xl p-5">
        <div className="grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Playlists</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">Secuencias reutilizables</h2>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Nueva playlist
              </label>
              <div className="flex gap-2">
                <input value={newPlaylistName} onChange={(event) => setNewPlaylistName(event.target.value)} className={inputCls} placeholder="Ej. Promociones caja" />
                <button
                  type="button"
                  onClick={handleCreatePlaylist}
                  disabled={!canManage}
                  className="inline-flex items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  type="button"
                  onClick={() => setSelectedPlaylistId(playlist.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    selectedPlaylistId === playlist.id
                      ? "border-green-200 bg-green-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-950">{playlist.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{playlist.items.length} items</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {selectedPlaylist ? (
              <>
                <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[minmax(0,1fr)_220px_160px]">
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Nombre de playlist
                    </label>
                    <input value={renamePlaylist} onChange={(event) => setRenamePlaylist(event.target.value)} className={inputCls} disabled={!canManage} />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Asset de biblioteca
                    </label>
                    <select value={selectedAssetId} onChange={(event) => setSelectedAssetId(event.target.value)} className={inputCls}>
                      {assets.map((asset) => (
                        <option key={asset.id} value={asset.id}>{asset.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Duración
                    </label>
                    <input type="number" min={3} max={300} value={newItemDuration} onChange={(event) => setNewItemDuration(Number(event.target.value))} className={inputCls} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!selectedPlaylist) return;
                      await savePlaylist({ ...selectedPlaylist, name: renamePlaylist });
                    }}
                    disabled={!canManage || isSavingPlaylist}
                    className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    {isSavingPlaylist ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Guardar playlist
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAssetToPlaylist}
                    disabled={!canManage || !selectedAssetId}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    <Plus className="h-4 w-4" />
                    Añadir asset
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedPlaylist.items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-400">
                      Esta playlist todavía no tiene items.
                    </div>
                  ) : (
                    selectedPlaylist.items.map((item, index) => (
                      <article key={item.id} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-[104px_minmax(0,1fr)_120px_160px]">
                        <div className="h-24 overflow-hidden rounded-xl bg-slate-950">
                          {item.asset.type === "image" ? (
                            <img src={item.asset.url} alt={item.asset.name} className="h-full w-full object-cover" />
                          ) : (
                            <video src={item.asset.url} className="h-full w-full object-cover" muted playsInline />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-950">{item.asset.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">#{index + 1} · {item.asset.type}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button type="button" disabled={!canManage || index === 0} onClick={() => {
                              if (!selectedPlaylist) return;
                              const nextItems = moveItem(selectedPlaylist.items, index, index - 1);
                              setPlaylists((current) => current.map((playlist) => playlist.id === selectedPlaylist.id ? { ...playlist, items: nextItems } : playlist));
                            }} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-40">
                              <ArrowLeft className="h-3.5 w-3.5" />
                              Subir
                            </button>
                            <button type="button" disabled={!canManage || index === selectedPlaylist.items.length - 1} onClick={() => {
                              if (!selectedPlaylist) return;
                              const nextItems = moveItem(selectedPlaylist.items, index, index + 1);
                              setPlaylists((current) => current.map((playlist) => playlist.id === selectedPlaylist.id ? { ...playlist, items: nextItems } : playlist));
                            }} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-40">
                              Bajar
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Duración
                          </label>
                          <input type="number" min={3} max={300} value={item.durationSec} onChange={(event) => {
                            if (!selectedPlaylist) return;
                            const nextItems = selectedPlaylist.items.map((current) => current.id === item.id ? { ...current, durationSec: Number(event.target.value) } : current);
                            setPlaylists((current) => current.map((playlist) => playlist.id === selectedPlaylist.id ? { ...playlist, items: nextItems } : playlist));
                          }} className={inputCls} disabled={!canManage} />
                        </div>
                        <div className="flex items-end justify-end">
                          <button type="button" disabled={!canManage} onClick={() => handleDeletePlaylistItem(item.id)} className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60">
                            <Trash2 className="h-4 w-4" />
                            Quitar
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
                Crea una playlist para empezar a agrupar assets.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="backoffice-card rounded-xl p-5">
        <div className="grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Centro de control</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">Pantallas emparejadas</h2>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">Vincular pantalla</p>
              <div className="mt-4 space-y-3">
                <input value={pairingCode} onChange={(event) => setPairingCode(event.target.value.replace(/\D/g, "").slice(0, 4))} className={inputCls} placeholder="PIN de 4 dígitos" disabled={!canManage} />
                <input value={pairingName} onChange={(event) => setPairingName(event.target.value)} className={inputCls} placeholder="Nombre de la pantalla" disabled={!canManage} />
                <button
                  type="button"
                  onClick={handlePairDisplay}
                  disabled={!canManage || pairingCode.length !== 4 || !pairingName.trim() || isPairing}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {isPairing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                  Vincular pantalla
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {displays.map((display) => (
                <button
                  key={display.id}
                  type="button"
                  onClick={() => setSelectedDisplayId(display.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    selectedDisplayId === display.id
                      ? "border-green-200 bg-green-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-slate-950">{display.name}</p>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${badgeForDisplay(display)}`}>
                      {display.online ? "Online" : "Offline"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                    {formatMode(display.mode)} · {display.playlist?.name ?? display.pinnedAsset?.name ?? "Sin asignación"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {selectedDisplay && displayDraft ? (
              <>
                <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Nombre de pantalla
                    </label>
                    <input value={displayDraft.name} onChange={(event) => setDisplayDraft((current) => current ? { ...current, name: event.target.value } : current)} className={inputCls} disabled={!canManage} />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Modo
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["AUTOPLAY", "PINNED", "MANUAL"] as const).map((mode) => (
                        <button key={mode} type="button" onClick={() => setDisplayDraft((current) => current ? { ...current, mode } : current)} className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${displayDraft.mode === mode ? "border-green-300 bg-green-600 text-white" : "border-slate-200 bg-white text-slate-700"}`} disabled={!canManage}>
                          {formatMode(mode)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Playlist asignada
                    </label>
                    <select value={displayDraft.playlistId} onChange={(event) => setDisplayDraft((current) => current ? { ...current, playlistId: event.target.value } : current)} className={inputCls} disabled={!canManage}>
                      <option value="">Sin playlist</option>
                      {playlists.map((playlist) => (
                        <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Asset fijado
                    </label>
                    <select value={displayDraft.pinnedAssetId} onChange={(event) => setDisplayDraft((current) => current ? { ...current, pinnedAssetId: event.target.value } : current)} className={inputCls} disabled={!canManage}>
                      <option value="">Sin asset fijado</option>
                      {assets.map((asset) => (
                        <option key={asset.id} value={asset.id}>{asset.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSaveDisplay}
                    disabled={!canManage || isSavingDisplay}
                    className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    {isSavingDisplay ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MonitorCog className="h-4 w-4" />}
                    Guardar configuración
                  </button>
                  <button
                    type="button"
                    onClick={() => void refreshDisplays()}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refrescar estado
                  </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-4">
                  <button type="button" disabled={!canManage || isSendingCommand !== null} onClick={() => handleCommand("PREVIOUS")} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60">
                    {isSendingCommand === "PREVIOUS" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4" />}
                    Anterior
                  </button>
                  <button type="button" disabled={!canManage || isSendingCommand !== null} onClick={() => handleCommand("NEXT")} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60">
                    {isSendingCommand === "NEXT" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    Siguiente
                  </button>
                  <button type="button" disabled={!canManage || isSendingCommand !== null} onClick={() => handleCommand("RELOAD")} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60">
                    {isSendingCommand === "RELOAD" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Reload
                  </button>
                  <button type="button" disabled={!canManage || isSendingCommand !== null} onClick={() => handleCommand("RESYNC")} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60">
                    {isSendingCommand === "RESYNC" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MonitorPlay className="h-4 w-4" />}
                    Resincronizar
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${badgeForDisplay(selectedDisplay)}`}>
                      {selectedDisplay.online ? "Online" : "Offline"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                      {formatMode(selectedDisplay.mode)}
                    </span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                      v{selectedDisplay.configVersion}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">
                    Último ping: {selectedDisplay.lastPing ? new Date(selectedDisplay.lastPing).toLocaleString("es-ES") : "sin actividad"}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Último comando: {selectedDisplay.lastCommand}{selectedDisplay.lastCommandAt ? ` · ${new Date(selectedDisplay.lastCommandAt).toLocaleString("es-ES")}` : ""}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Activo: {selectedDisplay.playlist?.name ?? selectedDisplay.pinnedAsset?.name ?? "sin contenido"}
                  </p>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
                Vincula una pantalla o selecciona una existente para controlarla.
              </div>
            )}
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}
