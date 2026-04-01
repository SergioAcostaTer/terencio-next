"use client";

import { useEffect, useRef } from "react";

export function useAutosave(effect: () => void | (() => void), delay: number, deps: unknown[], enabled = true) {
  const effectRef = useRef(effect);

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timeout = window.setTimeout(() => effectRef.current(), delay);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [delay, enabled, ...deps]);
}
