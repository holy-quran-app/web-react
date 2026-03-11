import { useEffect, useState } from "react";
import type { SurahDetail } from "@/types/quran";

export function useSurah(number: string | undefined) {
  const [data, setData] = useState<{
    surah: SurahDetail | null;
    fetchedFor: string | null;
    error: boolean;
  }>({ surah: null, fetchedFor: null, error: false });

  useEffect(() => {
    if (!number) return;
    let cancelled = false;

    fetch(`https://api.alquran.cloud/v1/surah/${number}`)
      .then((r) => r.json())
      .then((result) => {
        if (cancelled) return;

        const surah: SurahDetail = result.data;

        // The non-tajweed API includes bismillah in the first ayah's text
        // for all surahs except Al-Fatiha (1) and At-Tawbah (9).
        // Since we display bismillah separately, strip it from the first ayah.
        if (surah.number !== 1 && surah.number !== 9 && surah.ayahs.length > 0) {
          const firstAyah = surah.ayahs[0];
          const bismillah = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ";
          if (firstAyah.text.startsWith(bismillah)) {
            firstAyah.text = firstAyah.text.slice(bismillah.length);
          }
        }

        setData({ surah, fetchedFor: number, error: false });
      })
      .catch(() => {
        if (!cancelled) {
          setData({ surah: null, fetchedFor: number, error: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [number]);

  const loading = data.fetchedFor !== number;

  return { surah: data.surah, loading, error: data.error };
}
