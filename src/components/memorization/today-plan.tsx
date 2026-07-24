import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { startOfDay, type PlanSection, type SrsRating, type TodayPlan } from "@/lib/memorization";
import type { MemorizationEntry } from "@/types/memorization";

interface Props {
  plan: TodayPlan;
  reviewedIds: Set<number>;
  onToggle: (surahNumber: number) => void;
  onRate: (surahNumber: number, rating: SrsRating) => void;
}

export function TodayPlan({ plan, reviewedIds, onToggle, onRate }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {plan.sections.map((section) => (
        <Section
          key={section.key}
          section={section}
          reviewedIds={reviewedIds}
          onToggle={onToggle}
          onRate={onRate}
        />
      ))}
    </div>
  );
}

function Section({
  section,
  reviewedIds,
  onToggle,
  onRate,
}: {
  section: PlanSection;
  reviewedIds: Set<number>;
  onToggle: Props["onToggle"];
  onRate: Props["onRate"];
}) {
  const done = section.entries.filter((e) => reviewedIds.has(e.surahNumber)).length;

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/40 px-5 py-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{section.title}</h3>
            {section.arabic && (
              <span className="font-arabic text-primary" dir="rtl" lang="ar">
                {section.arabic}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{section.description}</p>
        </div>
        {section.entries.length > 0 && (
          <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
            {done}/{section.entries.length} done
          </span>
        )}
      </div>

      {section.entries.length === 0 ? (
        <p className="px-5 py-4 text-sm text-muted-foreground">
          {emptyLabel(section.key)}
        </p>
      ) : (
        <ul className="divide-y">
          {section.entries.map((entry) => (
            <EntryRow
              key={entry.surahNumber}
              entry={entry}
              kind={section.kind}
              reviewed={reviewedIds.has(entry.surahNumber)}
              onToggle={onToggle}
              onRate={onRate}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}

function EntryRow({
  entry,
  kind,
  reviewed,
  onToggle,
  onRate,
}: {
  entry: MemorizationEntry;
  kind: PlanSection["kind"];
  reviewed: boolean;
  onToggle: Props["onToggle"];
  onRate: Props["onRate"];
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 px-5 py-3 transition-colors",
        reviewed && "bg-primary/5",
      )}
    >
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
        <p className="text-xs text-muted-foreground">
          {entry.numberOfAyahs} ayahs
          {kind === "srs" && reviewed && ` · next in ${nextInDays(entry)}`}
        </p>
      </div>
      <span
        className="hidden font-arabic text-lg text-primary sm:block"
        dir="rtl"
        lang="ar"
      >
        {entry.surahName}
      </span>

      {kind === "srs" ? (
        <RatingControls
          reviewed={reviewed}
          onRate={(rating) => onRate(entry.surahNumber, rating)}
        />
      ) : (
        <CheckControl
          checked={reviewed}
          onToggle={() => onToggle(entry.surahNumber)}
        />
      )}
    </li>
  );
}

function CheckControl({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      aria-label={checked ? "Mark as not reviewed" : "Mark as reviewed"}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors",
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input text-transparent hover:border-primary hover:text-primary/40",
      )}
    >
      <Check className="size-4" />
    </button>
  );
}

const RATINGS: { rating: SrsRating; label: string; className: string }[] = [
  {
    rating: "again",
    label: "Again",
    className: "hover:border-destructive hover:text-destructive",
  },
  { rating: "good", label: "Good", className: "hover:border-primary hover:text-primary" },
  {
    rating: "easy",
    label: "Easy",
    className: "hover:border-primary hover:text-primary",
  },
];

function RatingControls({
  reviewed,
  onRate,
}: {
  reviewed: boolean;
  onRate: (rating: SrsRating) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      {reviewed && <Check className="size-4 text-primary" aria-label="Reviewed today" />}
      {RATINGS.map((r) => (
        <Button
          key={r.rating}
          type="button"
          variant="outline"
          size="xs"
          className={r.className}
          onClick={() => onRate(r.rating)}
        >
          {r.label}
        </Button>
      ))}
    </div>
  );
}

function nextInDays(entry: MemorizationEntry): string {
  const days = Math.max(0, Math.round((entry.dueAt - startOfDay(Date.now())) / 86_400_000));
  if (days <= 0) return "today";
  return days === 1 ? "1 day" : `${days} days`;
}

function emptyLabel(key: string): string {
  switch (key) {
    case "sabaq":
    case "new":
      return "No new lesson right now — add a surah below to start memorizing.";
    case "sabqi":
      return "Nothing memorized in the last two weeks yet.";
    case "manzil":
      return "Your long-term rotation will fill in as you memorize more.";
    default:
      return "Mark surahs as memorized to build today's review.";
  }
}
