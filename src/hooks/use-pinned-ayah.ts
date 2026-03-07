import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "holy-quran-pinned-ayah";

export interface PinnedAyah {
  surahNumber: number;
  ayahIndex: number;
  ayahNumberInSurah: number;
  surahName: string;
}

function getSnapshot(): PinnedAyah | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PinnedAyah;
  } catch {
    return null;
  }
}

function getServerSnapshot(): PinnedAyah | null {
  return null;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function usePinnedAyah() {
  const pinnedAyah = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const pinAyah = useCallback((pin: PinnedAyah) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pin));
    emitChange();
  }, []);

  const unpinAyah = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    emitChange();
  }, []);

  const togglePin = useCallback(
    (pin: PinnedAyah) => {
      const current = getSnapshot();
      if (
        current &&
        current.surahNumber === pin.surahNumber &&
        current.ayahIndex === pin.ayahIndex
      ) {
        unpinAyah();
      } else {
        pinAyah(pin);
      }
    },
    [pinAyah, unpinAyah],
  );

  return { pinnedAyah, pinAyah, unpinAyah, togglePin };
}

export function getPinnedAyah(): PinnedAyah | null {
  return getSnapshot();
}
