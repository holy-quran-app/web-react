import { useCallback, useEffect, useState } from "react";
import type { TafsirEdition } from "@/types/quran";

export const TAFSIR_EDITIONS: TafsirEdition[] = [
  { identifier: "en.jalalayn", language: "en", englishName: "Tafsir al-Jalalayn (English)" },
  { identifier: "ar.muyassar", language: "ar", englishName: "التفسير الميسر" },
  { identifier: "ar.jalalayn", language: "ar", englishName: "تفسير الجلالين" },
];

const STORAGE_KEY = "holy-quran-tafsir-edition";

// Module-level cache: key = `${surahNumber}:${edition}` -> Map(ayahNumberInSurah -> text)
const cache = new Map<string, Map<number, string>>();
const inflight = new Map<string, Promise<Map<number, string>>>();

function cacheKey(surahNumber: number, edition: string) {
  return `${surahNumber}:${edition}`;
}

async function fetchTafsir(
  surahNumber: number,
  edition: string,
): Promise<Map<number, string>> {
  const key = cacheKey(surahNumber, edition);
  const cached = cache.get(key);
  if (cached) return cached;
  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`)
    .then((r) => r.json())
    .then((result) => {
      const map = new Map<number, string>();
      for (const ayah of result.data.ayahs as { numberInSurah: number; text: string }[]) {
        map.set(ayah.numberInSurah, ayah.text);
      }
      cache.set(key, map);
      inflight.delete(key);
      return map;
    })
    .catch((err) => {
      inflight.delete(key);
      throw err;
    });

  inflight.set(key, promise);
  return promise;
}

export function useTafsir(surahNumber: number | undefined) {
  const [edition, setEditionState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? TAFSIR_EDITIONS[0].identifier;
    } catch {
      return TAFSIR_EDITIONS[0].identifier;
    }
  });
  const [tafsirMap, setTafsirMap] = useState<Map<number, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const setEdition = useCallback((value: string) => {
    setEditionState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!surahNumber) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setLoading(true);
        setError(false);
      }
    });
    fetchTafsir(surahNumber, edition)
      .then((map) => {
        if (!cancelled) {
          setTafsirMap(map);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [surahNumber, edition]);

  return { edition, setEdition, tafsirMap, loading, error, availableEditions: TAFSIR_EDITIONS };
}
