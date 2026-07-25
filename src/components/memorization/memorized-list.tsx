import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MemorizationEntry, MemorizationStatus } from "@/types/memorization";

interface Props {
  entries: MemorizationEntry[];
  onSetStatus: (surahNumber: number, status: MemorizationStatus) => void;
  onRemove: (surahNumber: number) => void;
}

export function MemorizedList({ entries, onSetStatus, onRemove }: Props) {
  const sorted = [...entries].sort((a, b) => a.surahNumber - b.surahNumber);

  return (
    <ul className="divide-y rounded-xl border">
      {sorted.map((entry) => (
        <li key={entry.surahNumber} className="flex items-center gap-3 p-3">
          <Link
            to={`/surah/${entry.surahNumber}`}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            {entry.surahNumber}
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              to={`/surah/${entry.surahNumber}`}
              className="font-medium hover:text-primary"
            >
              {entry.englishName}
            </Link>
            <p className="text-xs text-muted-foreground">{entry.numberOfAyahs} ayahs</p>
          </div>

          <div className="flex items-center gap-0.5 rounded-lg border p-0.5">
            {(["learning", "memorized"] as MemorizationStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSetStatus(entry.surahNumber, s)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                  entry.status === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(entry.surahNumber)}
            aria-label={`Remove ${entry.englishName}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
