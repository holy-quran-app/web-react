import { useState } from "react";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Loader2,
  Volume2,
  Repeat,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RECITERS } from "@/hooks/use-recitation";
import type { RangeRepeatConfig } from "@/hooks/use-recitation";
import type { Reciter } from "@/types/quran";

interface RecitationPlayerProps {
  isPlaying: boolean;
  isLoading: boolean;
  currentAyahIndex: number | null;
  totalAyahs: number;
  progress: number;
  duration: number;
  reciter: Reciter;
  rangeRepeat: RangeRepeatConfig;
  onPlaySurah: () => void;
  onTogglePlayPause: () => void;
  onStop: () => void;
  onPlayAyah: (index: number) => void;
  onReciterChange: (reciter: Reciter) => void;
  onRangeRepeatChange: (config: Partial<RangeRepeatConfig>) => void;
  onClearRange: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function RecitationPlayer({
  isPlaying,
  isLoading,
  currentAyahIndex,
  totalAyahs,
  progress,
  duration,
  reciter,
  rangeRepeat,
  onPlaySurah,
  onTogglePlayPause,
  onStop,
  onPlayAyah,
  onReciterChange,
  onRangeRepeatChange,
  onClearRange,
}: RecitationPlayerProps) {
  const isActive = currentAyahIndex !== null;
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const [showRangePanel, setShowRangePanel] = useState(false);

  const hasRange =
    rangeRepeat.startIndex !== null && rangeRepeat.endIndex !== null;

  return (
    <div className="sticky bottom-0 z-40 border-t bg-card/95 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {/* Reciter selector */}
          <div className="flex items-center gap-2">
            <Volume2 className="size-4 shrink-0 text-muted-foreground" />
            <select
              value={reciter.identifier}
              onChange={(e) => {
                const selected = RECITERS.find(
                  (r) => r.identifier === e.target.value,
                );
                if (selected) onReciterChange(selected);
              }}
              className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Select reciter"
            >
              {RECITERS.map((r) => (
                <option key={r.identifier} value={r.identifier}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      if (currentAyahIndex !== null && currentAyahIndex > 0) {
                        onPlayAyah(currentAyahIndex - 1);
                      }
                    }}
                    disabled={!isActive || currentAyahIndex === 0}
                    aria-label="Previous ayah"
                  >
                    <SkipBack className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Previous Ayah</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={isActive ? onTogglePlayPause : onPlaySurah}
                    disabled={isLoading}
                    aria-label={
                      isLoading
                        ? "Loading"
                        : isPlaying
                          ? "Pause"
                          : isActive
                            ? "Resume"
                            : hasRange
                              ? "Play Range"
                              : "Play Surah"
                    }
                  >
                    {isLoading ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="size-5" />
                    ) : (
                      <Play className="size-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isLoading
                    ? "Loading..."
                    : isPlaying
                      ? "Pause"
                      : isActive
                        ? "Resume"
                        : hasRange
                          ? "Play Range"
                          : "Play Surah"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      if (
                        currentAyahIndex !== null &&
                        currentAyahIndex < totalAyahs - 1
                      ) {
                        onPlayAyah(currentAyahIndex + 1);
                      }
                    }}
                    disabled={
                      !isActive || currentAyahIndex === totalAyahs - 1
                    }
                    aria-label="Next ayah"
                  >
                    <SkipForward className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Next Ayah</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onStop}
                    disabled={!isActive}
                    aria-label="Stop"
                  >
                    <Square className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Stop</TooltipContent>
              </Tooltip>

              {/* Range/Repeat toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={hasRange ? "default" : "ghost"}
                    size="icon-sm"
                    onClick={() => setShowRangePanel(!showRangePanel)}
                    aria-label="Repeat range settings"
                  >
                    <Repeat className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Repeat Range</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Progress bar and info */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {isActive && (
              <>
                <span className="shrink-0 text-xs text-muted-foreground">
                  Ayah {(currentAyahIndex ?? 0) + 1}/{totalAyahs}
                </span>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {formatTime(progress)}
                  {duration > 0 && ` / ${formatTime(duration)}`}
                </span>
              </>
            )}
            {!isActive && hasRange && (
              <span className="text-xs text-muted-foreground">
                Range: Ayah {rangeRepeat.startIndex! + 1} &ndash;{" "}
                {rangeRepeat.endIndex! + 1} &middot; {rangeRepeat.repeatCount}x
              </span>
            )}
          </div>
        </div>

        {/* Range & Repeat panel */}
        {showRangePanel && (
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t pt-3">
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              From Ayah
              <input
                type="number"
                min={1}
                max={totalAyahs}
                value={
                  rangeRepeat.startIndex !== null
                    ? rangeRepeat.startIndex + 1
                    : ""
                }
                placeholder="1"
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "") {
                    onRangeRepeatChange({ startIndex: null });
                  } else {
                    const num = Math.max(
                      0,
                      Math.min(totalAyahs - 1, Number(v) - 1),
                    );
                    onRangeRepeatChange({ startIndex: num });
                  }
                }}
                className="h-7 w-16 rounded-md border border-input bg-background px-2 text-center text-sm tabular-nums text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Range start ayah"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              To Ayah
              <input
                type="number"
                min={1}
                max={totalAyahs}
                value={
                  rangeRepeat.endIndex !== null
                    ? rangeRepeat.endIndex + 1
                    : ""
                }
                placeholder={String(totalAyahs)}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "") {
                    onRangeRepeatChange({ endIndex: null });
                  } else {
                    const num = Math.max(
                      0,
                      Math.min(totalAyahs - 1, Number(v) - 1),
                    );
                    onRangeRepeatChange({ endIndex: num });
                  }
                }}
                className="h-7 w-16 rounded-md border border-input bg-background px-2 text-center text-sm tabular-nums text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Range end ayah"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Repeat
              <input
                type="number"
                min={1}
                max={99}
                value={rangeRepeat.repeatCount}
                onChange={(e) => {
                  const num = Math.max(1, Math.min(99, Number(e.target.value)));
                  onRangeRepeatChange({ repeatCount: num });
                }}
                className="h-7 w-14 rounded-md border border-input bg-background px-2 text-center text-sm tabular-nums text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Repeat count"
              />
              <span>times</span>
            </label>
            {hasRange && (
              <>
                <span className="text-xs font-medium text-primary">
                  {rangeRepeat.currentRepeat}/{rangeRepeat.repeatCount}
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={onClearRange}
                  aria-label="Clear range"
                >
                  <X className="size-3.5" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
