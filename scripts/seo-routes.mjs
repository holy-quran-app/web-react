// Shared route metadata for sitemap generation and prerendering.
// Only publicly indexable routes belong here — /bookmarks and /settings
// hold device-local state and are excluded (they carry a noindex tag).

export const SITE_URL = "https://holy-quran.app";

export const SITE_NAME = "Holy Quran";

export const DEFAULT_DESCRIPTION =
  "Read, search, and memorize the Holy Quran online. All 114 Surahs with Arabic text, translations, tajweed highlighting, audio recitation, and a Hifz memorization tracker.";

// [number, transliterated name, English meaning]
export const SURAHS = [
  [1, "Al-Fatihah", "The Opening"],
  [2, "Al-Baqarah", "The Cow"],
  [3, "Aal-Imran", "The Family of Imran"],
  [4, "An-Nisa", "The Women"],
  [5, "Al-Ma'idah", "The Table Spread"],
  [6, "Al-An'am", "The Cattle"],
  [7, "Al-A'raf", "The Heights"],
  [8, "Al-Anfal", "The Spoils of War"],
  [9, "At-Tawbah", "The Repentance"],
  [10, "Yunus", "Jonah"],
  [11, "Hud", "Hud"],
  [12, "Yusuf", "Joseph"],
  [13, "Ar-Ra'd", "The Thunder"],
  [14, "Ibrahim", "Abraham"],
  [15, "Al-Hijr", "The Rocky Tract"],
  [16, "An-Nahl", "The Bee"],
  [17, "Al-Isra", "The Night Journey"],
  [18, "Al-Kahf", "The Cave"],
  [19, "Maryam", "Mary"],
  [20, "Ta-Ha", "Ta-Ha"],
  [21, "Al-Anbiya", "The Prophets"],
  [22, "Al-Hajj", "The Pilgrimage"],
  [23, "Al-Mu'minun", "The Believers"],
  [24, "An-Nur", "The Light"],
  [25, "Al-Furqan", "The Criterion"],
  [26, "Ash-Shu'ara", "The Poets"],
  [27, "An-Naml", "The Ant"],
  [28, "Al-Qasas", "The Stories"],
  [29, "Al-Ankabut", "The Spider"],
  [30, "Ar-Rum", "The Romans"],
  [31, "Luqman", "Luqman"],
  [32, "As-Sajdah", "The Prostration"],
  [33, "Al-Ahzab", "The Combined Forces"],
  [34, "Saba", "Sheba"],
  [35, "Fatir", "The Originator"],
  [36, "Ya-Sin", "Ya-Sin"],
  [37, "As-Saffat", "Those Who Set the Ranks"],
  [38, "Sad", "Sad"],
  [39, "Az-Zumar", "The Troops"],
  [40, "Ghafir", "The Forgiver"],
  [41, "Fussilat", "Explained in Detail"],
  [42, "Ash-Shura", "The Consultation"],
  [43, "Az-Zukhruf", "The Ornaments of Gold"],
  [44, "Ad-Dukhan", "The Smoke"],
  [45, "Al-Jathiyah", "The Crouching"],
  [46, "Al-Ahqaf", "The Wind-Curved Sandhills"],
  [47, "Muhammad", "Muhammad"],
  [48, "Al-Fath", "The Victory"],
  [49, "Al-Hujurat", "The Rooms"],
  [50, "Qaf", "Qaf"],
  [51, "Adh-Dhariyat", "The Winnowing Winds"],
  [52, "At-Tur", "The Mount"],
  [53, "An-Najm", "The Star"],
  [54, "Al-Qamar", "The Moon"],
  [55, "Ar-Rahman", "The Beneficent"],
  [56, "Al-Waqi'ah", "The Inevitable"],
  [57, "Al-Hadid", "The Iron"],
  [58, "Al-Mujadila", "The Pleading Woman"],
  [59, "Al-Hashr", "The Exile"],
  [60, "Al-Mumtahanah", "She That Is To Be Examined"],
  [61, "As-Saf", "The Ranks"],
  [62, "Al-Jumu'ah", "The Congregation"],
  [63, "Al-Munafiqun", "The Hypocrites"],
  [64, "At-Taghabun", "The Mutual Disillusion"],
  [65, "At-Talaq", "The Divorce"],
  [66, "At-Tahrim", "The Prohibition"],
  [67, "Al-Mulk", "The Sovereignty"],
  [68, "Al-Qalam", "The Pen"],
  [69, "Al-Haqqah", "The Reality"],
  [70, "Al-Ma'arij", "The Ascending Stairways"],
  [71, "Nuh", "Noah"],
  [72, "Al-Jinn", "The Jinn"],
  [73, "Al-Muzzammil", "The Enshrouded One"],
  [74, "Al-Muddaththir", "The Cloaked One"],
  [75, "Al-Qiyamah", "The Resurrection"],
  [76, "Al-Insan", "Man"],
  [77, "Al-Mursalat", "The Emissaries"],
  [78, "An-Naba", "The Tidings"],
  [79, "An-Nazi'at", "Those Who Drag Forth"],
  [80, "Abasa", "He Frowned"],
  [81, "At-Takwir", "The Overthrowing"],
  [82, "Al-Infitar", "The Cleaving"],
  [83, "Al-Mutaffifin", "The Defrauding"],
  [84, "Al-Inshiqaq", "The Sundering"],
  [85, "Al-Buruj", "The Mansions of the Stars"],
  [86, "At-Tariq", "The Nightcomer"],
  [87, "Al-A'la", "The Most High"],
  [88, "Al-Ghashiyah", "The Overwhelming"],
  [89, "Al-Fajr", "The Dawn"],
  [90, "Al-Balad", "The City"],
  [91, "Ash-Shams", "The Sun"],
  [92, "Al-Layl", "The Night"],
  [93, "Ad-Duhaa", "The Morning Hours"],
  [94, "Ash-Sharh", "The Relief"],
  [95, "At-Tin", "The Fig"],
  [96, "Al-Alaq", "The Clot"],
  [97, "Al-Qadr", "The Power"],
  [98, "Al-Bayyinah", "The Clear Proof"],
  [99, "Az-Zalzalah", "The Earthquake"],
  [100, "Al-Adiyat", "The Courser"],
  [101, "Al-Qari'ah", "The Calamity"],
  [102, "At-Takathur", "The Rivalry in World Increase"],
  [103, "Al-Asr", "The Declining Day"],
  [104, "Al-Humazah", "The Traducer"],
  [105, "Al-Fil", "The Elephant"],
  [106, "Quraysh", "Quraysh"],
  [107, "Al-Ma'un", "The Small Kindnesses"],
  [108, "Al-Kawthar", "The Abundance"],
  [109, "Al-Kafirun", "The Disbelievers"],
  [110, "An-Nasr", "The Divine Support"],
  [111, "Al-Masad", "The Palm Fiber"],
  [112, "Al-Ikhlas", "The Sincerity"],
  [113, "Al-Falaq", "The Daybreak"],
  [114, "An-Nas", "Mankind"],
];

function surahRoute([number, name, meaning]) {
  const label = name === meaning ? name : `${name} (${meaning})`;
  return {
    path: `/surah/${number}`,
    title: `Surah ${label} | ${SITE_NAME}`,
    description: `Read Surah ${label}, chapter ${number} of the Holy Quran, with full Arabic text, English translation, tajweed highlighting, and audio recitation.`,
  };
}

export const ROUTES = [
  {
    path: "/",
    title: `${SITE_NAME} — Read, Search & Memorize the Quran Online`,
    description: DEFAULT_DESCRIPTION,
  },
  {
    path: "/surah",
    title: `All 114 Surahs | ${SITE_NAME}`,
    description:
      "Browse all 114 Surahs of the Holy Quran with Arabic names, English translations, revelation type, and verse counts.",
  },
  ...SURAHS.map(surahRoute),
  {
    path: "/juz",
    title: `Browse by Juz | ${SITE_NAME}`,
    description:
      "Read the Holy Quran by Juz — all 30 parts with Arabic text and translations.",
  },
  {
    path: "/page",
    title: `Browse by Page | ${SITE_NAME}`,
    description:
      "Read the Holy Quran page by page, following the standard 604-page Mushaf layout.",
  },
  {
    path: "/hizb",
    title: `Browse by Hizb | ${SITE_NAME}`,
    description:
      "Read the Holy Quran by Hizb — all 60 sections with Arabic text and translations.",
  },
  {
    path: "/memorize",
    title: `Memorization Tracker | ${SITE_NAME}`,
    description:
      "Track your Quran memorization (Hifz) with proven review methods and daily progress tracking.",
  },
  {
    path: "/search",
    title: `Search the Quran | ${SITE_NAME}`,
    description:
      "Search the Holy Quran for ayahs by keyword and read every match in context with translation.",
  },
];
