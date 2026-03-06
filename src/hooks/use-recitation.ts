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

interface RecitationState {
  currentAyahIndex: number | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  duration: number;
  reciter: Reciter;
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

export function useRecitation(surahNumber: number, ayahs: Ayah[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playAyahRef = useRef<(index: number) => void>(() => {});
  const [state, setState] = useState<RecitationState>({
    currentAyahIndex: null,
    isPlaying: false,
    isLoading: false,
    progress: 0,
    duration: 0,
    reciter: getSavedReciter(),
  });

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
          const nextIndex = index + 1;
          if (nextIndex < ayahs.length) {
            playAyahRef.current(nextIndex);
          } else {
            stop();
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
    playAyah(0);
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

  return {
    ...state,
    playAyah,
    playSurah,
    togglePlayPause,
    stop,
    setReciter,
  };
}
