import { useCallback, useSyncExternalStore } from "react";
import type { Bookmark } from "@/types/quran";

const STORAGE_KEY = "holy-quran-bookmarks";

let cachedRaw: string | null = null;
let cachedValue: Bookmark[] = [];

function getSnapshot(): Bookmark[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? (JSON.parse(raw) as Bookmark[]) : [];
    } catch {
      cachedValue = [];
    }
  }
  return cachedValue;
}

function getServerSnapshot(): Bookmark[] {
  return [];
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function persist(next: Bookmark[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  // Force re-read
  cachedRaw = null;
  for (const l of listeners) l();
}

function bookmarkId(surahNumber: number, ayahNumberInSurah: number) {
  return `${surahNumber}:${ayahNumberInSurah}`;
}

export function useBookmarks() {
  const bookmarks = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isBookmarked = useCallback(
    (surahNumber: number, ayahNumberInSurah: number) =>
      bookmarks.some((b) => b.id === bookmarkId(surahNumber, ayahNumberInSurah)),
    [bookmarks],
  );

  const addBookmark = useCallback((b: Omit<Bookmark, "id" | "createdAt">) => {
    const id = bookmarkId(b.surahNumber, b.ayahNumberInSurah);
    const current = getSnapshot();
    if (current.some((x) => x.id === id)) return;
    persist([{ ...b, id, createdAt: Date.now() }, ...current]);
  }, []);

  const removeBookmark = useCallback(
    (surahNumber: number, ayahNumberInSurah: number) => {
      const id = bookmarkId(surahNumber, ayahNumberInSurah);
      persist(getSnapshot().filter((b) => b.id !== id));
    },
    [],
  );

  const toggleBookmark = useCallback(
    (b: Omit<Bookmark, "id" | "createdAt">) => {
      if (isBookmarked(b.surahNumber, b.ayahNumberInSurah)) {
        removeBookmark(b.surahNumber, b.ayahNumberInSurah);
      } else {
        addBookmark(b);
      }
    },
    [isBookmarked, addBookmark, removeBookmark],
  );

  const clearAll = useCallback(() => persist([]), []);

  return { bookmarks, isBookmarked, addBookmark, removeBookmark, toggleBookmark, clearAll };
}
