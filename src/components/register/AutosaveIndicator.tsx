type AutosaveIndicatorProps = {
  saveState: "idle" | "saving" | "saved" | "error" | "local_only";
  lastSavedAt: string | null;
};

function labelForState(saveState: AutosaveIndicatorProps["saveState"]) {
  if (saveState === "saving") {
    return "Guardando...";
  }
  if (saveState === "saved") {
    return "Guardado";
  }
  if (saveState === "local_only") {
    return "Guardado localmente, pendiente de sincronizar";
  }
  if (saveState === "error") {
    return "Error al guardar";
  }

  return "Guardado automáticamente";
}

export default function AutosaveIndicator({ saveState, lastSavedAt }: AutosaveIndicatorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
      <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 ring-1 ring-slate-200">
        {labelForState(saveState)}
      </span>
      {lastSavedAt ? (
        <span>Última actualización {new Intl.DateTimeFormat("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(lastSavedAt))}</span>
      ) : null}
    </div>
  );
}
