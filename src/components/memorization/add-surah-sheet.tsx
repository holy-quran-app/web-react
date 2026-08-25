import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { clampAyahRange } from "@/lib/memorization";
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
  const [expanded, setExpanded] = useState<number | null>(null);
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
        if (!next) setExpanded(null);
        setOpen(next);
      }}
    >
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full gap-4 sm:max-w-md">
        <SheetHeader className="pb-0">
          <SheetTitle>Add to your memorization</SheetTitle>
          <SheetDescription>
            Pick a surah — or just the ayahs of it you are working on.
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
              {filtered.map((surah) => (
                <SurahRow
                  key={surah.number}
                  surah={surah}
                  added={existingNumbers.has(surah.number)}
                  expanded={expanded === surah.number}
                  onExpand={() =>
                    setExpanded((cur) => (cur === surah.number ? null : surah.number))
                  }
                  onRemove={() => onRemove(surah.number)}
                  onConfirm={(input) => {
                    onAdd(input, addAs);
                    setExpanded(null);
                  }}
                />
              ))}
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

function SurahRow({
  surah,
  added,
  expanded,
  onExpand,
  onConfirm,
  onRemove,
}: {
  surah: Surah;
  added: boolean;
  expanded: boolean;
  onExpand: () => void;
  onConfirm: (input: AddSurahInput) => void;
  onRemove: () => void;
}) {
  return (
    <li className="rounded-lg border">
      <div className="flex items-center gap-3 p-2.5">
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
          <Button variant="outline" size="sm" onClick={onRemove}>
            <Check className="size-3.5" /> Added
          </Button>
        ) : (
          <Button
            variant={expanded ? "outline" : "secondary"}
            size="sm"
            onClick={onExpand}
            aria-expanded={expanded}
          >
            {expanded ? (
              <>
                <X className="size-3.5" /> Cancel
              </>
            ) : (
              <>
                <Plus className="size-3.5" /> Add
              </>
            )}
          </Button>
        )}
      </div>

      {expanded && !added && <AddPortionForm surah={surah} onConfirm={onConfirm} />}
    </li>
  );
}

function AddPortionForm({
  surah,
  onConfirm,
}: {
  surah: Surah;
  onConfirm: (input: AddSurahInput) => void;
}) {
  const [from, setFrom] = useState("1");
  const [to, setTo] = useState(String(surah.numberOfAyahs));
  const [notes, setNotes] = useState("");

  const range = clampAyahRange(Number(from), Number(to), surah.numberOfAyahs);
  const isFull = range.ayahFrom === 1 && range.ayahTo === surah.numberOfAyahs;

  return (
    <div className="flex flex-col gap-3 border-t bg-muted/30 p-3">
      <div className="flex items-end gap-2">
        <label className="flex-1 text-xs text-muted-foreground">
          From ayah
          <Input
            type="number"
            min={1}
            max={surah.numberOfAyahs}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 h-8"
          />
        </label>
        <label className="flex-1 text-xs text-muted-foreground">
          To ayah
          <Input
            type="number"
            min={1}
            max={surah.numberOfAyahs}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 h-8"
          />
        </label>
      </div>
      <label className="text-xs text-muted-foreground">
        Notes <span className="opacity-70">(optional)</span>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Ayahs 25–28 need extra repetition"
          className="mt-1 min-h-14"
        />
      </label>
      <Button
        size="sm"
        onClick={() =>
          onConfirm({
            surahNumber: surah.number,
            surahName: surah.name,
            englishName: surah.englishName,
            numberOfAyahs: surah.numberOfAyahs,
            ayahFrom: range.ayahFrom,
            ayahTo: range.ayahTo,
            notes,
          })
        }
      >
        <Plus className="size-3.5" />
        {isFull ? "Add whole surah" : `Add ayahs ${range.ayahFrom}–${range.ayahTo}`}
      </Button>
    </div>
  );
}
