import { useEffect } from "react";

interface HotkeyOptions {
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault?: boolean;
  enabled?: boolean;
}

export function useHotkey(
  key: string,
  callback: () => void,
  options: HotkeyOptions = {}
) {
  const {
    meta = false,
    ctrl = false,
    shift = false,
    alt = false,
    preventDefault = true,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;
    const target = key.toLowerCase();
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== target) return;
      const metaMatches = meta ? event.metaKey || event.ctrlKey : true;
      const ctrlOnly = ctrl ? event.ctrlKey : true;
      const shiftMatches = shift ? event.shiftKey : !event.shiftKey || shift;
      const altMatches = alt ? event.altKey : !event.altKey || alt;
      if (!metaMatches || !ctrlOnly || !shiftMatches || !altMatches) return;
      if (preventDefault) event.preventDefault();
      callback();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, meta, ctrl, shift, alt, preventDefault, enabled]);
}
