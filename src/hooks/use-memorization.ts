import { useCallback, useSyncExternalStore } from "react";
import type {
  MemorizationEntry,
  MemorizationState,
  MemorizationStatus,
  ReviewMethodId,
} from "@/types/memorization";
import {
  applySrsRating,
  clampAyahRange,
  computeStats,
  computeTodayPlan,
  dayKey,
  reviewedTodayIds,
  startOfDay,
  type SrsRating,
} from "@/lib/memorization";
import { useNow } from "@/hooks/use-now";

const STORAGE_KEY = "holy-quran-memorization";

const DEFAULT_STATE: MemorizationState = {
  method: null,
  entries: [],
  cycleLength: 7,
  history: [],
  todayReviewed: { day: "", ids: [] },
};

/** Metadata needed to add a surah (or a portion of one) to the tracker. */
export interface AddSurahInput {
  surahNumber: number;
  surahName: string;
  englishName: string;
  numberOfAyahs: number;
  /** First ayah of the portion; defaults to 1. */
  ayahFrom?: number;
  /** Last ayah of the portion; defaults to the whole surah. */
  ayahTo?: number;
  notes?: string;
}

let cachedRaw: string | null = null;
let cachedValue: MemorizationState = DEFAULT_STATE;

/** Fill in fields added after an entry was persisted (ayah range, notes). */
function normalizeEntry(entry: MemorizationEntry): MemorizationEntry {
  return {
    ...entry,
    ...clampAyahRange(
      typeof entry.ayahFrom === "number" ? entry.ayahFrom : 1,
      typeof entry.ayahTo === "number" ? entry.ayahTo : entry.numberOfAyahs,
      entry.numberOfAyahs,
    ),
    notes: typeof entry.notes === "string" ? entry.notes : "",
  };
}

/** Fill in any missing fields so older/partial persisted state stays valid. */
function normalize(parsed: Partial<MemorizationState> | null): MemorizationState {
  if (!parsed || typeof parsed !== "object") return DEFAULT_STATE;
  return {
    method: parsed.method ?? null,
    entries: Array.isArray(parsed.entries) ? parsed.entries.map(normalizeEntry) : [],
    cycleLength:
      typeof parsed.cycleLength === "number" && parsed.cycleLength > 0
        ? parsed.cycleLength
        : 7,
    history: Array.isArray(parsed.history) ? parsed.history : [],
    todayReviewed:
      parsed.todayReviewed && Array.isArray(parsed.todayReviewed.ids)
        ? parsed.todayReviewed
        : { day: "", ids: [] },
  };
}

function getSnapshot(): MemorizationState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? normalize(JSON.parse(raw)) : DEFAULT_STATE;
    } catch {
      cachedValue = DEFAULT_STATE;
    }
  }
  return cachedValue;
}

function getServerSnapshot(): MemorizationState {
  return DEFAULT_STATE;
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function persist(next: MemorizationState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  cachedRaw = null; // force re-read on next snapshot
  for (const l of listeners) l();
}

/** Record `id` as reviewed today and log the day for streak tracking. */
function withReviewedToday(state: MemorizationState, id: number, now: number) {
  const key = dayKey(now);
  const tr = state.todayReviewed.day === key ? state.todayReviewed : { day: key, ids: [] };
  const ids = tr.ids.includes(id) ? tr.ids : [...tr.ids, id];
  const history = state.history.includes(key) ? state.history : [...state.history, key];
  return { todayReviewed: { day: key, ids }, history };
}

export function useMemorization() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const now = useNow();

  const plan = computeTodayPlan(state, now);
  const stats = computeStats(state, now);
  const reviewedIds = reviewedTodayIds(state, now);

  const setMethod = useCallback((method: ReviewMethodId) => {
    persist({ ...getSnapshot(), method });
  }, []);

  const setCycleLength = useCallback((cycleLength: number) => {
    persist({ ...getSnapshot(), cycleLength });
  }, []);

  const addSurah = useCallback(
    (input: AddSurahInput, status: MemorizationStatus = "learning") => {
      const cur = getSnapshot();
      if (cur.entries.some((e) => e.surahNumber === input.surahNumber)) return;
      const ts = Date.now();
      const entry: MemorizationEntry = {
        surahNumber: input.surahNumber,
        surahName: input.surahName,
        englishName: input.englishName,
        numberOfAyahs: input.numberOfAyahs,
        ...clampAyahRange(
          input.ayahFrom ?? 1,
          input.ayahTo ?? input.numberOfAyahs,
          input.numberOfAyahs,
        ),
        notes: input.notes?.trim() ?? "",
        status,
        addedAt: ts,
        memorizedAt: status === "memorized" ? ts : null,
        box: 0,
        dueAt: startOfDay(ts),
        lastReviewedAt: null,
        reviewCount: 0,
      };
      persist({ ...cur, entries: [...cur.entries, entry] });
    },
    [],
  );

  const removeSurah = useCallback((surahNumber: number) => {
    const cur = getSnapshot();
    persist({
      ...cur,
      entries: cur.entries.filter((e) => e.surahNumber !== surahNumber),
      todayReviewed: {
        ...cur.todayReviewed,
        ids: cur.todayReviewed.ids.filter((id) => id !== surahNumber),
      },
    });
  }, []);

  const setStatus = useCallback(
    (surahNumber: number, status: MemorizationStatus) => {
      const cur = getSnapshot();
      const ts = Date.now();
      persist({
        ...cur,
        entries: cur.entries.map((e) => {
          if (e.surahNumber !== surahNumber) return e;
          if (status === "memorized") {
            const memorizedAt = e.memorizedAt ?? ts;
            return {
              ...e,
              status,
              memorizedAt,
              dueAt: e.memorizedAt === null ? startOfDay(ts) : e.dueAt,
            };
          }
          return { ...e, status };
        }),
      });
    },
    [],
  );

  /** Change the tracked ayah portion of an entry (clamped to the surah). */
  const setAyahRange = useCallback((surahNumber: number, from: number, to: number) => {
    const cur = getSnapshot();
    persist({
      ...cur,
      entries: cur.entries.map((e) =>
        e.surahNumber === surahNumber
          ? { ...e, ...clampAyahRange(from, to, e.numberOfAyahs) }
          : e,
      ),
    });
  }, []);

  const setNotes = useCallback((surahNumber: number, notes: string) => {
    const cur = getSnapshot();
    persist({
      ...cur,
      entries: cur.entries.map((e) =>
        e.surahNumber === surahNumber ? { ...e, notes } : e,
      ),
    });
  }, []);

  /** Toggle a checkbox-style review item (SSM / cycle methods). */
  const toggleReviewed = useCallback((surahNumber: number) => {
    const cur = getSnapshot();
    const now2 = Date.now();
    const key = dayKey(now2);
    const tr = cur.todayReviewed.day === key ? cur.todayReviewed : { day: key, ids: [] };
    if (tr.ids.includes(surahNumber)) {
      persist({
        ...cur,
        todayReviewed: { day: key, ids: tr.ids.filter((id) => id !== surahNumber) },
      });
    } else {
      persist({ ...cur, ...withReviewedToday({ ...cur, todayReviewed: tr }, surahNumber, now2) });
    }
  }, []);

  /** Rate recall of an SRS-scheduled item and advance its schedule. */
  const rate = useCallback((surahNumber: number, rating: SrsRating) => {
    const cur = getSnapshot();
    const now2 = Date.now();
    persist({
      ...cur,
      entries: cur.entries.map((e) =>
        e.surahNumber === surahNumber ? applySrsRating(e, rating, now2) : e,
      ),
      ...withReviewedToday(cur, surahNumber, now2),
    });
  }, []);

  const resetAll = useCallback(() => {
    persist({ ...DEFAULT_STATE, method: getSnapshot().method });
  }, []);

  return {
    state,
    plan,
    stats,
    reviewedIds,
    setMethod,
    setCycleLength,
    addSurah,
    removeSurah,
    setStatus,
    setAyahRange,
    setNotes,
    toggleReviewed,
    rate,
    resetAll,
  };
}
