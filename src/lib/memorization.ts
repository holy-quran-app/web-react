import type {
  MemorizationEntry,
  MemorizationState,
  ReviewMethodId,
  ReviewMethodInfo,
} from "@/types/memorization";

/** Total number of ayahs in the Quran (Hafs). */
export const TOTAL_AYAHS = 6236;

const DAY_MS = 86_400_000;

/** Days a freshly memorized surah counts as "recent" (Sabqi) under SSM. */
export const RECENT_DAYS = 14;

/** Number of rotating long-term revision portions under SSM (Manzil). */
export const MANZIL_SECTIONS = 7;

/** Spaced-repetition interval ladder, in days. */
export const SRS_INTERVALS = [1, 3, 7, 16, 35, 70, 140];
const MAX_BOX = SRS_INTERVALS.length - 1;

export type SrsRating = "again" | "good" | "easy";

/**
 * The three most widely used Quran memorization (Hifz) review systems.
 * Content is user-facing and rendered by the method selector.
 */
export const REVIEW_METHODS: ReviewMethodInfo[] = [
  {
    id: "ssm",
    name: "Sabaq · Sabqi · Manzil",
    arabicName: "سبق · سبقي · منزل",
    tagline: "The classical three-tier daily cycle",
    description:
      "The centuries-old system used in Hifz schools worldwide. Each day balances brand-new memorization against structured revision of both recent and older portions, so nothing you have learned is left to fade.",
    howItWorks: [
      "Sabaq (new lesson): the fresh portion you are actively memorizing.",
      "Sabqi (recent revision): everything memorized in the last two weeks, revised daily.",
      "Manzil (long-term revision): older memorization split into 7 portions — one revised each day.",
    ],
    bestFor: "Students who want the proven, teacher-tested traditional structure.",
  },
  {
    id: "srs",
    name: "Spaced Repetition",
    arabicName: "المراجعة المتباعدة",
    tagline: "Review each portion right before you forget it",
    description:
      "The most research-backed technique. Every memorized surah is scheduled on its own expanding interval — 1 day, 3 days, a week, and beyond. Recall it well and the gap grows; struggle and it comes back sooner, so effort lands exactly where it is needed.",
    howItWorks: [
      "Each memorized surah gets its own review date.",
      "After each review you rate your recall: Again, Good, or Easy.",
      "Strong recall pushes the next review further out; a slip brings it back soon.",
    ],
    bestFor: "Self-learners who want to minimize wasted revision time.",
  },
  {
    id: "cycle",
    name: "Juz Cycle Rotation",
    arabicName: "المراجعة الدورية",
    tagline: "Cycle through everything on a fixed rhythm",
    description:
      "A steady rotation that removes all guesswork. Your entire memorized portion is divided into equal daily sections, so you pass over everything you know on a predictable cycle — a weekly cycle keeps the whole of your Hifz fresh.",
    howItWorks: [
      "Choose how many days one full cycle should take (e.g. 7).",
      "Your memorized surahs are split into that many balanced sections.",
      "Recite one section each day and the cycle repeats automatically.",
    ],
    bestFor: "Huffaz maintaining large portions who prefer a fixed routine.",
  },
];

export function getMethodInfo(id: ReviewMethodId): ReviewMethodInfo {
  return REVIEW_METHODS.find((m) => m.id === id) ?? REVIEW_METHODS[0];
}

/* ------------------------------------------------------------------ */
/* Ayah ranges                                                        */
/* ------------------------------------------------------------------ */

/** Coerce a from/to pair into a valid 1-based inclusive range within the surah. */
export function clampAyahRange(
  from: number,
  to: number,
  numberOfAyahs: number,
): { ayahFrom: number; ayahTo: number } {
  const f = Math.min(Math.max(1, Math.floor(from) || 1), numberOfAyahs);
  const t = Math.min(Math.max(f, Math.floor(to) || numberOfAyahs), numberOfAyahs);
  return { ayahFrom: f, ayahTo: t };
}

/** Number of ayahs in the entry's tracked portion. */
export function entryAyahCount(entry: MemorizationEntry): number {
  return entry.ayahTo - entry.ayahFrom + 1;
}

export function isFullSurah(entry: MemorizationEntry): boolean {
  return entry.ayahFrom === 1 && entry.ayahTo === entry.numberOfAyahs;
}

/** Label for an entry's portion, e.g. "286 ayahs" or "Ayahs 1–40 of 286". */
export function formatAyahRange(entry: MemorizationEntry): string {
  if (isFullSurah(entry)) return `${entry.numberOfAyahs} ayahs`;
  return `Ayahs ${entry.ayahFrom}–${entry.ayahTo} of ${entry.numberOfAyahs}`;
}

/* ------------------------------------------------------------------ */
/* Date helpers — all operate in the user's local time zone.          */
/* ------------------------------------------------------------------ */

export function startOfDay(ts: number): number {
  const d = new Date(ts);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function endOfDay(ts: number): number {
  return startOfDay(ts) + DAY_MS - 1;
}

export function addDays(ts: number, n: number): number {
  const d = new Date(ts);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n).getTime();
}

export function dayKey(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** A stable integer day number (time-zone / DST independent) for rotations. */
function dayNumber(ts: number): number {
  const d = new Date(ts);
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS);
}

function mod(a: number, n: number): number {
  return ((a % n) + n) % n;
}

/* ------------------------------------------------------------------ */
/* Section splitting                                                  */
/* ------------------------------------------------------------------ */

/**
 * Split entries into up to `requested` contiguous sections (in mushaf order),
 * balanced by ayah count. Never produces empty sections: if there are fewer
 * entries than requested sections, the number of sections shrinks to match.
 */
export function splitIntoSections(
  entries: MemorizationEntry[],
  requested: number,
): MemorizationEntry[][] {
  const sorted = [...entries].sort((a, b) => a.surahNumber - b.surahNumber);
  const n = Math.min(requested, sorted.length);
  if (n <= 0) return [];

  const total = sorted.reduce((sum, e) => sum + entryAyahCount(e), 0);
  const target = total / n;
  const groups: MemorizationEntry[][] = Array.from({ length: n }, () => []);

  let gi = 0;
  let running = 0;
  for (let idx = 0; idx < sorted.length; idx++) {
    groups[gi].push(sorted[idx]);
    running += entryAyahCount(sorted[idx]);

    const itemsLeft = sorted.length - idx - 1;
    const groupsLeft = n - gi - 1; // sections after the current one, still empty
    if (gi < n - 1) {
      const mustAdvance = itemsLeft <= groupsLeft; // reserve one item per section
      const targetMet = running >= target * (gi + 1) && itemsLeft >= groupsLeft;
      if (mustAdvance || targetMet) gi++;
    }
  }
  return groups;
}

/* ------------------------------------------------------------------ */
/* Today's review plan                                                */
/* ------------------------------------------------------------------ */

export interface PlanSection {
  key: string;
  title: string;
  arabic?: string;
  description: string;
  /** "new" and "review" render checkboxes; "srs" renders recall ratings. */
  kind: "new" | "review" | "srs";
  entries: MemorizationEntry[];
}

export interface TodayPlan {
  method: ReviewMethodId;
  sections: PlanSection[];
  totalItems: number;
}

function isRecent(entry: MemorizationEntry, now: number): boolean {
  return entry.memorizedAt !== null && entry.memorizedAt >= now - RECENT_DAYS * DAY_MS;
}

export function computeTodayPlan(state: MemorizationState, now: number): TodayPlan | null {
  if (!state.method) return null;

  const learning = state.entries.filter((e) => e.status === "learning");
  const memorized = state.entries.filter((e) => e.status === "memorized");
  const reviewedIds = reviewedTodayIds(state, now);

  let sections: PlanSection[] = [];

  if (state.method === "ssm") {
    const sabqi = memorized.filter((e) => isRecent(e, now));
    const older = memorized.filter((e) => !isRecent(e, now));
    const manzil = splitIntoSections(older, MANZIL_SECTIONS);
    const manzilToday = manzil.length ? manzil[mod(dayNumber(now), manzil.length)] : [];

    sections = [
      {
        key: "sabaq",
        title: "Sabaq",
        arabic: "سبق",
        kind: "new",
        description: "New lesson — the portion you are actively memorizing.",
        entries: learning,
      },
      {
        key: "sabqi",
        title: "Sabqi",
        arabic: "سبقي",
        kind: "review",
        description: "Recent revision — everything memorized in the last two weeks.",
        entries: sabqi,
      },
      {
        key: "manzil",
        title: "Manzil",
        arabic: "منزل",
        kind: "review",
        description: manzil.length
          ? `Long-term revision — portion ${mod(dayNumber(now), manzil.length) + 1} of ${manzil.length} of your older memorization.`
          : "Long-term revision — older memorization will rotate here over time.",
        entries: manzilToday,
      },
    ];
  } else if (state.method === "srs") {
    const due = memorized
      .filter((e) => e.dueAt <= endOfDay(now) || reviewedIds.has(e.surahNumber))
      .sort((a, b) => a.dueAt - b.dueAt);

    sections = [
      {
        key: "new",
        title: "New & in progress",
        kind: "new",
        description: "The portions you are currently memorizing.",
        entries: learning,
      },
      {
        key: "due",
        title: "Due for review",
        kind: "srs",
        description: "Scheduled for today. Rate your recall to set the next interval.",
        entries: due,
      },
    ];
  } else {
    // cycle
    const groups = splitIntoSections(memorized, state.cycleLength);
    const idx = groups.length ? mod(dayNumber(now), groups.length) : 0;
    const portion = groups.length ? groups[idx] : [];

    sections = [
      {
        key: "new",
        title: "New & in progress",
        kind: "new",
        description: "The portions you are currently memorizing.",
        entries: learning,
      },
      {
        key: "portion",
        title: "Today's portion",
        kind: "review",
        description: groups.length
          ? `Day ${idx + 1} of ${groups.length} — one rotation through everything you have memorized.`
          : "Mark surahs as memorized to build your rotation.",
        entries: portion,
      },
    ];
  }

  const totalItems = sections.reduce((sum, s) => sum + s.entries.length, 0);
  return { method: state.method, sections, totalItems };
}

/* ------------------------------------------------------------------ */
/* Progress & streaks                                                 */
/* ------------------------------------------------------------------ */

export function reviewedTodayIds(state: MemorizationState, now: number): Set<number> {
  if (state.todayReviewed.day !== dayKey(now)) return new Set();
  return new Set(state.todayReviewed.ids);
}

export interface MemorizationStats {
  memorizedCount: number;
  learningCount: number;
  ayahsMemorized: number;
  percentComplete: number;
  streak: number;
}

export function computeStats(state: MemorizationState, now: number): MemorizationStats {
  const memorized = state.entries.filter((e) => e.status === "memorized");
  const ayahsMemorized = memorized.reduce((sum, e) => sum + entryAyahCount(e), 0);
  return {
    memorizedCount: memorized.length,
    learningCount: state.entries.filter((e) => e.status === "learning").length,
    ayahsMemorized,
    percentComplete: Math.round((ayahsMemorized / TOTAL_AYAHS) * 1000) / 10,
    streak: computeStreak(state.history, now),
  };
}

/**
 * Consecutive days ending today (or yesterday) with a completed review.
 * Counting through yesterday keeps the streak visible until the day ends.
 */
export function computeStreak(history: string[], now: number): number {
  const days = new Set(history);
  let cursor = startOfDay(now);
  if (!days.has(dayKey(cursor))) {
    cursor = addDays(cursor, -1);
    if (!days.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/* ------------------------------------------------------------------ */
/* Spaced-repetition scheduling                                       */
/* ------------------------------------------------------------------ */

/** Apply a recall rating to an entry, returning updated scheduling fields. */
export function applySrsRating(
  entry: MemorizationEntry,
  rating: SrsRating,
  now: number,
): MemorizationEntry {
  let box: number;
  if (rating === "again") box = 0;
  else if (rating === "good") box = Math.min(entry.box + 1, MAX_BOX);
  else box = Math.min(entry.box + 2, MAX_BOX);

  const interval = SRS_INTERVALS[box];
  return {
    ...entry,
    box,
    dueAt: addDays(now, interval),
    lastReviewedAt: now,
    reviewCount: entry.reviewCount + 1,
  };
}
