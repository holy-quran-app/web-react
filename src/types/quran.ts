export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface SajdaInfo {
  id: number;
  recommended: boolean;
  obligatory: boolean;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter: number;
  sajda: boolean | SajdaInfo;
  audio?: string;
  audioSecondary?: string[];
}

export interface TranslationEdition {
  identifier: string;
  language: string;
  englishName: string;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

export interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: "text" | "audio";
  type: "quran" | "translation" | "transliteration" | "tafsir";
}

export interface Reciter {
  identifier: string;
  name: string;
}
