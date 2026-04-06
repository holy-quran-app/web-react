import { useCallback, useEffect, useState } from "react";
import type { TranslationEdition } from "@/types/quran";

const STORAGE_KEY = "holy-quran-translations";
const LEGACY_KEY = "holy-quran-translation";

const POPULAR_EDITIONS: TranslationEdition[] = [
  { identifier: "en.sahih", language: "en", englishName: "Saheeh International" },
  { identifier: "en.yusufali", language: "en", englishName: "Yusuf Ali" },
  { identifier: "en.pickthall", language: "en", englishName: "Pickthall" },
  { identifier: "en.asad", language: "en", englishName: "Muhammad Asad" },
  { identifier: "en.hilali", language: "en", englishName: "Hilali & Khan" },
  { identifier: "en.itani", language: "en", englishName: "Clear Quran - Talal Itani" },
  { identifier: "ur.jalandhry", language: "ur", englishName: "Jalandhry (Urdu)" },
  { identifier: "ur.maududi", language: "ur", englishName: "Maududi (Urdu)" },
  { identifier: "fr.hamidullah", language: "fr", englishName: "Hamidullah (French)" },
  { identifier: "tr.diyanet", language: "tr", englishName: "Diyanet İşleri (Turkish)" },
  { identifier: "id.indonesian", language: "id", englishName: "Bahasa Indonesia" },
  { identifier: "ru.kuliev", language: "ru", englishName: "Kuliev (Russian)" },
  { identifier: "de.bubenheim", language: "de", englishName: "Bubenheim & Elyas (German)" },
  { identifier: "es.cortes", language: "es", englishName: "Cortes (Spanish)" },
  { identifier: "bn.bengali", language: "bn", englishName: "Muhiuddin Khan (Bengali)" },
  { identifier: "hi.hindi", language: "hi", englishName: "Khan & Nadwi (Hindi)" },
  { identifier: "fa.makarem", language: "fa", englishName: "Makarem Shirazi (Persian)" },
  { identifier: "ms.basmeih", language: "ms", englishName: "Basmeih (Malay)" },
  { identifier: "zh.jian", language: "zh", englishName: "Ma Jian (Chinese)" },
  { identifier: "ja.japanese", language: "ja", englishName: "Japanese" },
  { identifier: "ko.korean", language: "ko", englishName: "Korean" },
];

function getSavedEditions(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === "string");
    }
    // Back-compat: migrate single-edition key
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) return [legacy];
  } catch {
    // ignore
  }
  return ["en.sahih"];
}

// cache: edition -> surah -> Map(ayah -> text)
const translationCache = new Map<string, Map<string, Map<number, string>>>();

async function fetchTranslation(
  surahNumber: string,
  edition: string,
): Promise<Map<number, string>> {
  let byEd = translationCache.get(edition);
  if (!byEd) {
    byEd = new Map();
    translationCache.set(edition, byEd);
  }
  const hit = byEd.get(surahNumber);
  if (hit) return hit;
  const result = await fetch(
    `https://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`,
  ).then((r) => r.json());
  const map = new Map<number, string>();
  for (const ayah of result.data.ayahs as { numberInSurah: number; text: string }[]) {
    map.set(ayah.numberInSurah, ayah.text);
  }
  byEd.set(surahNumber, map);
  return map;
}

export interface TranslationResult {
  edition: TranslationEdition;
  texts: Map<number, string>;
}

export function useTranslation(surahNumber: string | undefined) {
  const [editions, setEditionsState] = useState<string[]>(getSavedEditions);
  const [results, setResults] = useState<TranslationResult[]>([]);
  const [loading, setLoading] = useState(false);

  const setEditions = useCallback((values: string[]) => {
    setEditionsState(values);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      // ignore
    }
  }, []);

  const toggleEdition = useCallback(
    (identifier: string) => {
      setEditionsState((prev) => {
        const next = prev.includes(identifier)
          ? prev.filter((x) => x !== identifier)
          : [...prev, identifier];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    if (!surahNumber || editions.length === 0) {
      queueMicrotask(() => {
        if (!cancelled) setResults([]);
      });
      return () => {
        cancelled = true;
      };
    }
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    Promise.all(
      editions.map(async (id) => {
        const edObj =
          POPULAR_EDITIONS.find((e) => e.identifier === id) ?? {
            identifier: id,
            language: "",
            englishName: id,
          };
        try {
          const texts = await fetchTranslation(surahNumber, id);
          return { edition: edObj, texts } satisfies TranslationResult;
        } catch {
          return { edition: edObj, texts: new Map<number, string>() } satisfies TranslationResult;
        }
      }),
    ).then((arr) => {
      if (!cancelled) {
        setResults(arr);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [surahNumber, editions]);

  return {
    editions,
    setEditions,
    toggleEdition,
    translationResults: results,
    translationLoading: loading,
    availableEditions: POPULAR_EDITIONS,
  };
}
