import { useMemo } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { parseTajweedMarkup } from "@/lib/tajweed-parser";
import type { Ayah } from "@/types/quran";

interface AyahCardProps {
  ayah: Ayah;
  index: number;
  isCurrentlyPlaying: boolean;
  isLoading: boolean;
  onPlay: (index: number) => void;
  onTogglePlayPause: () => void;
  tajweedText?: string;
}

export function AyahCard({
  ayah,
  index,
  isCurrentlyPlaying,
  isLoading,
  onPlay,
  onTogglePlayPause,
  tajweedText,
}: AyahCardProps) {
  const isActive = isCurrentlyPlaying || isLoading;
  const tajweedHtml = useMemo(
    () => (tajweedText ? parseTajweedMarkup(tajweedText) : null),
    [tajweedText],
  );

  return (
    <Card
      className={cn(
        "p-4 transition-colors duration-300 md:p-6",
        isActive && "border-primary/40 bg-primary/5 ring-1 ring-primary/20",
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary",
            )}
          >
            {ayah.numberInSurah}
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => {
              if (isActive) {
                onTogglePlayPause();
              } else {
                onPlay(index);
              }
            }}
            aria-label={
              isLoading
                ? "Loading"
                : isCurrentlyPlaying
                  ? `Pause ayah ${ayah.numberInSurah}`
                  : `Play ayah ${ayah.numberInSurah}`
            }
            className={cn(
              "text-muted-foreground hover:text-primary",
              isActive && "text-primary",
            )}
          >
            {isLoading ? (
              <Loader2 className="size-3 animate-spin" />
            ) : isCurrentlyPlaying ? (
              <Pause className="size-3" />
            ) : (
              <Play className="size-3" />
            )}
          </Button>
        </div>
        {tajweedHtml ? (
          <p
            className="flex-1 text-right font-arabic text-2xl leading-[2.5] md:text-3xl"
            dir="rtl"
            lang="ar"
            data-tajweed=""
            dangerouslySetInnerHTML={{ __html: tajweedHtml }}
          />
        ) : (
          <p
            className="flex-1 text-right font-arabic text-2xl leading-[2.5] md:text-3xl"
            dir="rtl"
            lang="ar"
          >
            {ayah.text}
          </p>
        )}
      </div>
    </Card>
  );
}
