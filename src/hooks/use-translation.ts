import { useCallback, useEffect, useState } from "react";
import type { TranslationEdition } from "@/types/quran";

const STORAGE_KEY = "holy-quran-translation";

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

function getSavedEdition(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

interface TranslationState {
  translations: Map<number, string> | null;
  fetchedFor: string | null;
  fetchedEdition: string | null;
}

export function useTranslation(surahNumber: string | undefined) {
  const [edition, setEditionState] = useState<string | null>(getSavedEdition);
  const [data, setData] = useState<TranslationState>({
    translations: null,
    fetchedFor: null,
    fetchedEdition: null,
  });

  const setEdition = useCallback((value: string | null) => {
    setEditionState(value);
    try {
      if (value) {
        localStorage.setItem(STORAGE_KEY, value);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (!surahNumber || !edition) return;

    let cancelled = false;

    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`)
      .then((r) => r.json())
      .then((result) => {
        if (cancelled) return;
        const map = new Map<number, string>();
        for (const ayah of result.data.ayahs as { numberInSurah: number; text: string }[]) {
          map.set(ayah.numberInSurah, ayah.text);
        }
        setData({ translations: map, fetchedFor: surahNumber, fetchedEdition: edition });
      })
      .catch(() => {
        if (!cancelled) {
          setData({ translations: null, fetchedFor: surahNumber, fetchedEdition: edition });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [surahNumber, edition]);

  const isStale = edition
    ? data.fetchedFor !== surahNumber || data.fetchedEdition !== edition
    : false;
  const translations = edition ? data.translations : null;

  return {
    edition,
    setEdition,
    translations,
    translationLoading: isStale,
    availableEditions: POPULAR_EDITIONS,
  };
}
