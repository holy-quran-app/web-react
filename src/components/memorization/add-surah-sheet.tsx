import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { AddSurahInput } from "@/hooks/use-memorization";
import type { MemorizationStatus } from "@/types/memorization";
import type { Surah } from "@/types/quran";

interface Props {
  existingNumbers: Set<number>;
  onAdd: (input: AddSurahInput, status: MemorizationStatus) => void;
  onRemove: (surahNumber: number) => void;
  trigger: React.ReactNode;
}

export function AddSurahSheet({ existingNumbers, onAdd, onRemove, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [addAs, setAddAs] = useState<MemorizationStatus>("learning");
  const fetchedRef = useRef(false);

  // Fetch the surah list lazily, only once the picker is first opened, so
  // visiting the tracker never triggers a network request on its own.
  useEffect(() => {
    if (!open || fetchedRef.current) return;
    fetchedRef.current = true;
    let cancelled = false;
    fetch("https://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setSurahs(data.data as Surah[]);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        fetchedRef.current = false; // allow a retry the next time it opens
        setError(true);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(search) ||
        s.number.toString() === q,
    );
  }, [surahs, search]);

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        // Reset into a fresh loading state when (re)opening before a fetch.
        if (next && !fetchedRef.current) {
          setError(false);
          setLoading(true);
        }
        setOpen(next);
      }}
    >
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full gap-4 sm:max-w-md">
        <SheetHeader className="pb-0">
          <SheetTitle>Add to your memorization</SheetTitle>
          <SheetDescription>
            Pick the surahs you are learning or have already memorized.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3 px-4">
          <div className="flex items-center gap-1 rounded-lg border p-1">
            {(["learning", "memorized"] as MemorizationStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setAddAs(s)}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                  addAs === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <Input
            placeholder="Search by name or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Could not load the surah list. Please check your connection and try again.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {filtered.map((surah) => {
                const added = existingNumbers.has(surah.number);
                return (
                  <li
                    key={surah.number}
                    className="flex items-center gap-3 rounded-lg border p-2.5"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                      {surah.number}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{surah.englishName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {surah.numberOfAyahs} ayahs · {surah.englishNameTranslation}
                      </p>
                    </div>
                    {added ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemove(surah.number)}
                      >
                        <Check className="size-3.5" /> Added
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          onAdd(
                            {
                              surahNumber: surah.number,
                              surahName: surah.name,
                              englishName: surah.englishName,
                              numberOfAyahs: surah.numberOfAyahs,
                            },
                            addAs,
                          )
                        }
                      >
                        <Plus className="size-3.5" /> Add
                      </Button>
                    )}
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No surahs match "{search}".
                </p>
              )}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
