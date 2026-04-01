"use client";

import { useEffect } from "react";

export function useAutosave(effect: () => void | (() => void), delay: number, deps: unknown[], enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timeout = window.setTimeout(() => effect(), delay);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [delay, enabled, effect, ...deps]);
}
