import { useCallback, useEffect, useRef, useState } from "react";
import type { Ayah, Reciter } from "@/types/quran";

export const RECITERS: Reciter[] = [
  { identifier: "ar.alafasy", name: "Mishary Rashid Alafasy" },
  { identifier: "ar.abdurrahmaansudais", name: "Abdurrahmaan As-Sudais" },
  { identifier: "ar.abdullahbasfar", name: "Abdullah Basfar" },
  { identifier: "ar.husary", name: "Husary" },
  { identifier: "ar.huthayfi", name: "Huthayfi" },
  { identifier: "ar.minshawi", name: "Minshawi" },
  { identifier: "ar.muhammadayyoub", name: "Muhammad Ayyoub" },
  { identifier: "ar.muhammadjibreel", name: "Muhammad Jibreel" },
];

export interface RangeRepeatConfig {
  startIndex: number | null;
  endIndex: number | null;
  repeatCount: number;
  currentRepeat: number;
}

interface RecitationState {
  currentAyahIndex: number | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  duration: number;
  reciter: Reciter;
  rangeRepeat: RangeRepeatConfig;
}

const STORAGE_KEY = "holy-quran-reciter";

function getSavedReciter(): Reciter {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Reciter;
      const match = RECITERS.find((r) => r.identifier === parsed.identifier);
      if (match) return match;
    }
  } catch {
    // ignore
  }
  return RECITERS[0];
}

function buildAudioUrl(reciterIdentifier: string, ayahNumber: number): string {
  return `https://cdn.islamic.network/quran/audio/128/${reciterIdentifier}/${ayahNumber}.mp3`;
}

function attachAudioListeners(
  audio: HTMLAudioElement,
  {
    onCanPlay,
    onPlay,
    onPause,
    onTimeUpdate,
    onEnded,
    onError,
  }: {
    onCanPlay: () => void;
    onPlay: () => void;
    onPause: () => void;
    onTimeUpdate: () => void;
    onEnded: () => void;
    onError: () => void;
  },
) {
  audio.addEventListener("canplay", onCanPlay);
  audio.addEventListener("play", onPlay);
  audio.addEventListener("pause", onPause);
  audio.addEventListener("timeupdate", onTimeUpdate);
  audio.addEventListener("ended", onEnded);
  audio.addEventListener("error", onError);
}

const defaultRangeRepeat: RangeRepeatConfig = {
  startIndex: null,
  endIndex: null,
  repeatCount: 1,
  currentRepeat: 0,
};

export function useRecitation(surahNumber: number, ayahs: Ayah[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playAyahRef = useRef<(index: number) => void>(() => {});
  const rangeRepeatRef = useRef<RangeRepeatConfig>(defaultRangeRepeat);
  const [state, setState] = useState<RecitationState & { _surahNumber: number }>({
    currentAyahIndex: null,
    isPlaying: false,
    isLoading: false,
    progress: 0,
    duration: 0,
    reciter: getSavedReciter(),
    rangeRepeat: defaultRangeRepeat,
    _surahNumber: surahNumber,
  });

  // Reset range when surah changes (React-recommended pattern for adjusting state based on props)
  if (state._surahNumber !== surahNumber) {
    setState((prev) => ({
      ...prev,
      _surahNumber: surahNumber,
      rangeRepeat: defaultRangeRepeat,
    }));
  }

  // Keep ref in sync with state
  useEffect(() => {
    rangeRepeatRef.current = state.rangeRepeat;
  }, [state.rangeRepeat]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      currentAyahIndex: null,
      isPlaying: false,
      isLoading: false,
      progress: 0,
      duration: 0,
    }));
  }, []);

  const startAudio = useCallback(
    (index: number, reciterIdentifier: string) => {
      const ayah = ayahs[index];
      if (!ayah) return;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }

      const audio = new Audio(buildAudioUrl(reciterIdentifier, ayah.number));
      audioRef.current = audio;

      setState((prev) => ({
        ...prev,
        currentAyahIndex: index,
        isPlaying: false,
        isLoading: true,
        progress: 0,
        duration: 0,
      }));

      attachAudioListeners(audio, {
        onCanPlay: () => {
          setState((prev) => ({ ...prev, isLoading: false }));
          audio.play().catch(() => {
            setState((prev) => ({
              ...prev,
              isPlaying: false,
              isLoading: false,
            }));
          });
        },
        onPlay: () => setState((prev) => ({ ...prev, isPlaying: true })),
        onPause: () => setState((prev) => ({ ...prev, isPlaying: false })),
        onTimeUpdate: () => {
          setState((prev) => ({
            ...prev,
            progress: audio.currentTime,
            duration: audio.duration || 0,
          }));
        },
        onEnded: () => {
          const rr = rangeRepeatRef.current;
          const hasRange =
            rr.startIndex !== null && rr.endIndex !== null;

          if (hasRange) {
            const rangeEnd = rr.endIndex!;
            const rangeStart = rr.startIndex!;

            if (index < rangeEnd) {
              // Continue to next ayah in range
              playAyahRef.current(index + 1);
            } else {
              // Reached end of range
              const nextRepeat = rr.currentRepeat + 1;
              if (nextRepeat < rr.repeatCount) {
                // Start the range again
                setState((prev) => ({
                  ...prev,
                  rangeRepeat: {
                    ...prev.rangeRepeat,
                    currentRepeat: nextRepeat,
                  },
                }));
                playAyahRef.current(rangeStart);
              } else {
                // All repeats done, reset counter and stop
                setState((prev) => ({
                  ...prev,
                  rangeRepeat: {
                    ...prev.rangeRepeat,
                    currentRepeat: 0,
                  },
                }));
                stop();
              }
            }
          } else {
            // No range set - normal sequential play
            const nextIndex = index + 1;
            if (nextIndex < ayahs.length) {
              playAyahRef.current(nextIndex);
            } else {
              stop();
            }
          }
        },
        onError: () => {
          setState((prev) => ({
            ...prev,
            isPlaying: false,
            isLoading: false,
          }));
        },
      });

      audio.load();
    },
    [ayahs, stop],
  );

  const playAyah = useCallback(
    (index: number) => {
      startAudio(index, state.reciter.identifier);
    },
    [startAudio, state.reciter.identifier],
  );

  // Keep the ref in sync so ended callbacks always call the latest version
  useEffect(() => {
    playAyahRef.current = playAyah;
  }, [playAyah]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => {
        setState((prev) => ({ ...prev, isPlaying: false }));
      });
    } else {
      audio.pause();
    }
  }, []);

  const playSurah = useCallback(() => {
    const rr = rangeRepeatRef.current;
    if (rr.startIndex !== null && rr.endIndex !== null) {
      // Reset repeat counter and start from range start
      setState((prev) => ({
        ...prev,
        rangeRepeat: { ...prev.rangeRepeat, currentRepeat: 0 },
      }));
      playAyah(rr.startIndex);
    } else {
      playAyah(0);
    }
  }, [playAyah]);

  const setReciter = useCallback(
    (reciter: Reciter) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reciter));
      setState((prev) => {
        const wasPlaying = prev.isPlaying;
        const currentIndex = prev.currentAyahIndex;

        // Stop current audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
          audioRef.current = null;
        }

        // If was playing, restart with new reciter after state update
        if (wasPlaying && currentIndex !== null) {
          setTimeout(() => {
            startAudio(currentIndex, reciter.identifier);
          }, 0);
        }

        return {
          ...prev,
          reciter,
          currentAyahIndex: wasPlaying ? currentIndex : null,
          isPlaying: false,
          isLoading: false,
          progress: 0,
          duration: 0,
        };
      });
    },
    [startAudio],
  );

  const setRangeRepeat = useCallback(
    (config: Partial<RangeRepeatConfig>) => {
      setState((prev) => ({
        ...prev,
        rangeRepeat: { ...prev.rangeRepeat, ...config, currentRepeat: 0 },
      }));
    },
    [],
  );

  const clearRange = useCallback(() => {
    setState((prev) => ({
      ...prev,
      rangeRepeat: defaultRangeRepeat,
    }));
  }, []);

  // Cleanup on unmount or surah change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [surahNumber]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _surahNumber: _unused, ...publicState } = state;
  return {
    ...publicState,
    playAyah,
    playSurah,
    togglePlayPause,
    stop,
    setReciter,
    setRangeRepeat,
    clearRange,
  };
}
