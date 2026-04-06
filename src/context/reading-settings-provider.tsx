import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ReadingSettingsContext,
  type ArabicFontSize,
  type ReadingSettings,
  type TranslationFontSize,
} from "./reading-settings-context";

const STORAGE_KEY = "holy-quran-reading-settings";

const DEFAULTS: ReadingSettings = {
  arabicFontSize: "lg",
  translationFontSize: "md",
  showTranslation: true,
};

function load(): ReadingSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULTS;
}

export function ReadingSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ReadingSettings>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const setArabicFontSize = useCallback(
    (v: ArabicFontSize) => setSettings((s) => ({ ...s, arabicFontSize: v })),
    [],
  );
  const setTranslationFontSize = useCallback(
    (v: TranslationFontSize) =>
      setSettings((s) => ({ ...s, translationFontSize: v })),
    [],
  );
  const setShowTranslation = useCallback(
    (v: boolean) => setSettings((s) => ({ ...s, showTranslation: v })),
    [],
  );

  return (
    <ReadingSettingsContext.Provider
      value={{
        ...settings,
        setArabicFontSize,
        setTranslationFontSize,
        setShowTranslation,
      }}
    >
      {children}
    </ReadingSettingsContext.Provider>
  );
}
