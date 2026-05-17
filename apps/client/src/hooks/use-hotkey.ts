import { useEffect, useRef } from "react";

interface HotkeyOptions {
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault?: boolean;
  enabled?: boolean;
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  );
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
      if (!meta && !ctrl && isEditableElement(event.target)) return;
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

export function useSequenceHotkey(
  sequences: Record<string, () => void>,
  options: { enabled?: boolean; timeoutMs?: number } = {}
) {
  const { enabled = true, timeoutMs = 1000 } = options;
  const sequencesRef = useRef(sequences);
  sequencesRef.current = sequences;

  useEffect(() => {
    if (!enabled) return;
    let buffer = "";
    let timer: ReturnType<typeof setTimeout> | null = null;

    const reset = () => {
      buffer = "";
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const handler = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditableElement(event.target)) return;
      const key = event.key.toLowerCase();
      if (key.length !== 1 && key !== "escape") return;
      if (key === "escape") {
        reset();
        return;
      }

      buffer += key;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        buffer = "";
      }, timeoutMs);

      const map = sequencesRef.current;
      for (const seq of Object.keys(map)) {
        if (buffer.endsWith(seq)) {
          map[seq]();
          reset();
          break;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (timer) clearTimeout(timer);
    };
  }, [enabled, timeoutMs]);
}
