export type ReviewMethodId = "ssm" | "srs" | "cycle";

export type MemorizationStatus = "learning" | "memorized";

/**
 * A single surah the user is memorizing or has memorized. Stored in
 * localStorage. The spaced-repetition fields (`box`, `dueAt`, ...) are
 * maintained for every entry but only drive scheduling under the SRS method.
 */
export interface MemorizationEntry {
  surahNumber: number;
  /** Arabic surah name, e.g. "الفاتحة" */
  surahName: string;
  englishName: string;
  numberOfAyahs: number;
  status: MemorizationStatus;
  /** Timestamp the surah was added to the tracker. */
  addedAt: number;
  /** Timestamp the surah was first marked memorized (null while learning). */
  memorizedAt: number | null;
  /** Spaced-repetition level (index into the interval ladder). */
  box: number;
  /** Timestamp (local midnight) the surah is next due for SRS review. */
  dueAt: number;
  lastReviewedAt: number | null;
  reviewCount: number;
}

/** Which surahs have been marked done on a given calendar day. */
export interface TodayReviewed {
  /** Calendar day key, "YYYY-MM-DD". */
  day: string;
  /** Surah numbers reviewed on `day`. */
  ids: number[];
}

export interface MemorizationState {
  /** The chosen review method, or null until the user picks one. */
  method: ReviewMethodId | null;
  entries: MemorizationEntry[];
  /** Days to cycle through all memorized material under the "cycle" method. */
  cycleLength: number;
  /** Calendar days ("YYYY-MM-DD") with at least one completed review. */
  history: string[];
  todayReviewed: TodayReviewed;
}

/** Static, user-facing description of a review method. */
export interface ReviewMethodInfo {
  id: ReviewMethodId;
  name: string;
  arabicName?: string;
  tagline: string;
  description: string;
  howItWorks: string[];
  bestFor: string;
}
