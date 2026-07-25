import { BookOpenCheck, Brain, RotateCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReviewMethodId } from "@/types/memorization";

/** Icon shown for each review method, shared across the selector and dashboard. */
export const METHOD_ICONS: Record<ReviewMethodId, LucideIcon> = {
  ssm: BookOpenCheck,
  srs: Brain,
  cycle: RotateCw,
};
