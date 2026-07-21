import { type ReactNode, useMemo } from "react";
import { Play, Pause, Loader2, BookOpen, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { parseTajweedMarkup } from "@/lib/tajweed-parser";
import type { Ayah, TranslationEdition } from "@/types/quran";

export interface AyahTranslation {
  edition: TranslationEdition;
  text: string | undefined;
}

interface AyahCardProps {
  ayah: Ayah;
  index: number;
  isCurrentlyPlaying: boolean;
  isLoading: boolean;
  onPlay: (index: number) => void;
  onTogglePlayPause: () => void;
  tajweedText?: string;
  translations?: AyahTranslation[];
  isInRange?: boolean;
  isPinned?: boolean;
  onTogglePin?: () => void;
  isHighlighted?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  footerSlot?: ReactNode;
  arabicClassName?: string;
  translationClassName?: string;
  showTranslation?: boolean;
}

function hizbQuarterLabel(quarter: number): string {
  const hizbNumber = Math.ceil(quarter / 4);
  const pos = ((quarter - 1) % 4) + 1;
  const posLabels = ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"];
  return `Hizb ${hizbNumber} (${posLabels[pos - 1]})`;
}

function hasSajda(ayah: Ayah): boolean {
  return ayah.sajda !== false && ayah.sajda !== undefined;
}

function isSajdaObligatory(ayah: Ayah): boolean {
  if (typeof ayah.sajda === "object" && ayah.sajda !== null) {
    return ayah.sajda.obligatory;
  }
  return false;
}

function SajdaIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Person in prostration */}
      <circle cx="6" cy="6" r="2" />
      <path d="M4 14c0-2 1-3 3-3h2c2 0 4 1 4 3" />
      <path d="M6 11v3" />
      <path d="M13 14H4" />
      {/* Down arrow indicating prostration */}
      <path d="M18 8v6" />
      <path d="m15 11 3 3 3-3" />
      {/* Ground line */}
      <line x1="2" y1="18" x2="22" y2="18" />
    </svg>
  );
}

export function AyahCard({
  ayah,
  index,
  isCurrentlyPlaying,
  isLoading,
  onPlay,
  onTogglePlayPause,
  tajweedText,
  translations,
  isInRange,
  isPinned,
  onTogglePin,
  isHighlighted,
  leftSlot,
  rightSlot,
  footerSlot,
  arabicClassName,
  translationClassName,
  showTranslation = true,
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
        !isActive &&
          isInRange &&
          "border-accent/30 bg-accent/5 ring-1 ring-accent/20",
        isHighlighted && "border-accent/60 bg-accent/10 ring-2 ring-accent/40",
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
          {onTogglePin && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onTogglePin}
              aria-label={isPinned ? "Unpin ayah" : "Pin ayah"}
              className={cn(
                "text-muted-foreground hover:text-accent",
                isPinned && "text-accent",
              )}
            >
              <Pin
                className={cn("size-3", isPinned && "fill-current")}
              />
            </Button>
          )}
          {leftSlot}
          {hasSajda(ayah) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full",
                      isSajdaObligatory(ayah)
                        ? "bg-red-500/15 text-red-600 dark:text-red-400"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                    )}
                    aria-label={
                      isSajdaObligatory(ayah)
                        ? "Obligatory Sajda (prostration)"
                        : "Recommended Sajda (prostration)"
                    }
                  >
                    <SajdaIcon className="size-3.5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isSajdaObligatory(ayah)
                      ? "Obligatory Sajda"
                      : "Recommended Sajda"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            {tajweedHtml ? (
              <p
                className={cn(
                  "flex-1 text-right font-arabic",
                  arabicClassName ?? "text-2xl md:text-3xl",
                  // Keep line-height last so tailwind-merge doesn't drop it in
                  // favor of the text-size utility's bundled line-height, which
                  // would cram the Arabic diacritics into overlapping lines.
                  "leading-[2.5]",
                )}
                dir="rtl"
                lang="ar"
                data-tajweed=""
                dangerouslySetInnerHTML={{ __html: tajweedHtml }}
              />
            ) : (
              <p
                className={cn(
                  "flex-1 text-right font-arabic",
                  arabicClassName ?? "text-2xl md:text-3xl",
                  // Keep line-height last so tailwind-merge doesn't drop it in
                  // favor of the text-size utility's bundled line-height, which
                  // would cram the Arabic diacritics into overlapping lines.
                  "leading-[2.5]",
                )}
                dir="rtl"
                lang="ar"
              >
                {ayah.text}
              </p>
            )}
            {rightSlot && <div className="shrink-0">{rightSlot}</div>}
          </div>
          {showTranslation && translations && translations.length > 0 && (
            <div className="flex flex-col gap-2">
              {translations.map(
                (t) =>
                  t.text && (
                    <div
                      key={t.edition.identifier}
                      className={cn("leading-relaxed", translationClassName ?? "text-sm")}
                    >
                      {translations.length > 1 && (
                        <p className="text-[11px] font-medium uppercase tracking-wide text-primary/70">
                          {t.edition.englishName}
                        </p>
                      )}
                      <p className="text-muted-foreground">{t.text}</p>
                    </div>
                  ),
              )}
            </div>
          )}
          {footerSlot}
          {/* Ayah metadata */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="size-3" />
              Page {ayah.page}
            </span>
            <span>Juz {ayah.juz}</span>
            <span>{hizbQuarterLabel(ayah.hizbQuarter)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
