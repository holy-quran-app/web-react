import { createContext } from "react";

export type ArabicFontSize = "sm" | "md" | "lg" | "xl";
export type TranslationFontSize = "sm" | "md" | "lg";

export interface ReadingSettings {
  arabicFontSize: ArabicFontSize;
  translationFontSize: TranslationFontSize;
  showTranslation: boolean;
}

export interface ReadingSettingsContextValue extends ReadingSettings {
  setArabicFontSize: (v: ArabicFontSize) => void;
  setTranslationFontSize: (v: TranslationFontSize) => void;
  setShowTranslation: (v: boolean) => void;
}

export const ReadingSettingsContext =
  createContext<ReadingSettingsContextValue | null>(null);
