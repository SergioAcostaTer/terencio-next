"use client";

import { AlertTriangle, LoaderCircle, MonitorPlay, RefreshCw, Tv2 } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from "react";

import type { DisplayStatePayload, MediaAssetPayload } from "@/lib/display-types";

const DEVICE_TOKEN_STORAGE_KEY = "device_token";
const PAIRING_POLL_INTERVAL_MS = 3_000;
const HEARTBEAT_INTERVAL_MS = 30_000;
const STREAM_RETRY_MS = 4_000;

type RuntimePhase =
  | "initializing"
  | "pairing"
  | "loading"
  | "ready"
  | "error";

type PairingPayload = {
  pairingCode: string;
  pairingExpiresAt: string;
};

type DisplayRuntimeProps = {
  legalBannerText: string;
};

type AssetViewportProps = {
  asset: MediaAssetPayload;
  playbackKey: string;
  onEnded?: () => void;
};

function FullscreenMessage({
  icon,
  title,
  description,
  action,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#14532d_0%,#052e16_34%,#000_100%)] px-6 py-10 text-white">
      <div className="w-full max-w-4xl rounded-[32px] border border-white/10 bg-black/35 p-8 text-center shadow-[0_32px_90px_-40px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
          {icon}
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/72 sm:text-xl">{description}</p>
        {children}
        {action ? <div className="mt-8">{action}</div> : null}
      </div>
    </div>
  );
}

function AssetViewport({ asset, playbackKey, onEnded }: AssetViewportProps) {
  if (asset.type === "video") {
    return (
      <video
        key={playbackKey}
        src={asset.url}
        autoPlay
        muted
        playsInline
        onEnded={onEnded}
        className="h-full w-full object-cover"
      />
    );
  }

  return <img key={playbackKey} src={asset.url} alt={asset.name} className="h-full w-full object-cover" />;
}

export default function DisplayRuntime({ legalBannerText }: DisplayRuntimeProps) {
  const [phase, setPhase] = useState<RuntimePhase>("initializing");
  const [display, setDisplay] = useState<DisplayStatePayload | null>(null);
  const [pairing, setPairing] = useState<PairingPayload | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoplayIndex, setAutoplayIndex] = useState(0);
  const streamRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);

  const loadSession = useEffectEvent(async (token: string) => {
    setPhase("loading");
    setError(null);

    const response = await fetch("/api/displays/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceToken: token }),
    });

    if (!response.ok) {
      window.localStorage.removeItem(DEVICE_TOKEN_STORAGE_KEY);
      setDeviceToken(null);
      setDisplay(null);
      setPhase("error");
      setError("El dispositivo no es válido o fue desvinculado.");
      return;
    }

    const payload = (await response.json()) as DisplayStatePayload;
    setDisplay(payload);
    setAutoplayIndex(0);
    setPhase("ready");
  });

  const registerDisplay = useEffectEvent(async () => {
    setPhase("loading");
    setError(null);

    const response = await fetch("/api/displays/register", {
      method: "POST",
    });

    if (!response.ok) {
      setPhase("error");
      setError("No se pudo solicitar un PIN de emparejamiento.");
      return;
    }

    const payload = (await response.json()) as PairingPayload;
    setPairing(payload);
    setPhase("pairing");
  });

  useEffect(() => {
    const storedToken = window.localStorage.getItem(DEVICE_TOKEN_STORAGE_KEY);

    if (storedToken) {
      setDeviceToken(storedToken);
      void loadSession(storedToken);
      return;
    }

    void registerDisplay();
  }, [loadSession, registerDisplay]);

  useEffect(() => {
    if (phase !== "pairing" || !pairing?.pairingCode) {
      return;
    }

    const interval = window.setInterval(async () => {
      const response = await fetch(`/api/displays/status/${pairing.pairingCode}`, {
        cache: "no-store",
      });

      if (response.status === 404) {
        await registerDisplay();
        return;
      }

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as {
        status: "pending" | "paired";
        deviceToken: string | null;
      };

      if (payload.status === "paired" && payload.deviceToken) {
        window.localStorage.setItem(DEVICE_TOKEN_STORAGE_KEY, payload.deviceToken);
        setDeviceToken(payload.deviceToken);
        await loadSession(payload.deviceToken);
      }
    }, PAIRING_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadSession, pairing?.pairingCode, phase, registerDisplay]);

  useEffect(() => {
    if (!deviceToken || phase !== "ready") {
      return;
    }

    const sendHeartbeat = async () => {
      await fetch(`/api/displays/${deviceToken}/ping`, {
        method: "POST",
      }).catch(() => undefined);
    };

    void sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [deviceToken, phase]);

  useEffect(() => {
    if (!deviceToken || phase !== "ready") {
      return;
    }

    const connect = () => {
      streamRef.current?.close();
      const stream = new EventSource(`/api/displays/${deviceToken}/stream`);
      streamRef.current = stream;

      stream.addEventListener("state", (event) => {
        const nextState = JSON.parse((event as MessageEvent).data) as DisplayStatePayload;
        setDisplay(nextState);
        setPhase("ready");

        if (nextState.mode !== "AUTOPLAY") {
          setAutoplayIndex(0);
        }
      });

      stream.onerror = () => {
        stream.close();
        if (reconnectTimerRef.current) {
          window.clearTimeout(reconnectTimerRef.current);
        }
        reconnectTimerRef.current = window.setTimeout(connect, STREAM_RETRY_MS);
      };
    };

    connect();

    return () => {
      streamRef.current?.close();
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
      }
    };
  }, [deviceToken, phase]);

  const autoplayItems = display?.playlist?.items ?? [];
  const manualItems = display?.playlist?.items ?? [];

  useEffect(() => {
    if (phase !== "ready" || display?.mode !== "AUTOPLAY" || autoplayItems.length === 0) {
      return;
    }

    const activeItem = autoplayItems[autoplayIndex % autoplayItems.length];
    if (!activeItem) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setAutoplayIndex((current) => (current + 1) % autoplayItems.length);
    }, activeItem.durationSec * 1000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [autoplayIndex, autoplayItems, display?.mode, phase]);

  useEffect(() => {
    if (display?.mode === "AUTOPLAY") {
      setAutoplayIndex(0);
    }
  }, [display?.configVersion, display?.mode]);

  const activeAutoplayItem =
    autoplayItems.length > 0 ? autoplayItems[autoplayIndex % autoplayItems.length] : null;

  const activeManualItem =
    manualItems.length > 0 ? (manualItems[display?.manualIndex ?? 0] ?? manualItems[0]) : null;

  if (phase === "initializing" || phase === "loading") {
    return (
      <FullscreenMessage
        icon={<LoaderCircle className="h-8 w-8 animate-spin" />}
        title={phase === "initializing" ? "Inicializando pantalla" : "Cargando configuración"}
        description="Preparando la identidad del dispositivo y sincronizando su estado con el backoffice."
      />
    );
  }

  if (phase === "pairing" && pairing) {
    return (
      <FullscreenMessage
        icon={<Tv2 className="h-8 w-8" />}
        title="Pantalla pendiente de vinculación"
        description="Introduce este PIN en el backoffice para reclamar la pantalla y asignarle contenido."
      >
        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/8 px-6 py-8">
          <div className="text-[4.75rem] leading-none font-semibold tracking-[0.22em] text-white sm:text-[8rem]">
            {pairing.pairingCode}
          </div>
          <p className="mt-4 text-sm uppercase tracking-[0.28em] text-white/60">
            PIN temporal de 4 dígitos
          </p>
        </div>
      </FullscreenMessage>
    );
  }

  if (phase === "error") {
    return (
      <FullscreenMessage
        icon={<AlertTriangle className="h-8 w-8" />}
        title="Pantalla no disponible"
        description={error ?? "No se pudo recuperar la configuración del dispositivo."}
        action={
          <button
            type="button"
            onClick={() => {
              window.localStorage.removeItem(DEVICE_TOKEN_STORAGE_KEY);
              setDeviceToken(null);
              setDisplay(null);
              setPairing(null);
              void registerDisplay();
            }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            <RefreshCw className="h-4 w-4" />
            Solicitar nuevo PIN
          </button>
        }
      />
    );
  }

  if (!display) {
    return null;
  }

  const renderContent = () => {
    if (display.mode === "PINNED") {
      if (!display.pinnedAsset) {
        return (
          <FullscreenMessage
            icon={<MonitorPlay className="h-8 w-8" />}
            title="Asset fijo pendiente"
            description="Esta pantalla está en modo fijado, pero todavía no tiene ningún contenido asignado."
          />
        );
      }

      return (
        <AssetViewport
          asset={display.pinnedAsset}
          playbackKey={`${display.pinnedAsset.id}-${display.configVersion}`}
        />
      );
    }

    if (display.mode === "MANUAL") {
      if (!activeManualItem) {
        return (
          <FullscreenMessage
            icon={<MonitorPlay className="h-8 w-8" />}
            title="Modo manual sin contenido"
            description="Asigna una playlist desde el backoffice para controlar los assets manualmente."
          />
        );
      }

      return (
        <AssetViewport
          asset={activeManualItem.asset}
          playbackKey={`${activeManualItem.asset.id}-${display.configVersion}`}
        />
      );
    }

    if (!activeAutoplayItem) {
      return (
        <FullscreenMessage
          icon={<MonitorPlay className="h-8 w-8" />}
          title="Autoplay sin playlist"
          description="Asigna una playlist a esta pantalla para comenzar la reproducción automática."
        />
      );
    }

    return (
      <AssetViewport
        asset={activeAutoplayItem.asset}
        playbackKey={`${activeAutoplayItem.asset.id}-${display.configVersion}-${autoplayIndex}`}
        onEnded={() => {
          setAutoplayIndex((current) => (current + 1) % autoplayItems.length);
        }}
      />
    );
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative h-screen overflow-hidden bg-black">
        {renderContent()}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/60 via-black/15 to-transparent px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
                Terencio Digital Signage
              </p>
              <h1 className="mt-2 text-xl font-semibold sm:text-2xl">{display.name}</h1>
            </div>
            <div className="rounded-full bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
              {display.mode}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/82 to-transparent px-6 pb-6">
          <div className="mx-auto max-w-7xl border-t border-white/10 pt-4 text-sm leading-relaxed text-white/72">
            {legalBannerText}
          </div>
        </div>
      </div>
    </main>
  );
}
