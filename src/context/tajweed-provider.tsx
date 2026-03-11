import { useState, type ReactNode } from "react";
import { TajweedContext } from "./tajweed-context";

const STORAGE_KEY = "holy-quran-tajweed";

export function TajweedProvider({ children }: { children: ReactNode }) {
  const [tajweedEnabled, setTajweedEnabledState] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === "true",
  );

  const setTajweedEnabled = (enabled: boolean) => {
    localStorage.setItem(STORAGE_KEY, String(enabled));
    setTajweedEnabledState(enabled);
  };

  return (
    <TajweedContext.Provider value={{ tajweedEnabled, setTajweedEnabled }}>
      {children}
    </TajweedContext.Provider>
  );
}
