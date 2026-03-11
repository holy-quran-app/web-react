import { useContext } from "react";
import { TajweedContext } from "@/context/tajweed-context";

export function useTajweed() {
  return useContext(TajweedContext);
}
