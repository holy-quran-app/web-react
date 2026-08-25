import { useState } from "react";
import { Link } from "react-router-dom";
import { StickyNote, SquarePen, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { clampAyahRange, formatAyahRange } from "@/lib/memorization";
import type { MemorizationEntry, MemorizationStatus } from "@/types/memorization";

interface Props {
  entries: MemorizationEntry[];
  onSetStatus: (surahNumber: number, status: MemorizationStatus) => void;
  onSetAyahRange: (surahNumber: number, from: number, to: number) => void;
  onSetNotes: (surahNumber: number, notes: string) => void;
  onRemove: (surahNumber: number) => void;
}

export function MemorizedList({
  entries,
  onSetStatus,
  onSetAyahRange,
  onSetNotes,
  onRemove,
}: Props) {
  const sorted = [...entries].sort((a, b) => a.surahNumber - b.surahNumber);
  const [editing, setEditing] = useState<number | null>(null);

  return (
    <ul className="divide-y rounded-xl border">
      {sorted.map((entry) => (
        <EntryRow
          key={entry.surahNumber}
          entry={entry}
          editing={editing === entry.surahNumber}
          onToggleEdit={() =>
            setEditing((cur) => (cur === entry.surahNumber ? null : entry.surahNumber))
          }
          onSetStatus={onSetStatus}
          onSetAyahRange={onSetAyahRange}
          onSetNotes={onSetNotes}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}

function EntryRow({
  entry,
  editing,
  onToggleEdit,
  onSetStatus,
  onSetAyahRange,
  onSetNotes,
  onRemove,
}: {
  entry: MemorizationEntry;
  editing: boolean;
  onToggleEdit: () => void;
} & Omit<Props, "entries">) {
  return (
    <li>
      <div className="flex items-center gap-3 p-3">
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
          <p className="text-xs text-muted-foreground">{formatAyahRange(entry)}</p>
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
          onClick={onToggleEdit}
          aria-label={
            editing
              ? `Close editor for ${entry.englishName}`
              : `Edit ayah range and notes for ${entry.englishName}`
          }
          aria-expanded={editing}
          className={cn("text-muted-foreground", editing && "text-primary")}
        >
          {editing ? <X className="size-4" /> : <SquarePen className="size-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(entry.surahNumber)}
          aria-label={`Remove ${entry.englishName}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {!editing && entry.notes && (
        <p className="flex items-start gap-1.5 px-3 pb-3 text-xs text-muted-foreground">
          <StickyNote className="mt-0.5 size-3 shrink-0" />
          <span className="min-w-0 whitespace-pre-wrap">{entry.notes}</span>
        </p>
      )}

      {editing && (
        <EntryEditor
          entry={entry}
          onSetAyahRange={onSetAyahRange}
          onSetNotes={onSetNotes}
          onDone={onToggleEdit}
        />
      )}
    </li>
  );
}

function EntryEditor({
  entry,
  onSetAyahRange,
  onSetNotes,
  onDone,
}: {
  entry: MemorizationEntry;
  onSetAyahRange: Props["onSetAyahRange"];
  onSetNotes: Props["onSetNotes"];
  onDone: () => void;
}) {
  const [from, setFrom] = useState(String(entry.ayahFrom));
  const [to, setTo] = useState(String(entry.ayahTo));
  const [notes, setNotes] = useState(entry.notes);

  const range = clampAyahRange(Number(from), Number(to), entry.numberOfAyahs);

  return (
    <div className="flex flex-col gap-3 border-t bg-muted/30 p-3">
      <div className="flex items-end gap-2">
        <label className="flex-1 text-xs text-muted-foreground">
          From ayah
          <Input
            type="number"
            min={1}
            max={entry.numberOfAyahs}
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
            max={entry.numberOfAyahs}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 h-8"
          />
        </label>
        <p className="pb-2 text-xs text-muted-foreground">of {entry.numberOfAyahs}</p>
      </div>
      <label className="text-xs text-muted-foreground">
        Notes
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Ayahs 25–28 need extra repetition"
          className="mt-1 min-h-14"
        />
      </label>
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            onSetAyahRange(entry.surahNumber, range.ayahFrom, range.ayahTo);
            onSetNotes(entry.surahNumber, notes.trim());
            onDone();
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
