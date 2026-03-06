import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Loader2,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RECITERS } from "@/hooks/use-recitation";
import type { Reciter } from "@/types/quran";

interface RecitationPlayerProps {
  isPlaying: boolean;
  isLoading: boolean;
  currentAyahIndex: number | null;
  totalAyahs: number;
  progress: number;
  duration: number;
  reciter: Reciter;
  onPlaySurah: () => void;
  onTogglePlayPause: () => void;
  onStop: () => void;
  onPlayAyah: (index: number) => void;
  onReciterChange: (reciter: Reciter) => void;
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
  onPlaySurah,
  onTogglePlayPause,
  onStop,
  onPlayAyah,
  onReciterChange,
}: RecitationPlayerProps) {
  const isActive = currentAyahIndex !== null;
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

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
          </div>
        </div>
      </div>
    </div>
  );
}
