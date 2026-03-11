import { useEffect, useState } from "react";
import type { SurahDetail } from "@/types/quran";

export function useSurah(number: string | undefined, tajweed = false) {
  const [data, setData] = useState<{
    surah: SurahDetail | null;
    tajweedTexts: Map<number, string> | null;
    fetchedFor: string | null;
    fetchedTajweed: boolean;
    error: boolean;
  }>({ surah: null, tajweedTexts: null, fetchedFor: null, fetchedTajweed: false, error: false });

  useEffect(() => {
    if (!number) return;
    let cancelled = false;

    const surahUrl = `https://api.alquran.cloud/v1/surah/${number}`;
    const tajweedUrl = `https://api.alquran.cloud/v1/surah/${number}/quran-tajweed`;

    const fetches: Promise<Response>[] = [fetch(surahUrl)];
    if (tajweed) {
      fetches.push(fetch(tajweedUrl));
    }

    Promise.all(fetches)
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then((results) => {
        if (cancelled) return;

        const surah: SurahDetail = results[0].data;

        // The API includes bismillah in the first ayah's text
        // for all surahs except Al-Fatiha (1) and At-Tawbah (9).
        // Since we display bismillah separately, strip it from the first ayah.
        // Use regex to handle Unicode variations (e.g. optional tatweel ـ before superscript alef).
        const bismillahRegex = /^بِسْمِ ٱللَّهِ ٱلرَّحْمَ[ـ]?ٰنِ ٱلرَّحِيمِ\s*/;
        if (surah.number !== 1 && surah.number !== 9 && surah.ayahs.length > 0) {
          const firstAyah = surah.ayahs[0];
          firstAyah.text = firstAyah.text.replace(bismillahRegex, "");
        }

        let tajweedTexts: Map<number, string> | null = null;

        if (tajweed && results[1]?.data?.ayahs) {
          tajweedTexts = new Map();
          for (const ayah of results[1].data.ayahs as { numberInSurah: number; text: string }[]) {
            let text = ayah.text;
            // Strip bismillah from first ayah's tajweed text too.
            // The tajweed text contains bracket annotations, so match on the
            // last word of the bismillah ("لرَّحِيمِ") and strip everything before it.
            if (
              ayah.numberInSurah === 1 &&
              surah.number !== 1 &&
              surah.number !== 9
            ) {
              const marker = "لرَّحِيمِ";
              const idx = text.indexOf(marker);
              if (idx !== -1) {
                let end = idx + marker.length;
                // Skip closing tajweed brackets and whitespace after the marker
                while (end < text.length && (text[end] === "]" || /\s/.test(text[end]))) {
                  end++;
                }
                text = text.substring(end);
              }
            }
            tajweedTexts.set(ayah.numberInSurah, text);
          }
        }

        setData({ surah, tajweedTexts, fetchedFor: number, fetchedTajweed: tajweed, error: false });
      })
      .catch(() => {
        if (!cancelled) {
          setData({ surah: null, tajweedTexts: null, fetchedFor: number, fetchedTajweed: tajweed, error: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [number, tajweed]);

  const loading = data.fetchedFor !== number || data.fetchedTajweed !== tajweed;

  return { surah: data.surah, tajweedTexts: data.tajweedTexts, loading, error: data.error };
}
