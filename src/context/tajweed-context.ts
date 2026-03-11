import { createContext } from "react";

export interface TajweedContextState {
  tajweedEnabled: boolean;
  setTajweedEnabled: (enabled: boolean) => void;
}

export const TajweedContext = createContext<TajweedContextState>({
  tajweedEnabled: false,
  setTajweedEnabled: () => null,
});
