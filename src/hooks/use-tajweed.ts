import { useContext } from "react";
import { TajweedContext } from "@/context/tajweed-context";

export function useTajweed() {
  const context = useContext(TajweedContext);
  if (!context) {
    throw new Error("useTajweed must be used within a TajweedProvider");
  }
  return context;
}
