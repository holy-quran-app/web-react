import { useEffect } from "react";

export interface ShortcutHandlers {
  onTogglePlay?: () => void;
  onNextAyah?: () => void;
  onPrevAyah?: () => void;
  onNextSurah?: () => void;
  onPrevSurah?: () => void;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case " ":
          if (handlers.onTogglePlay) {
            e.preventDefault();
            handlers.onTogglePlay();
          }
          break;
        case "j":
        case "J":
          if (handlers.onNextAyah) {
            e.preventDefault();
            handlers.onNextAyah();
          }
          break;
        case "k":
        case "K":
          if (handlers.onPrevAyah) {
            e.preventDefault();
            handlers.onPrevAyah();
          }
          break;
        case "n":
        case "N":
          handlers.onNextSurah?.();
          break;
        case "p":
        case "P":
          handlers.onPrevSurah?.();
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}
