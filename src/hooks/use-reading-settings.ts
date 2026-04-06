import { useContext } from "react";
import { ReadingSettingsContext } from "@/context/reading-settings-context";

export function useReadingSettings() {
  const ctx = useContext(ReadingSettingsContext);
  if (!ctx) {
    throw new Error(
      "useReadingSettings must be used within a ReadingSettingsProvider",
    );
  }
  return ctx;
}
